import * as React from 'react';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import { ServiceProvider } from '../services/ServiceProvider';
import { IWeb, Web } from "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import ReactTooltip from "react-tooltip";
import pnp from 'sp-pnp-js';
import * as moment from 'moment';
import RemoResponsive from './RemoResponsive';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../Configuration';
var metaTag = document.createElement('meta');
metaTag.name = "viewport"
metaTag.content = "width=device-width, initial-scale=1.0"
document.getElementsByTagName('head')[0].appendChild(metaTag);

let Logolist = listNames.Logo;
let Navigationslist = listNames.Navigations;
let DepartmentsMasterlist = listNames.DepartmentsMaster;
let QuickLinkslist = listNames.QuickLinks;

setTimeout(function () {
  $('html').css("visibility", "visible");
  $('html').addClass('loading-in-progress');
}, 1200);

export interface ISideNavProps {
  siteurl: string;
  context: any;
  currentWebUrl: string;
  CurrentPageserverRequestPath: string;
}
export interface ISideNavState {
  myMailDatas: any[];
  myMeetingsDatas: any[];
  EmailCount: any;
  MeetingsCount: any;
  CurrentPageUrl: any;
  IsAdminForContentEditor: boolean;

  MainNavItems: any[];
  DeptandQuickLinksItems: string | any[];
  QuickLinkItems: string | any[];
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
  VersionData: string;
  Userid: String;
}

var NewWeb: IWeb & IInvokable<any>;


export default class GlobalSideNav extends React.Component<ISideNavProps, ISideNavState, {}> {
  private serviceProvider;
  private displayData: JSX.Element[];
  private displayDataLevel2: any[];
  private displayDataQlink: JSX.Element[];


