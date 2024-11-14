import * as React from 'react';
import styles from "./RemoHomePage.module.scss";
import { IContentEditorProps } from "./IRemoHomePageProps";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
// import * as $ from 'jquery';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService'

const Content_Editor_Master_Categorylist = listNames.Content_Editor_Master_Category;
const Content_Editor_Masterlist = listNames.Content_Editor_Master;
const Analytics = listNames.Analytics;

export interface IRemoContentEditorState {
  Items: any[];
  ContentEditorAdmin: boolean;
  Tabs: any[];
  currentUser: any;
  Department: string;
  Designation: string;
  UserEmail: string;
}

// const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();

export default class RemoContentEditor extends React.Component<IContentEditorProps, IRemoContentEditorState, {}> {
  public constructor(props: IContentEditorProps, state: IRemoContentEditorState) {
    super(props);
    this.state = {
      Items: [],
      ContentEditorAdmin: false,
      Tabs: [],
      currentUser: null,
      Department: 'NA',
      Designation: 'NA',
      UserEmail: ''
    };
  }

  public async componentDidMount() {
    setTimeout(() => {
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
      // $('#content-editor').show();

      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }

      // Hide all div elements with the attribute data-automation-id="pageHeader"
      const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeaders.forEach((element: any) => {
        element.style.setProperty('display', 'none', 'important');
      });

      // Show the element with ID "ceoMessageReadMore"
      const ceoMessageReadMore = document.getElementById('ceoMessageReadMore');
      if (ceoMessageReadMore) {
        ceoMessageReadMore.style.display = 'block';
      }

      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
      const pageHeader: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeader.forEach((element: { style: { setProperty: (arg0: string, arg1: string, arg2: string) => void; }; }) => {
        element.style.setProperty('display', 'none', 'important');
      });
    }, 1500);

