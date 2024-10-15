import * as React from 'react';
import { IRemoDeptLandingPageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery'
import AboutDepartment from './RemoAboutDepartment';
import DepartmentServices from './RemoDepartmentServices';
import DepartmentGallery from './RemoDepartmentGallery';
import DepartmentQuickLink from './RemoDepartmentQuickLinks';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import Footer from '../../remoHomePage/components/Footer/Footer';
import { listNames, WEB } from '../../remoHomePage/Configuration'
import pnp from 'sp-pnp-js';
import { Web } from '@pnp/sp/webs';

let NewWeb: any;
const Analytics = listNames.Analytics;
var User: any;
var UserEmail: any;
var Designation: any;
var Department: any;
var Dept: any

NewWeb = Web(WEB.NewWeb)

export default class RemoHomePage extends React.Component<IRemoDeptLandingPageProps, {}> {
  public componentDidMount() {
    setTimeout(() => {
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#spLeftNav').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('.ms-CommandBar').attr('style', 'display: none !important');
      // $("#Dept-Homepage").show();



      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }

      const msCommandBar: any = document.getElementsByClassName('ms-CommandBar');
      if (msCommandBar) {
        msCommandBar.style.setProperty('display', 'none', 'important');
      }

      const spLeftNav: any = document.getElementById('spLeftNav');
      if (spLeftNav) {
        spLeftNav.style.setProperty('display', 'none', 'important');
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

      document.querySelectorAll('#Dept-Homepage').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
    }, 1000);

    this.getCurrentUser().then(() => {
      this.LandingPageAnalytics();
    })
  }

  public async LandingPageAnalytics() {
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    // console.log(this.state.Title);

    try {
      const response = await NewWeb.lists.getByTitle(Analytics).items.add({
        Category: `${Dept}-Dept Landing Page`,
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

  // public async getCurrentUser() {
  //   const url: any = new URL(window.location.href);


  //   const fullPath = url.pathname;

  //   // Find the index of 'SitePages'
  //   const segment = "SitePages";
  //   const segmentIndex = fullPath.indexOf(`/${segment}`);

  //   if (segmentIndex === -1) {
  //     // If 'SitePages' is not found in the URL, return null
  //     // return null;
  //   }

  //   // Extract the part of the URL before 'SitePages'
  //   const relevantPart = fullPath.substring(0, segmentIndex);

  //   // Find the last segment before 'SitePages'
  //   const lastSegmentIndex = relevantPart.lastIndexOf('/');

  //   // Extract the last segment
  //   const lastSegment = relevantPart.substring(lastSegmentIndex + 1);
  //   Dept = lastSegment;
  //   var reacthandler = this;
  //   User = reacthandler.props.userid;
  //   const profile = await pnp.sp.profiles.myProperties.get();
  //   UserEmail = profile.Email;
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

  // Updated code 
  public async getCurrentUser() {
    try {
      const url = new URL(window.location.href);
      const fullPath = url.pathname;

      // Find the index of 'SitePages' in the URL
      const segment = "SitePages";
      const segmentIndex = fullPath.indexOf(`/${segment}`);

      if (segmentIndex === -1) {
        // If 'SitePages' is not found in the URL, exit the function
        console.warn("SitePages segment not found in the URL.");
        return;
      }

      // Extract the relevant part of the URL before 'SitePages' and get the last segment
      const relevantPart = fullPath.substring(0, segmentIndex);
      const lastSegmentIndex = relevantPart.lastIndexOf('/');
      const lastSegment = relevantPart.substring(lastSegmentIndex + 1);
      Dept = lastSegment;

      // Retrieve user ID from props
      const reactHandler = this;
      User = reactHandler.props.userid;

      // Fetch user profile properties
      const profile = await pnp.sp.profiles.myProperties.get();
      UserEmail = profile.Email;
      Designation = profile.Title;

      // Find the Department property if it exists in the profile
      if (profile?.UserProfileProperties?.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find(
          (prop: { Key: string }) => prop.Key === 'Department'
        );

        if (departmentProperty) {
          Department = departmentProperty.Value;
        }
      }
    } catch (error) {
      console.error("Error fetching current user information:", error);
    }
  }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {

    return (
      <div id="Dept-Homepage" style={{ display: "none" }}>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.homepage} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <div className="container home_pg relative" >
          <div className="banner-ceo-message ">
            <div className="row">
              <div className="col-md-12">
                <AboutDepartment siteurl={this.props.siteurl} context={this.props.context} PageName={this.props.PageName} userid={this.props.userid} homepage={this.props.homepage} />

              </div>
            </div>

            <div className="row">
              <div className="col-md-8">

                <DepartmentServices siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />


                <DepartmentGallery siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />

              </div>
              <div className="col-md-4">
                <DepartmentQuickLink siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />

              </div>
            </div>

          </div>
          <RemoResponsive siteurl={this.props.homepage} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
          <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />
        </div>
      </div>

    );
  }
}
