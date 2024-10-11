import * as React from 'react';
import { IJobsMasterProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import * as moment from 'moment';
// import * as $ from 'jquery';
import pnp, { sp } from 'sp-pnp-js';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';

let JobsMasterlist = listNames.JobsMaster;

export interface IJobsMasterState {
    Items: any[];
    AppliedJobIds: number[];
}
var Appliedjobs: any;
var Designation: any;
var Department: any;


export default class JobsMaster extends React.Component<IJobsMasterProps, IJobsMasterState, {}> {
    public constructor(props: IJobsMasterProps) {
        super(props);
        this.state = {
            Items: [],
            AppliedJobIds: []
        };

    }

    public async componentDidMount() {
        // $('#spCommandBar').attr('style', 'display: none !important');
        // $('#CommentsWrapper').attr('style', 'display: none !important');
        // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

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
        this.getCurrentUser().then(() => {
            this.isuserAlreadyApplied()
        }).then(() => {
            this.LandingPageAnalytics()
        });
    }

    public async getCurrentUser() {
        const profile = await pnp.sp.profiles.myProperties.get();
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
    public async LandingPageAnalytics() {
        if (!Department) {
            Department = "NA";
        }
        if (!Designation) {
            Designation = "NA";
        }
        // console.log(this.state.Title);

        try {


        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    // public async Getcurrentuserid() {
    //     try {
    //         const user = await sp.web.currentUser.get();
    //         console.log("Current user:", user);
    //         CurrentUserID = user.Id;
    //         await this.isuserAlreadyApplied();


    //     } catch (error) {
    //         console.error("Error getting current user:", error);
    //     }
    // }

    public async GetJobs() {
        var reactHandler = this
        try {
            const items = await sp.web.lists.getByTitle(JobsMasterlist)
                .items.select("Title", "EmploymentType", "ExperienceLevel", "EmailID", "DateOfSubmission", "JobSummary", "Status", "ID", "Created")
                .filter(`IsActive eq '1'`)
                .getAll();

            reactHandler.setState({ Items: items }, async () => {
            });
        } catch (error) {
            console.error("Error getting job items:", error);
        }
    }

    public async isuserAlreadyApplied() {
        try {
        } catch (error) {
            console.error("Error checking if user applied:", error);
        }
    }

    public render(): React.ReactElement<IJobsMasterProps> {
        const JobsMaster: JSX.Element[] = this.state.Items.map((item, key) => {
            const { ID, Title, EmploymentType, ExperienceLevel, DateOfSubmission, Status } = item;
            const dateOfSubmissionFormatted = moment(DateOfSubmission).format("DD/MMM/YYYY");

            var isavailabe = false;
            // if (Status === "Open") {
            //     statusElement = <td className="status approved"><span>Open</span></td>;
            //     if (this.state.AppliedJobIds.indexOf(ID) !== -1) {
            //         actionElement = <td title='Already Applied for this JOB'><a className="apply">Applied</a></td>;
            //     } else {
            //         actionElement = <td><a href={`${this.props.siteurl}/SitePages/Jobs-Read-More.aspx?ItemID=${ID}`} className="apply">Apply Now</a></td>;
            //     }
            // } else {
            //     statusElement = <td className="status expired"><span>Expired</span></td>;
            //     actionElement = <td>...</td>;
            // }
            var count = 0
            var action = "";
            var reacthadler = this
            return (
                <tr key={key}>
                    <td>{ID}</td>
                    <td>{Title}</td>
                    <td>{EmploymentType}</td>
                    <td>{ExperienceLevel}</td>
                    <td>{dateOfSubmissionFormatted}</td>
                    {Status === "Open" ?
                        <>
                            <td className="status approved"><span>Open</span></td>
                            {Appliedjobs.map(function (items: any) {
                                console.log(items);
                                if (items.Title == Title && items.EmploymentType == EmploymentType && items.ExperienceLevel == ExperienceLevel) {
                                    action = "Applied"
                                    isavailabe = true
                                }
                                count = count + 1
                                if (count == Appliedjobs.length) {
                                    if (isavailabe) {
                                        return (
                                            <td>{action}</td>
                                        );
                                    } else {
                                        return (
                                            <td><a href={`${reacthadler.props.siteurl}/SitePages/Jobs-Read-More.aspx?ItemID=${ID}`} className="apply">Apply Now</a></td>
                                        );
                                    }
                                }
                            })}
                        </>
                        :
                        <>
                            <td className="status expired"><span>Expired</span></td>
                            <td>...</td>
                        </>}
                    {/* {statusElement}
                    {actionElement} */}
                </tr>
            );
        });

        return (
            <div id="jobsmaster">
                <section>
                    <div id="Global-Top-Header-Navigation">
                        <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
                    </div>
                    <div className="container relative">
                        <div className="section-rigth">
                            <div className="inner-banner-header jobs-banner relative m-b-20">
                                <div className="inner-banner-overlay"></div>
                                <div className="inner-banner-contents">
                                    <h1> We are hiring </h1>
                                    <ul className="breadcums">
                                        <li> <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`}> Home </a> </li>
                                        <li> <a href="#"> Jobs </a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="inner-page-contents ">
                                <div className="sec">
                                    <div className="contact-table-info">
                                        <div className='table-responsive'>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Job Title</th>
                                                        <th>Employment Type</th>
                                                        <th>Experience Level</th>
                                                        <th className='th_dos'>Date Of Submission</th>
                                                        <th className='th_status'>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {JobsMaster}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
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
