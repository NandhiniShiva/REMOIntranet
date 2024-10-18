import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { INewsViewMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import { IWeb, Web } from "@pnp/sp/webs";
import Slider from "react-slick";
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp from 'sp-pnp-js';

let Newslist = listNames.News;
const Analytics = listNames.Analytics;



export interface INewsVmState {
  Items: any[];
  RecentNewsItems: any[];
  ViewBasedTopNews: any[];
  OneWkOldNews: any[];
  status: boolean;
  AvailableDepts: any[];
  DeptNewsArr: any[];
  Title: string;
  ItemID: number
}

let NewsAvailableDepts: { ID: any; Title: any; URL: any; }[] = [];
let DeptNames: any[] = [];
let DeptNamesExitsUnique: any[] = [];
var Designation = "";
var Department = "";
var User = "";
var UserEmail = "";

var NewWeb: IWeb & IInvokable<any>;
export default class NewsVm extends React.Component<INewsViewMoreProps, INewsVmState, {}> {
  constructor(props: INewsViewMoreProps) {
    super(props);
    this.state = {
      Items: [],
      RecentNewsItems: [],
      ViewBasedTopNews: [],
      OneWkOldNews: [],
      status: false,
      AvailableDepts: [],
      DeptNewsArr: [],
      Title: "",
      ItemID: 0,
    };
    NewWeb = Web(this.props.siteurl)
  }

  // public componentDidMount() {
  //   setTimeout(function () {
  //     // $('#spCommandBar').attr('style', 'display: none !important');
  //     // $('#CommentsWrapper').attr('style', 'display: none !important');
  //     // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
  //     // $('#RecommendedItems').attr('style', 'display: none !important');

  //     const spCommandBar = document.getElementById('spCommandBar');
  //     if (spCommandBar) {
  //       spCommandBar.style.setProperty('display', 'none', 'important');
  //     }
  //     const commentsWrapper = document.getElementById('CommentsWrapper');
  //     if (commentsWrapper) {
  //       commentsWrapper.style.setProperty('display', 'none', 'important');
  //     }
  //     const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
  //     pageHeaders.forEach((element: any) => {
  //       element.style.setProperty('display', 'none', 'important');
  //     });
  //     const RecommendedItems = document.getElementById('RecommendedItems');
  //     if (RecommendedItems) {
  //       RecommendedItems.style.setProperty('display', 'none', 'important');
  //     }




  //     // Hide all div elements with the attribute data-automation-id="pageHeader"



  //   }, 2000);

  //   var reactHandler = this;
  //   // reactHandler.GetAllNews();
  //   reactHandler.getCurrentUser().then(() => {
  //     reactHandler.GetAllNews();

  //     reactHandler.GetAllTopNews();
  //     reactHandler.GetAllNewsAvailableDepartments();
  //     reactHandler.GetWeekOldNews();
  //   })
  // }

  // Optimized code

  public componentDidMount() {
    setTimeout(() => {
      ['spCommandBar', 'CommentsWrapper', 'RecommendedItems'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.setProperty('display', 'none', 'important');
      });

      document.querySelectorAll('div[data-automation-id="pageHeader"]').forEach((element: HTMLElement) => {
        element.style.setProperty('display', 'none', 'important');
      });
    }, 2000);

    this.getCurrentUser().then(() => {
      this.GetAllNews();
      this.GetAllTopNews();
      this.GetAllNewsAvailableDepartments();
      this.GetWeekOldNews();
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
        Category: "News View-More",
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
    try {


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
    } catch (error) {
      console.log("Error in getCurrentUser", error);

    }
  }

  private async GetAllNews() {

    var reactHandler = this;
    try {


      await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter("IsActive eq 1").orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(1).get().then((items: { Id: any; }[]) => {

        reactHandler.setState({
          Items: items,
        }, () => {
          // Call LandingPageAnalytics after state is updated
          this.LandingPageAnalytics();
        });
        let ItemID = items[0].Id;
        reactHandler.GetAllRecentNews(ItemID);
      });
    } catch (error) {
      console.log("Error in GetAllNews", error);

    }
  }

  private async GetAllRecentNews(ID: any) {
    var reactHandler = this;
    try {


      await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter(`IsActive eq '1' and ID ne '${ID}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(4).get().then((items: any) => {

        reactHandler.setState({
          RecentNewsItems: items
        });
      });
    } catch (error) {
      console.log("Error in GetAllRecentNews", error);

    }
  }

  private async GetAllTopNews() {
    var reactHandler = this;
    try {


      await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "PageViewCount", "*").filter(`IsActive eq '1'`).orderBy("PageViewCount", false).expand("Dept", "SitePageID", "TransactionItemID").get().then((items: any[]) => {

        if (items.length != 0) {
          // $(".top-news-block-current-month").show();

          document.querySelectorAll('.top-news-block-current-month').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });
          reactHandler.setState({
            ViewBasedTopNews: items
          });
        } else {
          // $(".top-news-block-current-month").hide();
          document.querySelectorAll('.top-news-block-current-month').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
        }
      });
    } catch (error) {
      console.log("Error in GetAllTopNews", error);

    }
  }

  public async GetWeekOldNews() {
    var reactHandler = this;
    let today = moment().format("YYYY-MM-DD");
    let WkDate = moment(today, "YYYY-MM-DD").subtract(1, "week").format("YYYY-MM-DD");
    try {


      await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter(`IsActive eq '1' and Created lt '${WkDate}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(20).get().then((items: any[]) => {

        if (items.length != 0) {
          // $(".PastNewsData").show();
          document.querySelectorAll('.PastNewsData').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });
          reactHandler.setState({
            OneWkOldNews: items
          });
        } else {
          document.querySelectorAll('.PastNewsData').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
          // $(".PastNewsData").hide();
        }
      });
    } catch (error) {
      console.log("Error in GetWeekOldNews", error);

    }
  }

  private async GetAllNewsAvailableDepartments() {
    NewsAvailableDepts = [];
    DeptNames = [];
    DeptNamesExitsUnique = [];
    var reactHandler = this;
    try {


      await NewWeb.lists.getByTitle(Newslist).items.select("*", "ID", "Dept/Id", "Dept/Title", "Image").filter(`IsActive eq '1'`).orderBy("Created", false).expand("Dept").get().then((items: string | any[]) => {

        for (var i = 0; i < items.length; i++) {
          if (items[i].Dept == undefined) {

          } else {
            var DeptName = items[i].Dept.Title;
            var DeptID = items[i].Dept.Title;

          }

          DeptNames.push(DeptName);
          if (reactHandler.findValueInArray(DeptName, DeptNamesExitsUnique)) {
          }
          else {
            if (reactHandler.findValueInArray(DeptName, DeptNames)) {
              DeptNamesExitsUnique.push(DeptName);
              let RawImageTxt = items[i].Image;
              var serverRelativeUrl;
              if (RawImageTxt != "" && RawImageTxt != null) {

                var ImgObj = JSON.parse(RawImageTxt);
                if (ImgObj.serverRelativeUrl == undefined) {

                  serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + items[i].ID + "/" + ImgObj.fileName

                } else {

                  serverRelativeUrl = ImgObj.serverRelativeUrl

                }
                var PicUrl = serverRelativeUrl;
                NewsAvailableDepts.push({ "ID": DeptID, "Title": DeptName, "URL": PicUrl });
              }
            }
          }
        }
        reactHandler.setState({ AvailableDepts: NewsAvailableDepts });
        console.log(reactHandler.state.AvailableDepts);
        reactHandler.GetDeptNews();

      });
    } catch (error) {
      console.log("Error in GetAllNewsAvailableDepartments", error);

    }
  }


  public async GetDeptNews() {
    var reactHandler = this;

    for (var j = 0; j < this.state.AvailableDepts.length;) {
      var string = this.state.AvailableDepts[j].Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
      var CustomID = "" + Title + "-Dept-News";
      var DeptID = this.state.AvailableDepts[j].ID;
      if (DeptID != "" || DeptID != undefined || DeptID != null) {
        try {


          await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`IsActive eq '1' and Dept/Id eq '${DeptID}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(4).get().then((items: string | any[]) => {

            for (var i = 0; i < items.length;) {
              // $("#" + CustomID + "").append(`<li><a href="${items[i].DetailsPageUrl}?ItemID=${items[i].ID}&AppliedTag=${items[i].Tag}&Dept=${items[i].Dept.Title}&SitePageID=${items[i].SitePageID.Id}&" data-interception="off"><p>${items[i].Title}</p></a></li>`);
              // $("#" + CustomID + "").append(`<li><a href="${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${items[i].ID}&AppliedTag=${items[i].Tag}&Dept=${items[i].Dept.Title}&SitePageID=${items[i].SitePageID.Id}&" data-interception="off"><p>${items[i].Title}</p></a></li>`);
              const element = document.getElementById(CustomID);
              if (element) {
                element.insertAdjacentHTML('beforeend', `
                    <li>
                                    <a href="${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${items[i].ID}&AppliedTag=${items[i].Tag}&Dept=${items[i].Dept.Title}&SitePageID=${items[i].SitePageID.Id}&" data-interception="off">
        <p>${items[i].Title}</p>
      </a>
    </li>
  `);
              }

              i++;
            }
            j++;
          });

        } catch (error) {
          console.log("Error in GetDeptNews", error);

        }
      }
    }
  }

  public SampleNextArrow(props: { className: any; style: any; onClick: any; }) {
    const { className, onClick } = props;
    return (
      <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/img/right.svg`} alt="image" data-interception="off" /> </a>
    );
  }

  public SamplePrevArrow(props: { className: any; style: any; onClick: any; }) {
    const { className, onClick } = props;
    return (
      <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/img/left.svg`} alt="image" data-interception="off" /> </a>
    );
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

  public render(): React.ReactElement<INewsViewMoreProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 5, //Value Comes From State
      slidesToScroll: 4,
      draggable: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: false,
            arrows: false,
            autoplay: false,
            centerMode: false
          }
        }
      ]
      /*prevArrow: <this.SamplePrevArrow />,
      nextArrow: <this.SampleNextArrow />*/
    };

    var reactHandler = this;
    var Dt = "";
    var Dte = "";
    const TopRecentNews: JSX.Element[] = this.state.Items.map(function (item) {
      let RawImageTxt = item.Image;
      var serverRelativeUrl;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }

      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        //// var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (ImgObj.serverRelativeUrl == undefined) {

          serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + item.ID + "/" + ImgObj.fileName

        } else {

          serverRelativeUrl = ImgObj.serverRelativeUrl

        }

        return (
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${serverRelativeUrl}`} alt="image" />
            </div>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
        );
      } else {
        return (
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
        );
      }
    });

    const TopRecentOtherNews: JSX.Element[] = this.state.RecentNewsItems.map(function (item) {
      let RawImageTxt = item.Image;
      var serverRelativeUrl;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");

      if (RawPublishedDt == tdaydt) {
        Dte = "Today";
      } else {
        Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);

        if (ImgObj.serverRelativeUrl == undefined) {

          serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + item.ID + "/" + ImgObj.fileName

        } else {

          serverRelativeUrl = ImgObj.serverRelativeUrl

        }


        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${serverRelativeUrl}`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p>
              </div>
            </div>
          </li>
        );
      } else {
        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p>
              </div>
            </div>
          </li>
        );
      }
    });

    const TopNewsBasedonViews: JSX.Element[] = this.state.ViewBasedTopNews.map(function (item) {
      let RawImageTxt = item.Image;
      var serverRelativeUrl;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dte = "Today";
      } else {
        Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        //     var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        //  var tdaydt = moment().format("DD/MM/YYYY");
        if (ImgObj.serverRelativeUrl == undefined) {

          serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + item.ID + "/" + ImgObj.fileName

        } else {

          serverRelativeUrl = ImgObj.serverRelativeUrl

        }


        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      } else {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      }
    });

    const OneWkOldNews: JSX.Element[] = this.state.OneWkOldNews.map(function (item) {
      let RawImageTxt = item.Image;
      var serverRelativeUrl
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        if (ImgObj.serverRelativeUrl == undefined) {

          serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + item.ID + "/" + ImgObj.fileName

        } else {

          serverRelativeUrl = ImgObj.serverRelativeUrl

        }


        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      } else {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      }
    });

    const AllDepartmentNews: JSX.Element[] = this.state.AvailableDepts.map(function (item) {
      var string = item.Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');

      return (
        <div className="col-md-3  m-b-0">
          <div className="heading clearfix">
            <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=DeptBased&Dept=${item.Title}`} data-interception='off'>
              {item.Title}
            </a>
          </div>
          <div className="section-part">
            <img src={`${item.URL}`} alt="image" />
            <ul id={`${Title}-Dept-News`}>

            </ul>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.remoHomePage} id="newsVm">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> News </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> All News </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    <div className="col-md-6 view-all-news-l-col">
                      {TopRecentNews}
                    </div>
                    <div className="col-md-6">
                      <div className="list-news-latests">
                        <ul>
                          {TopRecentOtherNews}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="top-news-sections m-b-20 top-news-block-current-month" style={{ display: "none" }}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Top News
                      </div>
                      <div className="pull-right">

                      </div>
                    </div>
                    <div className="section-part newsvm clearfix">
                      <ul>
                        <Slider {...settings} className='hero-banner-container-wrap' >
                          {TopNewsBasedonViews}
                        </Slider>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="education-government-track sec m-b-20">
                  <div className="row dept-based-news-block">
                    <Slider {...settings} className='hero-banner-container-wrap' >
                      {AllDepartmentNews}
                    </Slider>
                  </div>
                </div>
                <div className="top-news-sections m-b-20 PastNewsData" style={{ display: "none" }}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Past News
                      </div>
                      <div className="pull-right">

                      </div>
                    </div>
                    <div className="section-part newsvm clearfix">
                      <ul>
                        <Slider {...settings} className='hero-banner-container-wrap' >
                          {OneWkOldNews}
                        </Slider>
                      </ul>
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