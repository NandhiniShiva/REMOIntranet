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
import pnp from 'sp-pnp-js';
import { Web } from '@pnp/sp/webs';
import { sp, } from "@pnp/sp/presets/all";
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
import { LayoutsDetails } from './ServiceProvider/Layoutconfiguration';
import { PositionDetails } from './ServiceProvider/PositionConfiguration';
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
import { SPComponentLoader } from '@microsoft/sp-loader';
sp.setup({
  sp: {
    baseUrl: "https://remodigital.sharepoint.com/sites/RemoIntranetProduct"
  }
});

// let NewWeb: any = WEB.NewWeb;
let spWeb: any;
let fetchList: any;
let IsListCreate: any;
const PictureGalleryName = listNames.PictureGallery;
var ComponentConfigurationList = listNames.ComponentMaster;
var Draftmaster = listNames.DraftMaster;
var ComponentallocationList = listNames.ComPonentAllocationMaster;
var LayoutMasterList = listNames.LayoutMaster;
var User: any;
var UserEmail: any;

var Selectedcomponents: any = [];
var Components = PositionDetails;
console.log(Draftmaster);

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
    SPComponentLoader.loadCss('https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SiteAssets/css/newStyle.css?v=0.1');

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
    const userDetails = new CurrentUserDetails();
    await userDetails
      .getCurrentUserDetails()
      .then(async (data) => {
        if (data) {

          console.log("Current user details", data);
          console.log("data details", data?.Department, data?.Designation);

        } else {
          console.warn("No user details were fetched.");
        }
      })
      .catch((err) => {
        console.error("Error fetching current user details:", err);
      });

    this.checkUserAdmin();
  }

  public checkEditMode() {
    const url: any = new URL(window.location.href);
    const mode = url.searchParams.get("Mode");
    this.setState({
      editMode: mode
    })
  }

  public async checkUserAdmin() {
    try {
      // Fetch all site users

      const CurrentUserAdmin = await sp.web.currentUser.get()
        .then(user => user.IsSiteAdmin);
      this.setState({
        isCurrentUserAdmin: CurrentUserAdmin
      })

    } catch (error) {
      console.error("Error checking site admin status:", error);
    }
  }

  public async getAllocatedComponents() {
    try {
      const listName = (this.state.isCurrentUserAdmin && this.state.editMode) ? Draftmaster : ComponentallocationList;
      // Fetch items from the SharePoint list
      let response = await sp.web.lists.getByTitle(listName).items.filter(`Title eq '${this.state.selectedValue}'`).get();
      if (listName === ComponentallocationList && response.length === 0) {
        console.log("No items found in the SharePoint list.");
        return;
      } else if (listName === Draftmaster && response.length === 0) {
        // Fetch from ComponentallocationList if no items found in Draftmaster
        response = await sp.web.lists.getByTitle(ComponentallocationList).items.filter(`Title eq '${this.state.selectedValue}'`).get();
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

    } catch (error) {
      console.error("Error fetching allocated components:", error);
    }
  }

  public async GetAllavailablecomponents() {
    try {
      var allcomponents = [];
      // const listName = (this.state.isCurrentUserAdmin && this.state.editMode) ? Draftmaster : ComponentallocationList;
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
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
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
    const loadContent = document.getElementById('load-content');
    const loaderIcon = document.getElementById('loader-Icon');

    if (loadContent) {
      loadContent.style.display = 'block';
    }

    if (loaderIcon) {
      loaderIcon.style.display = 'none';
    }
  }


  public async getCurrentUser() {
    try {
      const url: URL = new URL(window.location.href);
      console.log(url);

      const reactHandler = this;
      User = reactHandler.props.userid;
      const profile = await pnp.sp.profiles.myProperties.get();
      UserEmail = profile.Email;

      // Check if the UserProfileProperties collection exists and has the Department and Designation properties
      if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
        const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
        console.log(departmentProperty, designationProperty);

      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
      } else {
        console.log("Picture Library Created already");
        return;
      }

    } catch (error) {
      console.error("Error creating Picture Library:", error);
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
          // const updatedAvailableComponents = this.state.AvailableComponents.filter(
          //   (item) => item.ComponentId !== selectedComponent.ComponentId
          // );
          const updatedAvailableComponents = Array.from(
            new Map(
              this.state.AvailableComponents
                .filter((item) => item.ComponentId !== selectedComponent.ComponentId)
                .map((item) => [item.Title, item]) // Use ComponentName as key
            ).values()
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
        .getByTitle(Draftmaster)
        .items.filter(`Position eq '${position}'`)
        .get();

      if (existingItems.length > 0) {
        // If an item exists for the position, update it
        const itemId = existingItems[0].Id; // Get the item ID
        await sp.web.lists.getByTitle(Draftmaster).items.getById(itemId).update({
          Title: this.state.selectedValue,
          Component: value,
          ComponentID: selectedComponent,
        });

        console.log(`Item at position ${position} updated successfully.`);
      } else {
        // If no item exists, create a new one
        await sp.web.lists.getByTitle(Draftmaster).items.add({
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

  public async handlePublish() {
    try {
      // Fetch all items from the Draftmaster list
      const draftItems = await sp.web.lists.getByTitle(Draftmaster).items.filter(`Title eq '${this.state.selectedValue}'`).get();

      if (draftItems.length === 0) {
        console.log("No items to publish.");
        return;
      }

      // Loop through each draft item and copy it to PublishedList
      for (const item of draftItems) {
        await sp.web.lists.getByTitle(ComponentallocationList).items.add({
          Title: item.Title,
          Component: item.Component,
          ComponentID: item.ComponentID,
          Position: item.Position,
        });

        // Delete the item from Draftmaster after successfully copying
        await sp.web.lists.getByTitle(Draftmaster).items.getById(item.Id).recycle();
      }

      console.log("All items published successfully.");

    } catch (error) {
      console.error("Error publishing items:", error);
    }
  }



  public async getLayout() {
    try {
      this.setState({
        layoutItems: LayoutsDetails
      });

    } catch (error) {
      console.log("Error in getLayout", error);
    }
  }



  public readMoreHandler(ReadMoreData: any) {


    console.log("Name", ReadMoreData.Name, "Id", ReadMoreData.Id);


    this.setState({
      isClicked: ReadMoreData.Name,
      itemID: ReadMoreData.Id,
      showDropdown: false
    })


  }

  public async handleSelectChange(event: any) {
    console.log("selected option", event.target.value);
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

  public Showclearbutton(ID: any) {
    var input = $("#SearchInput").val();
    if (input == "") {
      $(".clear_part").hide();
      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.remove("active"); // Add the active class
      }
    }
    else {

      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.add("active"); // Add the active class
      }
    }
  }

  public showcomponents(e: any, DOMID: string) {
    e.preventDefault();
    if (this.state.isCurrentUserAdmin === true && this.state.editMode === "edit") {

      $("#" + DOMID).toggle();
      this.showSearchbtn();
    }
  }
  public handleInputChange(ID: any, SelectID: string) {
    var input = $("#SearchInput").val();
    $("#" + SelectID).show();
    this.showSearchbtn();
    if (input == "") {

      const inputElement = document.querySelector(`.${ID}`); // Find the input by DOMID
      if (inputElement) {
        inputElement.classList.remove("active"); // Add the active class
      }
    }
    else {

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


  public async clearHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, SelectID: any) {
    e.preventDefault();
    // Clear the search input and reset any active state
    $("#SearchInput").val("");
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
    let existingItems = await sp.web.lists
      .getByTitle(Draftmaster)
      .items.filter(`Position eq '${Position}' and Title eq '${this.state.selectedValue}'`)
      .get();
    if (existingItems.length > 0) {
      // If an item exists for the position, update it
      const itemId = existingItems[0].Id; // Get the item ID
      await sp.web.lists.getByTitle(Draftmaster).items.getById(itemId).recycle();
      
    }else{
       existingItems = await sp.web.lists
      .getByTitle(ComponentallocationList)
      .items.filter(`Position eq '${Position}' and Title eq '${this.state.selectedValue}'`)
      .get();
      if (existingItems.length > 0) { // Ensure the item exists before accessing it
      const itemId = existingItems[0].Id; // Get the item ID
      await sp.web.lists.getByTitle(ComponentallocationList).items.getById(itemId).recycle();
      }
    }
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
      const listName = (this.state.isCurrentUserAdmin && this.state.editMode) ? Draftmaster : ComponentallocationList;
      // Check if the new layout already exists
      const isLayoutExist = await sp.web.lists
        .getByTitle(listName)
        .items.filter(`Title eq '${value}'`)
        .get();

      if (!isLayoutExist || isLayoutExist.length === 0) {
        // Fetch all existing items from the previous layout
        const existingItems = await sp.web.lists
          .getByTitle(listName)
          .items.filter(`Title eq '${previousLayout}'`)
          .get();

        if (existingItems.length === 0) {
          console.log("No items found to duplicate.");
          return;
        }

        // Duplicate each existing item with the new layout title
        await Promise.all(
          existingItems.map((item) =>
            sp.web.lists.getByTitle(listName).items.add({
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
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?';
    window.location.href = url;
  }
  public async publishHandler(event: any) {
    event.preventDefault();
    await this.handlePublish();
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
          <button id={ButtonId}
            onClick={(e) => handler.showcomponents(e, SelectID)}
          >
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
                    {this.state.isCurrentUserAdmin == true && this.state.editMode == "edit" &&
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
                      <AnnouncementsRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} useremail={undefined} createList={false}></AnnouncementsRm>
                    ) :

                    this.state.isClicked == "AnnouncementViewMore" ?
                      (
                        <AnnouncementsVm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></AnnouncementsVm>
                      ) :
                      this.state.isClicked == "BirthdayRm" ?
                        (
                          <BirthdayRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={this.state.itemID} useremail={undefined}></BirthdayRm>
                        ) :
                        this.state.isClicked == "CEOReadMore" ?
                          (
                            <CeoMessageRm description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={undefined}></CeoMessageRm>
                          ) :
                          this.state.isClicked == "DeptGalleryGridView" ?
                            (
                              <DeptGalleryGridView description={''} siteurl={''} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} homepage={''} ></DeptGalleryGridView>
                            ) :
                            this.state.isClicked == "DeptGalleryViewMore" ?
                              (
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
                                          <HeroBannerViewMore description={''} siteurl={''} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></HeroBannerViewMore>
                                        ) :


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

            </div>
            {/* )} */}
          </div>
        }

        {this.state.showDropdown == true &&
          <>
            <header className='layout_header'></header>
            <div className="selectLayers">
              <div className="selectYours"> Select Your Layout</div>
              <div className="Layout-content">
                <div className="SelectLayout cont-1">
                  <div className="SElect-Layout-img">
                    <img src={`${this.props.siteurl}/SiteAssets/img/layout%201.PNG`} data-themekey="#" />
                  </div>
                  <div className="LayoutText">Layout 1</div>
                </div>
                <div className="SelectLayout cont-2">
                  <div className="SElect-Layout-img">
                    <img src="#" data-themekey="#" />
                  </div>
                  <div className="LayoutText">Layout 2</div>
                </div>
              </div>
            </div>
            <div>
              <select value={this.state.selectedValue} onChange={(e) => this.handleSelectChange(e)}>
                <option value="">Select Layout</option>
                {this.state.layoutItems.map((item) => (
                  <option key={item.ID} value={item.ID}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div></>
        }

        {this.state.showButton == true &&
          <div>
            <button onClick={() => this.showDropDown()}>Configure</button>
          </div>
        }

      </>

    );

  }
}



