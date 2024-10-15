import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery';
import GlobalSideNav from '../components/Header/GlobalSideNav';
import RemoResponsive from '../components/Header/RemoResponsive';
import RemoHeroBanner from './RemoHeroBanner';
import RemoCEOMessage from './RemoCEOMessage';
import RemoNavigations from './RemoNavigations';
import RemoMyMeetings from './RemoMyMeetings';
import RemoNews from './RemoNews';
import RemoLatestEventsandAnnouncements from './RemoLatestEventsandAnnouncements';
import RemoImagesandVideos from './RemoImagesandVideos';
import RemoClimate from './RemoClimate';
import RemoBirthday from './RemoBirthday';
import RemoQuickLinks from './RemoQuickLinks';
import RemoRecentFiles from './RemoRecentFiles';
import RemoSocialMedia from './RemoSocialMedia';
import Footer from './Footer/Footer'
import pnp from 'sp-pnp-js';
import { listNames, totalList } from '../Configuration';
import { Web } from '@pnp/sp/webs';
import { sp } from '@pnp/sp';

let NewWeb: any;
let spWeb: any;
let fetchList: any;
let IsListCreate: any;
const Analytics = listNames.Analytics;
var User: any;
var UserEmail: any;
var Designation: any;
var Department: any;
// var UserID: any;
// var Dept: any



export default class RemoHomePage extends React.Component<IRemoHomePageProps, {}> {

  constructor(props: IRemoHomePageProps) {
    super(props);
    console.log(spWeb, fetchList, IsListCreate);

    // this.state = {


    // };
    spWeb = Web(this.props.siteurl);
    fetchList = true
    IsListCreate = false;

  }

  public componentDidMount() {
    this.loaderInProgress();
    // console.log("listname", listNames);
    // $(".inner-pages-nav").remove();
    document.querySelectorAll('.inner-pages-nav').forEach(function (element) {
      element.remove();
    });
    setTimeout(() => {

      // $(".inner-pages-nav").remove();
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

      // $("#HomePage").show();

      document.querySelectorAll('.inner-pages-nav').forEach(function (element) {
        element.remove();
      });
      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
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
    }, 1000);
    debugger;
    // if (this.props.createList === true) {
    // this.CreateList();
    // this.CreateMultipleLists(totalListName);
    // alert("ok")
    this.createSharePointLists();
    // }
    this.getCurrentUser().then(() => {
      this.LandingPageAnalytics();
    })

  }


