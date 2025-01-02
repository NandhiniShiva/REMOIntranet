import * as React from 'react';
import { IJobsRmProps } from './IRemoHomePageProps';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import * as moment from 'moment';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Swal from "sweetalert2";
import { Web } from '@pnp/sp/webs';
import Footer from '../../remoHomePage/components/Footer/Footer';
// import pnp from 'sp-pnp-js';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
// import * as $ from "jquery"

const JobsMasterlist = listNames.JobsMaster;
const JobApplicationMasterlist = listNames.JobApplicationMaster;

export interface IJobsRMState {
  Items: any[];
  Isuserapplied: boolean;
  title: any[];
  ItemID: number;
  JobTitle: string;
}

let JobTitle: string;
let employmentType: any;
let experienceLevel: any;
let NewWeb: any;
// var Designation: any;
// var Department: any;
var UserID: any;
var ItemID: any;

export default class JobsRm extends React.Component<IJobsRmProps, IJobsRMState, {}> {
  public constructor(props: IJobsRmProps) {
    super(props);
    this.state = {
      Items: [],
      title: [],
      Isuserapplied: false,
      ItemID: 0,
      JobTitle: "",
    };
    NewWeb = Web(this.props.siteurl);
  }

  public async componentDidMount() {
    setTimeout(() => {
      // $('#spCommandBar').hide();
      // $('#CommentsWrapper').hide();
      // $('div[data-automation-id="pageHeader"]').hide();

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

      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
    }, 2000);

    const url = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");

    // await this.getCurrentUser().then(async () => {
    //   await this.GetJobs(ItemID);
    // }).then(async () => {
    //   await this.LandingPageAnalytics();
    // }).then(async () => {
    //   await this.isuserApplied()
    // })

    const userDetails = new CurrentUserDetails();

    try {
      const data = await userDetails.getCurrentUserDetails();
      console.log("Current user details", data);

      await this.GetJobs(ItemID);
      await this.LandingPageAnalytics(data?.Department, data?.Designation);
      await this.isuserApplied();
    } catch (error) {
      console.error("Error fetching current user details or processing data:", error);
    }




  }

  public async isuserApplied() {
    try {
      const items = await sp.web.lists.getByTitle(JobApplicationMasterlist)
        .items.select("*", "Title", "EmploymentType", "ExperienceLevel", "AppliedBy/ID")
        .expand("AppliedBy")
        .filter(`AppliedBy/ID eq ${UserID} and Title eq '${JobTitle}' and EmploymentType eq '${employmentType}' and ExperienceLevel eq '${experienceLevel}'`)
        .getAll();

      if (items.length !== 0) {
        this.setState({ Isuserapplied: true });
      } else {
        this.setState({ Isuserapplied: false });
      }
    } catch (error) {
      console.error("Error checking if user applied:", error);
    }
  }

  public async GetJobs(ItemID: string) {
    try {
      const items = await sp.web.lists.getByTitle(JobsMasterlist)
        .items.select("Title", "EmploymentType", "ExperienceLevel", "EmailID", "DateOfSubmission", "JobSummary", "Status", "ID", "Created")
        .filter(`IsActive eq '1' and ID eq '${ItemID}'`)
        .getAll();
      this.setState({
        JobTitle: items[0].Title
      })
      JobTitle = items[0].Title;
      employmentType = items[0].EmploymentType;
      experienceLevel = items[0].ExperienceLevel;
      console.log("Job items:", items);

      this.setState({
        Items: items,
      }, async () => {
        //  await this.isuserApplied() ;

      });
    } catch (error) {
      console.error("Error getting job items:", error);
    }
  }
  // public async getCurrentUser() {
  //   try {
  //     const profile = await pnp.sp.profiles.myProperties.get();
  //     Designation = profile.Title;
  //     const currentUser = await sp.web.currentUser.get();
  //     UserID = currentUser.Id;
  //     // Check if the UserProfileProperties collection exists and has the Department property
  //     if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //       // Find the Department property in the profile
  //       const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
  //       console.log(departmentProperty);
  //       if (departmentProperty) {
  //         Department = departmentProperty.Value;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while fetching the user profile:", error);
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
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  // public async Getcurrentuserid() {
  //   try {
  //     const user = await sp.web.currentUser.get();
  //     // console.log("Current user:", user);