  private displayDataResponsive: JSX.Element[];
  private displayDataLevel2Responsive: any[];
  private displayDataQlinkResponsive: JSX.Element[];
  public constructor(props: ISideNavProps) {
    super(props);
    pnp.setup({
      spfxContext: this.props.context,
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


    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/AutoListCreation/SP-NativeStyle-Overriding.css?v=3.3`);
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/AutoListCreation/style.css?v=1.8`);
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/AutoListCreation/Responsive.css?v=4.18`);

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
      SiteLogo: "",
      VersionData: "",
      Userid: "",
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }


  public componentDidMount() {

    const { siteurl } = this.props;
    const ActivePageUrl = (window.location.href.split('?')[0]).toLowerCase();

    // Hide elements based on page URL
    if (
      ActivePageUrl === `${siteurl}/sitepages/HomePage.aspx` ||
      ActivePageUrl === `${siteurl}/sitepages/HomePage.aspx#` ||
      ActivePageUrl === `${siteurl}/` ||
      ActivePageUrl === `${siteurl}#` ||
      ActivePageUrl === `${siteurl}/`
    ) {
      setTimeout(() => {
        $('div[data-automation-id="CanvasControl"]').css('padding', '0px').css('margin', '0px');
        $(".inner-pages-nav").hide();
        $('#master_footer_parent').hide();
        $('.ControlZone--control').attr('style', 'display: none !important');


        document.querySelectorAll('div[data-automation-id="CanvasControl"]').forEach(function (element: any) {
          element.style.padding = '0px';
          element.style.margin = '0px';
        });

        const innerPagesNav: any = document.getElementsByClassName('innerpages-nav');
        if (innerPagesNav) {
          innerPagesNav.style.display = 'none';
        }

        const masterFooter = document.getElementById('master_footer_parent');
        if (masterFooter) {
          masterFooter.style.display = 'none';
        }

        const ControlZone: any = document.getElementsByClassName('ControlZone--control');
        if (ControlZone) {
          ControlZone.style.setProperty('display', 'none', 'important');
        }
      }, 500);
    } else if (
      ActivePageUrl === `${siteurl}/eventsactivities/sitepages/HomePage.aspx` ||
      ActivePageUrl === `${siteurl}/eventsactivities/sitepages/HomePage.aspx#` ||
      ActivePageUrl === `${siteurl}/eventsactivities` ||
      ActivePageUrl === `${siteurl}/eventsactivities#` ||
      ActivePageUrl === `${siteurl}/eventsactivities/` ||
      ActivePageUrl === `${siteurl}/eventsactivities/#`
    ) {
      // $('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper').hide();
      document.querySelectorAll('#spLeftNav, #sp-appBar, #spSiteHeader, #SuiteNavWrapper').forEach(function (element: any) {
        element.style.display = 'none';
      });

    } else if (
      ActivePageUrl === `${siteurl}/learningportal/sitepages/HomePage.aspx` ||
      ActivePageUrl === `${siteurl}/learningportal/sitepages/HomePage.aspx#` ||
      ActivePageUrl === `${siteurl}/learningportal` ||
      ActivePageUrl === `${siteurl}/learningportal#` ||
      ActivePageUrl === `${siteurl}/learningportal/` ||
      ActivePageUrl === `${siteurl}/learningportal/#`
    ) {
      // $('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper').hide();
      document.querySelectorAll('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper').forEach(function (element: any) {
        element.style.display = 'none';
      });
    } else if (
      ActivePageUrl === `${siteurl}/offerspromotions/sitepages/HomePage.aspx` ||
      ActivePageUrl === `${siteurl}/offerspromotions/sitepages/HomePage.aspx#` ||
      ActivePageUrl === `${siteurl}/offerspromotions` ||
      ActivePageUrl === `${siteurl}/offerspromotions#` ||
      ActivePageUrl === `${siteurl}/offerspromotions/` ||
      ActivePageUrl === `${siteurl}/offerspromotions/#`
    ) {
      // $('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper').hide();
      document.querySelectorAll('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper').forEach(function (element: any) {
        element.style.display = 'none';
      });

    }

    // Hide elements initially
    // $('#spLeftNav').hide();
    // $('#spCommandBar').hide();
    // $('#SuiteNavWrapper').hide();

    const spLeftNav = document.getElementById('spLeftNav');
    if (spLeftNav) {
      spLeftNav.style.display = 'none';
    }

    const spCommandBar = document.getElementById('spCommandBar');
    if (spCommandBar) {
      spCommandBar.style.display = 'none';
    }

    const SuiteNavWrapper = document.getElementById('SuiteNavWrapper');
    if (SuiteNavWrapper) {
      SuiteNavWrapper.style.display = 'none';
    }

    // Other operations
    // this.GetVersionData();
    this.getUnreadmailCount();
    this.getmymeetings();
    this.GetMainNavItems();
    this.BindPlaceholderLogo();
    this.GetCurrentUserDetails();
    this.EnableContentEditorForSuperAdmins();
    this.setState({ CurrentPageUrl: ActivePageUrl });

    // Event listeners
    $('.globalleftmenu-fixed-area ul li').on('click', function () {
      $(this).siblings().removeClass('active').removeClass('open');
      $(this).addClass('active').toggleClass('open');
    });

    $(".reponsive-quick-wrap .main-menu ul li.submenu a img").on("click", function () {
      $(this).parent().toggleClass("active");
    });

    // Timeout to remove loading class
    setTimeout(() => {
      $('html').css("visibility", "visible").removeClass('loading-in-progress');
    }, 5000);

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = '#sp-appBar { display: none !important; }';
    const ref = document.querySelector('script');
    if (ref && ref.parentNode) {
      ref.parentNode.insertBefore(style, ref);
    }

    // Click outside event listeners
    document.addEventListener("mousedown", (event) => {
      const target = event.target as Element;
      const container1 = $(".reponsive-quick-wrap");
      if (!container1.is(target) && container1.has(target).length === 0) {
        $(".responsive-menu-wrap ").removeClass("open");
      }
      const container2 = $(".search");
      if (!container2.is(target) && container2.has(target).length === 0) {
        $(".responsive-background").removeClass("open");
        $(".search").removeClass("open");
      }
      const user = $(".user-images");
      if (!$(target).closest(user).length) {
        $(".user-profile-details").removeClass("open");
      }
      const submenuContainer = $(".submenu");
      if (!$(target).closest(submenuContainer).length) {
        $(".main-submenu").removeClass("open");
      }
    });
  }