  public async LandingPageAnalytics() {
    NewWeb = Web(this.props.siteurl)
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    // console.log(this.state.Title);

    try {
      const response = await NewWeb.lists.getByTitle(Analytics).items.add({
        Category: "Landing Page",
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

  // public loaderInProgress() {
  //   setTimeout(() => {
  //     $('#loader-Icon').show()
  //   }, 500);
  //   setTimeout(() => {
  //     $('#load-content').show()
  //     $('#loader-Icon').hide()
  //   }, 2000);
  // }

  public loaderInProgress() {
    setTimeout(() => {
      const loaderIcon = document.getElementById('loader-Icon');
      if (loaderIcon) {
        loaderIcon.style.display = 'block';
      }
    }, 500);

    setTimeout(() => {
      const loadContent = document.getElementById('load-content');
      const loaderIcon = document.getElementById('loader-Icon');

      if (loadContent) {
        loadContent.style.display = 'block';
      }

      if (loaderIcon) {
        loaderIcon.style.display = 'none';
      }
    }, 2000);
  }

  // public async getCurrentUser() {
  //   const url: any = new URL(window.location.href);
  //   console.log(url);


  //   var reacthandler = this;
  //   User = reacthandler.props.userid;
  //   const profile = await pnp.sp.profiles.myProperties.get();
  //   UserEmail = profile.Email;
  //   var Name = profile.DisplayName;
  //   console.log(Name);
  //   Designation = profile.Title;

  //   // Check if the UserProfileProperties collection exists and has the Department property
  //   if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //     // Find the Department property in the profile
  //     const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
  //     const DesignationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
  //     console.log(departmentProperty, DesignationProperty);
  //     if (departmentProperty) {
  //       Department = departmentProperty.Value;
  //     }
  //   }
  // }

  // Updated code 

  public async getCurrentUser() {
    try {
      const url: URL = new URL(window.location.href);
      console.log(url);

      const reactHandler = this;
      User = reactHandler.props.userid;

      const profile = await pnp.sp.profiles.myProperties.get();
      UserEmail = profile.Email;
      const Name = profile.DisplayName;
      console.log(Name);
      Designation = profile.Title;

      // Check if the UserProfileProperties collection exists and has the Department and Designation properties
      if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
        const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
        console.log(departmentProperty, designationProperty);

        if (departmentProperty) {
          Department = departmentProperty.Value;
        }


      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Function to create lists and columns in SharePoint
  public async createSharePointLists() {
    try {
      // Iterate through the array of lists
      for (const list of totalList) {
        const { name, columns } = list;
        // Check if the list exists
        let listExists = true;
        try {
          await sp.web.lists.getByTitle(name).get(); // Attempt to get the list
          console.log(`List '${name}' already exists.`);
        } catch (err) {
          listExists = false; // If error, assume list doesn't exist
        }
        // If list does not exist, create it
        if (!listExists) {
          await sp.web.lists.add(name, "", 100, false);
          console.log(`List '${name}' created successfully.`);
        }

        for (const column of columns) {
          let columnExists = true;
          try {
            // Check if the column already exists
            await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
            console.log(`Column '${column.columnName}' already exists in list '${name}'.`);
          } catch (err) {
            columnExists = false; // If error, assume column doesn't exist
          }

          // If column doesn't exist, create it
          if (!columnExists) {
            switch (column.type) {
              case "addImageField":
                await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
                console.log(`Column '${column.columnName}' added as Image Field.`);
                const view = await sp.web.lists.getByTitle(name).views.getByTitle("All Items").get();
                console.log(view);
                await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
                break;

              case "addBoolean":
                await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
                console.log(`Column '${column.columnName}' added as Boolean.`);
                await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
                break;

              case "addTextField":
                await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
                await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
                console.log(`Column '${column.columnName}' added as Text Field.`);
                break;

              case "addNumberField":
                await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
                console.log(`Column '${column.columnName}' added as Number Field.`);
                await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
                break;

              case "addDateField":
                await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
                console.log(`Column '${column.columnName}' added as Date Field.`);
                await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
                break;

              default:
                console.log(`Unknown column type: ${column.type}`);

            }
          }
        }
      }
    } catch (err) {
      console.error("Error during list/column creation process:", err);
    }
  }



  // public async createColumn(listName: any) {

  //   await spWeb.lists.getByTitle(listName).fields.addBoolean("IsActive", { Group: "My Group" });
  //   await spWeb.lists.getByTitle(listName).fields.addImageField("Image", { Group: "My Group" });

  // }


  public render(): React.ReactElement<IRemoHomePageProps> {

    return (
      <>
        <div className={styles.remoHomePage} id="load-content" style={{ display: "none" }}>
          <div id="Global-Top-Header-Navigation">
            <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
          </div>
          <section>
            <div className="container home_pg relative">

              <div className="section-rigth">
                <div className="banner-ceo-message ">
                  <div className="row">

                    <RemoHeroBanner siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

                    <RemoCEOMessage siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
                  </div>
                </div>
                <RemoNavigations siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

                <div className="row section_bottom">

                  <div className="col-md-8">
                    <div className="events-calender">
                      <RemoMyMeetings siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

                    </div>

                    <RemoNews siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />


                    <div className="latest-news-announcemnst" id="latest-news-announcemnst">
                      <div className="row row-res">
                        <RemoLatestEventsandAnnouncements siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
                      </div>
                    </div>
                    <div id="social-and-gallery">
                      <div className="images-social">
                        <div className="row row-res">
                          <RemoImagesandVideos siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
                          <RemoSocialMedia siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">

                    <RemoBirthday siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

                    <RemoClimate siteurl={this.props.siteurl} context={this.props.context} description={''} />



                    <RemoQuickLinks siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />


                    <RemoRecentFiles siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

                  </div>
                </div>
                <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
                <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

              </div>

            </div>
          </section>
        </div>
        <div id='loader-Icon' className="loader-block" style={{ display: "none" }}>
          {/* <img src="https://etccgov.sharepoint.com/sites/Intranet/SiteAssets/ETCC%20Intranet/img/loader%20.gif" alt="Loader-Icon" /> */}
          <div id="progressContainer" style={{ display: "none" }}>
            <p id="currentListName">Creating lists...</p>
            <progress id="listProgressBar" value="0" max="100"></progress>
          </div>

        </div>
      </>

    );
  }
}
