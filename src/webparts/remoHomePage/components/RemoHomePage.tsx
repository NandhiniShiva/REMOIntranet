import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as $ from 'jquery';
import GlobalSideNav from '../components/Header/GlobalSideNav';
import RemoLayout1 from './RemoLayout1';
import RemoLayout2 from './RemoLayout2';

import pnp from 'sp-pnp-js';
import { Web } from '@pnp/sp/webs';
import { ChoiceFieldFormatType, FieldUserSelectionMode, sp, UrlFieldFormatType } from "@pnp/sp/presets/all";
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
import { LayoutsDetails } from './ServiceProvider/Layoutconfiguration';
import { LandingPageListDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { listNames } from '../Configuration';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';
import Swal from 'sweetalert2';
import "../components/ServiceProvider/Styles/Responsive.css"
import '../components/ServiceProvider/Styles/SPNativeStyleOverriding.css'
import '../components/ServiceProvider/Styles/Style.css'

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
let Logolist = listNames.Logo;
var User: any;
var UserEmail: any;

var Selectedcomponents: any = [];
// var Components = PositionDetails;


export interface IRemoHomePageState {
  progress: any,
  isCreatingLists: boolean,
  loadContent: boolean,
  currentList: any,
  showConfigure: boolean,
  showLayout: boolean,
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
  isSearchActive: boolean,
  itemID: any,
  SiteLogo: string;

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
      showConfigure: false,
      showLayout: false,
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
      isSearchActive: false,
      itemID: null,
      SiteLogo: "",
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
    // this.setState({ showConfigure: true })
    await this.checkEditMode();
    await this.getCurrentUser();
    await this.checkUserAdmin();
    await this.CheckalreadyConfigured();
    await this.BindPlaceholderLogo();
    await this.loaderInProgress();
  }

  public checkEditMode() {
    const url: any = new URL(window.location.href);
    const mode = url.searchParams.get("Mode");
    this.setState({
      editMode: mode,
    })
  }
   public async getCurrentUser() {
      try {
        const url: URL = new URL(window.location.href);
        console.log(url);
        const profile = await pnp.sp.profiles.myProperties.get();
        UserEmail = profile.Email;
        let curruser = await sp.web.currentUser.get().then(function (res: any) {
          // let CurrentUserEmail = res.Email
          User = res.Id
        }).then(() => {
          console.log(User, curruser);
        })
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
  public async CheckalreadyConfigured() {
    try {
      // Check if the new layout already exists
      // debugger;
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
        await sp.web.lists.getByTitle(LayoutMasterList).items.get().then((response) => {
          if (response.length !== 0) {
            // Check if at least one item has IsActive set to true
            const activeItem = response.find(item => item.IsActive === true);
        
            if (activeItem) {
              this.setState(
                {
                  selectedValue: activeItem.Title,
                  showConfigure: false,
                  showLayout: false,
                  showHomepage: true,
                },
                async () => {
                  await this.getLayout();
                  await this.setActiveLayout(this.state.selectedValue);
                  await this.HideInProgress();
                }
              );
            } else {
              // No active items, show the configuration
              this.setState({ showConfigure: true });
            }
          } else {
            // No items in response, show the configuration
            this.setState({ showConfigure: true });
          }
        });
        
    } catch (error) {
      console.error("Error handling layout change:", error);
    }

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
  public BindPlaceholderLogo() {
    const { siteurl } = this.props;
    const reacthandler = this;

    sp.web.lists.getByTitle(Logolist)
      .items.select("Logo", "*")
      .filter("IsActive eq 1")
      .orderBy("Created", false)
      .top(1)
      .get()
      .then((items) => {
        if (items.length > 0) {
          const { Logo } = items[0];
          if (Logo) {
            const ImgObj = JSON.parse(Logo);
            const serverRelativeUrl = ImgObj.serverRelativeUrl || `${siteurl}/Lists/${Logolist}/Attachments/${items[0].ID}/${ImgObj.fileName}`;
            reacthandler.setState({ SiteLogo: serverRelativeUrl });
          }
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
        return;
      } else if (listName === Draftmaster && response.length === 0) {
        // Fetch from ComponentallocationList if no items found in Draftmaster
        response = await sp.web.lists.getByTitle(ComponentallocationList).items.filter(`Title eq '${this.state.selectedValue}'`).get();
        if (response.length === 0) {
          console.log("No items found in the SharePoint list.");
          return;
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


  public showLayout() {
    this.getLayout();
    this.setState({
      showConfigure: false,
      showLayout: true,
    })
  }


  public async setSelectedComponent(event: any, ComponentName: string, DOMID: string, key: number, ComponentId: number) {
    // debugger;
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
        await this.handleComponentAllocation(ComponentName, selectedComponent.ComponentId, position);

        console.log("Item successfully added to the list.");
      } else {
        console.log("No value selected. Skipping addition to the list.");
      }

      // this.handleDraft();
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

  // public async handlePublish() {
  //   // debugger;
  //   try {
  //     // Fetch all items from the Draftmaster list
  //     const draftItems = await sp.web.lists.getByTitle(Draftmaster).items.filter(`Title eq '${this.state.selectedValue}'`).get();

  //     if (draftItems.length === 0) {
  //       console.log("No items to publish.");
  //       return;
  //     }
  //     const existingItems = await sp.web.lists.getByTitle(ComponentallocationList)
  //       .items.filter(`Title eq '${this.state.selectedValue}'`)
  //       .get();

  //     for (const item of existingItems) {
  //       await sp.web.lists.getByTitle(ComponentallocationList).items.getById(item.Id).recycle();
  //     }

  //     // Loop through each draft item and copy it to PublishedList
  //     for (const item of draftItems) {
  //       await sp.web.lists.getByTitle(ComponentallocationList).items.add({
  //         Title: item.Title,
  //         Component: item.Component,
  //         ComponentID: item.ComponentID,
  //         Position: item.Position,
  //       });

  //       // Delete the item from Draftmaster after successfully copying
  //       await sp.web.lists.getByTitle(Draftmaster).items.getById(item.Id).recycle();
  //     }

  //     console.log("All items published successfully.");

  //   } catch (error) {
  //     console.error("Error publishing items:", error);
  //   }
  // }
  public async handlePublish() {
    try {
      if (!this.state.selectedValue || !this.state.selectedComponents) {
        console.warn("No selected value or components available.");
        return;
      }

      // console.log("Fetching existing items in DraftMaster...");
      const PublishedItems = await sp.web.lists.getByTitle(ComponentallocationList)
        .items.filter(`Title eq '${this.state.selectedValue}'`)
        .get();

      // Store existing ComponentIDs as strings
      const existingComponentIDs = new Set(PublishedItems.map(item => String(item.ComponentID)));

      // console.log("Existing Component IDs in DraftMaster:", existingComponentIDs);
      // debugger;
      for (const key in this.state.selectedComponents) {
        if (this.state.selectedComponents.hasOwnProperty(key)) {
          const item = this.state.selectedComponents[key];
          const position = parseInt(key, 10); // Convert key to integer
          const componentID = String(item.id); // Ensure it's a string

          // Check if ComponentID already exists in DraftMaster
          if (!existingComponentIDs.has(componentID)) {
            // console.log(`Adding Component: ${item.name}, ID: ${componentID}, Position: ${position}`);
            try {
              await sp.web.lists.getByTitle(ComponentallocationList).items.add({
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
          // Fetch and recycle items from the Draftmaster list

        }
      }

      const draftItems = await sp.web.lists.getByTitle(Draftmaster)
        .items.filter(`Title eq '${this.state.selectedValue}'`).get();
      // Recycle items in parallel using Promise.all
      await Promise.all(draftItems.map(item => sp.web.lists.getByTitle(Draftmaster).items.getById(item.Id).recycle()));
      console.log("All items published successfully.");
    } catch (error) {
      console.error("Error while handling the Draft Master:", error);
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
      showLayout: false
    })


  }

  public async handleSelectChange(event: any, LayoutId: any) {
    // console.log("selected option", event.target.value);
    this.setState(
      {
        showHomepage: true,
        showLayout: false,
        selectedValue: LayoutId
      },
      async () => {
        // await this.createLayoutMasterList();
        await this.loaderInProgress();
        await this.setActiveLayout(this.state.selectedValue);
        await this.getcreateLists();
        // await this.GetAllavailablecomponents();
        // await this.getAllocatedComponents();
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
      this.setState({ isInitialscreen: Array(12).fill(true) })

    } catch (error) {
      console.error("Error in setActiveLayout:", error);
    }
  }

  public async getcreateLists() {
    try {
      // Filter unmatched lists
      const ListtobeCreated: any[] = LandingPageListDetails
      let anyListCreated = false;
      // Loop through each unmatched list
      for (let i = 0; i < ListtobeCreated.length; i++) {
        const listName = ListtobeCreated[i].name; // Access the list name
        // const columns = unmatchedLists[i].columns; // Access the columns for the list
        const listCreation = new ListCreation();
        await listCreation.createSharePointLists(listName);
      }
      // Log final status
      if (!anyListCreated) {
        console.log("All lists already existed. No new lists were created.");
      }
    } catch (error) {
      console.error("Error creating lists:", error);
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

  public async handleChangeLayout(event: React.ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    const value = event.target.value;
    const previousLayout = this.state.selectedValue;
    if (previousLayout == value) {
      return;
    }
    try {
      const listName = (this.state.isCurrentUserAdmin && this.state.editMode === "edit") ? Draftmaster : ComponentallocationList;
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
        // Use SweetAlert2 to prompt the user
        const userChoice = await Swal.fire({
          title: `"${value}" does not exist!`,
          text: `Do you want to start fresh or duplicate components from "${previousLayout}"?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Duplicate Components",
          cancelButtonText: "Start Fresh",
        });
        if (userChoice.isConfirmed) {
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
        else {
          console.log(this.state.selectedComponents);
          this.setState({
            selectedComponents: {},
            isInitialscreen: Array(12).fill(true), // Create an array of 10 `true` values
          })
        }
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


  public async handleDraft() {
    try {
      if (!this.state.selectedValue || !this.state.selectedComponents) {
        console.warn("No selected value or components available.");
        return;
      }

      // console.log("Fetching existing items in DraftMaster...");
      const draftMasterItems = await sp.web.lists.getByTitle(Draftmaster)
        .items.filter(`Title eq '${this.state.selectedValue}'`)
        .get();

      // Store existing ComponentIDs as strings
      const existingComponentIDs = new Set(draftMasterItems.map(item => String(item.ComponentID)));

      // console.log("Existing Component IDs in DraftMaster:", existingComponentIDs);
      // debugger;
      for (const key in this.state.selectedComponents) {
        if (this.state.selectedComponents.hasOwnProperty(key)) {
          const item = this.state.selectedComponents[key];
          const position = parseInt(key, 10); // Convert key to integer
          const componentID = String(item.id); // Ensure it's a string

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

  public handleSelectedComponents(LayoutData: any) {
    console.log("Details", LayoutData.AllocatedComponentsDetails);
    this.setState({
      selectedComponents: LayoutData.AllocatedComponentsDetails,      // showDropdown: false
    })

  }


  public async draftHandler(event: any) {
    event.preventDefault();
    // await this.handleDraft();
    // debugger;
    // console.log(this.props.selectedComponents);

    await this.saveAsDraft();

    // console.log(this.state.selectedComponents);
    const url = 'https://remodigital.sharepoint.com/sites/RemoIntranetProduct/SitePages/RemoProductHome.aspx?';
    window.location.href = url;
  }
  public async saveAsDraft() {
    try {
      // debugger;
      let ComponentDetails = this.state.selectedComponents
      Object.entries(ComponentDetails).forEach(async ([position, item]: [string, any]) => {
        console.log(item);
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

          console.log(`Item at position ${position} updated successfully.`);
        } else {
          // If no item exists, create a new one
          await sp.web.lists.getByTitle(Draftmaster).items.add({
            Title: this.state.selectedValue,
            Component: value,
            ComponentID: selectedComponent,
            Position: String(position),
          });

          console.log(`New item created at position ${position}.`);
        }
      })
      // Fetch the item for the specific position

    } catch (error) {
      console.error("Error handling component allocation:", error);
    }
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

  public render(): React.ReactElement<IRemoHomePageProps> {

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
                          <img className='editimage' src={require("./ServiceProvider/Assets/Img/EditNew.svg")} alt="Edit-img" />
                          <span> Edit </span></button>
                      </li>
                      :
                      <><li id='draft_button'>
                        <button onClick={(e) => this.draftHandler(e)}>
                          <img className='draftimage' src={require("./ServiceProvider/Assets/Img/draft.svg")} alt="draft-img" />
                          <span> Save As Draft </span></button>
                      </li>
                        <li id='publish_button'>
                          <button onClick={(e) => this.publishHandler(e)}>
                            <img className='publishimage' src={require("./ServiceProvider/Assets/Img/publish.svg")} alt="publish-img" />
                            <span> Publish </span></button>
                        </li></>
                    }
                  </ul>
                </div>
              </div>
              <section>
                {this.state.selectedValue == "layout_1" &&
                  <RemoLayout1 description={`${this.state.isCurrentUserAdmin}, ${this.state.editMode}, ${User}`} siteurl={this.props.siteurl} userid={undefined} context={this.props.context} createList={false} name={""} onReadMoreClick={undefined} id={undefined} selectedComponents={(selectedComponents: any) => this.handleSelectedComponents(selectedComponents)} ></RemoLayout1>
                }
                {this.state.selectedValue == "layout_2" &&
                  <RemoLayout2 description={`${this.state.isCurrentUserAdmin}, ${this.state.editMode},${User}`} siteurl={this.props.siteurl} userid={undefined} context={this.props.context} createList={false} name={''} onReadMoreClick={undefined} id={undefined} selectedComponents={(selectedComponents: any) => this.handleSelectedComponents(selectedComponents)} ></RemoLayout2>
                }
              </section>
            </div>
            <div id="loader-Icon" className="loader-block" style={{ display: "none" }}>
              <img src={require("./ServiceProvider/Assets/Img/loader-new.gif")} alt="loader" />
            </div>
            {/* 
            
            */}
          </div>
        }

        {this.state.showLayout == true &&
          <>
            <header className='layout_header'>
              <div>
                <a className="logo-anchor" href={`${this.props.siteurl}/SitePages/RemoProductHome.aspx`} data-interception="off">  <img src={this.state.SiteLogo} alt="image" /> </a>
              </div>
            </header>
            <div className="selectLayers">
              <div className="selectYours"> Select Your Layout</div>
              <div className="Layout-content">
                {this.state.layoutItems.map((item, key) => (
                  <div className={`SelectLayout cont-${key + 1}`} onClick={(e) => this.handleSelectChange(e, item.ID)}>
                    <div className="SElect-Layout-img">
                      <img src={item.layoutimg} data-themekey="#" />
                    </div>
                    <div className="LayoutText">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        }

        {this.state.showConfigure == true &&
          <div className="config-banner">
            <img src={require("./ServiceProvider/Assets/Img/bannerremoproduct.jpg")} alt="Expert Consulting" data-themekey="#" className="config-image" />
            <div className="config-banner-content">
              <div className="config-left-side"><img src={require("./ServiceProvider/Assets/Img/logo.png")} className="config-logo" data-themekey="#" /></div>
              <div className="config-right-side">
                <h2 className="config-head">Expert Consulting</h2><p className="config-subhead">From the world’s tallest building, The Burj Khalifa, to the HSBC tower in Hong Kong, and from the New Delhi Metro to Manchester Airport, Ducab is changing the way that energy is distributed around the</p>
                <button onClick={() => this.showLayout()}>Configure</button>
              </div>
            </div>
          </div>
        }

      </>

    );

  }
}