  //   public async GetVersionData() {
  //     try {
  //       await NewWeb.lists.getByTitle(VersionMasterlist).items.select("Title").orderBy("Created", false).top(1).get().then((items: string | any[]) => {

  //         if (items.length != 0) {
  //           this.setState({
  //             VersionData: items[0].Title
  //           });
  //         }
  //       });
  //     }
  //     catch (error) {
  //       console.log("Unable to get VersionData due to : " + error);
  //     }
  //   }

  public async GetCurrentUserDetails() {
    try {
      const { siteurl } = this.props;
      const profile = await pnp.sp.profiles.myProperties.get();

      const { Email, DisplayName, Title } = profile;

      this.setState({
        CurrentUserName: DisplayName,
        CurrentUserDesignation: Title,
        CurrentUserProfilePic: `${siteurl}/_layouts/15/userphoto.aspx?size=l&username=${Email}`
      });
    } catch (error) {
      console.error('Error fetching current user details:', error);
    }
  }



  public BindPlaceholderLogo() {
    const { siteurl } = this.props;
    const reacthandler = this;

    NewWeb.lists.getByTitle(Logolist)
      .items.select("Logo", "*")
      .filter("IsActive eq 1")
      .orderBy("Created", false)
      .top(1)
      .get()
      .then((items) => {
        if (items.length > 0) {
          const { Logo } = items[0];
          if (Logo) {
            const ImgObj = JSON.parse(Logo);
            const serverRelativeUrl = ImgObj.serverRelativeUrl || `${siteurl}/Lists/${Logolist}/Attachments/${items[0].ID}/${ImgObj.fileName}`;
            reacthandler.setState({ SiteLogo: serverRelativeUrl });
          }
        }
      });
  }


  public async getUnreadmailCount() {
    try {
      const result = await this.serviceProvider.getMyMailCount();
      this.setState({ myMailDatas: result });

      const mailcount = this.state.myMailDatas.length;
      if (mailcount > 0) {
        this.setState({ EmailCount: mailcount });
        if (mailcount > 999) {
          $(".count-email").addClass("more");
        }
      } else {
        this.setState({ EmailCount: "0" });
        $("#Emails_count").hide();
      }
    } catch (error) {
      console.error("Error fetching unread mail count:", error);
    }
  }


  public getmymeetings() {
    this.serviceProvider.
      getMyMeetingsCount()
      .then(
        (result: any[]): void => {
          this.setState({ myMeetingsDatas: result });
          var myMeetingscount = this.state.myMeetingsDatas.length;
          if (this.state.myMeetingsDatas.length > 0) {
            this.setState({ MeetingsCount: myMeetingscount });
            if (this.state.myMeetingsDatas.length > 999) {
              $(".meet-count").addClass("more");
            }
          } else {
            this.setState({ MeetingsCount: "0" });
            $("#Meetings_count").hide();
          }
        }
      )
  }

