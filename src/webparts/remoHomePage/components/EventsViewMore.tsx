import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IEventsViewMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
// import { IWeb, Web } from "@pnp/sp/webs";
import 'evo-calendar';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
// import pnp, { sp } from 'sp-pnp-js';
import { Web } from 'sp-pnp-js';

let Eventslist = listNames.Events;
var Designation = "";
var Department = "";

export interface IEventsVmState {
  Items: any[];
  SelectedDate: any;
  Date: any;
  Mode: string;
  currentUser: any;
  Department: string;
  Designation: string;
  UserEmail: string;
  ItemID: any;
  Title: any
}
var NewWeb: any;
const eventList: { id: string; name: string; date: string; type: string; description: string; }[] = [];
export default class EventsVm extends React.Component<IEventsViewMoreProps, IEventsVmState, {}> {
  public constructor(props: IEventsViewMoreProps) {
    super(props);
    SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css');
    SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/js/evo-calendar.min.js');

    this.state = {
      Items: [],
      SelectedDate: "" + moment().format("MMM DD") + "",
      Date: "",
      Mode: "",
      currentUser: null,
      Department: 'NA',
      Designation: 'NA',
      UserEmail: '',
      ItemID: '',
      Title: ''
    };
    NewWeb = new Web(this.props.siteurl)
  }

  // public componentDidMount() {
  //   setTimeout(() => {
  //     // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
  //     // $('#spCommandBar').attr('style', 'display: none !important');
  //     // $('#CommentsWrapper').attr('style', 'display: none !important');
  //     // $('#RecommendedItems').attr('style', 'display: none !important');
  //     // $('.ms-CommandBar').attr('style', 'display: none !important');
  //     // $('#eventsvm').show();

  //     const commentsWrapper = document.getElementById('CommentsWrapper');
  //     if (commentsWrapper) {
  //       commentsWrapper.style.setProperty('display', 'none', 'important');
  //     }

  //     // Hide all div elements with the attribute data-automation-id="pageHeader"
  //     const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
  //     pageHeaders.forEach((element: any) => {
  //       element.style.setProperty('display', 'none', 'important');
  //     });

  //     // Show the element with ID "ceoMessageReadMore"
  //     const webPartContainer = document.getElementById('ms-CommandBar');
  //     if (webPartContainer) {
  //       webPartContainer.style.display = 'none';
  //     }

  //     const spCommandBar = document.getElementById('spCommandBar');
  //     if (spCommandBar) {
  //       spCommandBar.style.setProperty('display', 'none', 'important');
  //     }

  //     const RecommendedItems = document.getElementById('RecommendedItems');
  //     if (RecommendedItems) {
  //       RecommendedItems.style.setProperty('display', 'none', 'important');
  //     }

  //     document.querySelectorAll('#eventsvm').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });

  //   }, 1000)
  //   var handler = this;
  //   $('#calendar').on('selectDate', function (event, newDate) {
  //     let SelectedDate = moment(newDate, "MM/DD/YYYY").format("DD/MM/YYYY")
  //     handler.getCurrentUser().then(() => {
  //       handler.GetEventsofSelectedDate(SelectedDate)
  //       // .then(()=>{

  //       //   handler.LandingPageAnalytics();
  //       // })
  //     })
  //   });

  //   const url: any = new URL(window.location.href);
  //   const Date = url.searchParams.get("SelectedDate");
  //   const Mode = url.searchParams.get("Mode");
  //   if (Mode == "EvRM") {
  //     this.setState({ Mode: "EvRM", Date: moment(Date, "YYYYMMDD").format('MMMM DD, YYYY') });
  //     var tdaydateAdd = moment(Date, "YYYYMMDD").format('YYYY-MM-DD');
  //     handler.GetEvents(tdaydateAdd, 'EvRM');
  //   } else {
  //     this.setState({ Mode: "EvVM", Date: moment().format('MMMM DD, YYYY') });
  //     var tdaydateAdd = moment(Date, "YYYYMMDD").format('YYYY-MM-DD');
  //     handler.GetEvents(tdaydateAdd, 'EvVM');
  //   }
  // }

  // Optimized code 

  public componentDidMount() {
    setTimeout(() => {
      // Elements and their corresponding IDs/attributes for hiding
      const elementsToHide = [
        'CommentsWrapper',
        'spCommandBar',
        'RecommendedItems',
        'ms-CommandBar'
      ];
      const attributesToHide = ['div[data-automation-id="pageHeader"]'];

      // Hide elements based on IDs
      elementsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.style.setProperty('display', 'none', 'important');
        }
      });

      // Hide elements based on attributes
      attributesToHide.forEach(attr => {
        document.querySelectorAll<HTMLElement>(attr).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
      });

