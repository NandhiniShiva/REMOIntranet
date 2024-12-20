import * as React from 'react';
import { ServiceProvider } from '../ServiceProvider/ServiceProvider';
// import * as $ from 'jquery';
import { IWeb, Web } from "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import ReactTooltip from "react-tooltip";
import pnp from 'sp-pnp-js';
import { sp } from '@pnp/sp/presets/all';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../Configuration';
import { SPComponentLoader } from '@microsoft/sp-loader';

let Navigationslist = listNames.Navigations;
let DepartmentsMasterlist = listNames.DepartmentsMaster;
let QuickLinkslist = listNames.QuickLinks;

export interface IResponsiveProps {
    siteurl: string;
    context: any;
    currentWebUrl: string;
    CurrentPageserverRequestPath: string;
}

export interface IResponsiveState {
    myMailDatas: any[];
    myMeetingsDatas: any[];
    EmailCount: any;
    MeetingsCount: any;
    CurrentPageUrl: any;
    IsAdminForContentEditor: boolean;

    MainNavItems: any[];
    DeptandQuickLinksItems: any[];
    QuickLinkItems: any[];
    SelectedNav: any[];
    showdata: any[];
    showdataLevelTwo: any[];
    showdataqlink: any[];

    showdataResponsive: any[];
    showdataLevelTwoResponsive: any[];
    showdataqlinkResponsive: any[];

    CurrentUserName: string;
    CurrentUserDesignation: string;
    CurrentUserProfilePic: string;
    SiteLogo: string;
}

var NewWeb: IWeb & IInvokable<any>;

export default class RemoResponsive extends React.Component<IResponsiveProps, IResponsiveState, {}> {
    private serviceProvider;
    private displayData: JSX.Element[];
    private displayDataLevel2: any[];
    private displayDataQlink: JSX.Element[];


    private displayDataResponsive: JSX.Element[];
    private displayDataLevel2Responsive: any[];
    private displayDataQlinkResponsive: JSX.Element[];
    public constructor(props: IResponsiveProps) {
        super(props);
        sp.setup({
            spfxContext: this.props.context
        });
        this.serviceProvider = new ServiceProvider(this.props.context);

        this.displayData = [];
        this.displayDataLevel2 = [];
        this.displayDataQlink = [];

        this.displayDataResponsive = [];
        this.displayDataLevel2Responsive = [];
        this.displayDataQlinkResponsive = [];
        this.appendData = this.appendData.bind(this);
        this.appendDataLevelTwo = this.appendDataLevelTwo.bind(this);
        this.appendDataQLink = this.appendDataQLink.bind(this);

        SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
        SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);