  //     CurrentUserID = user.Id;
  //   } catch (error) {
  //     console.error("Error getting current user:", error);
  //   }
  // }

  public async ApplyJob(ItemID: string) {
    await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to proceed with the job application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel'
    }).then(async result => {
      const CurrentDateTime = moment().format("DD/MMM/YYYY HH:mm:ss");

      if (result.isConfirmed) {
        try {
          const items = await sp.web.lists.getByTitle(JobsMasterlist)
            .items.select("Title", "EmploymentType", "ExperienceLevel", "EmailID", "DateOfSubmission", "JobSummary", "Status", "ID", "Created")
            .filter(`IsActive eq '1' and ID eq '${ItemID}'`)
            .getAll();

          // console.log("Job items for application:", items);

          await NewWeb.lists.getByTitle(JobApplicationMasterlist).items.add({
            Title: items[0].Title,
            EmploymentType: items[0].EmploymentType,
            ExperienceLevel: items[0].ExperienceLevel,
            JobSummary: items[0].JobSummary,
            AppliedById: UserID,
            AppliedOn: CurrentDateTime,
          });

          Swal.fire({
            title: "Success",
            text: "Applied successfully",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            window.location.href = `${this.props.siteurl}/SitePages/Jobs-Master.aspx`;
          });
        } catch (error) {
          console.error("Error applying for job:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while applying. Please try again later.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } else {
        Swal.fire("Cancelled", "The job application process has been cancelled.", "info");
      }
    });
  }

  public alertuser() {
    Swal.fire("User already applied for Job");
  }

  public render(): React.ReactElement<IJobsRmProps> {
    const JobsRM = this.state.Items.map((item, key) => {
      const { ID, Title, EmploymentType, ExperienceLevel, EmailID, DateOfSubmission, JobSummary } = item;
      const dateOfSubmissionFormatted = moment(DateOfSubmission).format("DD/MMM/YYYY");

      return (
        <React.Fragment key={key}>
          <div className="inner-banner-header jobs-banner relative m-b-20">
            <div className="inner-banner-overlay"></div>
            <div className="inner-banner-contents">
              <h1> We are hiring {Title} </h1>
              <ul className="breadcums">
                <li><a href={`${this.props.siteurl}/SitePages/HomePage.aspx`}> Home </a></li>
                <li><a href="#"> Jobs </a></li>
              </ul>
            </div>
          </div>
          <div className="inner-page-contents">
            <div className="sec">
              <div className="top-news-sections jobs-info-sec">
                <div className="added-emp-part">
                  <div className="section-part">
                    <ul className="qq-links-part emp-info clearfix">
                      <li>
                        <div className="emp-details">
                          <h5>Employment Type</h5>
                          <h4>{EmploymentType}</h4>
                        </div>
                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Experience Level</h5>
                          <h4>{ExperienceLevel}</h4>
                        </div>
                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Email ID</h5>
                          <h4>{EmailID}</h4>
                        </div>
                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Date Of Submission</h5>
                          <h4>{dateOfSubmissionFormatted}</h4>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {JobSummary && (
                <div className="job-summary m-b-20">
                  <h4>Job Summary</h4>
                  <ul>{JobSummary}</ul>
                </div>
              )}
              <div className="align-center apply-btn">
                <a href="#" type="button" className="btn filter-btn">
                  {!this.state.Isuserapplied ? (
                    <span onClick={() => this.ApplyJob(ID)}>Apply Now</span>
                  ) : (
                    <span onClick={() => this.alertuser()}>Apply Now</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    return (
      <div id="jobsrm">
        <section>
          <div id="Global-Top-Header-Navigation">
            <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
          </div>
          <div className="container relative">
            <div className="section-rigth">
              {JobsRM}
            </div>
            <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} onReadMoreClick={null} id={null} />
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
