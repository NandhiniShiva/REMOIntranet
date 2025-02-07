import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as $ from 'jquery';
import GlobalSideNav from '../components/Header/GlobalSideNav';
import RemoResponsive from '../components/Header/RemoResponsive';
import RemoHeroBanner from './RemoHeroBanner';
import RemoCEOMessage from './RemoCEOMessage';
import RemoNavigations from './RemoNavigations';
import RemoMyMeetings from './RemoMyMeetings';
import RemoNews from './RemoNews';
import RemoLatestEventsandAnnouncements from './RemoLatestEventsandAnnouncements';
import RemoImagesandVideos from './RemoImagesandVideos';
import RemoClimate from './RemoClimate';
import RemoBirthday from './RemoBirthday';
import RemoQuickLinks from './RemoQuickLinks';
import RemoRecentFiles from './RemoRecentFiles';
import RemoSocialMedia from './RemoSocialMedia';
import Footer from './Footer/Footer'
import pnp, { FieldUserSelectionMode } from 'sp-pnp-js';
import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { Web } from '@pnp/sp/webs';
// import { sp } from '@pnp/sp';
import { ChoiceFieldFormatType, sp, UrlFieldFormatType } from "@pnp/sp/presets/all";

// import ProgressBar from 'react-bootstrap/ProgressBar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
import { LayoutsDetails } from './ServiceProvider/Layoutconfiguration';
import { PositionDetails } from './ServiceProvider/PositionConfiguration';
// import {listNameDetalis} from '../Configuration';
import { listNames } from '../Configuration';
import CeoMessageRm from './CeoMessageReadMore';
import AnnouncementsRm from './AnnouncementsRm';
import AnnouncementsVm from './AnnouncementsVm';
import BirthdayRm from './BirthdayRm';
import DeptGalleryGridView from './DeptGalleryGridView';
import DeptGalleryViewMore from './DeptGalleryViewMore';
import EventsViewMore from './EventsViewMore';
import GalleryGridView from './GalleryGridView';
import GalleryViewMore from './GalleryViewMore';
import HeroBannerRm from './HeroBannerReadmore';
import HeroBannerViewMore from './HeroBannerViewMore';
import NewsReadMore from './NewsReadMore';
import NewsViewMore from './NewsViewMore';
// import { PageAnalytics } from './ServiceProvider/LandingPageAnalytics';
sp.setup({
  sp: {
    baseUrl: "https://remodigital.sharepoint.com/sites/RemoIntranetProduct"
  }
});

// let NewWeb: any = WEB.NewWeb;
let spWeb: any;
let fetchList: any;
let IsListCreate: any;
// const Analytics = listNames.Analytics;
const PictureGalleryName = listNames.PictureGallery;
// const docLibName = listNames.DocumentLibrary;
var ComponentConfigurationList = listNames.ComponentMaster;
var ComponentallocationList = listNames.ComPonentAllocationMaster;
var LayoutMasterList = listNames.LayoutMaster;
var User: any;
var UserEmail: any;
var Designation: any;
var Department: any;
var Selectedcomponents: any = [];
var Components = PositionDetails;
// var UserID: any;
// var Dept: any
// let libraryName: any = PictureLib

// let totalLists = totalList;
export interface IRemoHomePageState {
  progress: any,
  isCreatingLists: boolean,
  loadContent: boolean,
  currentList: any,
  showButton: boolean,
  showDropdown: boolean,
  showHomepage: boolean,
  selectedValue: any,
  selectedDept: any,
  layoutItems: any[],
  AvailableComponents: any[],
  // SelectedComponents: any[],
  isInitialscreen: any[];
  componentName: string;
  selectedComponents: any, // To store selected components by position

  landingPageComponentList: any[];
  isClicked: string;
  ceoMessegeID: any;
  isCurrentUserAdmin: boolean;
  editMode: any
  isEditFalse: boolean,
  isSearchActive: boolean,
  itemID: any
}



export default class RemoHomePage extends React.Component<IRemoHomePageProps, IRemoHomePageState, {}> {

  constructor(props: IRemoHomePageProps, _state: IRemoHomePageState) {
    super(props);

    this.state = {
      progress: 0,
      isCreatingLists: false,
      loadContent: false,
      currentList: "",
      showButton: true,
      showDropdown: false,
      showHomepage: false,
      selectedValue: null,
      selectedDept: null,
      layoutItems: [],
      AvailableComponents: [],
      componentName: "",
      landingPageComponentList: [],
      selectedComponents: {}, // To store selected components by position
      // SelectedComponents: [],
      // isInitialscreen: true,
      isInitialscreen: Array(12).fill(true), // Create an array of 10 `true` values
      isClicked: "Home",
      ceoMessegeID: null,
      isCurrentUserAdmin: false,
      editMode: "",
      isEditFalse: true,
      isSearchActive: false,
      itemID: null
    };
    spWeb = Web(this.props.siteurl);
    fetchList = true
    IsListCreate = false;
    console.log(spWeb, fetchList, IsListCreate);
  }
  public async componentDidMount() {
    // this.GetAllavailablecomponents()
    const elements = document.querySelectorAll(".fui-FluentProvider.fui-FluentProvider6.___13yoiqc.f19n0e5.f3e3pzq.f1o700av.fk6fouc.fkhj508.figsok6.f1g96gwp");

    // Check if there are elements and hide the first one
    if (elements.length > 0) {
      var item: any = elements[0];
      item.style.display = "none";
    }

    document.querySelectorAll('#spLeftNav,#sp-appBar,#spSiteHeader,#SuiteNavWrapper,#spCommandBar,#CommentsWrapper, #spSiteHeader').forEach(function (element: any) {
      element.style.display = 'none';
    });
    this.checkEditMode();
    // $(".ControlZone--control").show();
    const userDetails = new CurrentUserDetails();
    await userDetails
      .getCurrentUserDetails()
      .then(async (data) => {
        if (data) {

          console.log("Current user details", data);
          console.log("data details", data?.Department, data?.Designation);
          // Call LandingPageAnalytics if needed
          // const pageAnalytics = new PageAnalytics(
          //   "Landing Page",
          //   User,
          //   data?.Department ?? "NA",
          //   data?.Designation ?? "NA",
          //   "NA",
          //   "NA",
          //   UserEmail
          // );
          //  await  pageAnalytics.LandingPageAnalytics();
        } else {
          console.warn("No user details were fetched.");
        }
      })
      .catch((err) => {
        console.error("Error fetching current user details:", err);
      });

    this.checkUserAdmin();
    // setTimeout(() => {
    // $('div[data-automation-id="CanvasControl"]').css('padding', '0px').css('margin', '0px');
    // $(".inner-pages-nav").hide();s
    // $('#master_footer_parent').hide();
    // $('.ControlZone--control').attr('style', 'display: none !important');


    // document.querySelectorAll('div[data-automation-id="CanvasControl"]').forEach(function (element: any) {
    //   element.style.padding = '0px';
    //   element.style.margin = '0px';
    // });

    // const innerPagesNav: any = document.getElementsByClassName('innerpages-nav');
    // if (innerPagesNav) {
    //   innerPagesNav.style.display = 'none';
    // }

    // const masterFooter = document.getElementById('master_footer_parent');
    // if (masterFooter) {
    //   masterFooter.style.display = 'none';
    // }

    // const ControlZone: any = document.getElementsByClassName('ControlZone--control');
    // if (ControlZone) {
    //   ControlZone.style.setProperty('display', 'none', 'important');
    // }
    // }, 500);

    // this.setState({ showButton: true })


  }

