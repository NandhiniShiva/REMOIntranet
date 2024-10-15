import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IHeroBannerReadMoreProps } from './IRemoHomePageProps';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import Swal from 'sweetalert2';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
// import * as $ from 'jquery';
import { Markup } from 'interweave';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp, { Web } from 'sp-pnp-js';

let User = "";
let UserEmail = "";
let title = "";
let ID: number;
let likes: number;
let commentscount: number;
let views: number;
const CurrentDate = new Date();
let ItemID: any;
var Designation = "";
var Department = "";

const ViewsCountMasterlist = listNames.ViewsCountMaster;
const Hero_Bannerlist = listNames.Hero_Banner;
const LikesCountMasterlist = listNames.LikesCountMaster;
const CommentsCountMasterlist = listNames.CommentsCountMaster;
const Analytics = listNames.Analytics;

export interface IHeroBannerRmState {
  Items: any[];
  ItemID: any;
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
  Title: string;
}
let NewWeb: any;
export default class HeroBannerRm extends React.Component<IHeroBannerReadMoreProps, IHeroBannerRmState> {
  constructor(props: IHeroBannerReadMoreProps) {
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
    NewWeb = new Web(`${this.props.siteurl}`);
  }

  public componentDidMount() {
    this.hideElements();
    this.getCurrentUser().then(() => {
      this.getItemID();
    })

  }

  private hideElements() {
    const elements: any = document.querySelectorAll('#spCommandBar, div[data-automation-id="pageHeader"], #CommentsWrapper');
    elements.forEach((element: { style: { display: string; }; }) => {
      element.style.display = 'none';
    });
  }

  // private async getCurrentUser() {
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
        Category: "HeroBanner Read-More",
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

