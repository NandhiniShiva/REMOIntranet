import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IManageQuickLinksProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';

let QuickLinkslist = listNames.QuickLinks;
let UsersQuickLinkslist = listNames.UsersQuickLinks;
let Designation: string, Department: string;

export interface IQuickLinkManagerState {
  items: any[];
  ExistingQuickLinksCount: any;
  BgBanner: any[];
  MyQuickLinksPrefference: any[];
  ExistingQL: any[];
  MyQLinksArray: any[];
  AvailableSpaceCount: number;
  IsEditModeisON: boolean;
  CurrentlyOpened: string;
  IsMyQuickLinksEmpty: boolean;
}

let ExistingQlinks: string | any[] = [];
var tempFavHolderArr: any[] = [];

export default class NewQuickLinkManager extends React.Component<IManageQuickLinksProps, IQuickLinkManagerState, {}> {
  public constructor(props: IManageQuickLinksProps) {
    super(props);
    this.state = {
      items: [],
      ExistingQuickLinksCount: 0,
      BgBanner: [],
      MyQuickLinksPrefference: [],
      ExistingQL: [],
      MyQLinksArray: [],
      AvailableSpaceCount: 5,
      IsEditModeisON: false,
      CurrentlyOpened: "",
      IsMyQuickLinksEmpty: true
    };

  }

