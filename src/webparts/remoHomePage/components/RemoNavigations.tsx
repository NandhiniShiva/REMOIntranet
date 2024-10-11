import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { IWeb, Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp/presets/all";
import ReactTooltip from "react-tooltip";
import * as moment from 'moment';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../Configuration';


export interface INavigationsState {
  MainNavItems: any[];
  DeptandQuickLinksItems: any[];
  QuickLinkItems: any[];
  SelectedNav: any[];
  showdata: any[];
  showdataqlink: any[];
  IsAdminForContentEditor: boolean;
  MyLinks: any[];
}

let BreadCrumb: { Title: any; ID: any; }[] = [];

let JobsMasterlist = listNames.JobsMaster;
let Navigationslist = listNames.Navigations;
let QuickLinkslist = listNames.QuickLinks;
let DepartmentsMasterlist = listNames.DepartmentsMaster;

var NewWeb: IWeb & IInvokable<any>;

export default class RemoNavigations extends React.Component<IRemoHomePageProps, INavigationsState> {
  displayData: any[];
  displayDataQlink: any[];
  constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      MainNavItems: [],
      DeptandQuickLinksItems: [],
      QuickLinkItems: [],
      SelectedNav: [],
      showdata: [],
      showdataqlink: [],
      IsAdminForContentEditor: false,
      MyLinks: [],
    };
    NewWeb = Web("" + this.props.siteurl + "");
  }

  async componentDidMount() {
    BreadCrumb = [];
    await this.JobsMasterCheck();
    await this.GetMainNavItems();
    await this.EnableContentEditorForSuperAdmins();
    await this.GetMyLinks();
    // $("#meetingroom").hide();
    // $("#clearbutton").hide();
    // $('.clears-subnav').hide();

    document.querySelectorAll('#meetingroom').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    }); document.querySelectorAll('#clearbutton').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    }); document.querySelectorAll('.clears-subnav').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  async EnableContentEditorForSuperAdmins() {
    const groups = await sp.web.currentUser.groups();
    const isAdminForContentEditor = groups.some(group => group.Title === "ContentPageEditors");
    this.setState({ IsAdminForContentEditor: isAdminForContentEditor });
  }

  async JobsMasterCheck() {
    const tdaydate = moment().format('YYYY-MM-DD');
    const results = await sp.web.lists.getByTitle(JobsMasterlist).items.select("DateOfSubmission", "ID").filter(`DateOfSubmission lt '${tdaydate}'`).getAll();
    for (const result of results) {
      await sp.web.lists.getByTitle(JobsMasterlist).items.getById(result.ID).update({ 'Status': 'Expired' });
    }
  }

  async GetMainNavItems() {
    const items = await sp.web.lists.getByTitle(Navigationslist).items
      .select("*", "Title", "URL", "OpenInNewTab", "LinkMasterID/Title", "LinkMasterID/Id", "HoverOnIcon", "HoverOffIcon")
      .filter("IsActive eq 1")
      .orderBy("Order0", true)
      .top(7)
      .expand("LinkMasterID")
      .get();

    this.setState({ MainNavItems: items });
    // $('#root-nav-links ul li').on('click', function () {
    //   $(this).siblings().removeClass('active');
    //   $(this).addClass('active');
    // });

    const navLinks = document.querySelectorAll('#root-nav-links ul li');

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Remove "active" class from all siblings
        navLinks.forEach(function (sibling) {
          sibling.classList.remove('active');
        });

        // Add "active" class to the clicked item
        link.classList.add('active');
      });
    });

  }

  async GetMyLinks() {
    try {
      const items = await sp.web.lists.getByTitle(QuickLinkslist).items
        .select("*", "Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL")
        .filter(`IsActive eq 1`)
        .orderBy("Order0", true)
        .top(5)
        .get();

      this.setState({ MyLinks: items });
      // $('#root-nav-links ul li').on('click', function () {
      //   $(this).siblings().removeClass('active');
      //   $(this).addClass('active');
      // });

      const navLinks = document.querySelectorAll('#root-nav-links ul li');

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          // Remove "active" class from all siblings
          navLinks.forEach(function (sibling) {
            sibling.classList.remove('active');
          });

          // Add "active" class to the clicked item
          link.classList.add('active');
        });
      });

    } catch (err) {
      console.log("Navigation Main Nav : " + err);
    }
  }
  public GetDepartments() {
    // $('.clears-subnav').show();
    // $('.floating-content-editor-home').addClass('active')
    // $('.breadcrum-block').addClass('open');
    // $(".breadcrum-block").show();

    document.querySelectorAll('.floating-content-editor-home').forEach(function (element) {
      element.classList.add('active');
    });

    document.querySelectorAll('.clears-subnav').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });

    document.querySelectorAll('.breadcrum-block').forEach(function (element) {
      element.classList.add('open');
    });

    document.querySelectorAll('.breadcrum-block').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });
    var reactHandler = this;
    reactHandler.displayData = [];
    BreadCrumb = [];
    // $(".main-mavigation").siblings().removeClass("submenu");
    // $(".main-mavigation").addClass("submenu");
    // $('#meetingroom').off('click');

    const mainNavigationElements: any = document.querySelectorAll('.main-mavigation');
    mainNavigationElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('submenu');
      });
    });
    document.querySelectorAll('.main-mavigation').forEach(function (element) {
      element.classList.add('submenu');
    });
    const meetingRoom = document.querySelector('#meetingroom');

    if (meetingRoom) {
      meetingRoom.replaceWith(meetingRoom.cloneNode(true));
    }

    try {
      sp.web.lists.getByTitle(DepartmentsMasterlist).items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1'`).orderBy("Order0", true).expand("PlaceDepartmentUnder/Id", "PlaceDepartmentUnder").get().then((items) => {
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
          //   }
        }
        // $(".submenu-clear-wrap").show()
        // $(".submenu-wrap-lists ul li").on("click", function () {
        //   $(this).siblings().removeClass('active');
        //   $(this).addClass('active');
        // });

        document.querySelectorAll('.submenu-clear-wrap').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });

        document.querySelectorAll('.submenu-wrap-lists ul li').forEach(function (item) {
          item.addEventListener('click', function () {
            // Remove "active" class from all siblings
            this.parentElement.querySelectorAll('li').forEach(function (sibling: any) {
              sibling.classList.remove('active');
            });

            // Add "active" class to the clicked item
            this.classList.add('active');
          });
        });

      });
    } catch (err) {
      console.log("Navigation Department Link : " + err);
    }
  }

  public async GetQuickLinks() {
    const { siteurl } = this.props;
    try {
      const items = await sp.web.lists.getByTitle(QuickLinkslist)
        .items.select("*", "Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL")
        .filter(`IsActive eq 1`)
        .orderBy("Order0", true)
        .get();

      const quickLinks = items.map(item => {
        const { Title, OpenInNewPage, Image, ImageHover, centernavigationicon, URL, ID } = item;
        const HoverOffImage = JSON.parse(Image);
        const HoverOnImage = JSON.parse(ImageHover);

        const serverRelativeUrlHoverOffImage = HoverOffImage.serverRelativeUrl ? HoverOffImage.serverRelativeUrl :
          `${siteurl}/Lists/${QuickLinkslist}/Attachments/${ID}/${HoverOffImage.fileName}`;

        const serverRelativeUrlHoverOnImage = HoverOnImage.serverRelativeUrl ? HoverOnImage.serverRelativeUrl :
          `${siteurl}/Lists/${QuickLinkslist}/Attachments/${ID}/${HoverOnImage.fileName}`;

        return {
          Title,
          OpenInNewTab: OpenInNewPage,
          Url: URL.Url,
          HoverOffImage,
          HoverOnImage,
          Centernav: centernavigationicon,
          serverRelativeUrlHoverOffImage,
          serverRelativeUrlHoverOnImage
        };
      });

      this.setState({
        QuickLinkItems: quickLinks
      });

    } catch (err) {
      console.log("Navigation Quick Link Error:", err);
    }
  }



  public async GetSubNodes(ID: any, Title: any, ClickFrom: string, key: any) {
    // $(".breadcrum-block").show();

    document.querySelectorAll('.breadcrum-block').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });
    if (ClickFrom === "Breadcrumb") {
      const indexValue = key;
      BreadCrumb = BreadCrumb.slice(0, indexValue + 1);
    } else {
      BreadCrumb.push({ Title, ID });
    }

    try {
      const items = await NewWeb.lists.getByTitle(DepartmentsMasterlist)
        .items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id")
        .filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`)
        .orderBy("Order0", true)
        .expand("PlaceDepartmentUnder")
        .get();

      this.setState({
        DeptandQuickLinksItems: items
      });

      items.forEach(item => {
        const { Id: ItemID, Title, URL, OpenInNewTab, HasSubDepartment } = item;
        this.appendData(ItemID, Title, OpenInNewTab, HasSubDepartment, URL.Url);
      });

    } catch (error) {
      console.error("Error fetching sub-nodes:", error);
    }
  }


  public appendData(ID: string, Title: {}, OpenInNewTab: boolean, HasSubDept: boolean, Url: string) {
    var reactHandler = this;

    if (OpenInNewTab == true) {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button"> <span>{Title}</span></a>
          <a className={"deptdropdown-" + ID + ""} href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><img src={`${reactHandler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav"></img></a>
        </li>);
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    } else {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a>
          <a className={"deptdropdown-" + ID + ""} href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><img src={`${reactHandler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav"></img></a>
        </li>);
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    }

    reactHandler.setState({
      showdata: reactHandler.displayData
    });
  }


  public appendDataQLink(Title: string, OpenInNewTab: boolean, Url: string, Centernav: string, serverRelativeUrlHoverOffImage: string, serverRelativeUrlHoverOnImage: string, items: any) {
    const { props, displayDataQlink } = this;

    let navIconUrl = "";
    if (Centernav && Centernav !== null) {
      console.log("Center nav image present");
      const centernavigationicon = JSON.parse(Centernav);
      navIconUrl = centernavigationicon.serverRelativeUrl || `${props.siteurl}/Lists/${QuickLinkslist}/Attachments/${items.ID}/${centernavigationicon.fileName}`;
    }

    const linkElement = (
      <a href={Url} target={OpenInNewTab ? "_blank" : ""} data-interception="off" role="button">
        <img className="bhover" src={navIconUrl || serverRelativeUrlHoverOffImage} alt="image" />
        <img className="hhover" src={serverRelativeUrlHoverOnImage} alt="image" />
        <p>{Title}</p>
      </a>
    );

    const listItem = <li>{linkElement}</li>;

    displayDataQlink.push(listItem);

    this.setState({
      showdataqlink: displayDataQlink
    });
  }


  public ClearNavigation() {
    BreadCrumb = [];
    // $('.breadcrum-block').removeClass('open');
    // $('.clears-subnav-quick').hide();
    // $('.clears-subnav').hide();
    // $(".breadcrum-block").hide();
    // $(".main-mavigation").removeClass("submenu");
    // $('#root-nav-links ul li').siblings().removeClass('active');
    // $(".submenu-wrap-lists ul li").siblings().removeClass('active');
    // $('#root-nav-links ul li:first-child').addClass('active');

    document.querySelectorAll('.breadcrum-block').forEach(function (element) {
      element.classList.remove('open');
    });

    document.querySelectorAll('.clears-subnav-quick').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    document.querySelectorAll('.clears-subnav').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });



    document.querySelectorAll('.breadcrum-block').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    document.querySelectorAll('.main-mavigation').forEach(function (element) {
      element.classList.remove('submenu');
    });


    const mainNavigationElements: any = document.querySelectorAll('#root-nav-links ul li');
    mainNavigationElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });

    const submenuWrapListElements: any = document.querySelectorAll('.submenu-wrap-lists ul li');
    submenuWrapListElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });
    document.querySelectorAll('#root-nav-links ul li:first-child').forEach(function (element) {
      element.classList.add('active');
    });



    this.displayData = [];
    this.displayDataQlink = [];
  }
  // public mylinkss() {
  //   $(".tab-2-data").removeClass("active");
  //   $("#meetingroom").hide()
  //   $(".tab-1-data").addClass("active");
  //   $("#contacts").show()

  //   $(".breadcrum-block").hide();
  //   $(".main-mavigation").removeClass("submenu");
  //   $('#root-nav-links ul li').siblings().removeClass('active');
  //   $(".submenu-wrap-lists ul li").siblings().removeClass('active');
  //   $('#root-nav-links ul li:first-child').addClass('active');
  // }

  // converted code
  public mylinks() {
    // Remove "active" class from elements with the class "tab-2-data"
    document.querySelectorAll('.tab-2-data').forEach(function (element) {
      element.classList.remove('active');
    });

    // Hide the element with the ID "meetingroom"
    document.querySelectorAll('#meetingroom').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    // Add "active" class to elements with the class "tab-1-data"
    document.querySelectorAll('.tab-1-data').forEach(function (element) {
      element.classList.add('active');
    });

    // Show the element with the ID "contacts"
    document.querySelectorAll('#contacts').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });
    // Hide elements with the class "breadcrum-block"
    document.querySelectorAll('.breadcrum-block').forEach(function (element) {
      (element as HTMLElement).style.display = 'none';
    });

    // Remove "submenu" class from elements with the class "main-mavigation"
    document.querySelectorAll('.main-mavigation').forEach(function (element) {
      element.classList.remove('submenu');
    });

    // Remove "active" class from siblings of list items in "#root-nav-links ul"
    const mainNavigationElements: any = document.querySelectorAll('#root-nav-links ul li');
    mainNavigationElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });
    const submenuWrapListsElements: any = document.querySelectorAll('.submenu-wrap-lists ul li');
    submenuWrapListsElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });

    // Add "active" class to the first child of "#root-nav-links ul"
    const firstChild = document.querySelector('#root-nav-links ul li:first-child');
    if (firstChild) {
      firstChild.classList.add('active');
    }
  }

  // public quicklinkss() {
  //   $(".tab-1-data").removeClass("active");
  //   $("#contacts").hide()
  //   $(".tab-2-data").addClass("active");
  //   $("#meetingroom").show()

  //   $(".breadcrum-block").hide();
  //   $(".main-mavigation").removeClass("submenu");
  //   $('#root-nav-links ul li').siblings().removeClass('active');
  //   $(".submenu-wrap-lists ul li").siblings().removeClass('active');
  //   // $('#root-nav-links ul li:first-child').addClass('active');
  // }

  public quicklinks() {
    document.querySelectorAll('.tab-1-data').forEach(function (element) {
      element.classList.remove('active');
    });

    document.querySelectorAll('#contacts').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    document.querySelectorAll('.tab-2-data').forEach(function (element) {
      element.classList.add('active');
    });

    document.querySelectorAll('#meetingroom').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });

    document.querySelectorAll('.breadcrum-block').forEach(function (element) {
      (element as HTMLElement).style.display = 'none';
    });

    document.querySelectorAll('.main-mavigation').forEach(function (element) {
      element.classList.remove('submenu');
    });

    const mainNavigationElements: any = document.querySelectorAll('#root-nav-links ul li');
    mainNavigationElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });
    const submenuWrapListsElements: any = document.querySelectorAll('.submenu-wrap-lists ul li');
    submenuWrapListsElements.forEach(function (element: any) {

      const siblings = Array.prototype.slice.call(element.parentElement.children).filter(
        (sibling: any) => sibling !== element
      );
      // Remove the "submenu" class from each sibling
      siblings.forEach(function (sibling: any) {
        sibling.classList.remove('active');
      });
    });

  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;

    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item) {
      let RawImageTxtOn = item.HoverOnIcon;
      let RawImageTxtOff = item.HoverOffIcon;
      if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        if (ImgObjforON.serverRelativeUrl == undefined) {

          var serverRelativeUrl = `${handler.props.siteurl}/Lists/${Navigationslist}/Attachments/` + item.ID + "/" + ImgObjforON.fileName

        } else {

          serverRelativeUrl = ImgObjforON.serverRelativeUrl

        }

        var ImgObjforOFF = JSON.parse(RawImageTxtOff);
        if (ImgObjforOFF.serverRelativeUrl == undefined) {

          var serverRelativeUrl2 = `${handler.props.siteurl}/Lists/${Navigationslist}/Attachments/` + item.ID + "/" + ImgObjforOFF.fileName

        } else {

          serverRelativeUrl2 = ImgObjforOFF.serverRelativeUrl

        }


        if (item.LinkMasterID != undefined) { var LinkMasterIDTitle = item.LinkMasterID.Title }

        if (item.OpenInNewTab == true) {
          if (LinkMasterIDTitle == "DEPT_00001") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetDepartments()}> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" data-interception="off" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists department-wrap">

                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == "QLINK_00002") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" data-interception="off" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists q-links-dpt">
                  <div className="submenu-clear-wrap" >
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == undefined) {

            var str2 = item.Title;

            var ContentEditorURL = item.URL;
            var conturl = ContentEditorURL.toLowerCase();

            conturl = conturl.split("?");
            var DomID2 = str2.replace(/[_\W]+/g, "_");

            if (item.Title == "Home") {

              return (
                <li className="active" id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            } else if (item.Title == "Content Editor") {
              if (handler.state.IsAdminForContentEditor == true) {

                return (
                  <li> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
                );
              }
            } else {

              return (
                <li id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        } else {
          if (LinkMasterIDTitle == "DEPT_00001") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetDepartments()}> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" data-interception="off" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists department-wrap">

                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == "QLINK_00002") {
            return (
              <li> <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" data-interception="off" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists q-links-dpt">
                  <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()} data-interception="off">   <img src={`${handler.props.siteurl}/SiteAssets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == undefined) {
            var str = item.Title;
            var ContentEditorURL = item.URL;

            var conturl = ContentEditorURL.toLowerCase();

            conturl = conturl.split("?");
            var DomID = str.replace(/[_\W]+/g, "_");
            if (item.Title == "Home") {
              return (
                <li className="active" id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            } else if (item.Title == "Content Editor") {
              if (handler.state.IsAdminForContentEditor == true) {
                return (
                  <li> <a href={`${item.URL}`} data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
                );
              }
            } else {
              return (
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" /><img src={`${serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        }
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`



    const MyLinks: JSX.Element[] = handler.state.MyLinks.map(function (item) {
      let RawImageTxtOn = item.ImageHover;
      let RawImageTxtOff = item.Image;
      if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        if (ImgObjforON.serverRelativeUrl == undefined) {

          var serverRelativeUrl = `${handler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/` + item.ID + "/" + ImgObjforON.fileName

        } else {

          serverRelativeUrl = ImgObjforON.serverRelativeUrl

        }
        var ImgObjforOFF = JSON.parse(RawImageTxtOff);

        if (ImgObjforOFF.serverRelativeUrl == undefined) {

          var serverRelativeUrl2 = `${handler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/` + item.ID + "/" + ImgObjforOFF.fileName

        } else {

          serverRelativeUrl2 = ImgObjforOFF.serverRelativeUrl

        }

        var str2 = item.Title;
        var ContentEditorURL = item.URL.Url;
        var conturl = ContentEditorURL.toLowerCase();
        conturl = conturl.split("?");
        var DomID2 = str2.replace(/[_\W]+/g, "_");
        if (item.OpenInNewTab == true) {
          return (
            <li
              id={DomID2}>
              <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
                <img src={`${serverRelativeUrl2}`} alt="img" className="bhover" />
                <img src={`${serverRelativeUrl}`} alt="img" className="hhover" />
                <p>{item.Title}</p>
              </a>
            </li>
          );

        }
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`

    return (
      <div className='tab-view-content'>
        <div className="tab-view">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item active tab-1-data" role="presentation">
              <a className="nav-link active tab-1-data" onClick={this.mylinks} id="home-tab" data-toggle="tab" href="#contacts" role="tab"
                aria-controls="contacts" aria-selected="true">Quick Links </a>
            </li>
            <li className="nav-item tab-2-data" role="presentation">
              <a className="nav-link tab-2-data" onClick={this.quicklinks} id="profile-tab" data-toggle="tab" href="#meetingroom" role="tab"
                aria-controls="meetingroom" aria-selected="false">My Links</a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          <div className="nav-link active tab-1-data" id="contacts">
            <div className="main-mavigation m-b-20">
              <nav className="sec" id="root-nav-links">
                <div className="breadcrum-block">
                  <a href='#' className="clears-subnav" onClick={() => handler.ClearNavigation()}>All Menu<img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav" data-interception="off"></img></a>
                  {BreadCrumb.map((item, key) => (
                    <a href="#" id="b-d-crumb" data-index={key} onClick={() => handler.GetSubNodes(item.ID, item.Title, "Breadcrumb", key)}>{item.Title}<img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav" data-interception="off"></img></a>
                  ))}
                </div>
                <ul className="clearfix">
                  {MainNavigations}
                </ul>
              </nav>

            </div>
          </div>

          <div className="nav-item tab-2-data" id="meetingroom">
            <div className="main-mavigation quick m-b-20">
              <nav className="sec" id="root-nav-links">
                <ul className="clearfix">
                  {MyLinks}
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>

    );
  }
}