        SPComponentLoader.loadScript('https://code.jquery.com/jquery-3.6.0.min.js', {
            globalExportsName: 'jQuery'
        }).then(() => {
            SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', {
                globalExportsName: 'jQuery'
            }).then(() => {
                SPComponentLoader.loadScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', {
                    globalExportsName: 'jQuery'
                });
            });
        });

        // SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/css/SP-NativeStyle-Overriding.css?v=3.3`);
        // SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/css/style.css?v=1.8`);
        // SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/css/Responsive.css?v=4.18`);

        // Updated code

        SPComponentLoader.loadCss('https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SiteAssets/css/SP-NativeStyle-Overriding.css?v=3.3');
        SPComponentLoader.loadCss('https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SiteAssets/css/style.css?v=1.8');
        SPComponentLoader.loadCss('https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SiteAssets/css/Responsive.css?v=4.18');
        // SPComponentLoader.loadCss(Configuration.cssPath);
        // SPComponentLoader.loadCss(Configuration.overRidingCss);
        // SPComponentLoader.loadCss(Configuration.respnsiveCss);


        SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
        SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");


        this.state = {
            myMailDatas: [],
            myMeetingsDatas: [],
            EmailCount: "",
            MeetingsCount: "",
            CurrentPageUrl: "",
            IsAdminForContentEditor: false,

            MainNavItems: [],
            DeptandQuickLinksItems: [],
            QuickLinkItems: [],
            SelectedNav: [],
            showdata: [],
            showdataLevelTwo: [],
            showdataqlink: [],

            showdataResponsive: [],
            showdataLevelTwoResponsive: [],
            showdataqlinkResponsive: [],

            CurrentUserName: "",
            CurrentUserDesignation: "",
            CurrentUserProfilePic: "",
            SiteLogo: ""
        };
        NewWeb = Web("" + this.props.siteurl + "")
    }


    public componentDidMount() {

        // Hide SharePoint left navigation, command bar, and SuiteNavWrapper
        // $('#spLeftNav, #spCommandBar').css('display', 'none !important');
        // $('#SuiteNavWrapper').hide();
        // $('.ControlZone--control').attr('style', 'display: none !important');

        document.querySelectorAll('#spLeftNav, #spCommandBar').forEach(function (element: any) {
            element.style.setProperty('display', 'none', 'important');
        });

        const SuiteNavWrapper = document.getElementById('SuiteNavWrapper');
        if (SuiteNavWrapper) {
            SuiteNavWrapper.style.display = 'none';
        }

        // document.querySelectorAll('.ControlZone--control').forEach(function (element: any) {
        //     element.style.setProperty('display', 'none', 'important');
        // });

        // Get the active page URL
        const ActivePageUrl = (window.location.href.split('?')[0]).toLowerCase();
        this.setState({ CurrentPageUrl: ActivePageUrl });

        // Fetch data and perform other initialization tasks
        this.getUnreadmailCount();
        this.GetMainNavItems();
        this.GetQuickLinks();
        this.GetCurrentUserDetails();
        this.EnableContentEditorForSuperAdmins();

        // Add click event listener to left menu items
        // $('.globalleftmenu-fixed-area ul li').on('click', function () {
        //     $('.globalleftmenu-fixed-area ul li').removeClass('active open');
        //     $(this).addClass('active open');
        // });

        document.querySelectorAll('.globalleftmenu-fixed-area ul li').forEach(function (item) {
            item.addEventListener('click', function () {
                // Remove "active" and "open" classes from all list items
                document.querySelectorAll('.globalleftmenu-fixed-area ul li').forEach(function (li) {
                    li.classList.remove('active', 'open');
                });

                // Add "active" and "open" classes to the clicked item
                this.classList.add('active', 'open');
            });
        });

        // Add click event listener to quick link menu items
        // $(".reponsive-quick-wrap .main-menu ul li.submenu a img").on("click", function () {
        //     $(this).parent().toggleClass("active");
        // });

        document.querySelectorAll('.reponsive-quick-wrap .main-menu ul li.submenu a img').forEach(function (img) {
            img.addEventListener('click', function () {
                this.parentElement.classList.toggle('active');
            });
        });

    }

    public async GetCurrentUserDetails() {
        try {
            const profile = await pnp.sp.profiles.myProperties.get();

            const email = profile.Email;
            const Name = profile.DisplayName;
            const Designation = profile.Title;

            this.setState({
                CurrentUserName: Name,
                CurrentUserDesignation: Designation,
                CurrentUserProfilePic: `${this.props.siteurl}/_layouts/15/userphoto.aspx?size=l&username=${email}`
            });
        } catch (error) {
            console.error('Error fetching current user details:', error);
        }
    }

    public async EnableContentEditorForSuperAdmins() {
        try {
            let groups = await sp.web.currentUser.groups();
            const isAdminForContentEditor = groups.some(group => group.Title === "ContentPageEditors");
            this.setState({ IsAdminForContentEditor: isAdminForContentEditor });
        } catch (error) {
            console.error('Error checking user groups:', error);
        }
    }


    public async getUnreadmailCount() {
        try {
            const result = await this.serviceProvider.getMyMailCount();
            this.setState({ myMailDatas: result });

            const mailcount = this.state.myMailDatas.length;
            if (mailcount > 0) {
                this.setState({ EmailCount: mailcount });
                if (mailcount > 999) {
                    // $(".count-email").addClass("more");

                    document.querySelectorAll('.count-email').forEach(function (element) {
                        element.classList.add('more');
                    });

                }
            } else {
                this.setState({ EmailCount: "0" });
                // $("#Emails_count").hide();

                const Emails_count = document.getElementById('Emails_count');
                if (Emails_count) {
                    Emails_count.style.display = 'none';
                }
            }
        } catch (error) {
            console.error("Error fetching unread mail count:", error);
        }
    }



    public async GetMainNavItems() {
        var reactHandler = this;
        try {
            await NewWeb.lists.getByTitle(Navigationslist).items.select("Title", "URL", "OpenInNewTab", "LinkMasterID/Title", "LinkMasterID/Id", "HoverOnIcon", "HoverOffIcon").filter("IsActive eq 1").orderBy("Order0", true).top(10).expand("LinkMasterID").get().then((items) => {
                reactHandler.setState({
                    MainNavItems: items
                });
                // $('#root-nav-links ul li').on('click', function () {
                //     $(this).siblings().removeClass('active');
                //     $(this).addClass('active');
                // });
                // $('.main-menu ul li').on('click', function () {
                //     $(this).siblings().removeClass('active');
                //     $(this).addClass('active');
                // });
                document.querySelectorAll('#root-nav-links ul li').forEach(function (item) {
                    item.addEventListener('click', function () {
                        // Remove the 'active' class from all sibling elements
                        this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
                            sibling.classList.remove('active');
                        });
                        // Add the 'active' class to the clicked element
                        this.classList.add('active');
                    });
                });
                document.querySelectorAll('.main-menu ul li').forEach(function (item) {
                    item.addEventListener('click', function () {
                        // Remove the 'active' class from all sibling elements
                        this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
                            sibling.classList.remove('active');
                        });
                        // Add the 'active' class to the clicked element
                        this.classList.add('active');
                    });
                });
            });
        }
        catch (error) {
            console.error("Error fetching unread mail count:", error);
        }
    }

    public async GetDepartments() {
        //$(".global-qlink-main").hide();
        //$(".global-dept-main").show();
        // $(".dep-res").removeClass("active-submenu");
        // $(".resp-dept-submenu-mob").toggleClass("active");
        // $(".responsi-inner-submenu").toggleClass("open");
        // $(".resp-dept-submenu-mob").toggleClass("active");
        // $(".resp-qlink-submenu").removeClass("active");
        // $(".global-qlink-main").removeClass("open");
        // $(".global-dept-main").toggleClass("open");

        // converted code

        document.querySelectorAll('.dep-res').forEach(function (element) {
            element.classList.remove('active-submenu');
        });

        document.querySelectorAll('.resp-dept-submenu-mob').forEach(function (element) {
            element.classList.toggle('active');
        });
        document.querySelectorAll('.esponsi-inner-submenu').forEach(function (element) {
            element.classList.toggle('open');
        });

        document.querySelectorAll('.resp-dept-submenu-mob').forEach(function (element) {
            element.classList.toggle('active');
        });

        document.querySelectorAll('.resp-qlink-submenu').forEach(function (element) {
            element.classList.remove('active');
        });

        document.querySelectorAll('.global-qlink-main').forEach(function (element) {
            element.classList.remove('open');
        });

        document.querySelectorAll('.global-dept-main').forEach(function (element) {
            element.classList.toggle('open');
        });

        var reactHandler = this;
        reactHandler.displayData = [];
        reactHandler.displayDataResponsive = [];
        NewWeb.lists.getByTitle(DepartmentsMasterlist).items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1'`).orderBy("Order0", true).expand("PlaceDepartmentUnder/Id", "PlaceDepartmentUnder").get().then((items) => {
            reactHandler.setState({
                DeptandQuickLinksItems: items
            });
            for (var i = 0; i < items.length; i++) {
                //  if (items[i].PlaceDepartmentUnder.Title == undefined) {
                let ID = items[i].Id;
                var Title = items[i].Title;
                var Url = items[i].URL.Url;
                let OpenInNewTab = items[i].OpenInNewTab;
                let HasSubDept = items[i].HasSubDepartment;
                reactHandler.appendData(ID, Title, OpenInNewTab, HasSubDept, Url);
            }

            // $(".submenu-clear-wrap").show()

            document.querySelectorAll('.submenu-clear-wrap').forEach(function (element: any) {
                element.style.display = 'block'; // Show the element
            });

            // $(".submenu-wrap-lists ul li").on("click", function () {
            //     $(this).siblings().removeClass('active');
            //     $(this).addClass('active');
            // });
            // $(".dep-res").on("click", function () {
            //     $(this).siblings().removeClass("active-submenu");
            //     $(this).addClass("active-submenu");
            // });

            document.querySelectorAll('.submenu-wrap-lists ul li').forEach(function (item) {
                item.addEventListener('click', function () {
                    // Remove the 'active' class from all sibling elements
                    this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
                        sibling.classList.remove('active');
                    });

                    // Add the 'active' class to the clicked element
                    this.classList.add('active');
                });
            });

            document.querySelectorAll('.dep-res').forEach(function (item) {
                item.addEventListener('click', function () {
                    // Remove the 'active-submenu' class from all sibling elements
                    this.parentElement.querySelectorAll('.dep-res').forEach(function (sibling: any) {
                        if (sibling !== item) {
                            sibling.classList.remove('active-submenu');
                        }
                    });

                    // Add the 'active-submenu' class to the clicked element
                    this.classList.add('active-submenu');
                });
            });


        });
    } catch(err: string) {
        console.log("Navigation Department Link : " + err);
    }

    public async GetQuickLinks() {
        // $(".resp-qlink-submenu").toggleClass("active");
        // $(".resp-dept-submenu-mob").removeClass("active");
        // $(".third-level-submenu").removeClass("open");
        // $(".global-dept-main").removeClass("open");
        // $(".global-qlink-main").toggleClass("open");

        document.querySelectorAll('.resp-qlink-submenu').forEach(function (element) {
            element.classList.toggle('active');
        });

        document.querySelectorAll('.resp-dept-submenu-mob').forEach(function (element) {
            element.classList.remove('active');
        });
        document.querySelectorAll('.third-level-submenu').forEach(function (element) {
            element.classList.remove('open');
        });
        document.querySelectorAll('.global-qlink-main').forEach(function (element) {
            element.classList.toggle('open');
        });
        var reactHandler = this;
        reactHandler.displayDataQlink = [];
        reactHandler.displayDataQlinkResponsive = [];
        try {
            const items = await NewWeb.lists.getByTitle(QuickLinkslist).items
                .select("Title", "URL", "OpenInNewTab", "Image", "ImageHover", "centernavigationicon")
                .filter("IsActive eq 1")
                .orderBy("Order0", true)
                .get();

            reactHandler.setState({
                QuickLinkItems: items
            });

            // $('.quicklink-menu ul li').on('click', function () {
            //     $(this).siblings().removeClass('active');
            //     $(this).addClass('active');
            // });

            document.querySelectorAll('.quicklink-menu ul li').forEach(function (item) {
                item.addEventListener('click', function () {
                    // Remove the 'active' class from all sibling elements
                    this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
                        sibling.classList.remove('active');
                    });

                    // Add the 'active' class to the clicked element
                    this.classList.add('active');
                });
            });

            items.forEach(item => {
                const { Title, URL, OpenInNewTab } = item;
                const Url = URL.Url;
                reactHandler.appendDataQLink(Title, OpenInNewTab, Url);
            });
        } catch (err) {
            console.log("Navigation Quick Link : " + err);
        }
    }


    public async GetSubNodes(ID: string, Title: any, ClickFrom: string, key: string) {
        // $("#" + ID + "-Dept-Child").empty();
        // $("#" + ID + "-Dept-Child-parent").toggleClass("open");
        const deptChild = document.getElementById(ID + "-Dept-Child");
        if (deptChild) {
            deptChild.innerHTML = "";
        }
        const deptChildParent = document.getElementById(ID + "-Dept-Child-parent");
        if (deptChildParent) {
            deptChildParent.classList.toggle("open");
        }
        var reactHandler = this;
        this.displayDataLevel2 = [];
        this.displayDataLevel2Responsive = [];
        try {
            const items = await NewWeb.lists.getByTitle(DepartmentsMasterlist).items
                .select("Title", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id")
                .filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`)
                .orderBy("Order0", true)
                .expand("PlaceDepartmentUnder")
                .get();
            reactHandler.setState({
                DeptandQuickLinksItems: items
            });
            items.forEach(item => {
                const { Id, Title, URL, OpenInNewTab, HasSubDepartment } = item;
                const Url = URL.Url;
                reactHandler.appendDataLevelTwo(Id, Title, OpenInNewTab, HasSubDepartment, Url);
            });
        } catch (error) {
            console.log("Error fetching sub-nodes:", error);
        }
    }


    public async GetSubNodesLevelTwo(ID: any) {
        try {
            const items = await NewWeb.lists.getByTitle(DepartmentsMasterlist).items
                .select("Title", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id")
                .filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`)
                .orderBy("Order0", true)
                .expand("PlaceDepartmentUnder")
                .get();
            this.setState({
                DeptandQuickLinksItems: items
            });
            items.forEach(item => {
                const { Id, Title, URL, OpenInNewTab, HasSubDepartment } = item;
                const Url = URL.Url;
                this.appendDataLevelTwo(Id, Title, OpenInNewTab, HasSubDepartment, Url);
            });
        } catch (error) {
            console.log("Error fetching sub-nodes level two:", error);
        }
    }


    public appendData(ID: any, Title: any, OpenInNewTab: boolean, HasSubDept: boolean, Url: string) {
        try {
            const reactHandler = this;
            const listItem = (
                <li>
                    {OpenInNewTab ? (
                        <a href={Url} target="_blank" data-interception="off" role="button">
                            {HasSubDept && (
                                <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off">
                                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                                </a>
                            )}
                            {Title}
                        </a>
                    ) : (
                        <a href={Url} data-interception="off" role="button">
                            {HasSubDept && (
                                <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off">
                                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                                </a>
                            )}
                            {Title}
                        </a>
                    )}
                    {HasSubDept && (
                        <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                            <ul id={`${ID}-Dept-Child`}>
                                {reactHandler.state.showdataLevelTwo}
                            </ul>
                        </div>
                    )}
                </li>
            );
            reactHandler.displayData.push(listItem);
            // For Responsive
            const responsiveListItem = (
                <li>
                    <a href={Url} target={OpenInNewTab ? "_blank" : undefined} data-interception="off" role="button">
                        <span>{Title}</span>
                    </a>
                    {HasSubDept && (
                        <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                            <ul id={`${ID}-Dept-Child`}>
                                {reactHandler.state.showdataLevelTwoResponsive}
                            </ul>
                        </div>
                    )}
                </li>
            );
            reactHandler.displayDataResponsive.push(responsiveListItem);
            reactHandler.setState({
                showdata: this.displayData,
                showdataResponsive: this.displayDataResponsive
            });
        }
        catch (error) {
            console.log("Error fetching sub-nodes level two:", error);
        }
    }


    public appendDataLevelTwo(ID: string, Title: any, OpenInNewTab: boolean, HasSubDept: boolean, Url: any) {
        const reactHandler = this;
        try {
            const listItem: any = `
        <li class="GetSubNodesLevelTwo">
            <a href="${Url}" ${OpenInNewTab ? 'target="_blank"' : ''} data-interception="off" role="button">${Title}</a>
            ${HasSubDept ? '<i class="fa fa-caret-down" aria-hidden="true"></i>' : ''}
            <div class="third-level-submenu relative">
                <ul class="clearfix" id="${ID}-Dept-Child"></ul>
            </div>
        </li>`;
            // $("#" + ID + "-Dept-Child").append(listItem);
            const deptChild = document.getElementById(ID + "-Dept-Child");
            if (deptChild) {
                deptChild.appendChild(listItem);  // Works if listItem is a Node (DOM element)
            }
            reactHandler.setState({
                showdataLevelTwo: this.displayDataLevel2,
                showdataLevelTwoResponsive: this.displayDataLevel2Responsive
            });
        }
        catch (error) {
            console.log("Error fetching DataLevelTwo:", error);
        }
    }


    public appendDataQLink(Title: string, OpenInNewTab: boolean, Url: string) {
        const reactHandler = this;
        try {
            // Create the JSX elements
            const regularLinkItem = (
                <li>
                    <a href={Url} data-interception="off" role="button">{Title}</a>
                </li>
            );
            const responsiveLinkItem = (
                <li>
                    <a href={Url} data-interception="off" role="button"><span>{Title}</span></a>
                </li>
            );
            // Push the JSX elements into the arrays based on the condition
            if (OpenInNewTab) {
                reactHandler.displayDataQlink.push(
                    <li>
                        <a href={Url} target="_blank" data-interception="off" role="button">{Title}</a>
                    </li>
                );
                reactHandler.displayDataQlinkResponsive.push(responsiveLinkItem);
            } else {
                reactHandler.displayDataQlink.push(regularLinkItem);
                reactHandler.displayDataQlinkResponsive.push(responsiveLinkItem);
            }
            // Update the state
            reactHandler.setState({
                showdataqlink: reactHandler.displayDataQlink,
                showdataqlinkResponsive: reactHandler.displayDataQlinkResponsive
            });
        }
        catch (error) {
            console.log("Error fetching sub-nodes level two:", error);
        }
    }


    public CloseBurggerMenu() {

        // $(".responsive-menu-wrap").removeClass("open");
        // $(".dep-res").removeClass("active-submenu");
        // $(".resp-dept-submenu-mob").removeClass("active");
        // $(".responsi-inner-submenu").removeClass("open");

        document.querySelectorAll('.responsive-menu-wrap').forEach(function (element) {
            element.classList.remove('open');
        });
        document.querySelectorAll('.dep-res').forEach(function (element) {
            element.classList.remove('active-submenu');
        });
        document.querySelectorAll('.resp-dept-submenu-mob').forEach(function (element) {
            element.classList.remove('active');
        });
        document.querySelectorAll('.responsi-inner-submenu').forEach(function (element) {
            element.classList.remove('open');
        });
    }


    public render(): React.ReactElement<IResponsiveProps> {
        // $('.globalleftmenu-fixed-area ul li').on('click', function () {
        //     $(this).siblings().removeClass('active');
        //     $(this).siblings().removeClass('open');
        //     $(this).addClass('active');
        //     $(this).toggleClass('open');
        // });

        document.querySelectorAll('.globalleftmenu-fixed-area ul li').forEach(function (item) {
            item.addEventListener('click', function () {
                // Remove 'active' and 'open' classes from all sibling elements
                this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
                    sibling.classList.remove('active', 'open');
                });

                // Add 'active' class to the clicked element
                this.classList.add('active');

                // Toggle the 'open' class on the clicked element
                this.classList.toggle('open');
            });
        });

        var handler = this;

        const ResponsiveMainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item) {
            let linkItem = null;
            if (item.LinkMasterID != undefined) {
                var LinkMasterIDTitle = item.LinkMasterID.Title;
            }
            const commonItem = (
                <li>
                    <a href={`${item.URL}`} data-interception="off">
                        <span>{item.Title}</span>
                    </a>
                </li>
            );

            if (item.OpenInNewTab == true) {
                if (LinkMasterIDTitle == "DEPT_00001") {
                    linkItem = (
                        <li className="submenu resp-dept-submenu-mob">
                            <a href="#" onClick={() => handler.GetDepartments()} data-interception="off">
                                <span>{item.Title}</span>
                                <img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" />
                            </a>
                            <div className="responsi-inner-submenu">
                                <ul>{handler.state.showdataResponsive}</ul>
                            </div>
                        </li>
                    );
                } else if (LinkMasterIDTitle == "QLINK_00002") {
                    linkItem = (
                        <li className="submenu resp-qlink-submenu">
                            <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off">
                                <span>{item.Title}</span>
                                <img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" />
                            </a>
                            <div className="responsi-inner-submenu">
                                <ul>{handler.state.showdataqlinkResponsive}</ul>
                            </div>
                        </li>
                    );
                } else if (LinkMasterIDTitle == undefined) {
                    if (item.Title == "HomePage" || item.Title == "Content Editor" && handler.state.IsAdminForContentEditor == true) {
                        linkItem = commonItem;
                    }
                }
            } else {
                if (LinkMasterIDTitle == "DEPT_00001") {
                    linkItem = (
                        <li className="submenu resp-dept-submenu-mob">
                            <a href="#" onClick={() => handler.GetDepartments()} data-interception="off">
                                <span>{item.Title}</span>
                                <img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" />
                            </a>
                            <div className="responsi-inner-submenu">
                                <ul>{handler.state.showdataResponsive}</ul>
                            </div>
                        </li>
                    );
                } else if (LinkMasterIDTitle == "QLINK_00002") {
                    linkItem = (
                        <li className="submenu resp-qlink-submenu">
                            <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off">
                                <span>{item.Title}</span>
                                <img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" />
                            </a>
                            <div className="responsi-inner-submenu">
                                <ul>{handler.state.showdataqlinkResponsive}</ul>
                            </div>
                        </li>
                    );
                } else if (LinkMasterIDTitle == undefined) {
                    if (item.Title == "HomePage" || item.Title == "Content Editor" && handler.state.IsAdminForContentEditor == true) {
                        linkItem = commonItem;
                    }
                }
            }
            return linkItem;
        })
            .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


        const ResponsiveQuicklinks: JSX.Element[] = handler.state.QuickLinkItems.map(function (item) {
            return item.OpenInNewTab == true ? (
                <li>
                    <a href={`${item.URL.Url}`} target="_blank" data-interception="off" role="button">{item.Title}</a>
                </li>
            ) : null;
        })
            .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


        return (

            <>
                {/*reponaive contents  menu */}

                <div className="responsive-menu-wrap">
                    <div className="reponsive-quick-wrap">
                        <div className="main-menu">
                            <ul>
                                {ResponsiveMainNavigations}

                            </ul>
                        </div>
                        <div className="quicklink-menu">
                            <ul>
                                {ResponsiveQuicklinks}

                            </ul>
                        </div>
                    </div>
                    <div className="responsive-qiuck-close">
                        <a href="#" onClick={this.CloseBurggerMenu} onTouchStart={this.CloseBurggerMenu} data-interception="off"><i className="fa fa-close"></i></a>
                    </div>
                    <div className="responsive-background">

                    </div>
                </div>

                <div className="responsive-notifications">
                    <ul>
                        <li className="meet-count" data-tip data-for={"React-tooltip-calendar-resp"} data-custom-class="tooltip-custom">
                            <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn4.svg`} alt="images" />
                                <span id="Meetings_count"> {this.state.MeetingsCount} </span>
                            </a>
                            <ReactTooltip id={"React-tooltip-calendar-resp"} place="top" type="dark" effect="solid">
                                <span>Calendar</span>
                            </ReactTooltip>
                        </li>
                        <li data-tip data-for={"React-tooltip-my-team-resp"} data-custom-class="tooltip-custom">
                            <a href={`${this.props.siteurl}/SitePages/My-Team.aspx?env=WebViewList`} data-interception="off" className="notification relative">
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn1.svg`} alt="images" />
                            </a>
                            <ReactTooltip id={"React-tooltip-my-team-resp"} place="top" type="dark" effect="solid">
                                <span>Teams</span>
                            </ReactTooltip>
                        </li>
                        <li className="count-email" data-tip data-for={"React-tooltip-Email-resp"} data-custom-class="tooltip-custom">
                            <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn2.svg`} alt="images" />
                                <span id="Emails_count"> {this.state.EmailCount} </span>
                            </a>
                            <ReactTooltip id={"React-tooltip-Email-resp"} place="top" type="dark" effect="solid">
                                <span>EMail</span>
                            </ReactTooltip>
                        </li>

                    </ul>
                </div>
            </>

        );
    }
}
