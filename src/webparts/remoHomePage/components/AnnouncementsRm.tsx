import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IAnnouncementsRmProps } from './IRemoHomePageProps';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import Swal from 'sweetalert2';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
// import * as $ from 'jquery';
import Footer from '../../remoHomePage/components/Footer/Footer'
import { PageAnalytics } from './ServiceProvider/LandingPageAnalytics';
import { ViewsCount } from './ServiceProvider/viewsCount';
import { LikesCount } from './ServiceProvider/LikesCount';
import { CommentsCount } from './ServiceProvider/CommentsCount';
import { CheckUserAlreadyLiked } from './ServiceProvider/CheckUserAlreadyLiked';
import { AddViews } from './ServiceProvider/AddViews';
import { CheckUserAlreadyCommented } from './ServiceProvider/CheckUserAlreadyCommented';
// import pnp from 'sp-pnp-js';
// import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService'

let User = "";
let UserEmail = "";
let ID: number;
let likes: any;
let commentscount: number;
let views: any;
const CurrentDate = new Date();
let ItemID: any;
var Designation = "";
var Department = "";

// const ViewsCountMasterlist = listNames.ViewsCountMaster;
const Announcementlist = listNames.Announcement;
const LikesCountMasterlist = listNames.LikesCountMaster;
const CommentsCountMasterlist = listNames.CommentsCountMaster;
const Analytics = listNames.Analytics;

interface IAnnouncementsRmState {
  Items: any[];
  ItemID: number | null;
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
  Title: string;
}

let NewWeb: any;

