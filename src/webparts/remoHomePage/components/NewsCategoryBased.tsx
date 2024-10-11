import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { INewsCategoryBasedProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
// import * as $ from 'jquery';
import { IWeb, Web } from "@pnp/sp/webs";
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp from 'sp-pnp-js';

let Newslist = listNames.News;
const Analytics = listNames.Analytics;


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

let NewsAvailableDepts: { ID: any; Title: any; URL: any; }[] = [];
let DeptNames: any[] = [];
let DeptNamesExitsUnique: any[] = [];
var User = "";
var UserEmail = "";
var Designation = "";
var Department = "";
var NewWeb: IWeb & IInvokable<any>;
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
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('#RecommendedItems').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');


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

    reactHandler.getCurrentUser().then(() => {

      if (Mode == "TagBased") {
        reactHandler.GetAvailableTags();
      } else {
        reactHandler.GetAvailableDepts();
      }
    }).then(() => {
      reactHandler.LandingPageAnalytics();
    });
  }


  public async LandingPageAnalytics() {
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    console.log(this.state.Title);

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

  public async getCurrentUser() {
    var reacthandler = this;
    User = reacthandler.props.userid;
    const profile = await pnp.sp.profiles.myProperties.get();
    UserEmail = profile.Email;
    Designation = profile.Title;

    // Check if the UserProfileProperties collection exists and has the Department property
    if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
      // Find the Department property in the profile
      const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
      console.log(departmentProperty);
      if (departmentProperty) {
        Department = departmentProperty.Value;
      }
    }
  }
  public async GetAvailableTags() {
    var handler = this;
    await NewWeb.lists.getByTitle(Newslist).fields.filter(`EntityPropertyName eq 'Tag'`).get().then((items: any[]) => {
      for (var i = 0; i < items[0].Choices.length; i++) {
        handler.setState({ AvailableTags: items[0].Choices });
      }
      handler.GetCategoryBasedNews(handler.state.Mode, handler.state.Tag, handler.state.Department);
    });
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
      // Handle error gracefully
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
    var reactHandler = this;
    if (Mode == 'TagBased') {
      for (var i = 0; i < reactHandler.state.AvailableTags.length; i++) {
        await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`IsActive eq '1' and Tag eq '${reactHandler.state.AvailableTags[i]}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").get().then((items: any[]) => {
          if (items.length != 0 && items[0].Tag != "" + reactHandler.state.Tag + "") {
            reactHandler.setState({ TagBasedNews: items });
            $('.available-depts-or-tags').append(`<li>
                  <a href="${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${items[0].Tag}" data-interception='off' className="clearfix">  
                  <div class="vategory-news-left pull-left">
                      ${items[0].Tag}
                  </div>     
                  <div class="vategory-news-right pull-right">
                      ${items.length}
                  </div>     
                  </a>
                </li>`);
          }
        });
      }
    } else {
      for (var j = 0; j < reactHandler.state.AvailableDepts.length; j++) {
        await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`IsActive eq '1' and Dept/Id eq '${reactHandler.state.AvailableDepts[j].ID}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").get().then((items: any[]) => {
          if (items.length != 0 && items[0].Dept.Title != "" + reactHandler.state.Department + "") {
            reactHandler.setState({ DeptBasedNews: items });
            $('.available-depts-or-tags').append(`<li>
                  <a href="${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=DeptBased&Dept=${items[0].Dept.Title}" data-interception='off' class="clearfix">  
                    <div class="vategory-news-left pull-left">
                        ${items[0].Dept.Title}
                    </div>     
                    <div class="vategory-news-right pull-right">
                        ${items.length}
                    </div>     
                  </a>
                </li>`);
          }
        });
      }
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
            {/* <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a> */}
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a>

            <div className="ns-tag-duration">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception="off" className="tags">{item.Tag}</a>
            </div>
          </li>
        );
      } else {
        serverRelativeUrl = `${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`;

        return (
          <li key={key}>
            <div className="top-img-wrap">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            {/* <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a> */}
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
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/NewsViewMore.aspx?`} data-interception="off"> All News </a> </li>
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
                            {/*TagBasedNews*/}

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
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
