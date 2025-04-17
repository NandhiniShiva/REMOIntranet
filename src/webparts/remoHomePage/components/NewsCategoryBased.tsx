import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { INewsCategoryBasedProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { IWeb, Web } from "@pnp/sp/webs";
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';

let Newslist = listNames.News;
const Analytics = listNames.Analytics;

let NewsAvailableDepts: { ID: any; Title: any; URL: any; }[] = [];
let DeptNames: any[] = [];
let DeptNamesExitsUnique: any[] = [];
var User = "";
var UserEmail = "";
var NewWeb: IWeb & IInvokable<any>;

export interface INewsCategoryBasedState {
  Items: any[];
  Tag: string;
  Department: string;
  SitePageID: any;
  ActiveMainNewsID: any;
  Mode: string;
  CurrentPage: string;
  RelevantNews: any[];
  AvailableTags: any[];
  AvailableDepts: any[];
  TotalPageCount: number;
  TagBasedNews: any[];
  DeptBasedNews: any[];
  Title: string;
}

export default class NewsCategoryBased extends React.Component<INewsCategoryBasedProps, INewsCategoryBasedState, {}> {
  constructor(props: INewsCategoryBasedProps) {
    super(props);

    SPComponentLoader.loadScript('https://code.jquery.com/jquery-3.6.0.min.js', {
      globalExportsName: 'jQuery'
    }).then(() => {
      SPComponentLoader.loadScript('https://cdn.rawgit.com/mrk-j/paginga/v0.8.1/paginga.jquery.min.js', {
        globalExportsName: 'jQuery'
      });
    });

    this.state = {
      Items: [],
      Tag: "",
      Department: "",
      SitePageID: null,
      ActiveMainNewsID: null,
      Mode: "",
      CurrentPage: "",
      RelevantNews: [],
      AvailableTags: [],
      AvailableDepts: [],
      TotalPageCount: 0,
      TagBasedNews: [],
      DeptBasedNews: [],
      Title: "",
    };
    NewWeb = Web(this.props.siteurl)
  }

  public componentDidMount() {

    setTimeout(function () {

      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }

      const RecommendedItems = document.getElementById('RecommendedItems');
      if (RecommendedItems) {
        RecommendedItems.style.setProperty('display', 'none', 'important');
      }



      // Hide all div elements with the attribute data-automation-id="pageHeader"
      const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeaders.forEach((element: any) => {
        element.style.setProperty('display', 'none', 'important');
      });

      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
    }, 2000);

    var reactHandler = this;
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    const AppliedTage: string = url.searchParams.get("Tag");
    const Dept: string = url.searchParams.get("Dept");
    const SitePageID = url.searchParams.get("SitePageID");
    const Mode = url.searchParams.get("Mode");
    reactHandler.setState({ Tag: "" + AppliedTage + "", Department: "" + Dept + "", SitePageID: SitePageID, ActiveMainNewsID: ItemID, Mode: Mode });
    const userDetails = new CurrentUserDetails();
    userDetails.getCurrentUserDetails().then((data) => {

      if (Mode == "TagBased") {
        reactHandler.GetAvailableTags();
      } else {
        reactHandler.GetAvailableDepts();
      }
      this.LandingPageAnalytics(data?.Department, data?.Designation);
    }).catch((error) => {
      console.error("Error fetching current user details:", error);
    });

  }


  public async LandingPageAnalytics(Department: any, Designation: any) {
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }

    try {
      const response = await NewWeb.lists.getByTitle(Analytics).items.add({
        Category: "News CategoryBased",
        UserId: User.toString(),
        Department: Department,
        Designation: Designation,
        Title: "NA",
        ItemId: "NA",
        UserEmail: UserEmail,
      });

      console.log('Data successfully added:', response);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  public async GetAvailableTags() {
    var handler = this;
    try {
      await NewWeb.lists.getByTitle(Newslist).fields.filter(`EntityPropertyName eq 'Tag'`).get().then((items: any[]) => {
        for (var i = 0; i < items[0].Choices.length; i++) {
          handler.setState({ AvailableTags: items[0].Choices });
        }
        handler.GetCategoryBasedNews(handler.state.Mode, handler.state.Tag, handler.state.Department);
      });
    } catch (error) {
      console.error("An error occurred while fetching the available tags:", error);
    }
  }


  public async GetAvailableDepts() {
    try {
      const reactHandler = this;
      NewsAvailableDepts = [];
      DeptNames = [];
      DeptNamesExitsUnique = [];

      const items = await NewWeb.lists.getByTitle(Newslist)
        .items.select("ID", "Dept/Id", "Dept/Title", "Image", "*")
        .filter("IsActive eq '1'")
        .expand("Dept")
        .get();

      items.forEach((item) => {
        const DeptName = item.Dept.Title;
        DeptNames.push(DeptName);

        if (!reactHandler.findValueInArray(DeptName, DeptNamesExitsUnique) && reactHandler.findValueInArray(DeptName, DeptNames)) {
          DeptNamesExitsUnique.push(DeptName);
          const RawImageTxt = item.Image;
          if (RawImageTxt && RawImageTxt !== "") {
            const ImgObj = JSON.parse(RawImageTxt);
            const serverRelativeUrl = ImgObj.serverRelativeUrl ? ImgObj.serverRelativeUrl : `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/${item.ID}/${ImgObj.fileName}`;
            const PicUrl = serverRelativeUrl;
            NewsAvailableDepts.push({ "ID": item.Dept.Id, "Title": item.Dept.Title, "URL": PicUrl });
          }
        }
      });

      reactHandler.setState({ AvailableDepts: NewsAvailableDepts });
      reactHandler.GetCategoryBasedNews(reactHandler.state.Mode, reactHandler.state.Tag, reactHandler.state.Department);
    } catch (error) {
      console.error("Error fetching available departments:", error);
    }
  }


  public async GetCategoryBasedNews(Mode: string, AppliedTage: string, Dept: string) {
    var reactHandler = this;

    if (Mode == "TagBased") {
      reactHandler.setState({ CurrentPage: AppliedTage });
      var result = await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter(`IsActive eq '1' and Tag eq '${AppliedTage}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").get()

      reactHandler.GetAllOtherRelatedNews(AppliedTage, 'TagBased');
    } else {
      reactHandler.setState({ CurrentPage: Dept });
      var result = await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter(`IsActive eq '1' and Dept/Title eq '${Dept}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").get()

      reactHandler.GetAllOtherRelatedNews(Dept, 'DeptBased');
    }

    reactHandler.setState({
      Items: result
    });
    const TotalNews: number = result.length;
    const Count: number = TotalNews / 2;
    const PageCount: number = parseInt(Count.toFixed());
    reactHandler.setState({ TotalPageCount: PageCount });
  }

  public async GetAllOtherRelatedNews(ReleventCategory: any, Mode: string) {
    try {
      const { AvailableTags, AvailableDepts, Tag, Department } = this.state;
      const isTagBased = Mode === 'TagBased';
      const categories = isTagBased ? AvailableTags : AvailableDepts;
      const filterKey = isTagBased ? 'Tag' : 'Dept/Id';

      for (const category of categories) {
        try {
          const filterValue = isTagBased ? category : category.ID;
          const items: any[] = await NewWeb.lists.getByTitle(Newslist).items
            .select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id")
            .filter(`IsActive eq '1' and ${filterKey} eq '${filterValue}'`)
            .orderBy("Created", false)
            .expand("Dept", "SitePageID", "TransactionItemID")
            .get();

          if (items.length > 0 && (isTagBased ? items[0].Tag !== Tag : items[0].Dept.Title !== Department)) {
            const href = `${this.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=${Mode}&${isTagBased ? 'Tag' : 'Dept'}=${isTagBased ? items[0].Tag : items[0].Dept.Title}`;
            const title = isTagBased ? items[0].Tag : items[0].Dept.Title;

            document.querySelector('.available-depts-or-tags')?.insertAdjacentHTML('beforeend', `
                      <li>
                          <a href="${href}" data-interception='off' class="clearfix">
                              <div class="vategory-news-left pull-left">
                                  ${title}
                              </div>     
                              <div class="vategory-news-right pull-right">
                                  ${items.length}
                              </div>     
                          </a>
                      </li>
                  `);
          }
        } catch (error) {
          console.error(`Error fetching ${isTagBased ? 'Tag' : 'Dept'}-based news:`, error);
        }
      }
    } catch (globalError) {
      console.error("An error occurred in GetAllOtherRelatedNews:", globalError);
    }
  }

  public findValueInArray(value: any, arr: string | any[]) {
    var result = false;
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (name == value) {
        result = true;
        break;
      }
    }
    return result;
  }
  public readMoreHandler(compName: any) {
    this.props.onReadMoreClick({ Name: compName })
  }
  public render(): React.ReactElement<INewsCategoryBasedProps> {
    var reactHandler = this;

    const CategoryBasedNews: JSX.Element[] = this.state.Items.map((item, key) => {
      const RawImageTxt = item.Image;
      let serverRelativeUrl;

      if (RawImageTxt && RawImageTxt !== null) {
        const ImgObj = JSON.parse(RawImageTxt);
        serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/${item.ID}/${ImgObj.fileName}`;
        var depttitle = item.Dept?.Title;
        var sitepageid = item.SitePageID?.Id;

        return (
          <li key={key}>
            <div className="top-img-wrap">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a>

            <div className="ns-tag-duration">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception="off" className="tags">{item.Tag}</a>
            </div>
          </li>
        );
      } else {
        serverRelativeUrl = require("./ServiceProvider/Assets/Img/ErrorHandlingImages/home_news_noimage.png");

        return (
          <li key={key}>
            <div className="top-img-wrap">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a>

            <div className="ns-tag-duration">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception="off" className="tags">{item.Tag}</a>
            </div>
          </li>
        );
      }
    });


    // Function to get image URL

    // Function to calculate date


    return (
      <div className={styles.remoHomePage} id="newsCategoryBased">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="relative container">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> News </h1>
                  <ul className="breadcums">
                    <li>  <a href='#' onClick={() => this.readMoreHandler("Home")}> Home </a> </li>
                    <li>  <a href='#' onClick={() => this.readMoreHandler("NewsViewMore")} data-interception="off"> All News </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> {this.state.CurrentPage} </a> </li>
                  </ul>
                </div>

              </div>
              <div className="inner-page-contents ">
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-9 category-main-lists">
                        <div className="heading clearfix">
                          <div className="pull-left">
                            {this.state.CurrentPage}
                          </div>
                        </div>
                        <div className="section-part clearfix">
                          <ul className="paginate 1">
                            <div className="items">
                              {CategoryBasedNews}
                            </div>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-3 category-news-list">
                        <div className="heading clearfix">
                          <div className="pull-left">
                            Related News
                          </div>
                        </div>
                        <div className="section-part clearfix ">
                          <ul className="available-depts-or-tags">
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pagination" style={{ display: "none" }}>
                <div className="pager">
                  <div className="firstPage">&laquo;</div>
                  <div className="previousPage">&lsaquo;</div>
                  <div className="pageNumbers"></div>
                  <div className="nextPage">&rsaquo;</div>
                  <div className="lastPage">&raquo;</div>
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} onReadMoreClick={null} id={null} selectedComponents={undefined} />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