      // Show specific elements
      document.querySelectorAll('#eventsvm').forEach(el => {
        (el as HTMLElement).style.display = 'block';

      });

    }, 1000);

    // Event handler for calendar date selection
    const handler = this;
    $('#calendar').on('selectDate', (event, newDate) => {
      const selectedDate = moment(newDate, "MM/DD/YYYY").format("DD/MM/YYYY");
      handler.getCurrentUser().then(() => {
        handler.GetEventsofSelectedDate(selectedDate);
      });
    });

    // Get URL parameters and set state based on mode
    const url = new URL(window.location.href);
    const selectedDateParam = url.searchParams.get("SelectedDate");
    const modeParam = url.searchParams.get("Mode");
    const formattedDate = selectedDateParam
      ? moment(selectedDateParam, "YYYYMMDD").format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    const formattedDisplayDate = selectedDateParam
      ? moment(selectedDateParam, "YYYYMMDD").format('MMMM DD, YYYY')
      : moment().format('MMMM DD, YYYY');

    const mode = modeParam === "EvRM" ? "EvRM" : "EvVM";
    this.setState({ Mode: mode, Date: formattedDisplayDate });
    handler.GetEvents(formattedDate, mode);
  }

  //   public async getCurrentUser() {
  //     var reacthandler = this;
  //     User = reacthandler.props.userid;
  //     const profile = await pnp.sp.profiles.myProperties.get().then(async(profile)=>{
  //     UserEmail = profile.Email;
  //     var Name = profile.DisplayName;
  //     Designation = profile.Title;
  // console.log(profile);

  //     // const currentUser = await sp.web.currentUser.get();
  //     // UserID = currentUser.Id;

  //     // Check if the UserProfileProperties collection exists and has the Department property
  //     if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //       // Find the Department property in the profile
  //       const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
  //       const DesignationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
  //       console.log(departmentProperty);
  //       if (departmentProperty) {
  //         Department = departmentProperty.Value;
  //       }
  //     }
  //   })
  //   }
  // public async getCurrentUser() {
  //   var reacthandler = this
  //   let curruser = await NewWeb.currentUser.get().then(function (res:any) {

  // console.log(res);

  //     const UserEmail = res.Email
  //     UserID.push(res.Id)
  //     const CurrentUserID = res.Id

  //   });
  // }


  public async getCurrentUser() {
    var reacthandler = this;
    try {
      $.ajax({
        url: `${reacthandler.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
        type: "GET",
        headers: { Accept: "application/json; odata=verbose;" },
        success: function (profile) {
          console.log(profile);
          Designation = profile.d.Title;
          if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
            // Find the Department property in the profile
            const departmentProperty = profile.d.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
            console.log(departmentProperty);
            if (departmentProperty) {
              Department = departmentProperty.Value;
            }
          }
          // reacthandler.setState({
          // //  CurrentUserName: Name,
          //  // CurrentuserEmail: resultData.d.Email,
          // });


        },
        error: function () { },
      });
    }
    catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
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


    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  // private async GetEvents(Date: string, Mode: string) {
  //   var reactHandler = this;
  //   var result
  //   if (Mode == "EvRM") {

  //     result = await NewWeb.lists.getByTitle(Eventslist).items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate").orderBy("EventDate", true).filter(`EndDate gt '${Date}'`).get()
  //   } else {

  //     result = await NewWeb.lists.getByTitle(Eventslist).items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate").orderBy("EventDate", true).filter(`EndDate gt '${moment().format('YYYY-MM-DD')}'`).get()
  //   }
  //   this.GetEventsForDots(Date, Mode);
  //   if (result.length != 0) {
  //     reactHandler.setState({
  //       Items: result,

  //     });

  //     // $("#if-event-present").show();
  //     // $("#if-no-event-present").hide();

  //     document.querySelectorAll('#if-event-present').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //     document.querySelectorAll('#if-no-event-present').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });

  //   } else {

  //     document.querySelectorAll('#if-event-present').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });
  //     document.querySelectorAll('#if-no-event-present').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });

  //     // $("#if-event-present").hide();
  //     // $("#if-no-event-present").show();
  //   }
  // }

  // Optimize thsi code

  private async GetEvents(date: string, mode: string) {
    try {
      // Fetch events based on the mode and date
      const filterDate = mode === "EvRM" ? date : moment().format('YYYY-MM-DD');
      const result = await NewWeb.lists
        .getByTitle(Eventslist)
        .items
        .select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate")
        .orderBy("EventDate", true)
        .filter(`EndDate gt '${filterDate}'`)
        .get();

      // Process events for dots
      this.GetEventsForDots(date, mode);

      // Update state and toggle visibility based on whether events are found
      this.setState({ Items: result });

      const isEventPresent = result.length !== 0;
      this.toggleEventDisplay(isEventPresent);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  // Helper function to toggle display based on whether events are present
  private toggleEventDisplay(isEventPresent: boolean) {
    const eventPresentElements = document.querySelectorAll<HTMLElement>('#if-event-present');
    const noEventPresentElements = document.querySelectorAll<HTMLElement>('#if-no-event-present');

    eventPresentElements.forEach(element => {
      element.style.display = isEventPresent ? 'block' : 'none';
    });

    noEventPresentElements.forEach(element => {
      element.style.display = isEventPresent ? 'none' : 'block';
    });
  }

  // private async GetEventsForDots(Date: moment.MomentInput, Mode: string) {
  //   if (Mode == "EvVM") {
  //     await NewWeb.lists.getByTitle(Eventslist).items.select("Title", "Description", "Location", "Image", "Location", "EventDate", "EndDate", "ID").orderBy("Created", false).getAll().then((items: string | any[]) => { // //orderby is false -> decending                  

  //       for (var i = 0; i < items.length; i++) {
  //         eventList.push(
  //           { id: "" + items[i].ID + "", name: "" + items[i].Title + "", date: "" + moment(items[i].EventDate).format("MMMM/D/YYYY") + "", type: "holiday", description: "" + items[i].Description + "" }
  //         );
  //       }

  //       ($('#calendar') as any).evoCalendar({
  //         calendarEvents: eventList,
  //         'todayHighlight': true,
  //         'eventListToggler': false,
  //         'eventDisplayDefault': false,
  //         'sidebarDisplayDefault': false
  //       });
  //     }).catch((err: any) => {
  //       console.log(err);
  //     });
  //   } else {

  //     await NewWeb.lists.getByTitle(Eventslist).items.select("Title", "Description", "Location", "Image", "Location", "EventDate", "EndDate", "ID").orderBy("Created", false).getAll().then((items: string | any[]) => { // //orderby is false -> decending                  
  //       for (var i = 0; i < items.length; i++) {


  //         eventList.push(
  //           { id: "" + items[i].ID + "", name: "" + items[i].Title + "", date: "" + moment(items[i].EventDate).format("MMMM/D/YYYY") + "", type: "holiday", description: "" + items[i].Description + "" }
  //         );
  //       }
  //       const DateFormat = moment(Date).format("MMMM DD,YYYY");
  //       ($('#calendar') as any).evoCalendar({
  //         calendarEvents: eventList,
  //         'todayHighlight': true,
  //         'eventListToggler': false,
  //         'eventDisplayDefault': false,
  //         'sidebarDisplayDefault': false,
  //         'selectDate': "07/09/2021"//this.state.Date
  //       });
  //       ($("#calendar") as any).evoCalendar('selectDate', "" + DateFormat + "");


  //     }).catch((err: any) => {
  //       console.log(err);
  //     });
  //   }

  // }

  // Optimized code

  private async GetEventsForDots(Date: moment.MomentInput, Mode: string) {
    try {
      const items = await NewWeb.lists
        .getByTitle(Eventslist)
        .items.select("Title", "Description", "Location", "Image", "EventDate", "EndDate", "ID")
        .orderBy("Created", false)
        .getAll();

      // Populate eventList based on fetched items
      items.forEach((item: { ID: any; Title: any; EventDate: moment.MomentInput; Description: any; }) => {
        eventList.push({
          id: `${item.ID}`,
          name: `${item.Title}`,
          date: `${moment(item.EventDate).format("MMMM/D/YYYY")}`,
          type: "holiday",
          description: `${item.Description}`
        });
      });

      // Common evoCalendar initialization options
      const calendarOptions = {
        calendarEvents: eventList,
        todayHighlight: true,
        eventListToggler: false,
        eventDisplayDefault: false,
        sidebarDisplayDefault: false
      };

      // Initialize evoCalendar with options
      // ($('#calendar') as any).evoCalendar(calendarOptions);

      const calendarElement = document.querySelector('#calendar') as HTMLElement;
      if (calendarElement) {
        (calendarElement as any).evoCalendar(calendarOptions);
      }

      if (Mode !== "EvVM") {
        // If not 'EvVM' mode, set the selected date
        const formattedDate = moment(Date).format("MMMM DD, YYYY");
        // ($("#calendar") as any).evoCalendar('selectDate', formattedDate);
        (calendarElement as any).evoCalendar('selectDate', formattedDate);

      }
    } catch (err) {
      console.error('Error fetching events for calendar:', err);
    }
  }


  private async GetEventsofSelectedDate(Date: moment.MomentInput) {
    var reactHandler = this;
    var tdaydateAdd = moment(Date, "DD/MM/YYYY").subtract(1, 'd').format('YYYY-MM-DD');
    this.setState({ Items: [], Date: moment(tdaydateAdd).add(1, 'd').format('YYYY-MM-DD'), SelectedDate: "" + moment(Date, "DD/MM/YYYY").format("MMM D") + "" });
    await NewWeb.lists.getByTitle(Eventslist).items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate", "*").orderBy("EventDate", true).filter(`EventDate gt '${tdaydateAdd}'`).get().then((items: any[]) => { // //orderby is false -> decending                  
      reactHandler.setState({
        Items: items, ItemID: items[0].Id, Title: items[0].Title
      }, () => {
        // Call LandingPageAnalytics after state is updated
        this.LandingPageAnalytics();

      });
      if (items.length == 0) {
        $("#if-event-present").hide();
        $("#if-no-event-present").show();
      } else {
        $("#if-event-present").show();
        $("#if-no-event-present").hide();
      }
      reactHandler.CheckEvents();
    });
  }
  public CheckEvents() {
    const calendarElement = document.querySelector('#calendar') as HTMLElement;
    let active_events;

    if (calendarElement) {
      active_events = (calendarElement as any).evoCalendar('getActiveEvents');
    }
    // var active_events = ($("#calendar") as any).evoCalendar('getActiveEvents');
    console.log(active_events)
    if (active_events.length == 0) {
      // $("#if-event-present").hide();
      // $("#if-no-event-present").show();

      document.querySelectorAll('#if-event-present').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      document.querySelectorAll('#if-no-event-present').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });

    } else {
      // $("#if-event-present").show();
      // $("#if-no-event-present").hide();

      document.querySelectorAll('#if-event-present').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
      document.querySelectorAll('#if-no-event-present').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });

    }
  }

  public checkSame(date1: moment.MomentInput, date2: moment.MomentInput) {
    return moment(date1).isSame(date2);
  }

  public render(): React.ReactElement<IEventsViewMoreProps> {
    var handler = this;
    const EventsfromCalender: JSX.Element[] = this.state.Items.map(function (item: {
      ID: any; EventDate: moment.MomentInput; Title: any; Description: string; Location: any; EndDate: moment.MomentInput; Image: any;
    }) {
      var EventDateStart = moment(item.EventDate).format('YYYY-MM-DD');
      if (handler.checkSame(handler.state.Date, EventDateStart)) {
        var Title = item.Title;
        let dummyElement = document.createElement("div");
        dummyElement.innerHTML = item.Description;
        var outputText = dummyElement.innerText;
        var Location = item.Location;
        var EndDate = moment(item.EndDate).format("DD/MM/YYYY h:mm A");
        var StartDate = moment(item.EventDate).format("DD/MM/YYYY h:mm A");
        let RawImageTxt = item.Image;
        var serverRelativeUrl;

        if (RawImageTxt && RawImageTxt !== "") {
          var ImgObj = JSON.parse(RawImageTxt);
          serverRelativeUrl = ImgObj.serverRelativeUrl || `${handler.props.siteurl}/Lists/${Eventslist}/Attachments/` + item.ID + "/" + ImgObj.fileName;
        } else {
          serverRelativeUrl = `${handler.props.siteurl}/SiteAssets/img/No-Events-Image.svg`;
        }

        return (
          <li className="clearfix">
            <div className="inner-event-body-left">
              <img src={serverRelativeUrl} alt="image" />
            </div>
            <div className="inner-event-body-right">
              <div className="event-location-duration clearfix">
                <div className="event-location-duration-left">
                  <img src={`${handler.props.siteurl}/SiteAssets/img/duration.svg`} /> {StartDate} to {EndDate}
                </div>
                <div className="event-location-duration-right">
                  <img src={`${handler.props.siteurl}/SiteAssets/img/location.svg`} /> {Location}
                </div>
              </div>
              <h4>{Title}</h4>
              <p>{outputText}</p>
            </div>
          </li>
        );
      }
    }).filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className={styles.remoHomePage} id="eventsvm" style={{ display: "none" }}>

        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}

        <div className="container relative">
          <div className="section-rigth">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Events </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Events </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents sec">
              <div className="row">
                <div className="col-md-6">
                  <div id="calendar"></div>

                </div>
                <div className="col-md-6">
                  <div className="inner-event-wrap">
                    <div className="inner-event-main-wrap" >
                      <div className="inner-event-header">
                        {this.state.SelectedDate}
                      </div>
                      <div id="event" >

                        <div className="inner-event-body" id="if-event-present" >
                          <ul >
                            {EventsfromCalender}
                          </ul>
                        </div>
                        <div className="inner-event-body" id="if-no-event-present" >
                          <p >No events on selected date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

          </div>
        </div>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
