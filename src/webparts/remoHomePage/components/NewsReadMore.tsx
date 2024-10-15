import * as React from 'react';
import { INewsReadMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Markup } from 'interweave';
import { IWeb, Web } from "@pnp/sp/presets/all";
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import pnp from 'sp-pnp-js';
import "@pnp/sp/site-users/web";
import Swal from 'sweetalert2';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';

var User = "";
var UserEmail = "";
var title = "";
var ID: number;
var likes: number;
var commentscount: number;
var views: number;
var CurrentDate = new Date();
var Designation = "";
var Department = "";

let ViewsCountMasterlist = listNames.ViewsCountMaster;
let Newslist = listNames.News;
let LikesCountMasterlist = listNames.LikesCountMaster;
let CommentsCountMasterlist = listNames.CommentsCountMaster;
const Analytics = listNames.Analytics;
let NotificationList = listNames.NotificationList


export interface INewsRmState {
  Items: any[];
  TagBasedMoreNews: any[];
  RawJsonHtml: any[];
  Tag: string;
  Department: string;
  SitePageID: any;
  NewsViewCount: number;
  ActiveMainNewsID: any;
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
  Title: string;
  ItemID: number
}

var NewWeb: IWeb & IInvokable<any>

export default class NewsRm extends React.Component<INewsReadMoreProps, INewsRmState, {}> {
  constructor(props: INewsReadMoreProps) {
    super(props);
    pnp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      Items: [],
      TagBasedMoreNews: [],
      RawJsonHtml: [],
      Tag: "",
      Department: "",
      SitePageID: null,
      NewsViewCount: 0,
      ActiveMainNewsID: null,
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false,
      Title: "",
      ItemID: 0,
    };
    NewWeb = Web(this.props.siteurl);
  }

  public componentDidMount() {
    setTimeout(() => {
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#spLeftNav').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('#newsRm').show();


      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }

      const RecommendedItems = document.getElementById('spLeftNav');
      if (RecommendedItems) {
        RecommendedItems.style.setProperty('display', 'none', 'important');
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

      document.querySelectorAll('#newsRm').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });

    }, 1000);

    var reactHandler = this;
    reactHandler.getCurrentUser().then(() => {
      reactHandler.GetNews(ItemID);
    })
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    const List = url.searchParams.get("List");
    const AppliedTage: string = url.searchParams.get("AppliedTag");
    const Dept: string = url.searchParams.get("Dept");
    const SitePageID = url.searchParams.get("SitePageID");
    reactHandler.setState({ Tag: "" + AppliedTage + "", Department: "" + Dept + "", SitePageID: SitePageID, ActiveMainNewsID: ItemID });

    reactHandler.GetTagBasedNews(AppliedTage, Dept, ItemID);
    reactHandler.IsItemSeen(ItemID, Dept, List)

  }

  public IsItemSeen(id: string, Currentcatagory: any, Listname: any) {
    NewWeb.lists.getByTitle(NotificationList).items.select("*", "Author/Title").expand("Author").filter(`ItemId eq '${id}'and AssignedToId eq ${User} and Catagory eq '${Currentcatagory}'`).getAll().then((items) => { // //orderby is false -> decending
      if (items.length > 0) {
        if (items[0].IsSeen == false) {
          const itemId = items[0].Id;
          NewWeb.lists.getByTitle(NotificationList).items.getById(itemId).delete().then(() => {
            if (items[0].Catagory == Currentcatagory && items[0].AssignedToId == User && items[0].ItemId == id) {
              document.querySelectorAll('.notification_part ul li').forEach(function (element) {
                if (element.getAttribute('id') === id) {
                  element.remove();
                }
              });
              // $('.notification_part ul li').each(function () {
              //   if ($(this).attr('id') === id) {
              //     $(this).remove();
              //   }
              // })
            }
          }).then(() => {
            this.getNotication(id, Currentcatagory);
          })
        }
      }
    })
  }
  public getNotication(id: any, Currentcatagory: any) {
    NewWeb.lists.getByTitle(NotificationList).items.select("*", "Author/Title").expand("Author").filter(`AssignedToId eq ${User} and IsSeen ne '1'`).orderBy('Created', false).getAll().then((response) => {
      var totalcount: any = response.length;
      if (totalcount < 10) {
        totalcount = response.length;
      }
      else if (10 > totalcount && totalcount < 20) {
        totalcount = "10+";
      }
      else if (20 > totalcount && totalcount < 30) {
        totalcount = "20+";
      }
      else if (30 > totalcount && totalcount < 40) {
        totalcount = "30+";
      }
      else if (40 > totalcount && totalcount < 50) {
        totalcount = "40+";
      }
      else if (50 > totalcount && totalcount < 60) {
        totalcount = "50+";
      }
      else if (60 > totalcount && totalcount < 70) {
        totalcount = "60+";
      }
      else if (70 > totalcount && totalcount < 80) {
        totalcount = "70+";
      }
      else if (80 > totalcount && totalcount < 90) {
        totalcount = "80+";
      }
      else if (90 > totalcount && totalcount < 100) {
        totalcount = "90+";
      }
      else {
        totalcount = "99+";
      }
      if (response.length != 0) {
        const bannerElement = document.querySelector(".notification_banner a span");
        if (bannerElement) {
          bannerElement.innerHTML = totalcount;
        }
        const headerElement = document.querySelector(".noti_header p");
        if (headerElement) {
          headerElement.innerHTML = totalcount + " Unread";
        }
        // document.querySelector(".notification_banner a span").innerHTML = totalcount;
        // document.querySelector(".noti_header p").innerHTML = totalcount + " Unread";        
      }
    })
  }

  // public async GetCurrentUser() {

  //   User = this.props.userid;
  //   UserEmail = this.props.useremail;
  // }
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
        Category: "News Read-More",
        UserId: User.toString(),
        Department: Department,
        Designation: Designation,
        Title: this.state.Title,
        ItemId: this.state.ItemID.toString(),
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
  }
  public AddViews() {
    // const url: any = new URL(window.location.href);
    // const mode = url.searchParams.get("mode");
    var handler = this;

    handler.viewsCount();
    // }
  }
  public viewsCount() {
    NewWeb.lists.getByTitle(ViewsCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending      
      if (items.length != 0) {
        views = items.length;
      } else {
        views = 0;
      }
      this.pageviewscount(items.length);
    });
  }

  //news code<
  private async GetNews(ItemID: any) {
    var reactHandler = this;
    await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "EnableComments", "EnableLikes", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "*").filter(`ID eq ${ItemID}`).orderBy("Created", false).expand("SitePageID", "TransactionItemID", "Dept").get().then((items) => {
      title = items[0].Title;
      ID = items[0].ID
      reactHandler.setState({
        Items: items,
        Title: title,
        ItemID: items[0].ID,
      }, () => {
        // Call LandingPageAnalytics after state is updated
        this.LandingPageAnalytics();

      });
      if (items[0].EnableLikes == true) {
        reactHandler.setState({
          IsLikeEnabled: true
        })
      }
      if (items[0].EnableComments == true) {
        reactHandler.setState({
          IsCommentEnabled: true
        })
      } else {
        // $(".all-commets").remove();
        // $("#commentedpost").remove();

        let allCommentsElements = document.querySelectorAll(".all-comments");
        allCommentsElements.forEach(element => {
          element.remove();
        }); let allCommentPostElements = document.querySelectorAll("#commentedpost");
        allCommentPostElements.forEach(element => {
          element.remove();
        });
      }
      reactHandler.AddViews();
      reactHandler.checkUserAlreadyLiked();
      reactHandler.checkUserAlreadyCommented();
      reactHandler.viewsCount();
      reactHandler.likesCount();
      reactHandler.commentsCount();
      // var TransID = items[0].TransactionItemID.Id;
      //reactHandler.GetNewsViewCount(temp, TransID);
    });
  }

  public async GetTagBasedNews(AppliedTage: string, Dept: string, ItemID: any) {
    var reactHandler = this;
    await NewWeb.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "*").filter(`Tag eq '${AppliedTage}' and IsActive eq 1 and Id ne ${ItemID} `).orderBy("Created", false).expand("SitePageID", "Dept").getAll().then((items) => {

      reactHandler.setState({
        TagBasedMoreNews: items
      });
      if (items.length == 0) {
        // $('.view-all-news-l-col').addClass('col-md-12').removeClass('col-md-8');
        const newsElements = document.querySelectorAll('.view-all-news-l-col');

        // Iterate over each element and add/remove classes
        newsElements.forEach(element => {
          element.classList.add('col-md-12');
          element.classList.remove('col-md-8');
        });
        // $(".sub-news-section").hide();

        document.querySelectorAll('.sub-news-section').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      } else {
        // $('.view-all-news-l-col').addClass('col-md-8').removeClass('col-md-12');
        const newsElements = document.querySelectorAll('.view-all-news-l-col');

        newsElements.forEach(element => {
          element.classList.add('col-md-12');
          element.classList.remove('col-md-8');
        });
        // $(".sub-news-section").show();
        document.querySelectorAll('.sub-news-section').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }

    });

  }


  public GetNewsViewCount(Page: any, TransID: any) { // Page ==> PageName.aspx
    var reactHandler = this;
    let ViewCount;
    // })


    $.ajax({
      url: `${this.props.siteurl}/_api/search/query?querytext='${Page}'&selectproperties='ViewsLifetime'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        let ResultsArr = resultData.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results[0].Cells.results;
        for (var i = 0; i < ResultsArr.length; i++) {
          if (ResultsArr[i].Key == "ViewsLifeTime") {
            if (ResultsArr[i].Value == null || ResultsArr[i].Value == "null") {
              ViewCount = 0;
            } else {
              ViewCount = ResultsArr[i].Value;
            }

            reactHandler.setState({ NewsViewCount: ViewCount });
            reactHandler.AddViewcounttoList(ViewCount, TransID);
          }
        }
        // $(".no-of-views").text(reactHandler.state.NewsViewCount + " Views ");

        const viewsElement = document.querySelector('.no-of-views');

        // Set the text content of the selected element
        if (viewsElement) {
          viewsElement.textContent = `${reactHandler.state.NewsViewCount} Views`;
        }
      },
      error: function () {
      }
    });
  }

  public async AddViewcounttoList(ViewCount: any, TransID: number) {
  }
  // news code >

  public checkUserAlreadyLiked() {
    NewWeb.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        // $(".like-selected").show();
        // $(".like-default").hide();

        document.querySelectorAll('.like-selected').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });

        document.querySelectorAll('.like-default').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        this.setState({
          IsUserAlreadyLiked: true
        });

      }
    });
  }
  public checkUserAlreadyCommented() {
    NewWeb.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        this.setState({
          IsUserAlreadyCommented: true
        });
        // $(".reply-tothe-post").hide();

        document.querySelectorAll('.reply-tothe-post').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      }
    });
  }
  public likesCount() {
    NewWeb.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        likes = items.length;
      } else {
        likes = 0;
      }
    });

  }
  public commentsCount() {
    NewWeb.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        commentscount = items.length;
      } else {
        commentscount = 0;
      }
    });
    this.checkUserAlreadyCommented();
    this.getusercomments();
  }
  public getusercomments() {
    NewWeb.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      this.setState({
        commentitems: items,
      });
    });
  }
  public async liked(mode: string) {
    if (mode == "like") {

      NewWeb.lists.getByTitle(LikesCountMasterlist).items.add({
        EmployeeNameId: User,
        LikedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "News",
        Title: title,
        ContentID: ID,
      }).then(() => {

        document.querySelectorAll('.like-default').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('.like-selected').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        // $(".like-default").hide()
        // $(".like-selected").show();
        NewWeb.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
          var like = items.length;
          var newspan = like.toString()
          const likescount = document.getElementById("likescount");
          if (likescount) {
            likescount.textContent = newspan;
          } else {
            console.error("Element with ID 'likescount' not found.");
          }

        });
      })
    } else {
      // $(".like-selected").hide();
      // $(".like-default").show();

      document.querySelectorAll('.like-default').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
      document.querySelectorAll('.like-selected').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      NewWeb.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get().then((data) => {
        NewWeb.lists.getByTitle(LikesCountMasterlist).items.getById(data[0].Id).delete().then(() => {

          NewWeb.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
            var like = items.length;
            var newspan = like.toString()
            // document.getElementById("likescount").textContent = newspan;
            const likescount = document.getElementById("likescount");
            if (likescount) {
              likescount.textContent = newspan;
            } else {
              console.error("Element with ID 'likescount' not found.");
            }
          });
        })
      })
    }

  }
  public showComments() {
    // $(".all-commets").toggle();
    document.querySelectorAll('.all-comments').forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.display = htmlElement.style.display === 'none' ? 'block' : 'none';
    });
    NewWeb.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           

      this.setState({
        commentitems: items,
      });
    });
  }
  public saveComments(e: any) {
    var comments = e.target.value;
    // var comments = $("#comments").val();

    if (comments && comments.toString().length == 0) {
      Swal.fire({
        title: "Minimum 1 character is required!",
        icon: "warning",
      } as any)
    } else {

    }
  }
  public async pageviewscount(views: number) {

    await NewWeb.lists.getByTitle(Newslist).items.getById(ID).update({
      'PageViewCount': views
    })
  }
  public render(): React.ReactElement<INewsReadMoreProps> {
    var reactHandler = this;
    var Dt = "";

    const NewsDetails: JSX.Element[] = this.state.Items.map(function (item) {
      let RawImageTxt = item.Image;
      let serverRelativeUrl = RawImageTxt ? getImageUrl(RawImageTxt, item) : null;
      let Dt = calculateDate(item.Created);
      let tagLink = `${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`;

      return (
        <div className='view-all-news-recent-left'>
          <a href='#' className='nw-list-main' data-interception="off">{item.Title}</a>
          <div className='ns-tag-duration clearfix'>
            <div className='pull-left'>
              <a href={tagLink} data-interception='off' className='tags'>{item.Tag}</a>
            </div>
            <div className='pull-right'>
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' /> {Dt}
            </div>
          </div>
          <div className='view-all-news-recent-img-cont'>
            {RawImageTxt && <img className='placeholder-main-banner-image' src={serverRelativeUrl || undefined} alt='image' />}
            {!RawImageTxt && <img className='placeholder-main-banner-image' src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt='image' />}
          </div>
          <div className='ns-tag-duration clearfix'>
            <div className='pull-left det-pg-post-dura'>
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' /> {Dt} <p className='no-of-views'> {item.Views} Views </p>
            </div>
          </div>
          <div className='mews-details-para'>
            <p><Markup content={item.Description} /></p>
          </div>
        </div>
      );
    });

    // Function to get image URL
    function getImageUrl(RawImageTxt: string, item: any): string {
      let ImgObj = JSON.parse(RawImageTxt);
      return ImgObj.serverRelativeUrl ? ImgObj.serverRelativeUrl : `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/${item.ID}/${ImgObj.fileName}`;
    }

    // Function to calculate date
    function calculateDate(date: Date): string {
      let RawPublishedDt = moment(date).format("DD/MM/YYYY");
      let tdaydt = moment().format("DD/MM/YYYY");
      return RawPublishedDt === tdaydt ? "Today" : moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");
    }


    const MoreNewsBasedonTag: JSX.Element[] = this.state.TagBasedMoreNews.map(function (item) {
      let RawImageTxt = item.Image;
      var serverRelativeUrl = "";
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
        //   var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        //  var tdaydt = moment().format("DD/MM/YYYY");
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
                <p> {Dt} </p>
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
                <p> {Dt} </p>
              </div>
            </div>
          </li>
        );
      }
    });

    const pagecomments: JSX.Element[] = this.state.commentitems.map((item, key) => {
      const EmpName = item.EmployeeName ? item.EmployeeName.Title : "Unknown";
      const dated = moment(item.CommentedOn).format("DD/MM/YYYY");
      const comment = item.UserComments;

      return (
        <li key={key}>
          <div className="commentor-desc clearfix">
            <div className="commentor-image">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
            </div>
            <div className="commentor-details-desc">
              <h3>{EmpName}</h3> <span>{dated}</span>
              <p>{comment}</p>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="newsReadMore" id="newsRm" style={{ display: "none" }}>
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <section>
          <div className='container relative'>
            <div className='section-rigth'>
              <div className='inner-banner-header relative m-b-20'>
                <div className='inner-banner-overlay'></div>
                <div className='inner-banner-contents'>
                  <h1> News </h1>
                  <ul className='breadcums'>
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/NewsViewMore.aspx?`} data-interception="off"> All News </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off">News Read More </a> </li>
                  </ul>
                </div>
              </div>
              <div className='inner-page-contents '>
                <div className='sec m-b-20'>
                  <div className='row news-details-page'>
                    <div className='col-md-8 view-all-news-l-col'>

                      {NewsDetails}
                      <div className="comments-like-view">
                        <div className="comments-like-view-block">
                          <ul className="comments-like-view-block">
                            {this.state.IsLikeEnabled == true ?
                              <li>

                                <img className="like-selected" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like_selected.svg`} alt="image" onClick={() => this.liked("dislike")} />

                                <img className="like-default" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like.svg`} alt="image" onClick={() => this.liked("like")} />
                                <span id="likescount"> {likes} </span>

                              </li>
                              : <></>
                            }
                            {this.state.IsCommentEnabled == true &&
                              <li>
                                <img src={`${this.props.siteurl}/SiteAssets/test/img/lcv_comment.svg`} alt="image" onClick={() => this.showComments()} /> <span id="commentscount"> {commentscount} </span>
                              </li>
                            }
                            <li>
                              <img className="nopointer" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_view.svg`} alt="image" /> <span> {views} </span>
                            </li>
                          </ul>
                        </div>
                        <div className="reply-tothe-post all-commets">
                          <h2> All Comments </h2>
                          <ul>
                            {pagecomments.length != 0 ? pagecomments : <p>No comments yet....!</p>}
                          </ul>
                        </div>
                        {this.state.IsUserAlreadyCommented == false ?
                          <div className="reply-tothe-post" id="commentedpost">
                            <h2> Comment to this post </h2>
                            <textarea id="comments" placeholder="Message Here" style={{ resize: "none" }} className="form-control"></textarea>
                            <input type="button" className="btn btn-primary" value="Submit" onClick={(e) => this.saveComments(e)} />
                          </div>
                          :
                          <></>
                        }
                      </div>
                    </div>

                    <div className='col-md-4 sub-news-section'>
                      <div className='heading clearfix'>
                        <a href={`${this.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${this.state.Tag}`} data-interception='off' >
                          More news on {this.state.Tag}
                        </a>
                      </div>
                      <div className="section-part clearfix">
                        <div className="list-news-latests">
                          <ul>
                            {MoreNewsBasedonTag}
                          </ul>
                        </div>
                      </div>
                      <div>

                      </div>
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