  public async EnableContentEditorForSuperAdmins() {
    let groups = await NewWeb.currentUser.groups();
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ IsAdminForContentEditor: true }); //To Show Content Editor on Center Nav to Specific Group Users alone

      } else {
        // this.setState({IsAdminForContentEditor:true});
      }
    }
  }

  public async GetMainNavItems() {
    var reactHandler = this;

    await NewWeb.lists.getByTitle(Navigationslist).items.select("Title", "URL", "OpenInNewTab", "LinkMasterID/Title", "LinkMasterID/Id", "HoverOnIcon", "HoverOffIcon").filter("IsActive eq 1").orderBy("Order0", true).top(10).expand("LinkMasterID").get().then((items: any) => {

      reactHandler.setState({
        MainNavItems: items
      });
      $('#root-nav-links ul li').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
      });
    });
  }

  public async GetDepartments() {
    //$(".global-qlink-main").hide();
    //$(".global-dept-main").show();
    $(".responsi-inner-submenu").toggleClass("open");
    $(".resp-dept-submenu-mob").toggleClass("active");
    $(".resp-qlink-submenu").removeClass("active");
    $(".global-qlink-main").removeClass("open");
    $(".global-dept-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayData = [];
    reactHandler.displayDataResponsive = [];
    NewWeb.lists.getByTitle(DepartmentsMasterlist).items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1'`).orderBy("Order0", true).expand("PlaceDepartmentUnder/Id", "PlaceDepartmentUnder").get().then((items: string | any[]) => {
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

      $(".submenu-clear-wrap").show()
      $(".submenu-wrap-lists ul li").on("click", function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
      });
    });
  } catch(err: string) {
    console.log("Navigation Department Link : " + err);
  }

  public async GetQuickLinks() {
    //$(".global-dept-main").hide();
    //$(".global-qlink-main").show();
    $(".resp-qlink-submenu").toggleClass("active");
    $(".resp-dept-submenu-mob").removeClass("active");
    $(".third-level-submenu").removeClass("open");
    $(".global-dept-main").removeClass("open");
    $(".global-qlink-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayDataQlink = [];
    reactHandler.displayDataQlinkResponsive = [];
    try {
      NewWeb.lists.getByTitle(QuickLinkslist).items.select("Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL").filter(`IsActive eq 1`).orderBy("Order0", true).get().then((items: string | any[]) => {
        //url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL,Image,ImageHover,centernavigationicon&$filter=IsActive eq 1&$orderby=Order0 asc`,
        reactHandler.setState({
          QuickLinkItems: items
        });
        for (var i = 0; i < items.length; i++) {
          var Title = items[i].Title;
          var Url = items[i].URL.Url;
          let OpenInNewTab = items[i].OpenInNewTab;
          reactHandler.appendDataQLink(Title, OpenInNewTab, Url);
        }
      });
    } catch (err) {
      console.log("Navigation Quick Link : " + err);
    }
  }

  public async GetSubNodes(ID: string, Title: any, ClickFrom: string, key: string) {
    try {

      $("#" + ID + "-Dept-Child").empty();
      $("#" + ID + "-Dept-Child-parent").toggleClass("open");

      this.displayDataLevel2 = [];
      this.displayDataLevel2Responsive = [];

      const items = await NewWeb.lists.getByTitle(DepartmentsMasterlist).items
        .select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id")
        .filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`)
        .orderBy("Order0", true)
        .expand("PlaceDepartmentUnder")
        .get();

      this.setState({
        DeptandQuickLinksItems: items
      });

      for (let i = 0; i < items.length; i++) {
        const { Id, Title, URL, HasSubDepartment, OpenInNewTab } = items[i];
        const Url = URL ? URL.Url : '';
        this.appendDataLevelTwo(Id, Title, OpenInNewTab, HasSubDepartment, Url);
      }
    } catch (error) {
      console.error('Error fetching subnodes:', error);
    }
  }


  public async GetSubNodesLevelTwo(ID: any) {
    try {
      const reactHandler = this;

      const items = await NewWeb.lists.getByTitle(DepartmentsMasterlist).items
        .select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id")
        .filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`)
        .orderBy("Order0", true)
        .expand("PlaceDepartmentUnder")
        .get();

      for (let i = 0; i < items.length; i++) {
        const { Id, Title, URL, HasSubDept, OpenInNewTab } = items[i];
        const Url = URL ? URL.Url : '';
        reactHandler.appendDataLevelTwo(Id, Title, OpenInNewTab, HasSubDept, Url);
      }
    } catch (error) {
      console.error('Error fetching subnodes level two:', error);
    }
  }


  public appendData(ID: any, Title: any, OpenInNewTab: boolean, HasSubDept: boolean, Url: string) {
    const { displayData, displayDataResponsive } = this;
    const reactHandler = this;

    if (displayData.length < Title.length && displayDataResponsive.length < Title.length) {
      if (OpenInNewTab) {
        if (HasSubDept) {
          const item = (
            <li className="GetSubNodes">
              <a href={Url} target="_blank" data-interception="off" role="button">{Title}</a>
              <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off">
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </a>
              <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                <ul id={`${ID}-Dept-Child`}>
                  {reactHandler.state.showdataLevelTwo}
                </ul>
              </div>
            </li>
          );

          displayData.push(item);
          displayDataResponsive.push(item);
        } else {
          const item = (
            <li>
              <a href={Url} target="_blank" data-interception="off" role="button">{Title}</a>
            </li>
          );

          displayData.push(item);
          displayDataResponsive.push(item);
        }
      } else {
        if (HasSubDept) {
          const item = (
            <li className="GetSubNodes">
              <a href={Url} data-interception="off" role="button">{Title}</a>
              <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off">
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </a>
              <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                <ul id={`${ID}-Dept-Child`}>
                  {reactHandler.state.showdataLevelTwo}
                </ul>
              </div>
            </li>
          );

          displayData.push(item);
          displayDataResponsive.push(item);
        } else {
          const item = (
            <li>
              <a href={Url} data-interception="off" role="button">{Title}</a>
            </li>
          );

          displayData.push(item);
          displayDataResponsive.push(item);
        }
      }

      reactHandler.setState({
        showdata: displayData,
        showdataResponsive: displayDataResponsive
      });
    }
  }

  public appendDataLevelTwo(ID: string, Title: any, OpenInNewTab: boolean, HasSubDept: boolean, Url: any) {
    const { displayDataLevel2, displayDataLevel2Responsive } = this;
    const reactHandler = this;

    if (OpenInNewTab) {
      if (HasSubDept) {
        const item = `
              <li class="GetSubNodesLevelTwo">
                  <a href="${Url}" target="_blank" data-interception="off" role="button">${Title}</a>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                  <div class="third-level-submenu relative">
                      <ul class="clearfix" id="${ID}-Dept-Child"></ul>
                  </div>
              </li>
          `;

        $("#" + ID + "-Dept-Child").append(item);
      } else {
        const item = `
              <li>
                  <a href="${Url}" target="_blank" data-interception="off" role="button">${Title}</a>
              </li>
          `;

        $("#" + ID + "-Dept-Child").append(item);
      }
    } else {
      if (HasSubDept) {
        const item = `
              <li class="GetSubNodesLevelTwo">
                  <a href="${Url}" data-interception="off" role="button">${Title}</a>
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                  <div class="third-level-submenu relative">
                      <ul class="clearfix" id="${ID}-Dept-Child"></ul>
                  </div>
              </li>
          `;

        $("#" + ID + "-Dept-Child").append(item);
      } else {
        const item = `
              <li>
                  <a href="${Url}" data-interception="off" role="button">${Title}</a>
              </li>
          `;

        $("#" + ID + "-Dept-Child").append(item);
      }
    }

    reactHandler.setState({
      showdataLevelTwo: displayDataLevel2,
      showdataLevelTwoResponsive: displayDataLevel2Responsive
    });
  }


  public appendDataQLink(Title: any, OpenInNewTab: boolean, Url: any) {
    const { displayDataQlink, displayDataQlinkResponsive } = this;
    const reactHandler = this;

    const linkItem = (
      <li>
        <a href={Url} target={OpenInNewTab ? "_blank" : undefined} data-interception="off" role="button">
          <span>{Title}</span>
        </a>
      </li>
    );

    displayDataQlink.push(linkItem);
    displayDataQlinkResponsive.push(linkItem);

    reactHandler.setState({
      showdataqlink: displayDataQlink,
      showdataqlinkResponsive: displayDataQlinkResponsive
    });
  }



  public OpenSearchPage(e: any, url: string) {
    const pathname = window.location.pathname.indexOf("UnifiedSearch") !== -1;

    if (e.keyCode === 13) {
      const searchUrl = `${url}/SitePages/UnifiedSearch.aspx?q=${e.target.value}`;

      if (!pathname) {
        window.open(searchUrl, "_blank");
      } else {
        window.location.href = searchUrl;
      }

      e.preventDefault();
    }
  }



  public OpenBurggerMainMenu() {
    $(".responsive-menu-wrap").addClass("open");
    $(".main-menu").show();
    $(".quicklink-menu").hide();
  }

  public OpenBurggerQuickLinkMenu() {
    $(".responsive-menu-wrap").addClass("open");
    $(".quicklink-menu").show();
    $(".main-menu").hide();
  }

  public OpenSearch() {
    $(".responsive-background, .search").addClass("open");
  }

  public CloseSearch() {
    $(".search").removeClass("open");
  }

  public ShowUserDetailBlock() {
    $(".user-profile-details").toggleClass("open");
  }




  public render(): React.ReactElement<ISideNavProps> {
    $('.globalleftmenu-fixed-area ul li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).siblings().removeClass('open');
      $(this).addClass('active');
      $(this).toggleClass('open');
    });

    var handler = this;


    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map((item) => {
      const { OpenInNewTab, LinkMasterID, Title, URL } = item;
      let LinkMasterIDTitle;

      if (LinkMasterID !== undefined) {
        LinkMasterIDTitle = LinkMasterID.Title;
      }

      if (OpenInNewTab) {
        if (LinkMasterIDTitle === "DEPT_00001" || LinkMasterIDTitle === "QLINK_00002") {
          return (
            <li className="submenu relative">
              <a href="#" onClick={LinkMasterIDTitle === "DEPT_00001" ? () => handler.GetDepartments() : () => handler.GetQuickLinks()} data-interception="off">{Title}<i className="fa fa-caret-down" aria-hidden="true"></i></a>
              <ul className={`main-submenu global-${LinkMasterIDTitle === "DEPT_00001" ? "dept" : "qlink"}-main`}>
                {handler.state.showdata}
              </ul>
            </li>
          );
        } else {
          const conturl = URL.toLowerCase().split("?");
          const DomID = Title.replace(/[_\W]+/g, "_");

          if (Title === "Home" || (conturl[0] === `${handler.props.siteurl}/sitepages/content-editor.aspx` && handler.state.IsAdminForContentEditor)) {
            return <li id={DomID}><a href={URL} target="_blank" data-interception="off">{Title}</a></li>;
          } else {
            return <li id={DomID}><a href={URL} target="_blank" data-interception="off">{Title}</a></li>;
          }
        }
      } else {
        if (LinkMasterIDTitle === "DEPT_00001" || LinkMasterIDTitle === "QLINK_00002") {
          return (
            <li className="submenu relative">
              <a href="#" onClick={LinkMasterIDTitle === "DEPT_00001" ? () => handler.GetDepartments() : () => handler.GetQuickLinks()} data-interception="off">{Title}<i className="fa fa-caret-down" aria-hidden="true"></i></a>
              <ul className={`main-submenu global-${LinkMasterIDTitle === "DEPT_00001" ? "dept" : "qlink"}-main`}>
                {handler.state.showdata}
              </ul>
            </li>
          );
        } else {
          const DomID = Title.replace(/[_\W]+/g, "_");
          if (Title === "HomePage" || (Title === "Content Editor" && handler.state.IsAdminForContentEditor)) {
            return <li id={DomID}><a href={URL} data-interception="off">{Title}</a></li>;
          } else {
            return <li id={DomID}><a href={URL} data-interception="off">{Title}</a></li>;
          }
        }
      }
    });




    return (
      <div className="visiblei ms-slideRightIn40 GlobalLeftNavigation">
        <header>
          <div className="container">
            <div className="header-left">
              <div className="logo">

                <a className="logo-anchor" href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off">  <img src={this.state.SiteLogo} alt="image" /> </a>
              </div>
              <div className="search relative">
                <img src={`${this.props.siteurl}/SiteAssets/img/search.png`} alt="image" />
                <input type="search" id="txt-search" className="form-control insearch" placeholder="Search Here" autoComplete='off' onKeyDown={(e) => this.OpenSearchPage(e, this.props.siteurl)} />
                <img className="res-ser-close" src={`${this.props.siteurl}/SiteAssets/img/close_resposnive.svg`} onClick={() => this.CloseSearch()} />

              </div>
            </div>
            <div className="header-right">
              <div className="header-right-lists">
                <ul>
                  {/* <li>
                    
                    <Notification siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.state.Userid} />

                  </li> */}
                  <li className="meet-count" data-tip data-for={"React-tooltip-calendar"} data-custom-class="tooltip-custom">
                    <a href="https://outlook.office.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                      <img src={`${this.props.siteurl}/SiteAssets/img/calender.svg`} alt="images" />
                      <span id="today-date"> {moment().format("D")} </span>
                      <span id="Meetings_count"> {this.state.MeetingsCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-calendar"} place="bottom" type="dark" effect="solid">
                      <span>Calendar</span>
                    </ReactTooltip>
                  </li>
                  <li data-tip data-for={"React-tooltip-my-team"} data-custom-class="tooltip-custom">
                    <a href={`https://teams.microsoft.com`} data-interception="off" target="_blank" className="notification relative">
                      <img src={`${this.props.siteurl}/SiteAssets/img/teams.svg`} alt="images" />
                    </a>
                    <ReactTooltip id={"React-tooltip-my-team"} place="bottom" type="dark" effect="solid">
                      <span>Teams</span>
                    </ReactTooltip>
                  </li>
                  <li className="count-email" data-tip data-for={"React-tooltip-Email"} data-custom-class="tooltip-custom">
                    <a href="https://outlook.office.com/mail/" target="_blank" data-interception="off" className="notification relative">
                      <img src={`${this.props.siteurl}/SiteAssets/img/tq3.svg`} alt="images" />
                      <span id="Emails_count"> {this.state.EmailCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-Email"} place="bottom" type="dark" effect="solid">
                      <span>E-mail</span>
                    </ReactTooltip>
                  </li>


                  <li className="user-images"> <a href="#" className="notification relative" onClick={() => this.ShowUserDetailBlock()} data-interception="off" >
                    <img src={`${this.state.CurrentUserProfilePic}`} alt="images" />
                    <div className="user-profile-details" id="user-profile-details">
                      <h3>  {this.state.CurrentUserName} </h3>
                      <p> {this.state.CurrentUserDesignation} </p>
                      <div className="logou-bck">
                        <a href="https://login.windows.net/common/oauth2/logout" data-interception="off" ><i className="fa fa-sign-out" aria-hidden="true" ></i> Logout</a>

                      </div>
                    </div>
                  </a>
                  </li>
                  {/* <li className="versn-data">
                    {this.state.VersionData}
                  </li> */}
                </ul>
              </div>

              <div className="responsive-inner-classes">
                <ul>
                  <li> <a href="#" onClick={() => this.OpenSearch()} data-interception="off"><img src={`${this.props.siteurl}/SiteAssets/img/res_searc.svg`} alt="image" /> </a></li>
                  <li> <a href="#" onClick={() => this.OpenBurggerQuickLinkMenu()} data-interception="off"><img src={`${this.props.siteurl}/SiteAssets/img/quick_link_mob.svg`} alt="image" /> </a></li>
                  <li> <a href="#" onClick={() => this.OpenBurggerMainMenu()} data-interception="off"><img src={`${this.props.siteurl}/SiteAssets/img/burger_menu.svg`} alt="image" /> </a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <div className="inner-pages-nav">
          <div className="container">
            <nav>
              <ul>
                {MainNavigations}
              </ul>
            </nav>
          </div>
        </div>
        {

          this.state.CurrentPageUrl.indexOf("allitems") != -1 ?
            <>
              <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
            </>
            :

            <></>}
      </div>
    );
  }
}
