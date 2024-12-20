import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { ICeoMessageReadMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import { Markup } from 'interweave';
// import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer'
// import pnp from 'sp-pnp-js';```
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService'

let CEO_Messagelist = listNames.CEO_Message;
// var Designation: any;
// var Department: any;
export interface ICeoMessageRmState {
  Items: any[];
  ItemID: any;
  Title: string;
}
export default class CeoMessageRm extends React.Component<ICeoMessageReadMoreProps, ICeoMessageRmState, {}> {
  constructor(props: ICeoMessageReadMoreProps) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null,
      Title: ""
    };

  }

  public componentDidMount() {

    setTimeout(function () {
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $("#ceoMessageReadMore").show();

      // Hide the element with ID "CommentsWrapper"
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

    var reactHandler = this;
    // const url: any = new URL(window.location.href);
    // const ItemID = url.searchParams.get("ItemID");

    const ItemID = this.props.id;
    // reactHandler.getCurrentUser().then(() => {
    //   reactHandler.GetCeoMessage(ItemID);
    // })

    // updated code
    const userDetails = new CurrentUserDetails();
    userDetails.getCurrentUserDetails().then((data) => {
      console.log("Current user details", data);
      console.log("data details", data?.Department, data?.Designation);
      reactHandler.GetCeoMessage(ItemID, data?.Department, data?.Designation);

    }).catch((error) => {
      console.error("Error fetching current user details:", error);
    });
  }
  // public async getCurrentUser() {
  //   try {
  //     const profile = await pnp.sp.profiles.myProperties.get();
  //     if (!profile || !profile.Title) {
  //       throw new Error("Profile data is incomplete or missing.");
  //     }
  //     Designation = profile.Title;
  //     if (profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //       const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string }) => prop.Key === 'Department');
  //       console.log(departmentProperty);
  //       if (departmentProperty) {
  //         Department = departmentProperty.Value;
  //       } else {
  //         console.warn("Department property not found in user profile.");
  //       }
  //     } else {
  //       console.warn("UserProfileProperties is empty or undefined.");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while fetching the user profile:", error);
  //   }
  // }


  // public async getCurrentUser() {
  //   const profile = await pnp.sp.profiles.myProperties.get();
  //   Designation = profile.Title;

  //   // Check if the UserProfileProperties collection exists and has the Department property
  //   if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //     // Find the Department property in the profile
  //     const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
  //     console.log(departmentProperty);
  //     if (departmentProperty) {
  //       Department = departmentProperty.Value;
  //     }
  //   }
  // }
  public async LandingPageAnalytics(Department: any, Designation: any) {
    try {
      if (!Department) {
        Department = "NA";
      }
      if (!Designation) {
        Designation = "NA";
      }
      console.log(this.state.Title);
    }
    catch (error) {
      console.error('Error adding data:', error);
    }
  }

  public async GetCeoMessage(ItemID: any, Department: any, Designation: any) {
    try {
      await sp.web.lists.getByTitle(CEO_Messagelist).items.select("Title", "Name", "Description", "Designation", "Image", "ID", "Created", "*").filter(`IsActive eq '1' and Id eq ${ItemID}`).getAll().then((items) => { // //orderby is false -> decending          
        // console.log(items);

        this.setState({
          Items: items,
          ItemID: items[0].Id,
          Title: items[0].Title
        }, () => {
          // Call LandingPageAnalytics after state is updated
          this.LandingPageAnalytics(Department, Designation);
        });
      })
    }
    catch (error) {
      console.error('Error adding data:', error);
    }
  }
  public render(): React.ReactElement<ICeoMessageReadMoreProps> {
    var handler = this;
    const CEOMessageDetails: JSX.Element[] = this.state.Items.map((item, key) => {
      const RawImageTxt = item.Image;
      const RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      const tdaydt = moment().format("DD/MM/YYYY");
      const Dte = (moment(RawPublishedDt, "DD/MM/YYYY").isSame(tdaydt, "day")) ? "Today" : moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");

      let serverRelativeUrl = "";
      if (RawImageTxt && RawImageTxt !== "") {
        const ImgObj = JSON.parse(RawImageTxt);
        serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${handler.props.siteurl}/Lists/${CEO_Messagelist}/Attachments/${item.ID}/${ImgObj.fileName}`;
      } else {
        serverRelativeUrl = `${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ceo_no_found.png`;
      }

      return (
        <div key={key} className="ceo-readmore-wrap clearfix">
          <div className="ceo-radmore-left">
            <img src={serverRelativeUrl} alt="image" />
          </div>
          <div className="ceo-radmore-right">
            <h2 className="nw-list-main">{item.Name}</h2>
            <div className="ns-tag-duration">
              <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off">{Dte}</a>
            </div>
          </div>
          <div className="mews-details-para">
            <p><Markup content={item.Description} /></p>
          </div>
        </div>
      );
    });

    return (
      <div className={styles.remoHomePage} id="ceoMessageReadMore" style={{ display: "none" }}>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <section>
          <div className="relative container">

            <div className="section-rigth">

              <div className="inner-banner-header relative m-b-20">

                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> CEO Read More </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> CEO Read More </a> </li>
                  </ul>
                </div>

              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row home-detail-banner">
                    <div className="col-md-12">
                      {CEOMessageDetails}
                    </div>
                  </div>
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} onReadMoreClick={null} id={null} />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />

      </div>
    );
  }
}