  public checkEditMode() {
    const url: any = new URL(window.location.href);
    const mode = url.searchParams.get("Mode");
    this.setState({
      editMode: mode
    })
  }

  public async checkUserAdmin() {
    debugger;
    try {
      // Fetch all site users
      // const profile = await pnp.sp.profiles.myProperties.get();

      // console.log("Profile data:", profile);
      const CurrentUserAdmin = await sp.web.currentUser.get()
        .then(user => user.IsSiteAdmin);

      console.log("currentUser", CurrentUserAdmin);


      // const users = await sp.web.siteUsers.get();
      // const currentUser = "Mariam" //"eservice"
      // console.log("All site users:", users);

      // // Filter for users named "Mariam" who are also site admins
      // const admins = users.filter(user => user.Title === currentUser && user.IsSiteAdmin);

      // if (admins.length > 0) {
      this.setState({
        isCurrentUserAdmin: CurrentUserAdmin
      })

      //   console.log("User 'Mariam' is a site admin:", admins);
      // } else {
      //   console.log("User 'Mariam' is not a site admin.");
      // }
    } catch (error) {
      console.error("Error checking site admin status:", error);
    }
  }

  public async getAllocatedComponents() {
    try {
      // Fetch items from the SharePoint list
      const response = await sp.web.lists.getByTitle(ComponentallocationList).items.filter(`Title eq '${this.state.selectedValue}'`).get();
      if (response.length === 0) {
        console.log("No items found in the SharePoint list.");
        return;
      }

      const selectedComponents: { [key: number]: string } = {};
      let updatedIsInitialscreen = [...this.state.isInitialscreen];
      let updatedAvailableComponents = [...this.state.AvailableComponents];

      response.forEach((item) => {
        if (item.Position != null && item.Component != null) {
          // Update selectedComponents by position
          selectedComponents[item.Position] = item.Component;

          // Update isInitialscreen to mark the position as not initial
          updatedIsInitialscreen = updatedIsInitialscreen.map((screen, index) =>
            index === item.Position - 1 ? false : screen
          );

          // Remove the component from AvailableComponents
          updatedAvailableComponents = updatedAvailableComponents.filter(
            (available) => available.Title !== item.Component
          );
        }
      });

      // Update the state with the aggregated changes
      this.setState({
        AvailableComponents: updatedAvailableComponents,
        selectedComponents: selectedComponents,
        isInitialscreen: updatedIsInitialscreen,
      });

      console.log("Available Components:", updatedAvailableComponents);
      console.log("Selected Components:", selectedComponents);
    } catch (error) {
      console.error("Error fetching allocated components:", error);
    }
  }

  public async GetAllavailablecomponents() {
    try {
      var allcomponents = [];
      // NewWeb = Web(this.props.siteurl)
      const response = await sp.web.lists.getByTitle(ComponentConfigurationList).items.get();
      console.log(response);
      if (response.length != 0) {
        allcomponents.push(response)
        // }
        this.setState({
          AvailableComponents: response,
          landingPageComponentList: response
        })
      }
      console.log(this.state.AvailableComponents);
    } catch (e) {
      console.error("error while getting all compoennts:", e)
    }

  }