  public componentDidMount() {
    setTimeout(function () {
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');

      // Show the element with ID "ceoMessageReadMore"

      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
      // Hide all div elements with the attribute data-automation-id="pageHeader"
      const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeaders.forEach((element: any) => {
        element.style.setProperty('display', 'none', 'important');
      });

      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }
    }, 1000);
    this.getCurrentUser().then(() => {
      this.getcurrentusersQuickLinksForEdit();
      this.GetAllQuickLinks();
    }).then(() => {
      this.LandingPageAnalytics();
    })




  }

  // public async GetAllQuickLinks() {
  //   var reactHandler = this;
  //   var AllID = "";
  //   for (var i = 0; i < ExistingQlinks.length; i++) {
  //     if (ExistingQlinks.length != 0) {
  //       let LastIndex = ExistingQlinks.length - 1;
  //       if (i == LastIndex) {
  //         AllID += "Id ne " + ExistingQlinks[i].ItemId + "";
  //       } else {
  //         AllID += "Id ne " + ExistingQlinks[i].ItemId + " and ";
  //       }
  //     }
  //   }
  //   if (ExistingQlinks.length != 0) {
  //     await sp.web.lists.getByTitle(QuickLinkslist).items.select("Title", "ID", "URL", "Image", "ImageHover", "*").filter(`IsActive eq '1' and ${AllID}`).orderBy("Order0", true).get().then((items) => {
  //       reactHandler.setState({
  //         items: items
  //       });
  //     });
  //   } else {
  //     await sp.web.lists.getByTitle(QuickLinkslist).items.select("Title", "ID", "URL", "Image", "ImageHover", "*").filter(`IsActive eq '1'`).orderBy("Order0", true).get().then((items) => {
  //       reactHandler.setState({
  //         items: items
  //       });
  //     });
  //   }
  // }

  // Optimized code

  public async GetAllQuickLinks() {
    try {
      // Build the filter string based on ExistingQlinks

      const filterString = Array.isArray(ExistingQlinks) && ExistingQlinks.length > 0
        ? `IsActive eq '1' and ${ExistingQlinks.map((link: any) => `Id ne ${link.ItemId}`).join(' and ')}`
        : `IsActive eq '1'`;
      // Fetch the items based on the filter
      const items = await sp.web.lists.getByTitle(QuickLinkslist)
        .items
        .select("Title", "ID", "URL", "Image", "ImageHover", "*")
        .filter(filterString)
        .orderBy("Order0", true)
        .get();

      // Update state with the fetched items
      this.setState({ items });
    } catch (error) {
      console.error('Error fetching quick links:', error);
    }
  }

  // public async getcurrentusersQuickLinksForEdit() {
  //   var reactHandler = this;
  //   let UserID = this.props.userid;
  //   ExistingQlinks = [];

  //   await sp.web.lists.getByTitle(UsersQuickLinkslist).items.select("ID", "SelectedQuickLinks/Id", "SelectedQuickLinks/Title", "URL", "Order0", "ImageSrc", "HoverImageSrc").filter(`Author/Id eq '${UserID}'`).expand("SelectedQuickLinks").orderBy("Order0", true).get().then(async (items) => {
  //     reactHandler.setState({
  //       MyQuickLinksPrefference: items
  //     });
  //     if (this.state.IsEditModeisON == true) {
  //       setTimeout(() => {
  //         // $(".delete-quicklinks").addClass("open");

  //         let allCommentsElements: any = document.querySelectorAll(".delete-quicklinks");
  //         allCommentsElements.forEach((element: { add: (arg0: string) => void; }) => {
  //           element.add("open");
  //         });

  //       }, 1500);
  //     }
  //     if (items.length != 0) {
  //       this.setState({
  //         IsMyQuickLinksEmpty: false
  //       });
  //     } else {
  //       this.setState({
  //         IsMyQuickLinksEmpty: true
  //       });
  //     }

  //     this.setState({ MyQLinksArray: items });

  //     // Remove quick links that match the condition
  //     let activeQuickLinks = await sp.web.lists.getByTitle(QuickLinkslist).items.select("ID").filter("IsActive eq '1'").get();
  //     const activeQuickLinkIds = new Set(activeQuickLinks.map((link) => link.Id));
  //     let updatedMyQLinksArray = items.filter((item) => activeQuickLinkIds.has(item.SelectedQuickLinks.Id));

  //     // Update the state with the filtered quick links
  //     this.setState({ MyQLinksArray: updatedMyQLinksArray });

  //     for (var i = 0; i < updatedMyQLinksArray.length; i++) {
  //       tempFavHolderArr.push(updatedMyQLinksArray[i].SelectedQuickLinks.Id);
  //     }

  //     let QlinkCount = ExistingQlinks.length;
  //     reactHandler.setState({ AvailableSpaceCount: 5 - QlinkCount });
  //     reactHandler.GetAllQuickLinks();
  //   });
  // }

  // Optimized code

  public async getcurrentusersQuickLinksForEdit() {
    try {
      const { userid } = this.props;
      ExistingQlinks = [];

      const items = await sp.web.lists.getByTitle(UsersQuickLinkslist)
        .items.select("ID", "SelectedQuickLinks/Id", "SelectedQuickLinks/Title", "URL", "Order0", "ImageSrc", "HoverImageSrc")
        .filter(`Author/Id eq '${userid}'`)
        .expand("SelectedQuickLinks")
        .orderBy("Order0", true)
        .get();

      this.setState({
        MyQuickLinksPrefference: items,
        IsMyQuickLinksEmpty: items.length === 0,
        MyQLinksArray: items
      });

      if (this.state.IsEditModeisON) {
        setTimeout(() => {
          document.querySelectorAll(".delete-quicklinks").forEach(element => {
            element.classList.add("open");
          });
        }, 1500);
      }

      const activeQuickLinks = await sp.web.lists.getByTitle(QuickLinkslist)
        .items.select("ID")
        .filter("IsActive eq '1'")
        .get();

      const activeQuickLinkIds = new Set(activeQuickLinks.map(link => link.Id));
      const updatedMyQLinksArray = items.filter(item => activeQuickLinkIds.has(item.SelectedQuickLinks.Id));

      this.setState({ MyQLinksArray: updatedMyQLinksArray });

      tempFavHolderArr = updatedMyQLinksArray.map(link => link.SelectedQuickLinks.Id);

      this.setState({
        AvailableSpaceCount: 5 - ExistingQlinks.length
      });

      this.GetAllQuickLinks();
    } catch (error) {
      console.error("Error in getting current user's quick links for edit:", error);
    }
  }

  public async getCurrentUser() {
    try {
      const profile = await sp.profiles.myProperties.get();
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
      console.error("An error occurred while fetching the user profile:", error);
    }
  }

  public async LandingPageAnalytics() {
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

  public EnableEditMode(CurrentTab: string) {
    this.setState({
      IsEditModeisON: true
    });
    this.ShowDeletedBtn();
    this.ShowAddBtn();
  }

  public ExitEditMode(CurrentTab: string) {
    this.setState({
      IsEditModeisON: false
    });

    this.HideDeletedBtn();
    this.HideAddBtn();
  }

  public ShowDeletedBtn() {
    // $(".delete-quicklinks").addClass("open");

    let allCommentsElements: any = document.querySelectorAll(".delete-quicklinks");
    allCommentsElements.forEach((element: { add: (arg0: string) => void; }) => {
      element.add("open");
    });

  }

  public HideDeletedBtn() {
    // $(".delete-quicklinks").removeClass("open");

    let allCommentsElements: any = document.querySelectorAll(".delete-quicklinks");
    allCommentsElements.forEach((element: { add: (arg0: string) => void; }) => {
      element.add("open");
    });

  }

  public ShowAddBtn() {
    // $(".add-quicklinks").addClass("open");

    let allCommentsElements: any = document.querySelectorAll(".add-quicklinks");
    allCommentsElements.forEach((element: { add: (arg0: string) => void; }) => {
      element.add("open");
    });

  }

  public HideAddBtn() {
    // $(".add-quicklinks").removeClass("open");

    let allCommentsElements: any = document.querySelectorAll(".add-quicklinks");
    allCommentsElements.forEach((element: { remove: (arg0: string) => void; }) => {
      element.remove("open");
    });
  }

  public async AddToMyQuickLinkPreference(ItemID: any, ImageSrc: any, HoverImageSrc: any, URL: any, index: number) {
    try {
      sp.web.lists.getByTitle(UsersQuickLinkslist).items.filter(`Author/Id eq ${this.props.userid}`).get().then(async (resp) => {
        if (resp.length < 5) {
          if (tempFavHolderArr.indexOf(ItemID) === -1) {
            this.setState({ MyQLinksArray: [] });
            this.getcurrentusersQuickLinksForEdit();
          } else {
            // $("#bt-qlink-adder").prop("disabled", false);

            const buttonElement: any = document.getElementById('bt-qlink-adder');
            // Set the "disabled" property to false
            if (buttonElement) {
              buttonElement.disabled = false;
            }
            Swal.fire({
              title: "Aleady exist",
              icon: "warning",
              showConfirmButton: false,
              // timer: 1500,
            });
          }
        } else {
          // $("#bt-qlink-adder").prop("disabled", false);

          const buttonElement: any = document.getElementById('bt-qlink-adder');
          // Set the "disabled" property to false
          if (buttonElement) {
            buttonElement.disabled = false;
          }
          Swal.fire({
            title: "No space, only 5 links can be added!",
            icon: "warning",
            showConfirmButton: false,
            // timer: 1500,
          } as any);
        }
      });
    } catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
  }

  public DeleteMyQuickLink(ID: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    } as any)
      .then((willDelete) => {
        if (willDelete) {
          let list = sp.web.lists.getByTitle(UsersQuickLinkslist);
          list.items.getById(ID).delete().then(() => {
            Swal.fire({
              title: "Deleted Successfully",
              icon: "success",
              showConfirmButton: false,
              // timer: 1500,
            } as any).then(() => {
              tempFavHolderArr = [];
              this.getcurrentusersQuickLinksForEdit();
            });
          });
        }
      });
  }

  public render(): React.ReactElement<IManageQuickLinksProps> {
    var reactHandler = this;

    const MyQuickLinks: JSX.Element[] = reactHandler.state.MyQLinksArray.map(function (item, key) {
      const { Id, URL, HoverImageSrc, SelectedQuickLinks: { Title } } = item;

      const handleDeleteQuickLink = () => {
        reactHandler.DeleteMyQuickLink(Id);
      };

      return (
        <li className='qlink-with-index' key={key} data-value={`${key + 1}|${Id}`}>
          <span className="indexers" style={{ display: "none" }} data-value={`${key + 1}|${Id}`}>{key + 1}</span>
          <a href={URL} data-interception="off" target="_blank">
            <img src={HoverImageSrc} alt="image" />
            <h5>{Title}</h5>
          </a>
          <div className="delete-quicklinks" onClick={handleDeleteQuickLink}>
            <img src={`${reactHandler.props.siteurl}/SiteAssets/img/remove_q.svg`} alt="image" />
          </div>
        </li>
      );
    });

    const AllQuickLinks: JSX.Element[] = reactHandler.state.items.map(function (item, key) {
      const { Image: RawImageTxt, ImageHover: RawImageHoverTxt, Title, URL } = item;

      if (!RawImageTxt) return null;

      const ImgObj = JSON.parse(RawImageTxt);
      const ImgObjHover = JSON.parse(RawImageHoverTxt);

      const serverRelativeUrl = ImgObj.serverRelativeUrl || `${reactHandler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/${item.ID}/${ImgObj.fileName}`;
      const hoverServerRelativeUrl = ImgObjHover.serverRelativeUrl || `${reactHandler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/${item.ID}/${ImgObjHover.fileName}`;

      const isQuickLinkAdded = reactHandler.state.MyQLinksArray.some(link => link.SelectedQuickLinks.Id === item.ID);

      const handleAddQuickLink = () => {
        reactHandler.AddToMyQuickLinkPreference(item.ID, serverRelativeUrl, hoverServerRelativeUrl, URL.Url, key + 1);
      };

      return (
        <li key={key}>
          <a href={URL.Url} data-interception="off">
            <img src={serverRelativeUrl} alt="image" />
            <h5>{Title}</h5>
          </a>
          {!isQuickLinkAdded && (
            <div className="add-quicklinks" id={item.ID}>
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/add_quick.png`} alt="image" onClick={handleAddQuickLink} />
            </div>
          )}
        </li>
      );
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className={styles.remoHomePage} id="quickLinkManager">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={reactHandler.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>

        <section>
          <div className="relative container">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Manage Quick Links </h1>
                  <ul className="breadcums">
                    <li> <a href={`${reactHandler.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li> <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Manage Quick Links </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div className="added-quickis-part">
                    <div className="heading clearfix"><div className="header-left">Added Quicklinks</div>
                      <div className="dragnddrop_text" >
                        <img src={`${reactHandler.props.siteurl}/SiteAssets/img/drap_drop.png`} alt="image" data-themekey="#" />
                        You can drag and drop to change position
                      </div>
                      <div className="header-right drap-drop-p">
                        {this.state.IsEditModeisON == false ?
                          <a href="#" className='editor-mode-enabler mode-edit-on' onClick={() => this.EnableEditMode(this.state.CurrentlyOpened)} >
                            <img src={`${this.props.siteurl}/SiteAssets/img/add_quick.png`} alt="image" data-themekey="#" />
                            Edit Mode</a>
                          :
                          <a href="#" className='editor-mode-enabler mode-edit-off' onClick={() => this.ExitEditMode(this.state.CurrentlyOpened)}>
                            <img src={`${this.props.siteurl}/SiteAssets/img/newdrap_drop.png`} alt="image" data-themekey="#" />
                            Exit</a>
                        }
                      </div>
                    </div>
                    <div className="section-part">
                      <ul className="qq-links-part clearfix my-qlink-block" id="quicklink-tab-area">
                        {this.state.IsMyQuickLinksEmpty == false ?
                          MyQuickLinks
                          :
                          <div className='no-fav-records if-favtab-empty if-tab-empty'>
                            <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/error-icon.svg`} alt="no-fav" />
                            <h3> No Quicklinks Added </h3>
                            <p> In Aswaq you mark as quicklinks are shown here </p>
                          </div>
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="whole-quickis-part">
                    <div className="heading clearfix">
                      <div className="header-left">
                        Quicklinks <span> {this.state.AvailableSpaceCount == 0 ? "Delete any quick link to add new" : `Select any ${this.state.AvailableSpaceCount} links to show in the Home page`} </span>
                      </div>
                    </div>
                    <div className="section-part">
                      <ul className="qq-links-part clearfix">
                        {AllQuickLinks}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}


