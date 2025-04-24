import * as React from 'react';
// import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as $ from 'jquery';
// import GlobalSideNav from '../components/Header/GlobalSideNav';
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
// import pnp from 'sp-pnp-js';
import { Web } from '@pnp/sp/webs';
import { ChoiceFieldFormatType, FieldUserSelectionMode, sp, UrlFieldFormatType } from "@pnp/sp/presets/all";
// import { sp, } from "@pnp/sp/presets/all";
// import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
import { LayoutsDetails } from './ServiceProvider/Layoutconfiguration';
import { PositionDetails } from './ServiceProvider/PositionConfiguration';
// import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
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
// import { ListCreation } from './ServiceProvider/List&ColumnCreation';
import Swal from 'sweetalert2';
// import "../components/ServiceProvider/Styles/newStyle.css"
import "../components/ServiceProvider/Styles/Responsive.css"
import '../components/ServiceProvider/Styles/SPNativeStyleOverriding.css'
import '../components/ServiceProvider/Styles/Style.css'
// import {Images} from '../components/ServiceProvider/Images';


// console.log(Images);


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
var UserID: any;
var Selectedcomponents: any = [];
var Components = PositionDetails;
var ComponentsatInitalStage = {};


export interface IRemoHomePageState {
  progress: any,
  isCreatingLists: boolean,
  loadContent: boolean,
  currentList: any,
  showButton: boolean,
  // showDropdown: boolean,
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
  itemID: any,
  SiteLogo: string;
  draggedItemKey: any,
}



export default class RemoLayout2 extends React.Component<IRemoHomePageProps, IRemoHomePageState, {}> {
  constructor(props: IRemoHomePageProps, _state: IRemoHomePageState) {
    super(props);
    console.log(this.props.description)
    const [isAdmin, Mode, Userid] = this.props.description.split(',').map(value => value.trim());
    UserID = Userid;
    SPComponentLoader.loadCss('https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SiteAssets/css/newStyle.css?v=0.1');
    this.state = {
      progress: 0,
      isCreatingLists: false,
      loadContent: false,
      currentList: "",
      showButton: true,
      // showDropdown: false,
      showHomepage: false,
      selectedValue: "layout_2",
      selectedDept: null,
      layoutItems: [],
      AvailableComponents: [],
      componentName: "",
      landingPageComponentList: [],
      selectedComponents: {}, // To store selected components by position
      isInitialscreen: Array(12).fill(true), // Create an array of 10 `true` values
      isClicked: "Home",
      ceoMessegeID: null,
      isCurrentUserAdmin: Boolean(isAdmin),
      editMode: Mode,
      isEditFalse: true,
      isSearchActive: false,
      itemID: null,
      SiteLogo: "",
      draggedItemKey: null,
    };
    spWeb = Web(this.props.siteurl);
    fetchList = true
    IsListCreate = false;
    console.log(spWeb, fetchList, IsListCreate);
  }
  public async componentDidMount() {
    await this.GetAllavailablecomponents();
    await this.getAllocatedComponents();
    // this.slidercontrol();


    document.addEventListener("mousedown", function (event: any) {
      const hideComponents = document.querySelectorAll(".hide_components");
      hideComponents.forEach((componentDiv: any) => {
        const selectId = componentDiv.getAttribute("data-selectid"); // Get dynamic SelectID
        const button = document.querySelector(`[data-selectid="${selectId}"]`); // Find button using SelectID
        if (componentDiv && !componentDiv.contains(event.target) && button && !button.contains(event.target)) {
          componentDiv.style.display = "none"; // Hide component when clicking outside
        }
      });
      const isClickInside = event.target.closest(".Drag_part");

      // If click is outside any .Drag_part, remove the border
      if (!isClickInside) {
        const allWithBorder = document.querySelectorAll(".Drag_part.border");
        allWithBorder.forEach((el) => {
          el.classList.remove("border");
          el.setAttribute("draggable", "false");
        })

      }
    });

  }


