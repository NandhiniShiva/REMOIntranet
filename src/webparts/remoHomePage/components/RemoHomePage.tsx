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
import { sp } from '@pnp/sp';
import ProgressBar from 'react-bootstrap/ProgressBar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { CurrentUserDetails } from './ServiceProvider/UseProfileDetailsService';
// import {listNameDetalis} from '../Configuration';
import { listNames } from '../Configuration';


let NewWeb: any;
let spWeb: any;
let fetchList: any;
let IsListCreate: any;
// const Analytics = listNames.Analytics;
const docLibName = listNames.PictureGallery;
var User: any;
var UserEmail: any;
var Designation: any;
var Department: any;
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
  selectedValue: any,
  layoutItems: any[]

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
      selectedValue: null,
      layoutItems: []

    };
    spWeb = Web(this.props.siteurl);
    fetchList = true
    IsListCreate = false;
    console.log(spWeb, fetchList, IsListCreate);

  }

  public componentDidMount() {
    debugger;
    // this.setState({
      // showButton: true
    // })
    this.loaderInProgress();
    // console.log("listname", listNames);
    // $(".inner-pages-nav").remove();
    document.querySelectorAll('.inner-pages-nav').forEach(function (element) {
      element.remove();
    });
    setTimeout(() => {
      document.querySelectorAll('.inner-pages-nav').forEach(function (element) {
        element.remove();
      });
      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
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
    }, 1000);
    // debugger;
    // if (this.props.createList === true) {
    // this.CreateList();
    // this.CreateMultipleLists(totalListName);
    // alert("ok")
    // this.createSharePointLists();
    // }
    // this.getCurrentUser().then(() => {
    //   this.LandingPageAnalytics();
    // })

    // const userdetails = new CurrentUserDetails();
    // let currentUser = userdetails.getCurrentUserDetails();
    // let data = currentUser.then(valuess){
    //   data.
    // }
    // console.log("Current user details", currentUser);

    const userDetails = new CurrentUserDetails();
    userDetails.getCurrentUserDetails().then((data) => {
      console.log("Current user details", data);
      console.log("data details", data?.Department, data?.Designation);
      this.LandingPageAnalytics(data?.Department, data?.Designation);
    }).catch((error) => {
      console.error("Error fetching current user details:", error);
    });

  }


  public async LandingPageAnalytics(Department: any, Designation: any) {
    NewWeb = Web(this.props.siteurl)
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    // console.log(this.state.Title);

    try {
      const response = await NewWeb.lists.getByTitle("AnalyticsMasterList").items.add({
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
    setTimeout(() => {
      const loaderIcon = document.getElementById('loader-Icon');
      if (loaderIcon) {
        loaderIcon.style.display = 'block';
      }
    }, 500);

    setTimeout(() => {
      const loadContent = document.getElementById('load-content');
      const loaderIcon = document.getElementById('loader-Icon');

      if (loadContent) {
        loadContent.style.display = 'block';
      }

      if (loaderIcon) {
        loaderIcon.style.display = 'none';
      }
    }, 2000);
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




  // optimized code

  // Updated function for creating SharePoint Lists
  // public async createSharePointLists() {
  //   try {

  //     const listNames: string[] = ListLibraryColumnDetails.map(list => list.name); // Collect list names
  //     const totalLists: any = listNames.length;

  //     // Initialize progress
  //     this.setState({
  //       isCreatingLists: true,
  //       progress: 0,
  //       loadContent: false
  //     });

  //     // Track if any list was newly created
  //     let anyListCreated = false;

  //     // Loop over each list for creation
  //     for (let i = 0; i < totalLists; i++) {
  //       const listName = totalLists[i];
  //       const columns = ListLibraryColumnDetails[i].columns; // Retrieve columns for the current list

  //       // Update current progress and list name
  //       this.setState({
  //         currentList: listName,
  //         progress: ((i + 1) / totalLists) * 100
  //       });

  //       // Check if the list exists; if not, create it
  //       const listEnsureResult = await sp.web.lists.ensure(listName);
  //       if (listEnsureResult.created) {
  //         console.log(`List '${listName}' created successfully.`);
  //         await this.createSharePointColumns(listName, columns); // Create columns if the list was newly created
  //         anyListCreated = true;
  //       } else {
  //         console.log(`List '${listName}' already exists.`);
  //       }
  //     }

  //     // Final progress update
  //     this.setState({
  //       progress: 100,
  //       isCreatingLists: false,
  //       loadContent: true
  //     });

  //     // Reset if no new lists were created
  //     if (!anyListCreated) {
  //       console.log("All lists already existed. No new lists were created.");
  //       this.setState({
  //         isCreatingLists: false,
  //         loadContent: true,
  //         progress: 0
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error creating lists:", error);
  //     this.setState({
  //       isCreatingLists: false,
  //       currentList: null,
  //       progress: 0,
  //       loadContent: true
  //     });
  //   }
  // }


  public async createSharePointLists() {
    debugger;
    try {
      const listNames: string[] = ListLibraryColumnDetails.map(list => list.name); // Collect list names
      const totalLists: number = listNames.length; // `totalLists` is the count of lists

      // Initialize progress
      this.setState({
        isCreatingLists: true,
        progress: 0,
        loadContent: false,
        currentList: null, // Ensure the current list is initially null
      });

      // Track if any list was newly created
      let anyListCreated = false;

      // Loop over each list for creation
      for (let i = 0; i < totalLists; i++) {
        const listName = listNames[i]; // Corrected list name assignment
        const columns = ListLibraryColumnDetails[i].columns; // Retrieve columns for the current list

        // Update current progress and list name
        this.setState({
          currentList: listName, // Dynamically update the list name being processed
          progress: Math.round(((i + 1) / totalLists) * 100), // Calculate progress
        });

        // Check if the list exists; if not, create it
        const listEnsureResult = await sp.web.lists.ensure(listName);

        if (listEnsureResult.created) {
          console.log(`List '${listName}' created successfully.`);
          await this.createSharePointColumns(listName, columns); // Create columns if the list was newly created
          anyListCreated = true;
        } else {
          console.log(`List '${listName}' already exists.`);
        }
      }

      // Final progress update
      this.setState({
        progress: 100,
        isCreatingLists: false,
        loadContent: true,
      });

      // Reset if no new lists were created
      if (!anyListCreated) {
        console.log("All lists already existed. No new lists were created.");
        this.setState({
          isCreatingLists: false,
          loadContent: true,
          progress: 0,
        });
      }
    } catch (error) {
      console.error("Error creating lists:", error);

      // Handle errors and reset the state
      this.setState({
        isCreatingLists: false,
        currentList: null,
        progress: 0,
        loadContent: true,
      });
    }
  }


  // Updated function for creating columns in a SharePoint List
  public async createSharePointColumns(name: string, columns: any[]): Promise<void> {
    try {
      for (const column of columns) {
        try {
          // Check if the column already exists
          await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
          console.log(`Column '${column.columnName}' already exists in list '${name}'.`);
        } catch (error) {
          // If column does not exist, create it based on type
          switch (column.type) {
            case "addImageField":
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
              console.log(`Column '${column.columnName}' added as Image Field.`);
              const view = await sp.web.lists.getByTitle(name).views.getByTitle("All Items").get();
              console.log(view);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;

            case "addBoolean":
              await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
              console.log(`Column '${column.columnName}' added as Boolean.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;

            case "addTextField":
              await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              console.log(`Column '${column.columnName}' added as Text Field.`);
              break;

            case "addNumberField":
              await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
              console.log(`Column '${column.columnName}' added as Number Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;

            case "addDateField":
              await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;
            case "addMultilineText":
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;

            case "Person or Group":
              await sp.web.lists.getByTitle(name).fields.addUser(column.columnName, FieldUserSelectionMode.PeopleOnly);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;
            case "addMultiChoice":
              // await sp.web.lists.getByTitle(name).fields.addMultiChoice("My Field",  column.group,  false, "My Group" );
              await sp.web.lists.getByTitle(name).fields.addMultiChoice(
                column.columnName, // The title of the field
                column.group, // The array of choices (["Midea", "Trosten", ...])
                false, // Set to true if you want to allow custom user input
                //  "My Group" // The group under which the field will appear (optional)
              );
              // const field2 = await sp.web.lists.getByTitle("My List").fields.addMultiChoice("My Field", { Choices: choices, FillInChoice: false, Group: "My Group" });

              console.log(`Column '${column.columnName}' added as Date Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;

            case "addLookup":
              const targetList = await sp.web.lists.getByTitle(column.targetListName).select("*").get();
              await sp.web.lists.getByTitle(name).fields.addLookup(column.columnName, targetList.Id, column.targetListColumn);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
              break;
            default:
              console.log(`Unknown column type: ${column.type}`);

          }

          // Add the column to the "All Items" view
          await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
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


  public CreatePictureLibrary = async () => {

    await spWeb.lists.add("Image gallery1", " Picture Library1", 109, true, { OnQuickLaunch: true });
    // await this.addFolder();
    alert("CreatePictureLibrary")


  }

  public showDropDown() {
    this.getLayout();
    this.setState({
      showButton: false,
      showDropdown: true,
    })
  }
  public async getLayout() {
    try {
      debugger;
      const items = await sp.web.lists
        .getByTitle("LayoutMaster")
        .items
        .select("Title", "*")
        // .filter(`IsActive eq '1'`)
        // .orderBy("Created", false)
        .get();
      console.log("Layout item", items);
      this.setState({
        layoutItems: items
      })

    } catch (error) {
      console.log("Error in getlayout", error);

    }
  }
  public async handleSelectChange(event: any) {
    console.log("selected option", event.target.value);
    if (event.target.value == "Layout 1") {
      this.setState({
        showButton: false,
        showDropdown: false,
      });
      await this.createSharePointLists();
      await this.createDocumentLibrary(docLibName);
      // await this.CreatePictureLibrary();
    }
    this.setState({
      selectedValue: event.target.value
    })
  };
  public render(): React.ReactElement<IRemoHomePageProps> {
    // const { siteurl, context, userid } = this.props

    // return (
    //   <>

    //     <div className={styles.remoHomePage} id="load-content" style={{ display: this.state.loadContent ? "block" : "none" }}>

    //       {/* <div className={styles.remoHomePage} id="load-content" style={{ display: "none" }}> */}
    //       <div id="Global-Top-Header-Navigation">
    //         <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
    //       </div>
    //       <section>
    //         <div className="container home_pg relative">

    //           <div className="section-rigth">
    //             <div className="banner-ceo-message ">
    //               <div className="row">

    //                 <RemoHeroBanner siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //                 <RemoCEOMessage siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
    //               </div>
    //             </div>
    //             <RemoNavigations siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //             <div className="row section_bottom">

    //               <div className="col-md-8">
    //                 <div className="events-calender">
    //                   <RemoMyMeetings siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //                 </div>

    //                 <RemoNews siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />


    //                 <div className="latest-news-announcemnst" id="latest-news-announcemnst">
    //                   <div className="row row-res">
    //                     <RemoLatestEventsandAnnouncements siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
    //                   </div>
    //                 </div>
    //                 <div id="social-and-gallery">
    //                   <div className="images-social">
    //                     <div className="row row-res">
    //                       <RemoImagesandVideos siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
    //                       <RemoSocialMedia siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="col-md-4">

    //                 <RemoBirthday siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //                 <RemoClimate siteurl={this.props.siteurl} context={this.props.context} description={''} />



    //                 <RemoQuickLinks siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />


    //                 <RemoRecentFiles siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //               </div>
    //             </div>
    //             <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
    //             <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''} />

    //           </div>

    //         </div>
    //       </section>
    //     </div>


    //     <div id='loader-Icon' className="loader-block" style={{ display: this.state.isCreatingLists ? "block" : "none" }}>
    //       <div id="progressContainer" style={{ display: this.state.isCreatingLists ? "block" : "none" }}>
    //         <p id="currentListName">Creating: {this.state.currentList}</p>
    //         <ProgressBar now={this.state.progress} label={`${Math.round(this.state.progress)}%`} />
    //       </div>
    //     </div>

    //   </>

    // );


    // Optimized code

    return (
      <>
        {/* Main Content */}
        {this.state.showButton == false ?

          <>
            {this.state.showDropdown == false ?
              <div>

                <div className={styles.remoHomePage} id="load-content" style={{ display: this.state.loadContent ? "block" : "none" }}>
                  <div id="Global-Top-Header-Navigation">
                    <GlobalSideNav
                      siteurl={this.props.siteurl}
                      context={this.props.context}
                      currentWebUrl=""
                      CurrentPageserverRequestPath=""
                    />
                  </div>

                  <section>
                    <div className="container home_pg relative">
                      <div className="section-right">
                        {/* Banner and CEO Message */}
                        <div className="banner-ceo-message">
                          <div className="row">
                            <RemoHeroBanner {...this.props} description="" createList={false} name="" />
                            <RemoCEOMessage {...this.props} description="" createList={false} name="" />
                          </div>
                        </div>

                        <RemoNavigations {...this.props} description="" createList={false} name="" />

                        {/* Events Calendar and News Section */}
                        <div className="row section_bottom">
                          <div className="col-md-8">
                            <div className="events-calendar">
                              <RemoMyMeetings {...this.props} description="" createList={false} name="" />
                            </div>

                            <RemoNews {...this.props} description="" createList={false} name="" />

                            <div className="latest-news-announcements" id="latest-news-announcements">
                              <div className="row row-res">
                                <RemoLatestEventsandAnnouncements {...this.props} description="" createList={false} name="" />
                              </div>
                            </div>

                            <div id="social-and-gallery" className="images-social">
                              <div className="row row-res">
                                <RemoImagesandVideos {...this.props} description="" createList={false} name="" />
                                <RemoSocialMedia {...this.props} description="" createList={false} name="" />
                              </div>
                            </div>
                          </div>

                          {/* Sidebar Components */}
                          <div className="col-md-4">
                            <RemoBirthday {...this.props} description="" createList={false} name="" />
                            <RemoClimate {...this.props} description="" />
                            <RemoQuickLinks {...this.props} description="" createList={false} name="" />
                            <RemoRecentFiles {...this.props} description="" createList={false} name="" />
                          </div>
                        </div>

                        <RemoResponsive {...this.props} currentWebUrl="" CurrentPageserverRequestPath="" />
                        <Footer {...this.props} description="" createList={false} name="" />
                      </div>
                    </div>
                  </section>
                </div>

                {this.state.isCreatingLists && (
                  <div id="loader-Icon" className="loader-block">
                    <div id="progressContainer">
                      <p id="currentListName">Creating: {this.state.currentList}</p>
                      <ProgressBar now={this.state.progress} label={`${Math.round(this.state.progress)}%`} />
                    </div>
                  </div>
                )}
              </div>
              :
              <div>
                <select value={this.state.selectedValue} onChange={(e) => this.handleSelectChange(e)}>
                  <option value="">Select Layout</option>
                  {this.state.layoutItems.map((item) => (
                    <option key={item.id} value={item.value}>
                      {item.Title}
                    </option>
                  ))}
                  {/* <option value="1">Layout 1</option>
                  <option value="2">Layout 2</option>
                  <option value="3">Layout 3</option> */}
                </select>
                {/* <p>Selected Value: {this.state.selectedValue}</p> */}
              </div>

            }
          </>
          :
          <div>
            <button onClick={() => this.showDropDown()}>Configure</button>
          </div>
        }
      </>
    );

  }
}
