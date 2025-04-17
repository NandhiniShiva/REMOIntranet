import * as React from 'react';
import { IBirthdayRmProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import { sp } from '@pnp/sp';
import Swal from 'sweetalert2';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService'
import Footer from '../../remoHomePage/components/Footer/Footer';
import { AddViews } from './ServiceProvider/AddViews';
import { CheckUserAlreadyCommented } from './ServiceProvider/CheckUserAlreadyCommented';
import { CheckUserAlreadyLiked } from './ServiceProvider/CheckUserAlreadyLiked';
import { CommentsCount } from './ServiceProvider/CommentsCount';
// import { LikesCount } from './ServiceProvider/LikesCount';
// import { ViewsCount } from './ServiceProvider/viewsCount';

var User = "";
var UserEmail = "";
var title = "";
var ID: number;
var likes: number;
var commentscount: number;
var views: number;
var CurrentDate = new Date()  //moment().format("DD/MM/YYYY");
var ItemID: string;
var bdaydate: any;
let ViewsCountMasterlist = listNames.ViewsCountMaster;
let Birthdaylist = listNames.Birthday;
let LikesCountMasterlist = listNames.LikesCountMaster;
let CommentsCountMasterlist = listNames.CommentsCountMaster;

export interface IBirthdayState {
  Items: any[];
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
  Title: string;
}
export default class BirthdayRm extends React.Component<IBirthdayRmProps, IBirthdayState, {}> {
  public constructor(props: IBirthdayRmProps) {
    super(props);
    this.state = {
      Items: [],
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false,
      Title: "",
    };
  }
  public componentDidMount() {

    setTimeout(function () {
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
      const ceoMessageReadMore = document.getElementById('ceoMessageReadMore');
      if (ceoMessageReadMore) {
        ceoMessageReadMore.style.display = 'block';
      }
      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
    }, 2000);
    var reactHandler = this;
    const url: any = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");
    const userDetails = new CurrentUserDetails();
    userDetails.getCurrentUserDetails().then((data) => {
      console.log("Current user details", data);
      console.log("data details", data?.Department, data?.Designation);

      // this.LandingPageAnalytics(data?.Department, data?.Designation);
      reactHandler.GetBirthday(ItemID, data?.Department, data?.Designation);
    }).catch((error) => {
      console.error("Error fetching current user details:", error);
    });
  }


  public async LandingPageAnalytics(Department: any, Designation: any) {
    try {
      if (!Department) {
        Department = "NA";
      }
      if (!Designation) {
        Designation = "NA";
      }
      console.log(this.state.Title);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  public viewsCount() {
    try {
      sp.web.lists.getByTitle(ViewsCountMasterlist).items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending      
        if (items.length != 0) {
          views = items.length;
        } else {
          views = 0;
        }
      });
    }
    catch (error) {
      console.error('Error adding data:', error);
    }
  }
  //brithday code <
  public async GetBirthday(ItemID: string, Department: any, Designation: any) {
    var reactHandler = this;
    try {
      const items = await sp.web.lists.getByTitle(Birthdaylist).items
        .select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "EnableComments", "EnableLikes", "Created")
        .filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll();  // orderby is false -> descending

      // Check if the returned items array is valid and contains data
      if (!items || items.length === 0) {
        throw new Error("No active birthday items found for the provided ItemID.");
      }

      const firstItem = items[0];
      title = firstItem.Title;
      ID = firstItem.ID;

      var tdaydate = moment().format('MM/DD');
      var bday = moment(firstItem.DOB).format('MM/DD');

      // let bdaydate;
      if (tdaydate === bday) {
        bdaydate = "Today";
      } else {
        bdaydate = moment(firstItem.DOB).format('MMM DD');
      }

      // Update state with the fetched items and title
      reactHandler.setState({
        Items: items,
        Title: firstItem.Title
      }, () => {
        reactHandler.LandingPageAnalytics(Department, Designation);  // Call after state is updated
      });

      // Handle likes and comments
      if (firstItem.EnableLikes === true) {
        reactHandler.setState({ IsLikeEnabled: true });
      }

      if (firstItem.EnableComments === true) {
        reactHandler.setState({ IsCommentEnabled: true });
      } else {
        // Remove comment elements if comments are not enabled
        const allCommentsElements = document.querySelectorAll(".all-comments");
        allCommentsElements.forEach(element => {
          element.remove();
        });

        const commentedPostElement = document.getElementById("commentedpost");
        if (commentedPostElement) {
          commentedPostElement.remove();
        }
      }

      // Execute additional functionality
      reactHandler.checkUserAlreadyLiked();
      reactHandler.checkUserAlreadyCommented();
      reactHandler.viewsCount();
      reactHandler.likesCount();
      reactHandler.commentsCount();


      // const viewsCount = new ViewsCount();
      // viewsCount.viewsCount(ID).then((data) => {
      //   console.log("Current user details", data);
      // });

      // const likesCount = new LikesCount();
      // likesCount.likesCount(ID).then((likeData) => {
      //   console.log("Current user details", likeData);
      // });

      const commentsCount = new CommentsCount();
      commentsCount.commentsCount(ID).then((commentData) => {
        console.log("commentData", commentData);
        this.checkUserAlreadyCommented();
        this.getusercomments();
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
            // console.log("User already liked this item:", result);
          } else {
            // If no like records were found
            // console.log("No likes found for the user.");
            this.setState({ IsUserAlreadyLiked: false });
          }
        })
        .catch((error) => {
          console.error("Error while checking user likes:", error);
        });

      const addView = new AddViews();
      addView.addViews(User, UserEmail, ID, this.state.Title)
        .then(() => {
          // console.log("View logged successfully.");
        })
        .catch((error) => {
          // console.error("Failed to add view:", error);
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


    } catch (error) {
      // Log the error or handle it in the UI as appropriate
      console.error("Error fetching birthday details:", error);
    }
  }
  public async checkUserAlreadyLiked() {
    try {
      const items = await sp.web.lists.getByTitle(LikesCountMasterlist).items
        .filter(`ContentPage eq 'Birthday' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`)
        .top(5000)
        .get();
      if (items.length !== 0) {
        // Show the "liked" UI state
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
    } catch (error) {
      console.error("Error checking if user has already liked the content:", error);
    }
  }

  public async checkUserAlreadyCommented() {
    try {
      await sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Birthday' and ContentID eq '${ID}' and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
        if (items.length != 0) {
          this.setState({
            IsUserAlreadyCommented: true
          });
          document.querySelectorAll('.reply-tothe-post').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
        }
      });
    }
    catch (error) {
      console.error("Error checking if user has already commented the content:", error);
    }
  }
  public likesCount() {
    try {
      sp.web.lists.getByTitle(LikesCountMasterlist).items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
        if (items.length != 0) {
          likes = items.length;
        } else {
          likes = 0;
        }
      });
    }
    catch (error) {
      console.error("Error checking if user has already liked the content:", error);
    }

  }
  public commentsCount() {
    try {
      sp.web.lists.getByTitle(CommentsCountMasterlist).items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
        if (items.length != 0) {
          commentscount = items.length;
        } else {
          commentscount = 0;
        }
      });
      this.checkUserAlreadyCommented();
      this.getusercomments();
    }
    catch (error) {
      console.error("Error checking the commentcount:", error);
    }
  }
  public getusercomments() {
    try {
      sp.web.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           
        this.setState({
          commentitems: items,
        });
      });
    }
    catch (error) {
      console.error("Error checking the comment:", error);
    }
  }

  public async liked(mode: string) {
    try {
      const isLikeMode = mode === "like";

      if (isLikeMode) {
        // Add a new like entry
        await sp.web.lists.getByTitle(LikesCountMasterlist).items.add({
          EmployeeNameId: User,
          LikedOn: CurrentDate,
          EmployeeEmail: UserEmail,
          ContentPage: "Birthday",
          Title: title,
          ContentID: ID,
        });

      } else {
        // Fetch the existing like entry for the user and content
        const data = await sp.web.lists.getByTitle(LikesCountMasterlist)
          .items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`)
          .get();

        // If an entry is found, delete it
        if (data.length > 0) {
          await sp.web.lists.getByTitle(LikesCountMasterlist).items.getById(data[0].Id).delete();
        }
      }

      // Toggle the display based on the like mode
      document.querySelectorAll<HTMLElement>('.like-selected').forEach(element => {
        element.style.display = isLikeMode ? 'block' : 'none';
      });

      document.querySelectorAll<HTMLElement>('.like-default').forEach(element => {
        element.style.display = isLikeMode ? 'none' : 'block';
      });

      // Fetch the updated like count and update the display
      const items = await sp.web.lists.getByTitle(LikesCountMasterlist)
        .items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`)
        .top(5000)
        .get();

      const likesElement = document.getElementById("likescount");
      if (likesElement) {
        likesElement.textContent = items.length.toString();
      } else {
        // console.error("Element with ID 'likescount' not found.");
      }

    } catch (error) {
      console.error("Error in liked function:", error);
    }
  }

  public showComments() {
    // $(".all-commets").toggle();
    try {
      document.querySelectorAll('.all-comments').forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.display = htmlElement.style.display === 'none' ? 'block' : 'none';
      });
      sp.web.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments", "*").expand("EmployeeName").filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           
        this.setState({
          commentitems: items,
        });
      });
    }
    catch (error) {
      console.error("Error showing the Comments:", error);
    }
  }
  public saveComments(e: any) {
    // var comments = $("#comments").val();
    var comments = e.target.value;
    if (comments && comments.toString().length == 0) {
      Swal.fire({
        title: "Minimum 1 character is required!",
        icon: "warning",
      } as any)
    } else {

    }
  }
  public readMoreHandler(compName: any) {
    this.props.onReadMoreClick({ Name: compName })
  }

  public render(): React.ReactElement<IBirthdayRmProps> {
    var handler = this;
    const Birthday: JSX.Element[] = this.state.Items.map(function (item) {

      let RawImageTxt = item.Picture;
      var serverRelativeUrl;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        if (ImgObj.serverRelativeUrl == undefined) {
          serverRelativeUrl = `${handler.props.siteurl}/Lists/${Birthdaylist}/Attachments/` + item.ID + "/" + ImgObj.fileName
        } else {
          serverRelativeUrl = ImgObj.serverRelativeUrl
        }
        return (
          <>
            <div className="people-highlights">
              <img src={`${serverRelativeUrl}`} alt="image" className="people-img" />
              <img src={require("./ServiceProvider/Assets/Img/highlight.svg")} alt="image" className="highlight-img" />
            </div>
            <div className="row home-detail-banner people-detail">
              <div className="col-md-12">
                <div className="ceo-readmore-wrap clearfix">
                  <div className="ceo-radmore-right">
                    <h2 className="nw-list-main birthday"> {item.Name} </h2>
                    <p>{item.Designation}</p>
                  </div>
                  <div className="mews-details-para">
                    <p>{item.Description}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="people-highlights">
              <img src={require("./ServiceProvider/Assets/Img/userphoto.jpg")} alt="image" className="people-img" />

              <img src={require("./ServiceProvider/Assets/Img/highlight.svg")} alt="image" className="highlight-img" />
            </div>
            <div className="row home-detail-banner people-detail">
              <div className="col-md-12">
                <div className="ceo-readmore-wrap clearfix">
                  <div className="ceo-radmore-right">
                    <h2 className="nw-list-main birthday"> {item.Name} </h2>
                    <p>{item.Designation}</p>
                  </div>
                  <div className="mews-details-para">
                    <p>{item.Description}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }
    });

    const pagecomments: JSX.Element[] = this.state.commentitems.map((item, key) => {
      const EmpName = item.EmployeeName.Title;
      const dated = moment(item.CommentedOn).format("DD/MM/YYYY");
      const comment = item.UserComments;
      const imageUrl = require("./ServiceProvider/Assets/Img/userphoto.jpg");

      return (
        <li key={key}>
          <div className="commentor-desc clearfix">
            <div className="commentor-image">
              <img src={imageUrl} alt="image" />
            </div>
            <div className="commentor-details-desc">
              <h3>{EmpName}</h3>
              <span>{dated}</span>
              <p>{comment}</p>
            </div>
          </div>
        </li>
      );
    });

    return (<>
      <div id="Birthday">
        <div id="Global-Top-Header-Navigation">
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="inner-banner-header email-banner relative m-b-20">
                    <div className="inner-banner-contents banner-contents">
                      <h1> Celebrating his birthday on {bdaydate}</h1>
                      <ul className="breadcums mail-breadcums">
                        <li>  <a href='#' onClick={() => this.readMoreHandler("Home")}> Home </a> </li>
                        <li style={{ pointerEvents: "none" }}>  <a href="#">Birthday Read More </a> </li>
                      </ul>
                    </div>
                  </div>
                  {Birthday}
                  <div>
                    <div className="comments-like-view">
                      <div className="comments-like-view-block">
                        <ul className="comments-like-view-block">
                          {this.state.IsLikeEnabled == true ?
                            <li>
                              <img className="like-selected" src={require("./ServiceProvider/Assets/Img/lcv_like_selected.svg")} alt="image" onClick={() => this.liked("dislike")} />
                              <img className="like-default" src={require("./ServiceProvider/Assets/Img/lcv_like.svg")} alt="image" onClick={() => this.liked("like")} />
                              <span id="likescount"> {likes} </span>
                            </li>
                            : <></>
                          }
                          {this.state.IsCommentEnabled == true &&
                            <li>
                              <img src={require("./ServiceProvider/Assets/Img/lcv_comment.svg")} alt="image" onClick={() => this.showComments()} /> <span id="commentscount"> {commentscount} </span>
                            </li>
                          }
                          <li>
                            <img className="nopointer" src={require("./ServiceProvider/Assets/Img/bannerremoproduct.jpg")} alt="image" /> <span> {views} </span>
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
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} onReadMoreClick={null} id={null} selectedComponents={undefined} />
            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    </>
    );
  }
}