  public async getAllocatedComponents() {
    try {
      const listName = (this.state.isCurrentUserAdmin && this.state.editMode === "edit") ? Draftmaster : ComponentallocationList;
      // Fetch items from the SharePoint list
      let response = await sp.web.lists.getByTitle(listName).items.filter(`Title eq '${this.state.selectedValue}'`).get();
      if (listName === ComponentallocationList && response.length === 0) {
        console.log("No items found in the SharePoint list.");
        // return;
      } else if (listName === Draftmaster && response.length === 0) {
        // Fetch from ComponentallocationList if no items found in Draftmaster
        response = await sp.web.lists.getByTitle(ComponentallocationList).items.filter(`Title eq '${this.state.selectedValue}'`).get();
        if (response.length === 0) {
          console.log("No items found in the SharePoint list.");
          // return;
        } else {
          await Promise.all(
            response.map((item) =>
              sp.web.lists.getByTitle(listName).items.add({
                Title: String(this.state.selectedValue), // Ensure string
                Component: String(item.Component), // Ensure string
                ComponentID: String(item.ComponentID), // Ensure string (if expected as text)
                Position: String(item.Position)
                // Add all other relevant fields here
              })
            )
          );
        }
      }
      const selectedComponents: { [key: number]: { name: string; id: number } } = {};
      let updatedIsInitialscreen = [...this.state.isInitialscreen];
      let updatedAvailableComponents = [...this.state.AvailableComponents];
      let ComponentID: any = [];
      response.forEach((item) => {
        if (item.Position != null && item.Component != null) {
          if (!ComponentID.includes(item.ComponentID)) {
            ComponentID.push(item.ComponentID);
            selectedComponents[item.Position] = {
              name: item.Component,
              id: item.ComponentID
            };
          }

          if (!ComponentID.includes(item.ComponentID)) {
            ComponentID.push(item.ComponentID);
            // Update selectedComponents by position
            selectedComponents[item.Position] = {
              name: item.Component,
              id: item.ComponentID
            };
          }

          // selectedComponents[item.Position] = {name: item.Component, id:item.ComponentID};

          // Update isInitialscreen to mark the position as not initial
          updatedIsInitialscreen = updatedIsInitialscreen.map((screen, index) =>
            index === item.Position - 1 ? false : screen
          );

          // Remove the component from AvailableComponents
          updatedAvailableComponents = updatedAvailableComponents.filter(
            (available) => available.Title !== item.Component
          );
        }
      })
      ComponentsatInitalStage = selectedComponents;
      console.log(ComponentsatInitalStage);


      // Update the state with the aggregated changes
      this.setState({
        AvailableComponents: updatedAvailableComponents,
        selectedComponents: selectedComponents,
        isInitialscreen: updatedIsInitialscreen,
      }, () => {
        this.handleSelectedComponents(this.state.selectedComponents)
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



  public loaderInProgress() {
    const loaderIcon = document.getElementById('loader-Icon');
    const loadContent = document.getElementById('load-content');
    if (loaderIcon) {
      loaderIcon.style.display = 'flex';
    }
    if (loadContent) {
      loadContent.style.display = 'none';
    }

  }
  public HideInProgress() {
    setTimeout(() => {
      const loadContent = document.getElementById('load-content');
      const loaderIcon = document.getElementById('loader-Icon');

      if (loadContent) {
        loadContent.style.display = 'block';
      }

      if (loaderIcon) {
        loaderIcon.style.display = 'none';
      }
    }, 5000);
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


  // public showDropDown() {
  //   this.getLayout();
  //   this.setState({
  //     showButton: false,
  //     showDropdown: true,
  //   })
  // }


  public async setSelectedComponent(event: any, ComponentName: string, DOMID: string, key: number, ComponentId: number) {
    try {
      event.preventDefault();
      const position = key;

      this.setState((prevState) => ({
        selectedComponents: {
          ...prevState.selectedComponents,
          [position]: {
            name: ComponentName,
            id: ComponentId
          }
        }
      }));

      this.setState({
        componentName: event.target.value
      });

      if (ComponentName != null) {
        const selectedComponent = this.state.AvailableComponents.find(
          (item) => item.Title === ComponentName
        );

        if (selectedComponent && !Selectedcomponents.includes(selectedComponent.ComponentId)) {
          // Add to global selected list
          Selectedcomponents.push(selectedComponent.ComponentId);

          //Update available components and screen states
          const updatedAvailableComponents = this.state.AvailableComponents.filter(
            (item) => item.ComponentId !== selectedComponent.ComponentId
          );
          // const updatedAvailableComponents = Array.from(
          //   new Map(
          //     this.state.AvailableComponents
          //       .filter((item) => item.ComponentId !== selectedComponent.ComponentId)
          //       .map((item) => [item.Title, item]) // Use ComponentName as key
          //   ).values()
          // );


          const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
            index === (key - 1) ? false : item
          );

          this.setState({
            AvailableComponents: updatedAvailableComponents,
            isInitialscreen: updatedIsInitialscreen,
          });
          $("#" + DOMID).hide();

          Swal.fire({
            title: 'Components was added successfully',
            icon: "success",
            showConfirmButton: true,
          })


          console.log("Updated Available Components:", updatedAvailableComponents);
        }

        // Ensure the SharePoint list exists
        const listEnsureResult = await sp.web.lists.ensure(ComponentallocationList);
        if (listEnsureResult.created) {
          console.log(`List '${ComponentallocationList}' created successfully.`);
        } else {
          console.log(`List '${ComponentallocationList}' already exists.`);
        }
        await this.handleSelectedComponents(this.state.selectedComponents)
        // await this.handleComponentAllocation(ComponentName, selectedComponent.ComponentId, position);

        console.log("Item successfully added to the list.");
      } else {
        console.log("No value selected. Skipping addition to the list.");
      }

      // this.handleDraft();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  public handleSelectedComponents(data: {}) {
    var isComponentChanged = false;
    if (JSON.stringify(ComponentsatInitalStage) !== JSON.stringify(this.state.selectedComponents)) {
      isComponentChanged = true;
    }
    this.props.selectedComponents({ AllocatedComponentsDetails: data, DataChanged: isComponentChanged })
  }
  public async saveAsDraft() {
    try {
      let ComponentDetails = this.state.selectedComponents
      Object.entries(ComponentDetails).forEach(async ([position, item]: [string, any]) => {
        // console.log(item);
        var value = item.name;
        var selectedComponent = item.id;
        // var position: any= key;
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

          // console.log(`Item at position ${position} updated successfully.`);
        } else {
          // If no item exists, create a new one
          await sp.web.lists.getByTitle(Draftmaster).items.add({
            Title: this.state.selectedValue,
            Component: value,
            ComponentID: selectedComponent,
            Position: String(position),
          });

          // console.log(`New item created at position ${position}.`);
        }
      })
      // Fetch the item for the specific position

    } catch (error) {
      console.error("Error handling component allocation:", error);
    }
  }

  public async handleComponentAllocation(value: string, selectedComponent: string, position: any) {
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

        // console.log(`Item at position ${position} updated successfully.`);
      } else {
        // If no item exists, create a new one
        await sp.web.lists.getByTitle(Draftmaster).items.add({
          Title: this.state.selectedValue,
          Component: value,
          ComponentID: selectedComponent,
          Position: String(position),
        });

        // console.log(`New item created at position ${position}.`);
      }
    } catch (error) {
      console.error("Error handling component allocation:", error);
    }
  }

  public async handlePublish() {
    try {
      let ComponentDetails = this.state.selectedComponents
      Object.entries(ComponentDetails).forEach(async ([position, item]: [string, any]) => {
        var value = item.name;
        var selectedComponent = item.id;
        // var position: any= key;
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
        } else {
          // If no item exists, create a new one
          await sp.web.lists.getByTitle(ComponentallocationList).items.add({
            Title: this.state.selectedValue,
            Component: value,
            ComponentID: selectedComponent,
            Position: String(position),
          });
        }
      })
      // Fetch all items from the Draftmaster list
      const draftItems = await sp.web.lists.getByTitle(Draftmaster).items.filter(`Title eq '${this.state.selectedValue}'`).get();

      if (draftItems.length === 0) {
        console.log("No items to publish.");
        return;
      }

      for (const item of draftItems) {
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
    this.setState({
      isClicked: ReadMoreData.Name,
      itemID: ReadMoreData.Id,
      // showDropdown: false
    })
  }

  public async setActiveLayout(selectedLayout: string) {
    try {
      const layoutList = sp.web.lists.getByTitle(LayoutMasterList);
      const selectedItem = this.state.layoutItems.find((item) => item.ID === selectedLayout);
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
      this.setState({ isInitialscreen: Array(12).fill(true) })

    } catch (error) {
      console.error("Error in setActiveLayout:", error);
    }
  }

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
    let updatedSelectedComponent: any = [];
    // let existingItems = await sp.web.lists
    //   .getByTitle(Draftmaster)
    //   .items.filter(`Position eq '${Position}' and Title eq '${this.state.selectedValue}'`)
    //   .get();
    // if (existingItems.length > 0) {
    //   // If an item exists for the position, update it
    //   // const itemId = existingItems[0].Id; // Get the item ID
    //   const itemName = existingItems[0].Component;
    //   // await sp.web.lists.getByTitle(Draftmaster).items.getById(itemId).recycle();

    //   updatedSelectedComponent = Object.fromEntries(
    //     Object.entries(this.state.selectedComponents).filter(
    //       ([, item]: [string, { name: string; id: string }]) => item.name !== itemName)
    //     // ([key, item]) => item.name !== itemName)
    //   );

    // }
    updatedSelectedComponent = Object.fromEntries(
      Object.entries(this.state.selectedComponents).filter(
        ([, item]: [string, { name: string; id: string }]) => item.name !== value)
      // ([key, item]) => item.name !== itemName)
    );

    await sp.web.lists.getByTitle(ComponentConfigurationList).items.top(5000).orderBy("Title", true).get().then(async (resp) => {
      if (resp.length != 0) {
        resp.forEach((items) => {
          if (items.Title == value) {
            data = items;
          }
        })
      }
      if (data) {
        updatedAvailableComponents = [...this.state.AvailableComponents, data]; // Include new data
        // Remove duplicates and sort by ComponentId in ascending order
        updatedAvailableComponents = updatedAvailableComponents
          .filter((value, index, self) => index === self.findIndex((t) => t.ComponentId === value.ComponentId)).sort((a, b) => a.ComponentId - b.ComponentId);
        // updatedAvailableComponents.sort((a, b) => a.ComponentId - b.ComponentId); // Sort by componentid in ascending order
        if (Selectedcomponents.includes(data.ComponentId)) {
          Selectedcomponents = Selectedcomponents.filter((id: any) => id !== data.ComponentId);
          console.log("Item removed from Selectedcomponents:", data.ComponentId);
        }

      }
      const updatedIsInitialscreen = this.state.isInitialscreen.map((item, index) =>
        index === (Position - 1) ? true : item
      );
      await this.handleSelectedComponents(this.state.selectedComponents)
      this.setState({
        AvailableComponents: updatedAvailableComponents,
        selectedComponents: updatedSelectedComponent,
        isInitialscreen: updatedIsInitialscreen,
      });
    });

    Swal.fire({
      title: 'Components removed successfully',
      icon: "success",
      showConfirmButton: true,
    })


  }

  public renderComponent(position: number) {
    const componentName = this.state.selectedComponents[position]?.name;
    const inputElement = document.querySelector(`.Location-${position}`);
    if (inputElement) {
      inputElement.classList.add('Drag_part');
    }

    const renderWithRemoveButton = (Component: any, props = {}) => {
      return (
        <>
          {this.state.isCurrentUserAdmin == true && this.state.editMode == "edit" &&
            <>
              <button className="Remove_Btn" onClick={(e) => this.removeComponent(e, componentName, position)}>
                <img src={require("./ServiceProvider/Assets/Img/remove-icon.svg")} alt="remove-btn" />
              </button>
            </>
          }
          <Component {...this.props} {...props} draggable={false} />
        </>
      );
    };

    switch (componentName) {
      case "Hero Banner":
        return renderWithRemoveButton(RemoHeroBanner, { description: `${this.state.isCurrentUserAdmin}, ${this.state.editMode}`, createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });
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
        return renderWithRemoveButton(RemoQuickLinks, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick), userid: UserID });

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


  // public renderComponent(position: number) {
  //   const componentName = this.state.selectedComponents[position]?.name;
  //   // Define a function to render components dynamically
  //   const renderWithRemoveButton = (Component: any, props = {}) => {
  //     return (
  //       <>
  //         {this.state.isCurrentUserAdmin == true && this.state.editMode == "edit" &&
  //           <>
  //             <button className="Remove_Btn" onClick={(e) => this.removeComponent(e, componentName, position)}>
  //               <img src={require("./ServiceProvider/Assets/Img/remove.svg")} alt="remove-btn" />
  //             </button>
  //           </>
  //         }

  //         <Component {...this.props} {...props} />
  //       </>
  //     );
  //   };

  //   switch (componentName) {
  //     case "Hero Banner":
  //       return renderWithRemoveButton(RemoHeroBanner, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });
  //     case "CEO Message":
  //       return renderWithRemoveButton(RemoCEOMessage, {
  //         description: "",
  //         createList: false,
  //         name: this.state.componentName,
  //         onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)
  //       });

  //     case "Quick Links":
  //       return renderWithRemoveButton(RemoNavigations, { description: "", createList: false, name: "" });

  //     case "My Meetings":
  //       return renderWithRemoveButton(RemoMyMeetings, { description: "", createList: false, name: this.state.componentName });

  //     case "Birthday":
  //       return renderWithRemoveButton(RemoBirthday, {
  //         description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)
  //       });

  //     case "News":
  //       return renderWithRemoveButton(RemoNews, { description: position, createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });

  //     case "Climate":
  //       return renderWithRemoveButton(RemoClimate, { description: "" });

  //     case "Manange Quick Links":
  //       return renderWithRemoveButton(RemoQuickLinks, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick), userid: UserID });

  //     case "Events and Announcements":
  //       return renderWithRemoveButton(RemoLatestEventsandAnnouncements, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });
  //     // case "Announcement":
  //     //   return renderWithRemoveButton(RemoLatestEventsandAnnouncements, { description: "", createList: false, name: this.state.componentName });

  //     case "Recent Files":
  //       return renderWithRemoveButton(RemoRecentFiles, { description: "", createList: false, name: this.state.componentName });

  //     case "Images and Videos":
  //       return renderWithRemoveButton(RemoImagesandVideos, { description: "", createList: false, name: this.state.componentName, onReadMoreClick: (onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick) });

  //     case "Social Media":
  //       return renderWithRemoveButton(RemoSocialMedia, { description: "", createList: false, name: this.state.componentName });

  //     default:
  //       return null;
  //   }
  // }

  public editHandler(event: any) {
    event.preventDefault();
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?Mode=edit';
    window.location.href = url;
  }


  public async handleDraft() {
    try {
      if (!this.state.selectedValue || !this.state.selectedComponents) {
        console.warn("No selected value or components available.");
        return;
      }

      // console.log("Fetching existing items in DraftMaster...");
      const draftMasterItems = await sp.web.lists.getByTitle("DraftMaster")
        .items.filter(`Title eq '${this.state.selectedValue}'`)
        .get();

      // Store existing ComponentIDs as strings
      const existingComponentIDs = new Set(draftMasterItems.map(item => String(item.ComponentID)));

      // console.log("Existing Component IDs in DraftMaster:", existingComponentIDs);
      for (const key in this.state.selectedComponents) {
        if (this.state.selectedComponents.hasOwnProperty(key)) {
          const item = this.state.selectedComponents[key];
          const position = parseInt(key, 10); // Convert key to integer
          const componentID = String(item.id); // Ensure it's a string
          const existingItemAtPosition = draftMasterItems.find(existingItem =>
            String(existingItem.Position) === String(position)
          );

          // Delete existing item at the same position if any
          if (existingItemAtPosition) {
            try {
              await sp.web.lists.getByTitle(Draftmaster).items.getById(existingItemAtPosition.Id).recycle(); // or .delete()
              console.log(`Deleted existing item at Position ${position}`);
            } catch (deleteError) {
              console.error(`Failed to delete existing item at Position ${position}`, deleteError);
            }
          }
          // Check if ComponentID already exists in DraftMaster
          if (!existingComponentIDs.has(componentID)) {
            // console.log(`Adding Component: ${item.name}, ID: ${componentID}, Position: ${position}`);
            try {
              await sp.web.lists.getByTitle(Draftmaster).items.add({
                Title: String(this.state.selectedValue), // Ensure string
                Component: String(item.name), // Ensure string
                ComponentID: String(item.id), // Ensure string (if expected as text)
                Position: String(position) // Ensure number (if expected as number)
              });
              // console.log(`Successfully added ${item.name}`);
            } catch (addError) {
              console.error(`Failed to add component: ${item.name}`, addError);
            }
          } else {
            console.log(`Component ${item.name} (ID: ${componentID}) already exists. Skipping.`);
          }
        }
      }
    } catch (error) {
      console.error("Error while handling the Draft Master:", error);
    }
  }


  public async draftHandler(event: any) {
    event.preventDefault();
    await this.saveAsDraft();
    // console.log(this.state.selectedComponents);
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?';
    window.location.href = url;
  }

  public async publishHandler(event: any) {
    event.preventDefault();
    const length = Object.keys(this.state.selectedComponents || {}).length;
    if (length !== 0) {
      // Show processing Swal
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we publish the components.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        }
      });

      try {
        await this.handlePublish(); // Wait for the function to complete
        // Close processing Swal and show success message
        Swal.fire({
          title: `Components were added in '${this.state.selectedValue}'`,
          icon: "success",
          showConfirmButton: true,
        }).then(() => {
          // Redirect after user acknowledges success
          window.location.href = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx';
        });

      } catch (error) {
        // Handle any errors (optional)
        Swal.fire({
          title: "Error",
          text: "Something went wrong while publishing.",
          icon: "error",
          showConfirmButton: true,
        });
      }

    } else {
      // Show warning message when no components are added
      Swal.fire({
        title: `None of the Components were added in '${this.state.selectedValue}'`,
        icon: "warning",
        showConfirmButton: true,
      });
    }
  }

  public handleDragStart = (e: React.DragEvent<HTMLDivElement>, key: any) => {
    // e.stopPropagation();
    e.dataTransfer.setData("key", key);
    this.setState({ draggedItemKey: key });
  };

  // Allow dropping
  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // e.stopPropagation();
  };
  handleDrop = (e: React.DragEvent<HTMLDivElement>, dropKey: any) => {
    e.preventDefault();
    // setTimeout(() => {
    const draggedKey = this.state.draggedItemKey;
    if (draggedKey === null || draggedKey === dropKey) return;
    // console.log("Before swap:", this.state.selectedComponents);
    if (draggedKey === dropKey) return;

    this.setState((prevState) => {
      const updatedComponents = { ...prevState.selectedComponents };
      let updatedIsInitialscreen = [...this.state.isInitialscreen]
      // Check if dropKey exists in selectedComponents
      if (!(dropKey in updatedComponents)) {
        // Move draggedKey value to dropKey
        updatedComponents[dropKey] = updatedComponents[draggedKey];

        // Remove the draggedKey
        delete updatedComponents[draggedKey];
        updatedIsInitialscreen = updatedIsInitialscreen.map((screen, index) =>
          index === draggedKey - 1 ? true : screen
        );
        updatedIsInitialscreen = updatedIsInitialscreen.map((screen, index) =>
          index === dropKey - 1 ? false : screen
        );
        // this.updateDraftMasterList(draggedKey, dropKey, "DataUnavailable");
      } else {
        // Swap the values of draggedKey and dropKey
        const temp = updatedComponents[draggedKey];
        updatedComponents[draggedKey] = updatedComponents[dropKey];
        updatedComponents[dropKey] = temp;
        // this.updateDraftMasterList(draggedKey, dropKey, "Dataavailable");

      }
      return { selectedComponents: updatedComponents, isInitialscreen: updatedIsInitialscreen };
    }, async () => {
      await this.handleSelectedComponents(this.state.selectedComponents)
      const allWithBorder = document.querySelectorAll(".Drag_part.border");
      allWithBorder.forEach((el) => {
        el.classList.remove("border");
        el.setAttribute("draggable", "false");
      })

    });
    // }, 5000);
  };

  handleborder = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, DOMID: any) => {
    // Stop the event from bubbling to the document click listener
    e.stopPropagation();

    // Remove border from all

    const allDragParts = document.querySelectorAll('.Drag_part.border');
    allDragParts.forEach((el) => {
      el.classList.remove('border')
      el.setAttribute("draggable", "false");
    }
    );

    // Add border to clicked one
    const inputElement = document.querySelector(`.${DOMID}`);
    if (inputElement && inputElement.classList.contains('Drag_part')) {
      inputElement.classList.add('border');
      inputElement.setAttribute("draggable", "true"); // Only this becomes draggable
      // setTimeout(() => {
      //   this.setState({ draggedItemId: DOMID })
      // }, 900);
    }
  };



  // Update SharePoint List
  public updateDraftMasterList = async (dragKey: any, dropKey: any, data: any) => {
    try {
      const draggedItemResponse = await sp.web.lists.getByTitle("DraftMaster")
        .items.filter(`Title eq '${this.state.selectedValue}' and Position eq '${dragKey}'`)
        .get();
      if (draggedItemResponse.length === 0) {
        console.error("One or both items not found.");
        return;
      }
      const draggedItem = draggedItemResponse[0];
      // Swap positions
      await sp.web.lists.getByTitle("DraftMaster").items.getById(draggedItem.Id).update({
        Position: String(dropKey)
      });
      if (data == "Dataavailable") {
        const droppedItemResponse = await sp.web.lists.getByTitle("DraftMaster")
          .items.filter(`Title eq '${this.state.selectedValue}' and Position eq '${dropKey}'`)
          .get();
        if (droppedItemResponse.length === 0) {
          console.error("One or both items not found.");
          return;
        }
        // Get the item IDs
        const droppedItem = droppedItemResponse[0];
        await sp.web.lists.getByTitle("DraftMaster").items.getById(droppedItem.Id).update({
          Position: String(dragKey)
        });
      }
      console.log(`Swapped Position ${dragKey} ↔ ${dropKey} successfully`);
    } catch (error) {
      console.error("Error swapping positions:", error);
    }
  };




  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;
    const SearchElement = ({ Position, DOMID, SelectID, ButtonId, ComponentIndex }: { Position: number, DOMID: string; SelectID: string; ButtonId: string; ComponentIndex: any; }) => {
      if (!handler.state.isCurrentUserAdmin && handler.state.editMode !== "edit") {
        console.log("not an admin User");
        return null;
      }
      const inputElement = document.querySelector(`.Location-${Position}`);
      if (inputElement) {
        inputElement.classList.remove('Drag_part');
        inputElement.classList.remove('border');

      }
      return (
        <>
          {/* Button to toggle component visibility */}
          <button id={ButtonId} className={this.state.editMode !== "edit" ? 'add_mode' : 'edit_mode'} data-selectid={SelectID}
            onClick={(e) => handler.showcomponents(e, SelectID)}
          >
            <img src={require("./ServiceProvider/Assets/Img/addcomponent.svg")} alt="AddComponent" />
            {/* src={`${this.props.siteurl}/SiteAssets/img/add component.svg`} */}
          </button>


          {/* Hidden component div, toggled dynamically */}
          <div id={SelectID} style={{ display: "none" }} className='hide_components' data-selectid={SelectID}>
            <div className={`component-search ${DOMID}`}>
              <input type="text" className={`form-control`} placeholder="Search for the contact here" id="SearchInput"
                onChange={() => handler.handleInputChange(DOMID, SelectID)} />
              <button className="form-control search_button" onClick={(e) => handler.SearchHandler(e, SelectID)} >
                <img src={require("./ServiceProvider/Assets/Img/search-fill.svg")} alt="search-img" />
              </button>
              <button className="form-control clear_part inp-search input-clear-onchange" onClick={(e) => handler.clearHandler(e, SelectID)}>
                <img src={require("./ServiceProvider/Assets/Img/close-icon.svg")} alt="clear-img" />
              </button>
            </div>

            {/* List of available components */}
            <ul className='component_search'>
              {handler.state.AvailableComponents.map((component: any) => {
                var Name = component.Title.replace(/\s+/g, "");
                return (
                  <li
                    key={component.Title} // Ensure unique key for each list item
                    className="li-search-wrap"
                    onClick={(e) => handler.setSelectedComponent(e, component.Title, SelectID, ComponentIndex, component.ComponentId)}
                  >
                    <div className='Component_icon'>
                      <img className={Name}
                        src={require(`./ServiceProvider/Assets/Img/icons/${Name}.svg`)}
                        alt={component.Title}
                      />
                      <p className="people_name">{component.Title}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )
    };
    const renderDraggableContainer = (position: any, classNamePrefix: any) => (
      <>
        {this.state.isCurrentUserAdmin && this.state.editMode == "edit" ?
          <div
            className={` col-md-${classNamePrefix} Location-${position}`}
            // draggable={this.state.draggedItemId == `Location-${position}`} // Make only the image draggable
            onDragStart={(e) => this.handleDragStart(e, position)} // Handle drag start on image
            onDragOver={(e) => this.handleDragOver(e)}              // Handle drag over
            onDrop={(e) => this.handleDrop(e, position)}
            onClick={(e) => { this.handleborder(e, `Location-${position}`) }}
          >
            {!this.state.isInitialscreen[position - 1] &&
              <img
                src={require("./ServiceProvider/Assets/Img/drag-icon.svg")}
                className='Drag_button'
                alt='Drag_icon'
              />
            }
            <DraggableContainer
              position={position}
            />
          </div>
          :
          <div className={` col-md-${classNamePrefix} Location-${position} ${this.state.isInitialscreen[position - 1] && this.state.editMode !== "edit" ? "empty" : ""}`}>
            <DraggableContainer
              position={position}
            />
          </div>


        }


      </>
    );



    const DraggableContainer = ({ position }: { position: any; }) => {
      return (
        // <div className={className}>
        <div>
          {this.state.isInitialscreen[position - 1] ? (
            Components.filter((item) => item.Position === position).map((item, key) => (
              <SearchElement
                key={key}
                Position={position}
                DOMID={`search-${key}`}
                SelectID={item.selectId}
                ButtonId={item.buttonId}
                ComponentIndex={item.componentIndex}

              />
            ))
          ) : (
            this.state.selectedComponents[position] && this.renderComponent(position)
          )}
        </div>
      )
    };

    return (
      //Layout 1
      <>
        <section>
          {this.state.isClicked == "Home" ?
            (<div className="container home_pg relative">
              <div className="section-right">
                <div className="banner-ceo-message">
                  <div className="row">
                    {[1, 2].map((position) => renderDraggableContainer(position, position === 1 ? 8 : 4))}
                  </div>
                </div>
                {/* //Quicklinks- remo navigation */}
                {[3].map((position) => renderDraggableContainer(position, 12))}
                {/* Events(Mymeetings) Calendar and News Section */}
                <div className="row section_bottom">
                  <div className="col-md-12">
                    <div className="events-calendar col-md-8">
                      {[4, 5].map((position) => renderDraggableContainer(position, 12))}
                      {/* News */}
                      <div className="latest-news-announcements" id="latest-news-announcements">
                        {/* events and announcements */}
                        {[10].map((position) => renderDraggableContainer(position, 12))}
                      </div>

                      <div id="social-and-gallery" className="images-social">
                        <div className="row row-res">
                          {[11, 12].map((position) => renderDraggableContainer(position, 6))}
                        </div>
                      </div>
                    </div>

                    {/* Birthday, Climate, Quicklinks, Recentfile */}
                    <div className="col-md-4 ">
                      {[6, 7, 8, 9].map((position) => renderDraggableContainer(position, 12))}
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
                <AnnouncementsRm description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} useremail={undefined} createList={false}></AnnouncementsRm>
              ) :

              this.state.isClicked == "AnnouncementViewMore" ?
                (
                  <AnnouncementsVm description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></AnnouncementsVm>
                ) :
                this.state.isClicked == "BirthdayRm" ?
                  (
                    <BirthdayRm description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={this.state.itemID} useremail={undefined}></BirthdayRm>
                  ) :
                  this.state.isClicked == "CEOReadMore" ?
                    (
                      <CeoMessageRm description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} id={undefined}></CeoMessageRm>
                    ) :
                    this.state.isClicked == "DeptGalleryGridView" ?
                      (
                        <DeptGalleryGridView description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} homepage={''} ></DeptGalleryGridView>
                      ) :
                      this.state.isClicked == "DeptGalleryViewMore" ?
                        (
                          <DeptGalleryViewMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={''} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} homepage={''} ></DeptGalleryViewMore>
                        ) :
                        this.state.isClicked == "EventsViewMore" ?
                          (
                            <EventsViewMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></EventsViewMore>
                          ) :
                          this.state.isClicked == "GalleryGridView" ?
                            (
                              <GalleryGridView description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></GalleryGridView>
                            ) :
                            this.state.isClicked == "GalleryViewMore" ?
                              (
                                <GalleryViewMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}   ></GalleryViewMore>
                              ) :

                              this.state.isClicked == "HeroBannerReadMore" ?
                                (
                                  <HeroBannerRm description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} useremail={null} id={this.state.itemID} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></HeroBannerRm>
                                ) :

                                this.state.isClicked == "HeroBannerViewMore" ?
                                  (
                                    <HeroBannerViewMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></HeroBannerViewMore>
                                  ) :


                                  this.state.isClicked == "NewsReadMore" ?
                                    (
                                      <NewsReadMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} siteID={undefined} useremail={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)} ></NewsReadMore>
                                    ) :

                                    this.state.isClicked == "NewsViewMore" ?
                                      (
                                        <NewsViewMore description={''} siteurl={this.props.siteurl} context={this.props.context} userid={undefined} onReadMoreClick={(onReadMoreClick: any) => this.readMoreHandler(onReadMoreClick)}></NewsViewMore>
                                      ) :

                                      null
          }
        </section >
      </>
    );
  }
}



