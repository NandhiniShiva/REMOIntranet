import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery';
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
  layoutItems: any[],
  AvailableComponents: any[],
  // SelectedComponents: any[],
  isInitialscreen: any[];
  componentName: string;
  selectedComponents: any, // To store selected components by position

  landingPageComponentList: any[];
  isClicked: string;
  ceoMessegeID: any

}



export default class RemoHomePage extends React.Component<IRemoHomePageProps, IRemoHomePageState, {}> {

  constructor(props: IRemoHomePageProps, state: IRemoHomePageState) {
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
      layoutItems: [],
      AvailableComponents: [],
      componentName: "",
      landingPageComponentList: [],
      selectedComponents: {}, // To store selected components by position
      // SelectedComponents: [],
      // isInitialscreen: true,
      isInitialscreen: Array(10).fill(true), // Create an array of 10 `true` values
      isClicked: "",
      ceoMessegeID: null


    };
    spWeb = Web(this.props.siteurl);
    fetchList = true
    IsListCreate = false;
    console.log(spWeb, fetchList, IsListCreate);

  }
  public async componentDidMount() {
    debugger;
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
    // setTimeout(() => {
    // $('div[data-automation-id="CanvasControl"]').css('padding', '0px').css('margin', '0px');
    // $(".inner-pages-nav").hide();
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
  public async GetAllavailablecomponents() {
    debugger;
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
    debugger;
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


  // Working create list function

  // public async createSharePointLists() {
  //   debugger;
  //   try {

  //     const listNames: any[] = ListLibraryColumnDetails.map(list => list.name); // Collect list names
  //     const totalLists: number = listNames.length; // `totalLists` is the count of lists

  //     // Initialize progress
  //     this.setState({
  //       isCreatingLists: true,
  //       progress: 0,
  //       loadContent: false,
  //       currentList: null, // Ensure the current list is initially null
  //     });

  //     // Track if any list was newly created
  //     let anyListCreated = false;

  //     // Loop over each list for creation
  //     for (let i = 0; i < totalLists; i++) {

  //       const listName = listNames[i]; // Corrected list name assignment
  //       const columns = ListLibraryColumnDetails[i].columns; // Retrieve columns for the current list

  //       // Update current progress and list name
  //       this.setState({
  //         currentList: listName, // Dynamically update the list name being processed
  //         progress: Math.round(((i + 1) / totalLists) * 100), // Calculate progress
  //       });

  //       // Check if the list exists; if not, create it
  //       const listEnsureResult = await sp.web.lists.ensure(listName);

  //       if (listEnsureResult.created) {
  //         console.log(`List '${listName}' created successfully.`);
  //         await this.createSharePointColumns(listName, columns); // Create columns if the list was newly created
  //         anyListCreated = true;
  //       } else {
  //         await this.createSharePointColumns(listName, columns); // Create columns if the list was newly created
  //         console.log(`List '${listName}' already exists.`);
  //       }
  //     }

  //     // Final progress update
  //     this.setState({
  //       progress: 100,
  //       isCreatingLists: false,
  //       loadContent: true,
  //     });

  //     // Reset if no new lists were created
  //     if (!anyListCreated) {
  //       console.log("All lists already existed. No new lists were created.");
  //       this.setState({
  //         isCreatingLists: false,
  //         loadContent: true,
  //         progress: 0,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error creating lists:", error);

  //     // Handle errors and reset the state
  //     this.setState({
  //       isCreatingLists: false,
  //       currentList: null,
  //       progress: 0,
  //       loadContent: true,
  //     });
  //   }
  // }



  public async createSharePointLists() {
    try {
      debugger;

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
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
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
  public showcomponents(e: any, DOMID: string) {
    e.preventDefault();
    $("#" + DOMID + "").show();
    // this.setState({ isInitialscreen: false })
  }
  public setSelectedComponent(event: any, value: string, DOMID: string, key: number) {
    debugger;
    event.preventDefault();
    var position = key;
    this.setState((prevState) => ({
      selectedComponents: {
        ...prevState.selectedComponents,
        [position]: value, // Store selected component for the position
      },
    }));
    this.setState({
      componentName: event.target.value
    })
    if (value != null) {
      const selectedComponent = this.state.AvailableComponents.find(
        (item) => item.Title === value
      );
      // if (selectedComponent) {
      if (!Selectedcomponents.includes(selectedComponent.ComponentId)) {
        // Push the selected component's ID into the global variable
        Selectedcomponents.push(selectedComponent.ComponentId);
        // Remove the selected component from AvailableComponents
        const updatedAvailableComponents = this.state.AvailableComponents.filter(
          (item) => item.ComponentId !== selectedComponent.ComponentId
        );

        const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
          index === (key - 1) ? false : item
        );

        // Update the state
        this.setState({
          AvailableComponents: updatedAvailableComponents,
          isInitialscreen: updatedIsInitialscreen,
          // SelectedComponents: value,
        });
        $("#" + DOMID + "").hide();
        // console.log("Global Selected IDs:", SelectedComponentIDs);
        console.log("Updated Available Components:", updatedAvailableComponents);
      }
      // if (!Selectedcomponents.includes(value)) {
      //   // Add the value to Selectedcomponents
      //   const updatedSelected = [...this.state.SelectedComponents, value];

      //   // Remove the selected value from AvailableComponents
      //   const updatedAvailable = this.state.AvailableComponents.filter(
      //     (item) => item.Title !== value
      //   );
      //   // Update the state
      //   this.setState({
      //     SelectedComponents: updatedSelected,
      //     AvailableComponents: updatedAvailable,
      //   });
      //   console.log(this.state.AvailableComponents);

      // }
    } else {

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


  public readMoreHandler(isReadMoreClick: any) {
    console.log("isReadMoreClick", isReadMoreClick);
    // this.props.onReadMoreClick()
    // this.props.onReadMoreClick("yes", ItemID)
    alert(`hi homePage ${isReadMoreClick.yesNo, isReadMoreClick.id}`)
    this.setState({
      isClicked: isReadMoreClick.yesNo,
      ceoMessegeID: isReadMoreClick.id
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
    if (event.target.value == "layout_1") {
      this.setState(
        {
          showHomepage: true,
          showDropdown: false,
          selectedValue: event.target.value
        },
        async () => {
          // await this.createLayoutMasterList();
          await this.loaderInProgress();
          await this.GetAllavailablecomponents();
          await this.createSharePointLists();
          await this.HideInProgress();
        }
      );
    }


  };
  public Showclearbutton() {
    var input = $("#SearchInput").val();
    if (input == "") {
      $(".clear_part").hide();
    }
    else {
      $(".clear_part").addClass("active");
      $(".clear_part").show();
    }
  }
  public Search(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    $(".search_button").show();
    var query: string = $.trim(($("#SearchInput") as any).val());
    sp.web.lists.getByTitle(ComponentConfigurationList).items.filter(`substringof('${query}',Title)`).top(5000).orderBy("Title", true).get().then((resp) => {
      if (resp.length != 0) {
        this.setState({
          AvailableComponents: resp
        });
      }
    })
  }
  public Clear(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    $("#SearchInput").val("");
    $(".clear_part").removeClass("active");
    sp.web.lists.getByTitle(ComponentConfigurationList).items.top(5000).orderBy("Title", true).get().then((resp) => {
      if (resp.length != 0) {
        this.setState({
          AvailableComponents: resp
        });
      }
    });
  }

  public renderComponent(position: string | number) {
    const componentName = this.state.selectedComponents[position];
    switch (componentName) {
      case "Hero Banner":
        return <RemoHeroBanner {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      // <Climate siteurl={this.props.siteurl} context={this.props.context} description="" userid={this.props.userid} />;
      case "CEO Message":
        return <RemoCEOMessage {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} />
      case "Quick Links":
        return <RemoNavigations {...this.props} description="" createList={false} name="" onReadMoreClick={null} />
      case "My Meetings":
        return <RemoMyMeetings {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Birthday":
        return <RemoBirthday {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "News":
        return <RemoNews {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Climate":
        return <RemoClimate {...this.props} description="" />
      case "Manange Quick Links":
        return <RemoQuickLinks {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Events":
        return <RemoLatestEventsandAnnouncements {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Announcement":
        return <RemoHeroBanner {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />;
      case "Recent Files":
        return <RemoRecentFiles {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Images and Videos":
        return <RemoImagesandVideos {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      case "Social Media":
        return <RemoSocialMedia {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
      // Add more cases for all components
      default:
        return null;
    }
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;

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
              </div>
              <section>
                {this.state.isClicked != "yes" ?
                  <div className="container home_pg relative">
                    <div className="section-right">
                      {/* Banner and CEO Message */}
                      <div className="banner-ceo-message">
                        <div className="row">
                          {this.state.isInitialscreen[0] == true ?
                            <div className="col-md-8" >
                              {Components.map((item) => {
                                debugger;
                                if (item.Position == 1) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[1] && this.renderComponent(1)}
                            </>

                            // <RemoHeroBanner {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
                            // {Components.map(item => {
                            //   return (
                            //     <>
                            //       {item.Position == 1 && item.componentName == "Climate" ?
                            //                                   <RemoHeroBanner {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />

                            //         <Climate siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //         :
                            //         item.Position == 16 && item.componentName == "Headlines" ?
                            //           <Headlines siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //           :
                            //           item.Position == 16 && item.componentName == "LeadershipCorner" ?
                            //             <LeadershipCorner siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //             :
                            //             item.Position == 16 && item.componentName == "CorporateNews" ?
                            //               <CorporateNews siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //               :
                            //               item.Position == 16 && item.componentName == "EmployeeoftheMonth" ?
                            //                 <EmployeeoftheMonth siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                 :
                            //                 item.Position == 16 && item.componentName == "Announcements" ?
                            //                   <Announcements siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                   :
                            //                   item.Position == 16 && item.componentName == "Events" ?
                            //                     <Events siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                     :
                            //                     item.Position == 15 && item.componentName == "OffersPromoandBusinessapps" ?
                            //                       <OffersPromoandBusinessapps siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                       :
                            //                       item.Position == 15 && item.componentName == "Quiz" ?
                            //                         <Quiz siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                         :
                            //                         item.Position == 15 && item.componentName == "ImagesandVideos" ?
                            //                           <ImagesandVideos siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                           :
                            //                           item.Position == 15 && item.componentName == "Otherresources" ?
                            //                             <Otherresources siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                             :
                            //                             item.Position == 15 && item.componentName == "SocialMedia" ?
                            //                               <SocialMedia siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                               :
                            //                               item.Position == 15 && item.componentName == "Highlights" ?
                            //                                 <Highlights siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                            //                                 :
                            //                                 <>
                            //                                 </>

                            //       }

                            //     </>

                            //   )
                            // })
                          }

                          {this.state.isInitialscreen[1] == true ?
                            <div className="col-md-8" >
                              {Components.map((item) => {
                                debugger;
                                if (item.Position == 2) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[2] && this.renderComponent(2)}
                            </>
                            // <RemoCEOMessage {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} />
                          }
                        </div>
                      </div>
                      {this.state.isInitialscreen[2] == true ?
                        <div className="col-md-8" >
                          {Components.map((item) => {
                            debugger;
                            if (item.Position == 3) {
                              return (
                                <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                  <div id={item.selectId} style={{ display: "none" }}>
                                    <div className="input-arap relative">
                                      <input type="text" className="form-control"
                                        placeholder="Search for the contact here"
                                        id="SearchInput" onChange={() => this.Showclearbutton()} />
                                      <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                        {/* <img /> */}
                                      </button>
                                      <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                        {/* <img/> */}
                                        <span>Clear</span>
                                      </button>
                                      <ul>
                                        {handler.state.AvailableComponents.map((Items1) => {
                                          return (
                                            <li
                                              className='li-search-wrap'
                                              onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                            >
                                              <p className="people_name">{Items1.Title}</p>
                                            </li>
                                          )
                                        }
                                        )}
                                      </ul>
                                    </div>
                                  </div>

                                </>
                              )
                            }
                          })}
                        </div>
                        :
                        <>
                          {this.state.selectedComponents[3] && this.renderComponent(3)}
                        </>

                      }

                      {/* Events Calendar and News Section */}
                      <div className="row section_bottom">
                        <div className="col-md-8">
                          <div className="events-calendar">
                            {this.state.isInitialscreen[3] == true ?
                              <div className="col-md-8" >
                                {Components.map((item) => {
                                  debugger;
                                  if (item.Position == 4) {
                                    return (
                                      <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                        <div id={item.selectId} style={{ display: "none" }}>
                                          <div className="input-arap relative">
                                            <input type="text" className="form-control"
                                              placeholder="Search for the contact here"
                                              id="SearchInput" onChange={() => this.Showclearbutton()} />
                                            <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                              {/* <img /> */}
                                            </button>
                                            <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                              {/* <img/> */}
                                              <span>Clear</span>
                                            </button>
                                            <ul>
                                              {handler.state.AvailableComponents.map((Items1) => {
                                                return (
                                                  <li
                                                    className='li-search-wrap'
                                                    onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                  >
                                                    <p className="people_name">{Items1.Title}</p>
                                                  </li>
                                                )
                                              }
                                              )}
                                            </ul>
                                          </div>
                                        </div>

                                      </>
                                    )
                                  }
                                })}
                              </div>
                              :
                              <>
                                {this.state.selectedComponents[4] && this.renderComponent(4)}
                              </>
                            }
                          </div>
                          {this.state.isInitialscreen[4] == true ?
                            <div className="col-md-8" >
                              {Components.map((item) => {
                                debugger;
                                if (item.Position == 5) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[5] && this.renderComponent(5)}
                            </>

                          }

                          <div className="latest-news-announcements" id="latest-news-announcements">
                            <div className="row row-res">
                              {this.state.isInitialscreen[5] == true ?
                                <div className="col-md-8" >
                                  {Components.map((item) => {
                                    debugger;
                                    if (item.Position == 6) {
                                      return (
                                        <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                          <div id={item.selectId} style={{ display: "none" }}>
                                            <div className="input-arap relative">
                                              <input type="text" className="form-control"
                                                placeholder="Search for the contact here"
                                                id="SearchInput" onChange={() => this.Showclearbutton()} />
                                              <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                                {/* <img /> */}
                                              </button>
                                              <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                                {/* <img/> */}
                                                <span>Clear</span>
                                              </button>
                                              <ul>
                                                {handler.state.AvailableComponents.map((Items1) => {
                                                  return (
                                                    <li
                                                      className='li-search-wrap'
                                                      onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                    >
                                                      <p className="people_name">{Items1.Title}</p>
                                                    </li>
                                                  )
                                                }
                                                )}
                                              </ul>
                                            </div>
                                          </div>

                                        </>
                                      )
                                    }
                                  })}
                                </div>
                                :
                                <>
                                  {this.state.selectedComponents[6] && this.renderComponent(6)}
                                </>
                              }
                            </div>
                          </div>

                          <div id="social-and-gallery" className="images-social">
                            <div className="row row-res">
                              {this.state.isInitialscreen[6] == true ?
                                <div className="col-md-8" >
                                  {Components.map((item) => {
                                    debugger;
                                    if (item.Position == 7) {
                                      return (
                                        <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                          <div id={item.selectId} style={{ display: "none" }}>
                                            <div className="input-arap relative">
                                              <input type="text" className="form-control"
                                                placeholder="Search for the contact here"
                                                id="SearchInput" onChange={() => this.Showclearbutton()} />
                                              <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                                {/* <img /> */}
                                              </button>
                                              <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                                {/* <img/> */}
                                                <span>Clear</span>
                                              </button>
                                              <ul>
                                                {handler.state.AvailableComponents.map((Items1) => {
                                                  return (
                                                    <li
                                                      className='li-search-wrap'
                                                      onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                    >
                                                      <p className="people_name">{Items1.Title}</p>
                                                    </li>
                                                  )
                                                }
                                                )}
                                              </ul>
                                            </div>
                                          </div>

                                        </>
                                      )
                                    }
                                  })}
                                </div>
                                :
                                <>
                                  {this.state.selectedComponents[7] && this.renderComponent(7)}
                                </>
                              }
                              {this.state.isInitialscreen[7] == true ?
                                <div className="col-md-8" >
                                  {Components.map((item) => {
                                    debugger;
                                    if (item.Position == 8) {
                                      return (
                                        <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                          <div id={item.selectId} style={{ display: "none" }}>
                                            <div className="input-arap relative">
                                              <input type="text" className="form-control"
                                                placeholder="Search for the contact here"
                                                id="SearchInput" onChange={() => this.Showclearbutton()} />
                                              <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                                {/* <img /> */}
                                              </button>
                                              <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                                {/* <img/> */}
                                                <span>Clear</span>
                                              </button>
                                              <ul>
                                                {handler.state.AvailableComponents.map((Items1) => {
                                                  return (
                                                    <li
                                                      className='li-search-wrap'
                                                      onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                    >
                                                      <p className="people_name">{Items1.Title}</p>
                                                    </li>
                                                  )
                                                }
                                                )}
                                              </ul>
                                            </div>
                                          </div>

                                        </>
                                      )
                                    }
                                  })}
                                </div>
                                :
                                <>
                                  {this.state.selectedComponents[8] && this.renderComponent(8)}
                                </>
                              }
                            </div>
                          </div>
                        </div>

                        {/* Sidebar Components */}
                        <div className="col-md-4">
                          {this.state.isInitialscreen[8] == true ?
                            <div className="col-md-4">

                              {Components.map((item) => {
                                if (item.Position == 8) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[9] && this.renderComponent(9)}
                            </>
                          }
                          {this.state.isInitialscreen[9] == true ?
                            // <>
                            <div className="col-md-4">

                              {Components.map((item) => {
                                if (item.Position == 9) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[10] && this.renderComponent(10)}
                            </>
                          }
                          {this.state.isInitialscreen[9] == true ?
                            <div className="col-md-4">

                              {Components.map((item) => {
                                if (item.Position == 9) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[10] && this.renderComponent(10)}
                            </>
                          }
                          {this.state.isInitialscreen[10] == true ?
                            <div className="col-md-4">
                              {Components.map((item) => {
                                if (item.Position == 10) {
                                  return (
                                    <><button id={item.buttonId} onClick={(e) => this.showcomponents(e, item.selectId)}>Add Component</button>
                                      <div id={item.selectId} style={{ display: "none" }}>
                                        <div className="input-arap relative">
                                          <input type="text" className="form-control"
                                            placeholder="Search for the contact here"
                                            id="SearchInput" onChange={() => this.Showclearbutton()} />
                                          <button className="form-control search_button" onClick={(e) => this.Search(e)}>
                                            {/* <img /> */}
                                          </button>
                                          <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => this.Clear(e)}>
                                            {/* <img/> */}
                                            <span>Clear</span>
                                          </button>
                                          <ul>
                                            {handler.state.AvailableComponents.map((Items1) => {
                                              return (
                                                <li
                                                  className='li-search-wrap'
                                                  onClick={(e) => handler.setSelectedComponent(e, Items1.Title, item.selectId, item.componentIndex)}
                                                >
                                                  <p className="people_name">{Items1.Title}</p>
                                                </li>
                                              )
                                            }
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                    </>
                                  )
                                }
                              })}
                            </div>
                            :
                            <>
                              {this.state.selectedComponents[11] && this.renderComponent(11)}
                            </>
                          }
                        </div>
                      </div>

                      <RemoResponsive {...this.props} currentWebUrl="" CurrentPageserverRequestPath="" />
                      <Footer {...this.props} description="" createList={false} name={this.state.componentName} onReadMoreClick={null} />
                    </div>
                  </div>
                  :
                  // <div>Read More</div>
                  <CeoMessageRm description={''} siteurl={''} context={this.props.context} userid={undefined} id={this.state.ceoMessegeID}></CeoMessageRm>
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