export default class AnnouncementsRm extends React.Component<IAnnouncementsRmProps, IAnnouncementsRmState> {
  constructor(props: IAnnouncementsRmProps) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null,
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false,
      Title: "",
    };
    NewWeb = Web(`${this.props.siteurl}`);
  }

  public async componentDidMount() {
    this.hideElements();
    const url: URL = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");

    if (ItemID) {
      // await this.getCurrentUser();
      await this.getAnnouncementsDetails(ItemID);
      // await this.LandingPageAnalytics();

      const pageAnalytics = new PageAnalytics("Announcements Read-More", User, Department, Designation, this.state.Title, ItemID, UserEmail);
      pageAnalytics.LandingPageAnalytics();

      // const userdetails = new CurrentUserDetails();
      // let currentUser = userdetails.getCurrentUserDetails()
      // console.log("Current user details", currentUser);
    } else {
      console.error("ItemID is not present in the URL");
    }
  }
  // old code 
  // private hideElements() {
  //   $('#spCommandBar, div[data-automation-id="pageHeader"], #CommentsWrapper').attr('style', 'display: none !important');
  // }

  // converted code

  private hideElements() {
    const elements: any = document.querySelectorAll('#spCommandBar, div[data-automation-id="pageHeader"], #CommentsWrapper');
    elements.forEach((element: { style: { display: string; }; }) => {
      element.style.display = 'none';
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
        Category: "Announcements Read-More",
        UserId: User,
        Department: Department,
        Designation: Designation,
        Title: this.state.Title,
        ItemId: ItemID,
        UserEmail: UserEmail,
      });

      console.log('Data successfully added:', response);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  // old code
  // public async getCurrentUser() {
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

  // converted code
  // public async getCurrentUser() {
  //   try {
  //     // const { userid } = this.props;
  //     const profile = await pnp.sp.profiles.myProperties.get();
  //     const departmentProperty = profile.UserProfileProperties?.find((prop: { Key: string; }) => prop.Key === 'Department');
  //     // const Department = departmentProperty?.Value ?? null;
  //     console.log(departmentProperty);
  //   }
  //   catch (error) {
  //     console.error('Error Feching current User Details:', error);
  //   }
  // }

  // private async addViews() {
  //   await sp.web.lists.getByTitle(ViewsCountMasterlist).items.add({
  //     EmployeeNameId: User,
  //     ViewedOn: CurrentDate,
  //     EmployeeEmail: UserEmail,
  //     ContentPage: "Announcements",
  //     Title: this.state.Title,
  //     ContentID: ID,
  //   });
  // }

  // private async viewsCount() {
  //   const items = await sp.web.lists.getByTitle(ViewsCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
  //   views = items.length !== 0 ? items.length : 0;
  // }

  private async getAnnouncementsDetails(itemID: string) {
    const items = await sp.web.lists.getByTitle(Announcementlist).items.select("*").filter(`IsActive eq '1' and ID eq '${itemID}'`).getAll();
    if (items && items.length > 0) {
      const title = items[0].Title;
      ID = items[0].ID;
      this.setState({ Items: items, ItemID: items[0].Id, Title: title });
      if (items[0].EnableLikes) {
        this.setState({ IsLikeEnabled: true });
      }
      if (items[0].EnableComments) {
        this.setState({ IsCommentEnabled: true });
      } else {
        // $(".all-commets, #commentedpost").remove();
        document.querySelectorAll(".all-commets, #commentedpost").forEach(function (element) {
          element.remove();
        });

      }
      // this.addViews();
      // this.checkUserAlreadyLiked();
      // this.checkUserAlreadyCommented();
      // this.viewsCount();
      // this.likesCount();
      // this.commentsCount();
      // New code

      const viewsCount = new ViewsCount();
      viewsCount.viewsCount(ID).then((data) => {
        console.log("Current user details", data);
      });

      const likesCount = new LikesCount();
      likesCount.likesCount(ID).then((likeData) => {
        console.log("Current user details", likeData);
      });

      const commentsCount = new CommentsCount();
      commentsCount.commentsCount(ID).then((commentData) => {
        console.log("commentData", commentData);
        this.checkUserAlreadyCommented();
        this.getUserComments();
      }).catch((err) => {
        console.log("Erorr in comment count", err);

      });



      const checkUserAlreadyLiked = new CheckUserAlreadyLiked();
      checkUserAlreadyLiked
        .checkUserAlreadyLiked(ID, User)
        .then((result: any) => {
          if (result.length !== 0) {
            // If the user has already liked the content
            document.querySelectorAll(".like-selected").forEach((element) => {
              (element as HTMLElement).style.display = "block";
            });
            document.querySelectorAll(".like-default").forEach((element) => {
              (element as HTMLElement).style.display = "none";
            });

            // Update the React component's state
            this.setState({ IsUserAlreadyLiked: true });
            console.log("User already liked this item:", result);
          } else {
            // If no like records were found
            console.log("No likes found for the user.");
            this.setState({ IsUserAlreadyLiked: false });
          }
        })
        .catch((error) => {
          console.error("Error while checking user likes:", error);
        });

      const addView = new AddViews();
      addView.addViews(User, UserEmail, ID, this.state.Title)
        .then(() => {
          console.log("View logged successfully.");
        })
        .catch((error) => {
          console.error("Failed to add view:", error);
        });



      const checkUserAlreadyCommented = new CheckUserAlreadyCommented();

      checkUserAlreadyCommented
        .checkUserAlreadyCommented(ID, User)
        .then((isCommented) => {
          if (isCommented) {
            console.log("User has already commented.");
            this.setState({ IsUserAlreadyCommented: true });
          } else {
            console.log("User has not commented yet.");
            this.setState({ IsUserAlreadyCommented: false });
          }
        })
        .catch((error) => {
          console.error("Error while checking user comments:", error);
        });

    } else {
      console.error("No items found or ItemID doesn't exist");
    }
  }


  // private async checkUserAlreadyLiked() {
  //   try {
  //     const items = await sp.web.lists
  //       .getByTitle(LikesCountMasterlist)
  //       .items
  //       .filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`)
  //       .top(5000)
  //       .get();
  //     if (items.length !== 0) {
  //       document.querySelectorAll('.like-selected').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //       document.querySelectorAll('.like-default').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       this.setState({ IsUserAlreadyLiked: true });
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

  private async checkUserAlreadyCommented() {
    try {
      const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get();
      if (items.length !== 0) {
        this.setState({ IsUserAlreadyCommented: true });
        // $(".reply-tothe-post").hide();
        document.querySelectorAll('.reply-tothe-post').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  // private async likesCount() {
  //   const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
  //   likes = items.length !== 0 ? items.length : 0;
  // }

  // private async commentsCount() {
  //   const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
  //   commentscount = items.length !== 0 ? items.length : 0;
  //   this.checkUserAlreadyCommented();
  //   this.getUserComments();
  // }

  private async getUserComments() {
    const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
    this.setState({ commentitems: items });
  }

  private async liked(mode: string) {
    if (mode === "like") {
      await sp.web.lists.getByTitle(LikesCountMasterlist).items.add({
        EmployeeNameId: User,
        LikedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "Announcements",
        Title: this.state.Title,
        ContentID: ID,
      });
      // $(".like-default").hide();
      // $(".like-selected").show();
      document.querySelectorAll('.like-selected').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
      document.querySelectorAll('.like-default').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
      const like = items.length;
      // document.getElementById("likescount").textContent = like.toString();
      const likesElement = document.getElementById("likescount");
      if (likesElement) {
        likesElement.textContent = like.toString();
      } else {
        console.error("Element with ID 'likescount' not found.");
      }
    } else {
      // $(".like-selected").hide();
      // $(".like-default").show();

      document.querySelectorAll('.like-selected').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });

      document.querySelectorAll('.like-default').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      const data = await sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get();
      await sp.web.lists.getByTitle(LikesCountMasterlist).items.getById(data[0].Id).delete();
      const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
      const like = items.length;
      // document.getElementById("likescount").textContent = like.toString();
      const likesElement = document.getElementById("likescount");
      if (likesElement) {
        likesElement.textContent = like.toString();
      } else {
        console.error("Element with ID 'likescount' not found.");
      }
    }
  }

  private async showComments() {
    // $(".all-commets").toggle();
    try {
      document.querySelectorAll('.all-comments').forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.display = htmlElement.style.display === 'none' ? 'block' : 'none';
      });
      const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
      this.setState({ commentitems: items });
    }
    catch {
      console.error("Element with ID 'Comment' not found.");
    }
  }

  private async saveComments(e: any) {

    const comments = e.target.value;
    console.log("comments1", comments);

    // const commentss = $("#comments").val();
    // console.log("comments2", commentss);

    if (comments && comments.toString().length === 0) {
      Swal.fire({
        title: "Minimum 1 character is required!",
        icon: "warning",
      });
    } else {
      await sp.web.lists.getByTitle(CommentsCountMasterlist).items.add({
        EmployeeNameId: User,
        CommentedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "Announcements",
        Title: this.state.Title,
        ContentID: ID,
        UserComments: comments,
      });
      // $("#commentedpost").hide();
      // $(".reply-tothe-post").hide();
      document.querySelectorAll('#commentedpost').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      document.querySelectorAll('.reply-tothe-post').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
      commentscount = items.length;
      // document.getElementById("commentscount").textContent = commentscount.toString();
      const commentsElement = document.getElementById("commentscount");

      if (commentsElement) {
        commentsElement.textContent = commentscount.toString();
      } else {
        console.error("Element with ID 'commentscount' not found.");
      }

    }
  }

  public render(): React.ReactElement<IAnnouncementsRmProps> {
    const AnncDetails: JSX.Element[] = this.state.Items.map((item: any) => {
      let RawImageTxt = item.Image;
      const RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      const tdaydt = moment().format("DD/MM/YYYY");
      const Dte = RawPublishedDt === tdaydt ? "Today" : moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");
      const serverRelativeUrl = RawImageTxt !== "" && RawImageTxt !== null ? (JSON.parse(RawImageTxt).serverRelativeUrl !== undefined ? JSON.parse(RawImageTxt).serverRelativeUrl : `${this.props.siteurl}/Lists/${Announcementlist}/Attachments/${item.ID}/${JSON.parse(RawImageTxt).fileName}`) : `${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`;
      return (
        <div className="col-md-12 view-all-news-l-col home-detail-banner" key={item.ID}>
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            <h2 className="nw-list-main">{item.Title}</h2>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off">{Dte}</a>
              </div>
            </div>
            <div className="mews-details-para">
              <p><Markup content={item.Description} /></p>
            </div>
          </div>
        </div>
      );
    });

    const pagecomments: JSX.Element[] = this.state.commentitems.map((item: any) => (
      <li key={item.ID}>
        <div className="commentor-desc clearfix">
          <div className="commentor-image">
            <img src={`${this.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
          </div>
          <div className="commentor-details-desc">
            <h3>{item.EmployeeName.Title}</h3><span>{moment(item.CommentedOn).format("DD/MM/YYYY")}</span>
            <p>{item.UserComments}</p>
          </div>
        </div>
      </li>
    ));

    return (
      <div className={styles.remoHomePage} id="annc-read-mb-t-50">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1>Announcements</h1>
                  <ul className="breadcums">
                    <li><a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off">Home</a></li>
                    <li><a href={`${this.props.siteurl}/SitePages/Announcement-View-More.aspx`} data-interception="off">All Announcements</a></li>
                    <li><a href="#" style={{ pointerEvents: "none" }} data-interception="off">Announcements Read More</a></li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents">
                <div className="sec m-b-20">
                  <div className="row">{AnncDetails}</div>
                  <div>
                    <div className="comments-like-view">
                      <div className="comments-like-view-block">
                        <ul className="comments-like-view-block">
                          {this.state.IsLikeEnabled && (
                            <li>
                              <img className="like-selected" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like_selected.svg`} alt="image" onClick={() => this.liked("dislike")} />
                              <img className="like-default" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like.svg`} alt="image" onClick={() => this.liked("like")} />
                              <span id="likescount">{likes}</span>
                            </li>
                          )}
                          {this.state.IsCommentEnabled && (
                            <li>
                              <img src={`${this.props.siteurl}/SiteAssets/test/img/lcv_comment.svg`} alt="image" onClick={
                                () => this.showComments()
                              } /> <span id="commentscount">{commentscount}</span>
                            </li>

                            // <li>
                            //   <img src={`${this.props.siteurl}/SiteAssets/test/img/lcv_comment.svg`} alt="image" onClick={
                            //      const showCommentsInstance= new ShowComments();
                            //   showCommentsInstance.showComments(this.state.ItemID);
                            // } /> <span id="commentscount">{commentscount}</span>
                            // </li>
                          )}
                          <li>
                            <img className="nopointer" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_view.svg`} alt="image" /> <span>{views}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="reply-tothe-post all-commets">
                        <h2>All Comments</h2>
                        <ul>{pagecomments.length !== 0 ? pagecomments : <p>No comments yet....!</p>}</ul>
                      </div>
                      {!this.state.IsUserAlreadyCommented ? (
                        <div className="reply-tothe-post" id="commentedpost">
                          <h2>Comment to this post</h2>
                          <textarea id="comments" placeholder="Message Here" style={{ resize: "none" }} className="form-control"></textarea>
                          <input type="button" className="btn btn-primary" value="Submit" onClick={(e) => this.saveComments(e)} />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} onReadMoreClick={null} id={null} />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