  public async getCurrentUser() {
    try {
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
    catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
  }

  private getItemID() {
    const url = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");
    this.getBannerDetails(ItemID);
  }

  private async getBannerDetails(ItemID: string) {
    try {
      const items = await sp.web.lists.getByTitle(Hero_Bannerlist).items
        .select("Title", "EnableComments", "EnableLikes", "Description", "Created", "Image", "ID", "*")
        .filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll();
      if (items.length > 0) {
        const item = items[0];
        title = item.Title;
        ID = item.ID;
        this.setState({
          Items: items, ItemID: item.ID, Title: title
        }, () => {
          // Call LandingPageAnalytics after state is updated
          this.LandingPageAnalytics();

        });
        if (item.EnableLikes) {
          this.setState({ IsLikeEnabled: true });
        }
        if (item.EnableComments) {
          this.setState({ IsCommentEnabled: true });
        } else {
          // $(".all-commets, #commentedpost").remove();

          const elements = document.querySelectorAll('.all-commets, #commentedpost');

          // Iterate over the NodeList and remove each element
          elements.forEach(element => {
            element.remove();
          });
        }
        this.addViews();
        this.checkUserAlreadyLiked();
        this.checkUserAlreadyCommented();
        this.viewsCount();
        this.likesCount();
        this.commentsCount();
      }
    } catch (error) {
      console.error('Error fetching banner details:', error);
    }
  }

  private addViews() {
    sp.web.lists.getByTitle(ViewsCountMasterlist).items.add({
      EmployeeNameId: User,
      ViewedOn: CurrentDate,
      EmployeeEmail: UserEmail,
      ContentPage: "Hero-Banner",
      Title: title,
      ContentID: ID,
    });
  }

  private viewsCount() {
    try {
      sp.web.lists.getByTitle(ViewsCountMasterlist).items.filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get().then((items) => {
        views = items.length || 0;
      });
    }
    catch (error) {
      console.error("An error occurred while fetching the viewsCount:", error);
    }
  }

  private checkUserAlreadyLiked() {
    try {
      sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => {
        if (items.length > 0) {
          // $(".like-selected").show();
          // $(".like-default").hide();

          document.querySelectorAll('.like-selected').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });
          document.querySelectorAll('.like-default').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });

          this.setState({ IsUserAlreadyLiked: true });
        }
      });
    } catch (error) {
      console.error("An error occurred while checking if the user already liked:", error);
    }
  }

  private checkUserAlreadyCommented() {
    try {
      sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => {
        if (items.length > 0) {
          this.setState({ IsUserAlreadyCommented: true });
          // $(".reply-tothe-post").hide();
          document.querySelectorAll('.reply-tothe-post').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });

        }
      });
    } catch (error) {
      console.error("An error occurred while checking if the user already commented:", error);
    }

  }

  private likesCount() {
    try {
      sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get().then((items) => {
        likes = items.length || 0;
      });
    }
    catch (error) {
      console.error("An error occurred while checking if the user already liked:", error);
    }
  }

  private commentsCount() {
    try {
      sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get().then((items) => {
        commentscount = items.length || 0;
      });
      this.checkUserAlreadyCommented();
      this.getUserComments();
    }
    catch (error) {
      console.error("An error occurred while checking the comments count:", error);
    }
  }

  private async getUserComments() {
    try {
      const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items
        .select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments")
        .expand("EmployeeName").filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get();
      this.setState({ commentitems: items });
    } catch (error) {
      console.error("An error occurred while checking if the user already commented:", error);
    }
  }

  private async liked(mode: string) {
    try {
      // Ensure required variables are defined
      if (!ID || !User || !UserEmail) {
        console.warn("ID, User, or UserEmail is undefined. Cannot proceed with the like operation.");
        return;
      }
      if (mode === "like") {
        // Add a like to the list
        await sp.web.lists.getByTitle(LikesCountMasterlist).items.add({
          EmployeeNameId: User,
          LikedOn: CurrentDate,
          EmployeeEmail: UserEmail,
          ContentPage: "Hero-Banner",
          Title: title,
          ContentID: ID,
        });
        // Hide the default like button and show the selected one
        document.querySelectorAll('.like-default').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('.like-selected').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        // Get the updated like count
        const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items
          .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get();
        // Update the likes count display
        const likesCountElement = document.getElementById('likescount');
        if (likesCountElement) {
          likesCountElement.textContent = items.length.toString();
        }
      } else {
        // If mode is "unlike"
        document.querySelectorAll('.like-default').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('.like-selected').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        // Find the user's like entry and delete it
        const data = await sp.web.lists.getByTitle(LikesCountMasterlist).items
          .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get();
        if (data.length > 0) {
          await sp.web.lists.getByTitle(LikesCountMasterlist).items.getById(data[0].Id).delete();
        }
        // Get the updated like count after removing the like
        const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items
          .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get();
        // Update the likes count display
        const likesCountElement = document.getElementById('likescount');
        if (likesCountElement) {
          likesCountElement.textContent = items.length.toString();
        }
      }
    } catch (error) {
      console.error("An error occurred while processing the like/unlike action:", error);
    }
  }


  // private async liked(mode: string) {
  //   if (mode === "like") {
  //     await sp.web.lists.getByTitle(LikesCountMasterlist).items.add({
  //       EmployeeNameId: User,
  //       LikedOn: CurrentDate,
  //       EmployeeEmail: UserEmail,
  //       ContentPage: "Hero-Banner",
  //       Title: title,
  //       ContentID: ID,
  //     });
  //     document.querySelectorAll('.like-default').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });
  //     document.querySelectorAll('.like-selected').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //     const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items
  //       .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get();
  //     // $("#likescount").text(items.length.toString());
  //     const likesCountElement = document.getElementById('likescount');
  //     if (likesCountElement) {
  //       likesCountElement.textContent = items.length.toString();
  //     }
  //   } else {
  //     document.querySelectorAll('.like-default').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //     document.querySelectorAll('.like-selected').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });
  //     const data = await sp.web.lists.getByTitle(LikesCountMasterlist).items
  //       .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get();
  //     await sp.web.lists.getByTitle(LikesCountMasterlist).items.getById(data[0].Id).delete();
  //     const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items
  //       .filter(`ContentPage eq 'Hero-Banner' and ContentID eq ${ID}`).top(5000).get();
  //     // $("#likescount").text(items.length.toString());
  //     // Select the element with the ID "likescount"
  //     const likesCountElement = document.getElementById('likescount');
  //     if (likesCountElement) {
  //       likesCountElement.textContent = items.length.toString();
  //     }
  //   }
  // }

  private showComments() {
    // $(".all-commets").toggle();

    document.querySelectorAll('.all-comments').forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.display = htmlElement.style.display === 'none' ? 'block' : 'none';
    });
    this.getUserComments();
  }
  private saveComments(e: any) {
    try {
      // Get the value of the comments from the event target
      const comments = e.target.value;
      // Check if the comments have at least 1 character
      if (!comments || comments.toString().trim().length === 0) {
        Swal.fire({ title: "Minimum 1 character is required!", icon: "warning" });
      } else {
        // Ensure required variables are defined
        if (!User || !UserEmail || !ID || !title) {
          console.warn("User, UserEmail, ID, or title is missing. Cannot proceed with saving the comment.");
          return;
        }

        // Add the comment to the SharePoint list
        sp.web.lists.getByTitle(CommentsCountMasterlist).items.add({
          EmployeeNameId: User,
          CommentedOn: CurrentDate,
          EmployeeEmail: UserEmail,
          ContentPage: "Hero-Banner",
          Title: title,
          ContentID: ID,
          UserComments: comments,
        }).then(() => {
          // Hide the commented post and reply elements
          document.querySelectorAll('#commentedpost').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });

          document.querySelectorAll('.reply-tothe-post').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });

          // Update the comment count
          this.commentsCount();
        }).catch((error) => {
          console.error("An error occurred while saving the comment:", error);
          Swal.fire({ title: "Error saving comment", text: "Please try again later.", icon: "error" });
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({ title: "Unexpected Error", text: "Something went wrong. Please try again later.", icon: "error" });
    }
  }


  // private saveComments(e: any) {
  //   // const comments = $("#comments").val();
  //   const comments = e.target.value

  //   if (comments && comments.toString().length === 0) {
  //     Swal.fire({ title: "Minimum 1 character is required!", icon: "warning" });
  //   } else {
  //     sp.web.lists.getByTitle(CommentsCountMasterlist).items.add({
  //       EmployeeNameId: User,
  //       CommentedOn: CurrentDate,
  //       EmployeeEmail: UserEmail,
  //       ContentPage: "Hero-Banner",
  //       Title: title,
  //       ContentID: ID,
  //       UserComments: comments,
  //     }).then(() => {
  //       // $("#commentedpost").hide();
  //       // $(".reply-tothe-post").hide();

  //       document.querySelectorAll('#commentedpost').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });

  //       document.querySelectorAll('.reply-tothe-post').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });

  //       this.commentsCount();
  //     });
  //   }
  // }

  public render(): React.ReactElement<IHeroBannerReadMoreProps> {
    const HeroBannerDetails: JSX.Element[] = this.state.Items.map((item, key) => {
      const RawImageTxt = item.Image;
      const RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      const isToday = RawPublishedDt === moment().format("DD/MM/YYYY");
      const Dte = isToday ? "Today" : moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");

      let serverRelativeUrl = `${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`;
      if (RawImageTxt && RawImageTxt !== null) {
        const ImgObj = JSON.parse(RawImageTxt);
        serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${ImgObj.fileName}`;
      }

      return (
        <div key={key} className="col-md-12 view-all-news-l-col home-detail-banner">
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            <h2 className="nw-list-main">{item.Title}</h2>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href="#" className="tags" data-interception="off">{Dte}</a>
              </div>
            </div>
            <div className="mews-details-para">
              <p><Markup content={item.Description} /></p>
            </div>
          </div>
        </div>
      );
    });


    const pagecomments = this.state.commentitems.map((item, key) => {
      const EmpName = item.EmployeeName.Title;
      const dated = moment(item.CommentedOn).format("DD/MM/YYYY");
      const comment = item.UserComments;
      return (
        <li key={key}>
          <div className="commentor-desc clearfix">
            <div className="commentor-image">
              <img src={`${this.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
            </div>
            <div className="commentor-details-desc">
              <h3>  {EmpName} </h3> <span>  {dated}  </span>
              <p>  {comment} </p>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className={styles.remoHomePage} id="heroBannerRm" >
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Hero Banner </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/Hero-Banner-VMore.aspx`} data-interception="off"> Hero Banner View More </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off">Hero Banner Read More</a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    {HeroBannerDetails}
                  </div>
                  <div>
                    <div className="comments-like-view">
                      <div className="comments-like-view-block">
                        <ul className="comments-like-view-block">
                          {this.state.IsLikeEnabled &&
                            <li>
                              <img className="like-selected" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like_selected.svg`} alt="image" onClick={() => this.liked("dislike")} />
                              <img className="like-default" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like.svg`} alt="image" onClick={() => this.liked("like")} />
                              <span id="likescount"> {likes} </span>
                            </li>
                          }
                          {this.state.IsCommentEnabled &&
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
                          {pagecomments.length !== 0 ? pagecomments : <p>No comments yet....!</p>}
                        </ul>
                      </div>
                      {!this.state.IsUserAlreadyCommented &&
                        <div className="reply-tothe-post" id="commentedpost">
                          <h2> Comment to this post </h2>
                          <textarea id="comments" placeholder="Message Here" style={{ resize: "none" }} className="form-control"></textarea>
                          <input type="button" className="btn btn-primary" value="Submit" onClick={(e) => this.saveComments(e)} />
                        </div>
                      }
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