    // await this.getCurrentUser();
    await this.CheckPermission();
    this.LandingPageAnalytics();
    const userDetails = new CurrentUserDetails();
    userDetails.getCurrentUserDetails().then((data) => {
      console.log("Anoucement vm Current user details", data);
      console.log("data details", data?.Department, data?.Designation);
      this.setState({
        currentUser: this.props.UserId,
        UserEmail: data?.userEmail,
        Department: data?.Department,
        Designation: data?.Designation
      });
    }).catch((error) => {
      console.error("Error fetching current user details:", error);
    });
  }

  public async getCurrentUser() {
    try {
      const profile = await sp.profiles.myProperties.get();
      console.log('User Profile:', profile); // Debug log

      const userEmail = profile.Email || "No Email";
      const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
      const department = departmentProperty && departmentProperty.Value !== "" ? departmentProperty.Value : "NA";
      const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Title');
      const designation = designationProperty ? designationProperty.Value : "NA";

      this.setState({
        currentUser: this.props.UserId,
        UserEmail: userEmail,
        Department: department,
        Designation: designation
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  public async CheckPermission() {
    try {
      let groups = await sp.web.currentUser.groups();
      let isContentEditorAdmin = false;
      for (let group of groups) {
        if (group.Title === "ContentPageEditors") {
          isContentEditorAdmin = true;
          break;
        }
      }
      this.setState({ ContentEditorAdmin: isContentEditorAdmin });
      if (isContentEditorAdmin) {
        document.querySelectorAll('#access-denied-block').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        await Promise.all([this.GetContentEditorTabs(), this.GetContentEditorNavigations(1)]);
      } else {
        document.querySelectorAll('#access-denied-block').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    } catch (error) {
      console.error("Error checking user permissions:", error)
    }
  }


  // public async CheckPermission() {
  //   let groups = await sp.web.currentUser.groups();
  //   let isContentEditorAdmin = false;

  //   for (let group of groups) {
  //     if (group.Title === "ContentPageEditors") {
  //       isContentEditorAdmin = true;
  //       break;
  //     }
  //   }

  //   this.setState({ ContentEditorAdmin: isContentEditorAdmin });

  //   if (isContentEditorAdmin) {
  //     // $("#access-denied-block").hide();

  //     document.querySelectorAll('#access-denied-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });

  //     await Promise.all([this.GetContentEditorTabs(), this.GetContentEditorNavigations(1)]);
  //   } else {
  //     // $("#access-denied-block").show();
  //     document.querySelectorAll('#access-denied-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //   }
  // }

  public async GetContentEditorTabs() {
    try {
      const { UserId } = this.props;
      const items = await sp.web.lists.getByTitle(Content_Editor_Master_Categorylist)
        .items.select("Title", "ID", "AccessibleTo/Title")
        .expand("AccessibleTo")
        .filter(`IsActive eq 1 and AccessibleTo/Id eq ${UserId}`)
        .get();
      this.setState({ Tabs: items });
    } catch (error) {
      console.error("Error fetching ContentEditorTabs:", error);
    }
  }

  public async GetContentEditorNavigations(ID: number) {
    try {
      const { UserId } = this.props;
      const items = await sp.web.lists.getByTitle(Content_Editor_Masterlist)
        .items.select("Title", "URL", "Icon", "BelongsTo/Title", "AccessibleTo/Title", "*")
        .expand("BelongsTo", "AccessibleTo")
        .orderBy("Title", true)
        .filter(`IsActive eq 1 and BelongsTo/Id eq ${ID} and AccessibleTo/Id eq ${UserId}`)
        .get();
      this.setState({ Items: items });
    }
    catch (error) {
      console.error("Error fetching ContentEditorNavigations:", error);
    }
  }

  public async LandingPageAnalytics() {
    const { currentUser, UserEmail, Department, Designation } = this.state;
    // const CurrentDate = new Date();
    const ItemId = "NA";
    try {
      await sp.web.lists.getByTitle(Analytics).items.add({
        Category: "Content Editor",
        UserId: currentUser,
        Department: Department,
        Designation: Designation,
        Title: "NA",
        ItemId: ItemId,
        UserEmail: UserEmail,
      });
    } catch (error) {
      console.error('Error logging analytics data:', error);
    }
  }

  public render(): React.ReactElement<IContentEditorProps> {
    // $(document).ready(function () {
    //   $("#accordion .card .card-header").on('click', function () {
    //     $(".card-header").removeClass("active");
    //     $(this).addClass("active");
    //   });
    // });

    document.addEventListener('DOMContentLoaded', function () {
      const cardHeaders = document.querySelectorAll('#accordion .card .card-header');

      cardHeaders.forEach(header => {
        header.addEventListener('click', function () {
          // Remove "active" class from all card headers
          cardHeaders.forEach(header => header.classList.remove('active'));

          // Add "active" class to the clicked card header
          this.classList.add('active');
        });
      });
    });


    var reactHandler = this;

    const ContentEditorTAB: JSX.Element[] = this.state.Tabs.map((item, key) => (
      <div className="card" key={key}>
        <div className={`card-header${key === 0 ? ' active' : ''}`}>
          <a href="#" onClick={() => reactHandler.GetContentEditorNavigations(item.Id)} className="card-link collapsed">
            {item.Title}
          </a>
        </div>
      </div>
    ));

    const ContentEditorElements: JSX.Element[] = this.state.Items.map((item, key) => {
      const RawImageTxt = item.Icon;
      let serverRelativeUrl;
      if (item) {
        if (RawImageTxt) {
          const ImgObj = JSON.parse(RawImageTxt);
          serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${reactHandler.props.siteurl}/Lists/${Content_Editor_Masterlist}/Attachments/${item.ID}/${ImgObj.fileName}`;

          return (
            <li className="ifcontentpresent" key={key}>
              <a href={item.URL.Url} target="_blank" data-interception="off">
                <div className="inner-qiuicklinks-inner">
                  <img src={serverRelativeUrl} />
                  <p>{item.Title}</p>
                </div>
              </a>
            </li>
          );
        }
        // Return null if RawImageTxt is falsy
        return null;
      }
      return null;
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className={styles.remoHomePage} id="content-editor" style={{ display: "none" }}>
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        {this.state.ContentEditorAdmin && this.state.ContentEditorAdmin == true ? (
          <section>
            <div className="relative container">
              <div className="section-rigth">
                <div className="inner-banner-header relative m-b-20">
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> Content Editor </h1>
                    <ul className="breadcums">
                      <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                      <li>  <a href="#" style={{ pointerEvents: "none" }}> Content Editor</a> </li>
                    </ul>
                  </div>
                </div>
                <div className="inner-page-contents ">
                  <div className="top-news-sections content-editir-secs m-b-20">
                    <div className="row">
                      <div className="col-md-6">
                        <div id="accordion">
                          {ContentEditorTAB}
                        </div>
                      </div>
                      <div className="col-md-6 direct-conttent-sreas">
                        <div className="sec">
                          <ul className="clearfix">
                            {ContentEditorElements}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

              </div>
            </div>
          </section>
        ) : (
          <section id="access-denied-block" style={{ display: "none" }}>
            <div className="result-succ-mess">
              <h3>Access Denied</h3>
              <img src={`${this.props.siteurl}/SiteAssets/img/Not_sync.png`} alt="image" data-themekey="#" />
              <h4> You don't have enough permission to access this!</h4>{" "}
              <p>Please contact your Administrator</p>
              <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Go Back</a>
            </div>
          </section>
        )}
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