  public async LandingPageAnalytics(Department: any, Designation: any) {
    // NewWeb = Web(this.props.siteurl)
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    // console.log(this.state.Title);

    try {
      const response = await sp.web.lists.getByTitle("AnalyticsMasterList").items.add({
        Category: "Landing Page",
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



  public loaderInProgress() {
    const loaderIcon = document.getElementById('loader-Icon');
    const loadContent = document.getElementById('load-content');
    if (loaderIcon) {
      loaderIcon.style.display = 'block';
    }
    if (loadContent) {
      loadContent.style.display = 'none';
    }

  }
  public HideInProgress() {
    // setTimeout(() => {
    const loadContent = document.getElementById('load-content');
    const loaderIcon = document.getElementById('loader-Icon');

    if (loadContent) {
      loadContent.style.display = 'block';
    }

    if (loaderIcon) {
      loaderIcon.style.display = 'none';
    }
    // }, 2000);
  }


  public async getCurrentUser() {
    try {
      const url: URL = new URL(window.location.href);
      console.log(url);

      const reactHandler = this;
      User = reactHandler.props.userid;

      const profile = await pnp.sp.profiles.myProperties.get();
      console.log("hompage profile", profile);
      console.log(Designation);
      console.log(Department);

      UserEmail = profile.Email;
      const Name = profile.DisplayName;
      console.log("getCurrentUser", Name);
      Designation = profile.Title;

      // Check if the UserProfileProperties collection exists and has the Department and Designation properties
      if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
        const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
        console.log(departmentProperty, designationProperty);
        console.log("departmentProperty.Value", departmentProperty.Value);

        if (departmentProperty) {
          Department = departmentProperty.Value;
        }


      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }



  public async createSharePointLists() {
    try {
      // Filter unmatched lists
      const unmatchedLists: any = ListLibraryColumnDetails.filter(
        listDetail => !this.state.landingPageComponentList.some(
          component => component.Title.toLowerCase() === listDetail.name.toLowerCase()
        )
      );

      console.log("Unmatched Lists:", unmatchedLists);

      // Get the total number of unmatched lists
      const totalLists: number = unmatchedLists.length;

      // Track if any list was newly created
      let anyListCreated = false;

      // Loop through each unmatched list
      for (let i = 0; i < totalLists; i++) {
        const listName = unmatchedLists[i].name; // Access the list name
        const columns = unmatchedLists[i].columns; // Access the columns for the list

        // Ensure the list exists or create it
        const listEnsureResult = await sp.web.lists.ensure(listName);

        if (listEnsureResult.created) {
          console.log(`List '${listName}' created successfully.`);
          await this.createSharePointColumns(listName, columns); // Create columns for the newly created list
          anyListCreated = true;
        } else {
          console.log(`List '${listName}' already exists.`);
          await this.createSharePointColumns(listName, columns); // Ensure columns exist even if the list already exists
        }
      }

      // Log final status
      if (!anyListCreated) {
        console.log("All lists already existed. No new lists were created.");
      }
    } catch (error) {
      console.error("Error creating lists:", error);
    }
  }



  // // Updated function for creating columns in a SharePoint List
  // public async createSharePointColumns(name: string, columns: any[]): Promise<void> {
  //   try {
  //     for (const column of columns) {
  //       try {
  //         // Check if the column already exists
  //         await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
  //         console.log(`Column '${column.columnName}' already exists in list '${name}'.`);
  //       } catch (error) {
  //         // If column does not exist, create it based on type
  //         switch (column.type) {
  //           case "addImageField":
  //             await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
  //             console.log(`Column '${column.columnName}' added as Image Field.`);
  //             const view = await sp.web.lists.getByTitle(name).views.getByTitle("All Items").get();
  //             console.log(view);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;

  //           case "addBoolean":
  //             await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Boolean.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;

  //           case "addTextField":
  //             await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Text Field.`);
  //             break;

  //           case "addNumberField":
  //             await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Number Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;

  //           case "addDateField":
  //             await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Date Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;
  //           case "addMultilineText":
  //             await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName);
  //             console.log(`Column '${column.columnName}' added as multiline Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;

  //           case "Person or Group":
  //             await sp.web.lists.getByTitle(name).fields.addUser(column.columnName, FieldUserSelectionMode.PeopleOnly);
  //             console.log(`Column '${column.columnName}' added as personorgroup Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;
  //           case "addMultiChoice":
  //             // await sp.web.lists.getByTitle(name).fields.addMultiChoice("My Field",  column.group,  false, "My Group" );
  //             await sp.web.lists.getByTitle(name).fields.addMultiChoice(
  //               column.columnName, // The title of the field
  //               column.group, // The array of choices (["Midea", "Trosten", ...])
  //               false, // Set to true if you want to allow custom user input
  //               //  "My Group" // The group under which the field will appear (optional)
  //             );
  //             // const field2 = await sp.web.lists.getByTitle("My List").fields.addMultiChoice("My Field", { Choices: choices, FillInChoice: false, Group: "My Group" });
  //             console.log(`Column '${column.columnName}' added as choice Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;
  //           case "addLookup":
  //             const targetList = await sp.web.lists.getByTitle(column.targetListName).select("*").get();
  //             await sp.web.lists.getByTitle(name).fields.addLookup(column.columnName, targetList.Id, column.targetListColumn);
  //             console.log(`Column '${column.columnName}' added as lookup Field.`);
  //             await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //             break;
  //             case "addUrl":
  //               debugger;
  //               await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Hyperlink); // Or UrlFieldFormatType.Image
  //               console.log(`Column '${column.columnName}' added as URL.`);
  //               break;              
  //           default:
  //             console.log(`Unknown column type: ${column.type}`);

  //         }

  //         // Add the column to the "All Items" view
  //         await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during column creation process:", error);
  //   }
  // }


  // public async createSharePointColumns(name: string, columns: any[]): Promise<void> {
  //   try {
  //     for (const column of columns) {
  //       var columnExist = await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
  //       if (!columnExist) {
  //         // try {
  //         //   // Check if the column already exists

  //         //   console.log(`Column '${column.columnName}' already exists in list '${name}'.`);
  //         // } catch (error) {
  //         // If column does not exist, create it based on type
  //         switch (column.type) {
  //           case "addImageField":
  //             await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
  //             console.log(`Column '${column.columnName}' added as Image Field.`);
  //             break;

  //           case "addBoolean":
  //             await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Boolean.`);
  //             break;

  //           case "addTextField":
  //             await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
  //             console.log(`Column '${column.columnName}' added as Text Field.`);
  //             break;

  //           case "addNumberField":
  //             await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Number Field.`);
  //             break;

  //           case "addDateField":
  //             await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Date Field.`);
  //             break;

  //           case "addMultilineText":
  //             await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName);
  //             console.log(`Column '${column.columnName}' added as Multiline Field.`);
  //             break;

  //           case "Person or Group":
  //             await sp.web.lists.getByTitle(name).fields.addUser(column.columnName, FieldUserSelectionMode.PeopleOnly);
  //             console.log(`Column '${column.columnName}' added as Person or Group Field.`);
  //             break;

  //           case "addMultiChoice":
  //             await sp.web.lists.getByTitle(name).fields.addMultiChoice(column.columnName, column.group, false);
  //             console.log(`Column '${column.columnName}' added as MultiChoice Field.`);
  //             break;

  //           case "addLookup":
  //             const targetList = await sp.web.lists.getByTitle(column.targetListName).select("*").get();
  //             await sp.web.lists.getByTitle(name).fields.addLookup(column.columnName, targetList.Id, column.targetListColumn);
  //             console.log(`Column '${column.columnName}' added as Lookup Field.`);
  //             break;

  //           case "addUrl":
  //             await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Hyperlink);
  //             console.log(`Column '${column.columnName}' added as URL Field.`);
  //             break;

  //           case "Icon":
  //             await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Image);
  //             console.log(`Column '${column.columnName}' added as Icon (URL field with Image format).`);
  //             break;
  //           case "addChoice":
  //             debugger;
  //             await sp.web.lists.getByTitle(name).fields.addChoice(
  //               column.columnName,
  //               column.choices,
  //               ChoiceFieldFormatType.Dropdown // Use Dropdown or RadioButtons
  //             );
  //             console.log(`Column '${column.columnName}' added as Choice Field.`);
  //             break;
  //           default:
  //             console.log(`Unknown column type: ${column.type}`);
  //         }

  //         // Add the column to the "All Items" view
  //         await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during column creation process:", error);
  //   }
  // }


  public async createSharePointColumns(name: string, columns: any[]): Promise<void> {
    try {
      for (const column of columns) {
        if (!column.columnName || !column.type) {
          console.error("Invalid column data:", column);
          continue;
        }

        let columnExist = false;
        try {
          columnExist = await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
        } catch {
          columnExist = false; // Column does not exist
        }

        if (!columnExist) {
          switch (column.type) {
            case "addImageField":
              await sp.web.lists.getByTitle(name).fields.addImageField(column.columnName);
              console.log(`Column '${column.columnName}' added as Image Field.`);
              break;

            case "addBoolean":
              await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
              console.log(`Column '${column.columnName}' added as Boolean.`);
              break;

            case "addTextField":
              await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
              console.log(`Column '${column.columnName}' added as Text Field.`);
              break;

            case "addNumberField":
              await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
              console.log(`Column '${column.columnName}' added as Number Field.`);
              break;

            case "addDateField":
              await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              break;

            case "addMultilineText":
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName);
              console.log(`Column '${column.columnName}' added as Multiline Field.`);
              break;

            case "Person or Group":
              await sp.web.lists.getByTitle(name).fields.addUser(column.columnName, FieldUserSelectionMode.PeopleOnly);
              console.log(`Column '${column.columnName}' added as Person or Group Field.`);
              break;

            case "addMultiChoice":
              await sp.web.lists.getByTitle(name).fields.addMultiChoice(column.columnName, column.group, false);
              console.log(`Column '${column.columnName}' added as MultiChoice Field.`);
              break;

            case "addLookup":
              if (!column.targetListName || !column.targetListColumn) {
                console.error("Missing target list or column for lookup field:", column);
                break;
              }
              const targetList = await sp.web.lists.getByTitle(column.targetListName).get();
              await sp.web.lists
                .getByTitle(name)
                .fields.addLookup(column.columnName, targetList.Id, column.targetListColumn);
              console.log(`Column '${column.columnName}' added as Lookup Field.`);
              break;

            case "addUrl":
              await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Hyperlink);
              console.log(`Column '${column.columnName}' added as URL Field.`);
              break;

            case "Icon":
              await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Image);
              console.log(`Column '${column.columnName}' added as Icon (URL field with Image format).`);
              break;

            case "addChoice":
              await sp.web.lists.getByTitle(name).fields.addChoice(
                column.columnName,
                column.choices,
                ChoiceFieldFormatType.Dropdown
              );
              console.log(`Column '${column.columnName}' added as Choice Field.`);
              break;

            default:
              console.log(`Unknown column type: ${column.type}`);
          }

          try {
            await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
          } catch (viewError) {
            console.error(`Failed to add column '${column.columnName}' to 'All Items' view:`, viewError);
          }
        }
      }
    } catch (error) {
      console.error("Error during column creation process:", error);
    }
  }





  public async createDocumentLibrary(docLibName: string): Promise<void> {
    if (!docLibName) {
      console.error("Library name is not provided.");
      return;
    }

    try {
      // Check if the library already exists
      let existingLibrary;
      try {
        existingLibrary = await sp.web.lists.getByTitle(docLibName).get();
      } catch (error) {
        if (error.status !== 404) {
          throw new Error(`Error checking existing library: ${error.message}`);
        }
      }

      if (existingLibrary) {
        console.log(`Document Library '${docLibName}' already exists.`);
        return;
      }

      // Create the document library
      await sp.web.lists.add(docLibName, "", 101, false, {
        OnQuickLaunch: true // Adds to Quick Launch
      });
      console.log(`Document Library '${docLibName}' created successfully.`);
    } catch (error) {
      console.error(`Error creating document library '${docLibName}': `, error);
    }
  }




  // New picture lib code 

  public CreatePictureLibrary = async () => {
    try {
      var ListExist = await spWeb.lists.getByTitle(PictureGalleryName).get();
      if (!ListExist) {
        const result = await spWeb.lists.add(PictureGalleryName, "Picture Library", 109, true, { OnQuickLaunch: true });
        console.log("Picture Library Created:", result);
        // alert("Picture Library created successfully!");
      } else {
        console.log("Picture Library Created already");
        return;
      }

    } catch (error) {
      console.error("Error creating Picture Library:", error);
      // alert("Failed to create Picture Library. Please check the console for more details.");
    }
  };


  public showDropDown() {
    this.getLayout();
    this.setState({
      showButton: false,
      showDropdown: true,
    })
  }


  public async setSelectedComponent(event: any, value: string, DOMID: string, key: number) {
    try {
      event.preventDefault();
      const position = key;
      // Update selected component for the position
      this.setState((prevState) => ({
        selectedComponents: {
          ...prevState.selectedComponents,
          [position]: value,
        },
      }));

      this.setState({
        componentName: event.target.value
      });

      if (value != null) {
        const selectedComponent = this.state.AvailableComponents.find(
          (item) => item.Title === value
        );

        if (selectedComponent && !Selectedcomponents.includes(selectedComponent.ComponentId)) {
          // Add to global selected list
          Selectedcomponents.push(selectedComponent.ComponentId);

          // Update available components and screen states
          const updatedAvailableComponents = this.state.AvailableComponents.filter(
            (item) => item.ComponentId !== selectedComponent.ComponentId
          );

          const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
            index === (key - 1) ? false : item
          );

          this.setState({
            AvailableComponents: updatedAvailableComponents,
            isInitialscreen: updatedIsInitialscreen,
          });

          $("#" + DOMID).hide();

          console.log("Updated Available Components:", updatedAvailableComponents);
        }

        // Ensure the SharePoint list exists
        const listEnsureResult = await sp.web.lists.ensure(ComponentallocationList);
        if (listEnsureResult.created) {
          console.log(`List '${ComponentallocationList}' created successfully.`);
        } else {
          console.log(`List '${ComponentallocationList}' already exists.`);
        }
        await this.handleComponentAllocation(value, selectedComponent.ComponentId, position);

        console.log("Item successfully added to the list.");
      } else {
        console.log("No value selected. Skipping addition to the list.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  public async handleComponentAllocation(value: string, selectedComponent: any, position: number) {
    try {
      // Fetch the item for the specific position
      const existingItems = await sp.web.lists
        .getByTitle(ComponentallocationList)
        .items.filter(`Position eq '${position}'`)
        .get();

      if (existingItems.length > 0) {
        // If an item exists for the position, update it
        const itemId = existingItems[0].Id; // Get the item ID
        await sp.web.lists.getByTitle(ComponentallocationList).items.getById(itemId).update({
          Title: this.state.selectedValue,
          Component: value,
          ComponentID: selectedComponent,
        });

        console.log(`Item at position ${position} updated successfully.`);
      } else {
        // If no item exists, create a new one
        await sp.web.lists.getByTitle(ComponentallocationList).items.add({
          Title: this.state.selectedValue,
          Component: value,
          ComponentID: selectedComponent,
          Position: position,
        });

        console.log(`New item created at position ${position}.`);
      }
    } catch (error) {
      console.error("Error handling component allocation:", error);
    }
  }


  public async getLayout() {
    try {
      this.setState({
        layoutItems: LayoutsDetails
      });
      // Check if the "LayoutMaster" list exists
      // const lists = await sp.web.lists.filter(`Title eq 'LayoutMaster'`).get();

      // if (lists.length === 0) {
      //   await sp.web.lists.add("LayoutMaster", "This list stores layout configurations.", 100, false); // 100 = Generic List
      //   console.log("List 'LayoutMaster' created.");
      //   await sp.web.lists.getByTitle("LayoutMaster").fields.addBoolean("IsActive", {
      //     DefaultValue: "0", // Default to false
      //     Title: "Is Active"
      //   });
      //   console.log("Field 'IsActive' added to the list.");
      //   await sp.web.lists.getByTitle("LayoutMaster").items.add({
      //     Title: "Layout1",
      //     IsActive: true
      //   });
      //   console.log("Default item 'Layout1' added to 'LayoutMaster' list.");
      //   // Add the default item to the list
      // }


      // // Fetch the active layouts from the list
      // const items = await sp.web.lists
      //   .getByTitle("LayoutMaster")
      //   .items
      //   .select("Title", "*")
      //   .filter(`IsActive eq '1'`)
      //   .getAll();

      // console.log("Layout items", items);

      // // Update the component state
      // this.setState({
      //   layoutItems: items
      // });
    } catch (error) {
      console.log("Error in getLayout", error);
    }
  }


  // public readMoreHandler(isReadMoreClick: any) {
  //   console.log("isReadMoreClick", isReadMoreClick);
  //   // this.props.onReadMoreClick()
  //   // this.props.onReadMoreClick("yes", ItemID)
  //   alert(`hi homePage ${isReadMoreClick.yesNo, isReadMoreClick.id}`)
  //   this.setState({
  //     isClicked: isReadMoreClick.yesNo,
  //     ceoMessegeID: isReadMoreClick.id
  //   })

  // }

  public readMoreHandler(ReadMoreData: any) {


    console.log("Name", ReadMoreData.Name, "Id", ReadMoreData.Id);

    // this.props.onReadMoreClick()
    // this.props.onReadMoreClick("yes", ItemID)
    this.setState({
      isClicked: ReadMoreData.Name,
      itemID: ReadMoreData.Id,
      // homePage: isReadMoreClick,
      showDropdown: false
    })


  }
  // public async createLayoutMasterList() {
  //   try {
  //     const list = await sp.web.lists.add("LayoutMaster");
  //     console.log("List 'LayoutMaster' created.");
  //     await list.fields.addBoolean("IsActive", {
  //       DefaultValue: false,
  //       Title: "Is Active"
  //     });
  //     console.log("Field 'IsActive' added.");
  //     await list.items.add({
  //       Title: "Layout1",
  //       IsActive: true
  //     });
  //     console.log("Default item added to the list.");
  //   } catch (error) {
  //     console.error("Error creating or updating 'LayoutMaster':", error);
  //   }
  // }


  public async handleSelectChange(event: any) {
    console.log("selected option", event.target.value);
    // if (event.target.value == "layout_1") {
    this.setState(
      {
        showHomepage: true,
        showDropdown: false,
        selectedValue: event.target.value
      },
      async () => {
        // await this.createLayoutMasterList();
        await this.loaderInProgress();
        await this.setActiveLayout(this.state.selectedValue);
        // await this.createSharePointLists();
        await this.GetAllavailablecomponents();
        await this.getAllocatedComponents();
        await this.HideInProgress();
      }
    );
    // }
  };

  public async setActiveLayout(selectedLayout: string) {
    try {
      const layoutList = sp.web.lists.getByTitle(LayoutMasterList);
      const selectedItem = this.state.layoutItems.find((item) => item.ID === selectedLayout);
      console.log(selectedItem);
      // Fetch all items in the list
      const response = await layoutList.items.get();

      let layoutExists = false;
      let existingItemId: number | null = null;

      // Check if the selected layout exists
      for (const item of response) {
        if (item.Title === selectedLayout) {
          layoutExists = true;
          existingItemId = item.ID;
          break;
        }
      }

      if (layoutExists && existingItemId) {
        // Update the matching item's IsActive to true
        await layoutList.items.getById(existingItemId).update({
          IsActive: true,
        });

        // Update all other items' IsActive to false
        for (const item of response) {
          if (item.ID !== existingItemId) {
            await layoutList.items.getById(item.ID).update({
              IsActive: false,
            });
          }
        }
      } else {
        // Add the new layout
        await layoutList.items.add({
          Title: selectedLayout,
          LayoutName: selectedItem.name,
          IsActive: true,
        });

        // Update all other items' IsActive to false
        for (const item of response) {
          await layoutList.items.getById(item.ID).update({
            IsActive: false,
          });
        }
      }
    } catch (error) {
      console.error("Error in setActiveLayout:", error);
    }
  }


  // public async setActiveLayout(selectedlayout: any) {
  //   const response = await sp.web.lists.getByTitle(LayoutMasterList).items.get();
  //   try {
  //     response.forEach(async (item) => {
  //       var ItemId = item.ID;
  //       if (item.title == selectedlayout) {
  //         await sp.web.lists.getByTitle(LayoutMasterList).items.getById(ItemId).update({
  //           IsActive: true
  //         })
  //       } else {
  //         await sp.web.lists.getByTitle(LayoutMasterList).items.getById(ItemId).update({
  //           IsActive: false
  //         })
  //       }
  //     })
  //   } catch {

  //   }
  // }
  public Showclearbutton(ID: any) {
    debugger;
    var input = $("#SearchInput").val();
    if (input == "") {
      $(".clear_part").hide();
      // $("." + ID + "").removeClass("active");
      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.remove("active"); // Add the active class
      }
    }
    else {
      // $(".clear_part").addClass("active");
      // $(".clear_part").show();
      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.add("active"); // Add the active class
      }
    }
  }

  public showcomponents(e: any, DOMID: string) {
    e.preventDefault();
    $("#" + DOMID).toggle();
    this.showSearchbtn();
    // this.setState({ isInitialscreen: false })
  }
  public handleInputChange(ID: any, SelectID: string) {
    var input = $("#SearchInput").val();
    $("#" + SelectID).show();
    this.showSearchbtn();
    if (input == "") {
      // $(".clear_part").hide();
      // $("." + ID + "").removeClass("active");
      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.remove("active"); // Add the active class
      }
    }
    else {
      // $(".clear_part").addClass("active");
      // $(".clear_part").show();
      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.add("active"); // Add the active class
      }
    }
  }
  public showSearchbtn() {
    $(".clear_part").hide();
    $(".search_button").show();
  }
  public showClearbtn() {
    $(".search_button").hide();
    $(".clear_part").show();
  }
  public SearchHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, SelectID: string) {
    e.preventDefault();
    var query: string = $.trim(($("#SearchInput") as any).val());
    sp.web.lists.getByTitle(ComponentConfigurationList).items.filter(`substringof('${query}',Title)`).top(5000).orderBy("Title", true).get().then((resp) => {
      if (resp.length != 0) {
        this.setState({
          AvailableComponents: resp
        }, () => {
          $("#" + SelectID).show();
          this.showClearbtn();
          this.getAllocatedComponents()

        });
      }
    })
  }
  // public clearHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault();
  //   $("#SearchInput").val("");
  //   $(".clear_part").removeClass("active");
  //   sp.web.lists.getByTitle(ComponentConfigurationList).items.top(5000).orderBy("Title", true).get().then((resp) => {

  //     if (resp.length != 0) {
  //       sp.web.lists.getByTitle(ComponentallocationList).items.filter(`substringof('${this.state.selectedValue}',Title)`).top(5000).orderBy("Title", true).get().then((res) => {
  //         if (res.length != 0) {
  //           var updatedavailablecomponent = resp.find((item)=> item.ComponentId !== res.ComponentID)
  //         }
  //       })
  //       this.setState({
  //         AvailableComponents: updatedavailablecomponent
  //       });
  //     }
  //   });
  // }

  // public async removeComponent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any, Position: number) {
  //   debugger;
  //   event.preventDefault();
  //   var data: any;
  //   const existingItems = await sp.web.lists
  //     .getByTitle(ComponentallocationList)
  //     .items.filter(`Position eq '${Position}' and Title eq '${this.state.selectedValue}'`)
  //     .get();
  //   if (existingItems.length > 0) {
  //     // If an item exists for the position, update it
  //     const itemId = existingItems[0].Id; // Get the item ID
  //     await sp.web.lists.getByTitle(ComponentallocationList).items.getById(itemId).delete();
  //     sp.web.lists.getByTitle(ComponentConfigurationList).items.top(5000).orderBy("Title", true).get().then((resp) => {
  //       if (resp.length != 0) {
  //         resp.forEach((items) => {
  //           if (items.Title == value) {
  //             data = items;
  //           }
  //         })
  //       }
  //       this.state.AvailableComponents.push(data)
  //       const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
  //         index === (Position - 1) ? true : item
  //       );
  //       this.setState({
  //         // AvailableComponents: updatedAvailableComponents,
  //         isInitialscreen: updatedIsInitialscreen,
  //       });
  //     });
  //   }


  // }

  public async clearHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, SelectID: any) {
    e.preventDefault();
    // Clear the search input and reset any active state
    $("#SearchInput").val("");
    // $(".clear_part").removeClass("active");
    try {
      // Fetch all components
      const allComponents = await sp.web.lists
        .getByTitle(ComponentConfigurationList)
        .items.top(5000)
        .orderBy("Title", true)
        .get();

      if (allComponents.length > 0) {
        // Fetch already allocated components
        const allocatedComponents = await sp.web.lists
          .getByTitle(ComponentallocationList)
          .items.filter(`substringof('${this.state.selectedValue}',Title)`)
          .top(5000)
          .orderBy("Title", true)
          .get();

        // Filter out the allocated components from the available components
        const allocatedComponentIDs: any = allocatedComponents.map((comp) => comp.ComponentID);
        const updatedAvailableComponents = allComponents.filter(
          (item) => !allocatedComponentIDs.includes(item.ComponentId)
        );
        updatedAvailableComponents.sort((a, b) => a.ComponentId - b.ComponentId); // Sort by componentid in ascending order
        // Update the state with the filtered components
        this.setState({
          AvailableComponents: updatedAvailableComponents,
        }, () => {
          $("#" + SelectID).show();
          this.showSearchbtn();
        });
      }
    } catch (error) {
      console.error("Error in Clear function:", error);
    }
  }


  public async removeComponent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any, Position: number) {
    event.preventDefault();
    var data: any;
    let updatedAvailableComponents: any[] = [];
    const existingItems = await sp.web.lists
      .getByTitle(ComponentallocationList)
      .items.filter(`Position eq '${Position}' and Title eq '${this.state.selectedValue}'`)
      .get();
    if (existingItems.length > 0) {
      // If an item exists for the position, update it
      const itemId = existingItems[0].Id; // Get the item ID
      await sp.web.lists.getByTitle(ComponentallocationList).items.getById(itemId).delete();
      sp.web.lists.getByTitle(ComponentConfigurationList).items.top(5000).orderBy("Title", true).get().then((resp) => {
        if (resp.length != 0) {
          resp.forEach((items) => {
            if (items.Title == value) {
              data = items;
            }
          })
        }
        if (data) {
          updatedAvailableComponents = [...this.state.AvailableComponents, data]; // Include new data
          updatedAvailableComponents.sort((a, b) => a.ComponentId - b.ComponentId); // Sort by componentid in ascending order
          if (Selectedcomponents.includes(data.ComponentId)) {
            Selectedcomponents = Selectedcomponents.filter((id: any) => id !== data.ComponentId);
            console.log("Item removed from Selectedcomponents:", data.ComponentId);
          }

        }
        const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
          index === (Position - 1) ? true : item
        );
        this.setState({
          AvailableComponents: updatedAvailableComponents,
          isInitialscreen: updatedIsInitialscreen,
        });
      });
    }


  }

  public renderComponent(position: number) {
    const componentName = this.state.selectedComponents[position];
    // const locationID = `Location-${position}`

    // Define a function to render components dynamically
    const renderWithRemoveButton = (Component: any, props = {}) => {
      return (
        <>
          {this.state.isCurrentUserAdmin == true && this.state.editMode == "edit" &&
            <>
              <button className="Remove_Btn" onClick={(e) => this.removeComponent(e, componentName, position)}>
                <img src={`${this.props.siteurl}/SiteAssets/img/remove.svg`} alt="remove-btn" />
              </button>
            </>
          }
          <Component {...this.props} {...props} />
        </>
      );
    };

    switch (componentName) {
      case "Hero Banner":
        return renderWithRemoveButton(RemoHeroBanner, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });
      case "CEO Message":
        return renderWithRemoveButton(RemoCEOMessage, {
          description: "",
          createList: false,
          name: this.state.componentName,
          onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)
        });

      case "Quick Links":
        return renderWithRemoveButton(RemoNavigations, { description: "", createList: false, name: "" });

      case "My Meetings":
        return renderWithRemoveButton(RemoMyMeetings, { description: "", createList: false, name: this.state.componentName });

      case "Birthday":
        return renderWithRemoveButton(RemoBirthday, {
          description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)
        });

      case "News":
        return renderWithRemoveButton(RemoNews, { description: position, createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });

      case "Climate":
        return renderWithRemoveButton(RemoClimate, { description: "" });

      case "Manange Quick Links":
        return renderWithRemoveButton(RemoQuickLinks, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });

      case "Events and Announcements":
        return renderWithRemoveButton(RemoLatestEventsandAnnouncements, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });
      // case "Announcement":
      //   return renderWithRemoveButton(RemoLatestEventsandAnnouncements, { description: "", createList: false, name: this.state.componentName });

      case "Recent Files":
        return renderWithRemoveButton(RemoRecentFiles, { description: "", createList: false, name: this.state.componentName });

      case "Images and Videos":
        return renderWithRemoveButton(RemoImagesandVideos, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });

      case "Social Media":
        return renderWithRemoveButton(RemoSocialMedia, { description: "", createList: false, name: this.state.componentName });

      default:
        return null;
    }
  }

  public async handleChangeLayout(event: React.ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    const value = event.target.value;
    const previousLayout = this.state.selectedValue;
    if (previousLayout == value) {
      return;
    }

    try {
      // Check if the new layout already exists
      const isLayoutExist = await sp.web.lists
        .getByTitle(ComponentallocationList)
        .items.filter(`Title eq '${value}'`)
        .get();

      if (!isLayoutExist || isLayoutExist.length === 0) {
        // Fetch all existing items from the previous layout
        const existingItems = await sp.web.lists
          .getByTitle(ComponentallocationList)
          .items.filter(`Title eq '${previousLayout}'`)
          .get();

        if (existingItems.length === 0) {
          console.log("No items found to duplicate.");
          return;
        }

        // Duplicate each existing item with the new layout title
        await Promise.all(
          existingItems.map((item) =>
            sp.web.lists.getByTitle(ComponentallocationList).items.add({
              Title: value,
              Component: item.Component,
              ComponentID: item.ComponentID,
              Position: item.Position,
              // Add all other relevant fields here
            })
          )
        );
      }

      // Update state and trigger dependent actions
      this.setState(
        { selectedValue: value },
        async () => {
          await this.loaderInProgress();
          await this.setActiveLayout(this.state.selectedValue);
          await this.GetAllavailablecomponents();
          await this.getAllocatedComponents();
          await this.HideInProgress();
        }
      );
    } catch (error) {
      console.error("Error handling layout change:", error);
    }
  }

  public editHandler(event: any) {
    event.preventDefault();
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?Mode=edit';
    window.location.href = url;
  }
  public draftHandler(event: any) {
    event.preventDefault();
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?Mode=edit';
    window.location.href = url;
  }
  public publishHandler(event: any) {
    event.preventDefault();
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?';
    window.location.href = url;
  }


  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;
    const SearchElement = ({ DOMID, SelectID, ButtonId, ComponentIndex }: { DOMID: string; SelectID: string; ButtonId: string; ComponentIndex: any; }) => {
      if (!handler.state.isCurrentUserAdmin && handler.state.editMode !== "edit") {
        return null;
      }
      return (
        <>
          {/* Button to toggle component visibility */}
          <button id={ButtonId} onClick={(e) => handler.showcomponents(e, SelectID)} >
            <img src={`${this.props.siteurl}/SiteAssets/img/add component.svg`} alt="AddComponent" />
          </button>

          {/* Hidden component div, toggled dynamically */}
          <div id={SelectID} style={{ display: "none" }}>
            <div className={`component-search ${DOMID}`}>
              <input type="text" className={`form-control`} placeholder="Search for the contact here" id="SearchInput"
                onChange={() => handler.handleInputChange(DOMID, SelectID)} />
              <button className="form-control search_button" onClick={(e) => handler.SearchHandler(e, SelectID)} >
                <img src={`${this.props.siteurl}/SiteAssets/img/search-fill.svg`} alt="search-img" />
              </button>
              <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => handler.clearHandler(e, SelectID)}>
                <img src={`${this.props.siteurl}/SiteAssets/img/close-icon.svg`} alt="clear-img" />
              </button>
            </div>

            {/* List of available components */}
            <ul>
              {handler.state.AvailableComponents.map((component: any) => (
                <li
                  key={component.Title} // Ensure unique key for each list item
                  className="li-search-wrap"
                  onClick={(e) => handler.setSelectedComponent(e, component.Title, SelectID, ComponentIndex)}
                >
                  <p className="people_name">{component.Title}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )
    };
    return (
      //Layout 1
      <>
        {this.state.showHomepage == true &&
          <div>
            <div className={styles.remoHomePage} id="load-content">
              <div id="Global-Top-Header-Navigation">
                <GlobalSideNav
                  siteurl={this.props.siteurl}
                  context={this.props.context}
                  currentWebUrl=""
                  CurrentPageserverRequestPath=""
                />
                <div className='header_part'>
                  <ul className='header_btn'>
                    {this.state.isCurrentUserAdmin == true &&
                      <li id='layout_button'>
                        <select value={this.state.selectedValue} onChange={(e) => this.handleChangeLayout(e)}>
                          <option value="">Select Layout</option>
                          {this.state.layoutItems.map((item) => (
                            <option key={item.ID} value={item.ID}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </li>
                    }
                    {this.state.editMode != "edit" ?
                      <li id='edit_button'>
                        <button onClick={(e) => this.editHandler(e)}>
                          <img className='editimage' src={`${this.props.siteurl}/SiteAssets/img/EditNew.svg`} alt="Edit-img" />
                          <span> Edit </span></button>
                      </li>
                      :
                      <><li id='draft_button'>
                        <button onClick={(e) => this.draftHandler(e)}>
                          <img className='draftimage' src={`${this.props.siteurl}/SiteAssets/img/EditNew.svg`} alt="Edit-img" />
                          <span> Draft </span></button>
                      </li>
                        <li id='publish_button'>
                          <button onClick={(e) => this.publishHandler(e)}>
                            <img className='publishimage' src={`${this.props.siteurl}/SiteAssets/img/EditNew.svg`} alt="Edit-img" />
                            <span> Publish </span></button>
                        </li></>
                    }
                  </ul>
                </div>
              </div>
              <section>


                {this.state.isClicked == "Home" ?

                  (<div className="container home_pg relative">
                    <div className="section-right">
                      {/* Banner and CEO Message */}
                      <div className="banner-ceo-message">
                        <div className="row">
                          {this.state.isInitialscreen[0] == true ?
                            <div className="col-md-8 Location-1">
                              {Components.map((item, key) => {
                                if (item.Position == 1) {
                                  return (
                                    <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                  )
                                }
                              })}
                            </div>
                            :
                            <div className="col-md-8 Location-1" >
                              {this.state.selectedComponents[1] && this.renderComponent(1)}
                            </div>
                          }

                          {this.state.isInitialscreen[1] == true ?
                            <div className="col-md-4 Location-2">
                              {Components.map((item, key) => {
                                if (item.Position == 2) {
                                  return (
                                    <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                  )
                                }
                              })}
                            </div>
                            :
                            <div className="col-md-4 Location-2" >
                              {this.state.selectedComponents[2] && this.renderComponent(2)}
                            </div>
                          }
                        </div>

                      </div>
                      {/* //Quicklinks- remo navigation */}
                      {this.state.isInitialscreen[2] == true ?
                        <div className="col-md-12 Location-3" >
                          {Components.map((item, key) => {
                            if (item.Position == 3) {
                              return (
                                <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                              )
                            }
                          })}
                        </div>
                        :
                        <div className="col-md-12 Location-3" >
                          {this.state.selectedComponents[3] && this.renderComponent(3)}
                        </div>
                      }

                      {/* Events(Mymeetings) Calendar and News Section */}
                      <div className="row section_bottom">
                        <div className="col-md-12">
                          <div className="events-calendar col-md-8">
                            {this.state.isInitialscreen[3] == true ?
                              <div className="Location-4 col-md-12" >
                                {Components.map((item, key) => {
                                  if (item.Position == 4) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className="Location-4 col-md-12" >
                                {this.state.selectedComponents[4] && this.renderComponent(4)}
                              </div>
                            }
                            {/* News */}
                            {this.state.isInitialscreen[4] == true ?
                              <div className="Location-5 col-md-12" >
                                {Components.map((item, key) => {
                                  if (item.Position == 5) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className="Location-5 col-md-12" >
                                {this.state.selectedComponents[5] && this.renderComponent(5)}
                              </div>
                            }

                            <div className="latest-news-announcements" id="latest-news-announcements">
                              {/* events and announcements */}
                              <div>
                                {this.state.isInitialscreen[9] == true ?
                                  // <>
                                  <div className="col-md-12 Location-10">
                                    {Components.map((item, key) => {
                                      if (item.Position == 10) {
                                        return (
                                          <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                        )
                                      }
                                    })}
                                  </div>
                                  :
                                  <div className="col-md-12 Location-10">
                                    {this.state.selectedComponents[10] && this.renderComponent(10)}
                                  </div>
                                }
                              </div>
                            </div>

                            <div id="social-and-gallery" className="images-social">
                              <div className="row row-res">
                                {this.state.isInitialscreen[10] == true ?
                                  <div className="col-md-6 Location-11">
                                    {Components.map((item, key) => {
                                      if (item.Position == 11) {
                                        return (
                                          <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                        )
                                      }
                                    })}
                                  </div>
                                  :
                                  <div className="col-md-6 Location-11">
                                    {this.state.selectedComponents[11] && this.renderComponent(11)}
                                  </div>
                                }
                                {this.state.isInitialscreen[11] == true ?
                                  <div className="col-md-6 Location-12">
                                    {Components.map((item, key) => {
                                      if (item.Position == 12) {
                                        return (
                                          <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                        )
                                      }
                                    })}
                                  </div>
                                  :
                                  <div className="col-md-6 Location-12">
                                    {this.state.selectedComponents[12] && this.renderComponent(12)}
                                  </div>
                                }
                              </div>
                            </div>
                          </div>

                          {/* Birthday, Climate, Quicklinks, Recentfile */}
                          <div className="col-md-4 ">
                            {this.state.isInitialscreen[5] == true ?
                              <div className='Location-6 col-md-12'>
                                {Components.map((item, key) => {
                                  if (item.Position == 6) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className='Location-6 col-md-12'>
                                {this.state.selectedComponents[6] && this.renderComponent(6)}
                              </div>
                            }
                            {this.state.isInitialscreen[6] == true ?
                              <div className='Location-7 col-md-12'>
                                {Components.map((item, key) => {
                                  if (item.Position == 7) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className='Location-7 col-md-12'>
                                {this.state.selectedComponents[7] && this.renderComponent(7)}
                              </div>
                            }
                            {this.state.isInitialscreen[7] == true ?
                              <div className='Location-8 col-md-12' >
                                {Components.map((item, key) => {
                                  if (item.Position == 8) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className='Location-8 col-md-12'>
                                {this.state.selectedComponents[8] && this.renderComponent(8)}
                              </div>
                            }
                            {this.state.isInitialscreen[8] == true ?
                              <div className="col-md-12 Location-9">
                                {Components.map((item, key) => {
                                  if (item.Position == 9) {
                                    return (
                                      <SearchElement DOMID={`search-${key}`} SelectID={`${item.selectId}`} ButtonId={`${item.buttonId}`} ComponentIndex={`${item.componentIndex}`} />
                                    )
                                  }
                                })}
                              </div>
                              :
                              <div className="col-md-12 Location-9">
                                {this.state.selectedComponents[9] && this.renderComponent(9)}
                              </div>
                            }
                          </div>

                        </div>
                      </div>

                      <RemoResponsive {...this.props} currentWebUrl="" CurrentPageserverRequestPath="" />
                      <Footer {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
                    </div>
                  </div>)
                  :
                  this.state.isClicked == "AnnouncementReadMore" ?
                    (
                      // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                      <AnnouncementsRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} useremail={undefined} createList={false}></AnnouncementsRm>
                    ) :

                    this.state.isClicked == "AnnouncementViewMore" ?
                      (
                        // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                        <AnnouncementsVm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></AnnouncementsVm>
                      ) :
                      this.state.isClicked == "BirthdayRm" ?
                        (
                          // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                          <BirthdayRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={this.state.itemID} useremail={undefined}></BirthdayRm>
                        ) :
                        this.state.isClicked == "CEOReadMore" ?
                          (
                            // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                            <CeoMessageRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={undefined}></CeoMessageRm>
                          ) :
                          this.state.isClicked == "DeptGalleryGridView" ?
                            (
                              // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                              <DeptGalleryGridView description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} homepage={''} ></DeptGalleryGridView>
                            ) :
                            this.state.isClicked == "DeptGalleryViewMore" ?
                              (
                                // <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}></NewsViewMore>
                                <DeptGalleryViewMore description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} homepage={''} ></DeptGalleryViewMore>
                              ) :
                              this.state.isClicked == "EventsViewMore" ?
                                (
                                  <EventsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></EventsViewMore>
                                ) :
                                this.state.isClicked == "GalleryGridView" ?
                                  (
                                    <GalleryGridView description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></GalleryGridView>
                                  ) :
                                  this.state.isClicked == "GalleryViewMore" ?
                                    (
                                      <GalleryViewMore description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}   ></GalleryViewMore>
                                    ) :

                                    this.state.isClicked == "HeroBannerReadMore" ?
                                      (
                                        <HeroBannerRm description={''} siteurl={''} context={this.props.context} userid={undefined} useremail={null} id={this.state.itemID} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></HeroBannerRm>
                                      ) :

                                      this.state.isClicked == "HeroBannerViewMore" ?
                                        (
                                          // <HeroBannerViewMore description={''} siteurl={''} context={this.props.context} userid={undefined}   onClickHome={(compName: any) => this.homeClickHandler(compName)} onViewMoreClick={null}></HeroBannerViewMore>
                                          <HeroBannerViewMore description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></HeroBannerViewMore>
                                        ) :
                                        // this.state.isClicked == "JobsRM" ?
                                        // (
                                        //   <JobsRM description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={undefined}></JobsRM>
                                        // ) :


                                        this.state.isClicked == "NewsReadMore" ?
                                          (
                                            <NewsReadMore description={''} siteurl={''} context={this.props.context} userid={undefined} siteID={undefined} useremail={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></NewsReadMore>
                                          ) :

                                          this.state.isClicked == "NewsViewMore" ?
                                            (
                                              <NewsViewMore description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></NewsViewMore>
                                            ) :

                                            null
                }
              </section>
            </div>
            <div id="loader-Icon" className="loader-block" style={{ display: "none" }}>
              <h1>Loader</h1>
              {/* <div id="progressContainer">
                <p id="currentListName">Creating: {this.state.currentList}</p>
                <ProgressBar now={this.state.progress} label={`${Math.round(this.state.progress)}%`} />
              </div> */}
            </div>
            {/* )} */}
          </div>
        }

        {this.state.showDropdown == true &&
          <div>
            <select value={this.state.selectedValue} onChange={(e) => this.handleSelectChange(e)}>
              <option value="">Select Layout</option>
              {this.state.layoutItems.map((item) => (
                <option key={item.ID} value={item.ID}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        }

        {this.state.showButton == true &&
          <div>
            <button onClick={() => this.showDropDown()}>Configure</button>
          </div>
        }

      </>

      //layouts
    );

  }
}



