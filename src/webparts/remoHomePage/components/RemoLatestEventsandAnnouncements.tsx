import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
// import * as $ from 'jquery';
import * as moment from 'moment';
import { listNames } from '../Configuration';
import "@pnp/sp/clientside-pages/web";
import { Web } from '@pnp/sp/webs';

let Announcementlist = listNames.Announcement;
let Eventslist = listNames.Events;
let spWeb: any;

export interface IEventsAnnouncementsState {
  Items: any[];
  Events: any[];
}

SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css");
SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");


export default class RemoLatestEventsandAnnouncements extends React.Component<IRemoHomePageProps, IEventsAnnouncementsState, {}> {
  constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      Events: []
    };

  }

  public componentDidMount() {

    var reactHandler = this;
    reactHandler.GetAnnouncements();
    reactHandler.GetEvents();
    if (this.props.createList) {
      reactHandler.CreateList();
    }
  }


  // private async GetAnnouncements() {
  //   var reactHandler = this;
  //   try {
  //     await sp.web.lists.getByTitle(Announcementlist).items.select("Title", "Description", "Created", "ID").filter(`IsActive eq '1'`).orderBy("Created", false).top(1).get().then((items) => { // //orderby is false -> decending          

  //       if (items.length != 0) {
  //         // $("#if-annc-present").show();
  //         document.querySelectorAll('#if-annc-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         });
  //         reactHandler.setState({
  //           Items: items
  //         });
  //       } else {
  //         // $("#if-no-annc-present").show();
  //         document.querySelectorAll('#if-no-annc-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     console.log("Events : " + err);
  //   }
  // }

  // Updated code 

  private async GetAnnouncements() {
    try {
      const items = await sp.web.lists
        .getByTitle(Announcementlist)
        .items.select("Title", "Description", "Created", "ID")
        .filter(`IsActive eq '1'`)
        .orderBy("Created", false)
        .top(1)
        .get();

      if (items.length !== 0) {
        // Show the announcement section
        document.querySelectorAll('#if-annc-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });

        // Update the state with fetched items
        this.setState({ Items: items });
      } else {
        // Show the "no announcement" section
        document.querySelectorAll('#if-no-annc-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  }
  // private async GetEvents() {
  //   var reactHandler = this;
  //   const tdaydate = moment().format('MM-DD-YYYY');
  //   try {
  //     await sp.web.lists.getByTitle(Eventslist).items.select("Title", "Description", "EventDate", "EndDate", "ID").filter(`EndDate ge '${tdaydate}'`).orderBy("Created", false).top(3).get().then((items) => { // //orderby is false -> decending          

  //       if (items.length != 0) {
  //         // $("#if-events-present").show();
  //         // $("#if-no-events-present").hide();

  //         document.querySelectorAll('#if-events-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         }); document.querySelectorAll('#if-no-events-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'none';
  //         });
  //         reactHandler.setState({
  //           Events: items
  //         });
  //       } else {
  //         // $("#if-events-present").hide();
  //         // $("#if-no-events-present").show();

  //         document.querySelectorAll('#if-events-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'none';
  //         }); document.querySelectorAll('#if-no-events-present').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     console.log("Events : " + err);
  //   }
  // }

  // Updated code 
  private async GetEvents() {
    const tdaydate = moment().format('MM-DD-YYYY');

    try {
      const items = await sp.web.lists
        .getByTitle(Eventslist)
        .items.select("Title", "Description", "EventDate", "EndDate", "ID")
        .filter(`EndDate ge '${tdaydate}'`)
        .orderBy("Created", false)
        .top(3)
        .get();

      if (items.length !== 0) {
        // Show the events section and hide the "no events" section
        document.querySelectorAll('#if-events-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-events-present').forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });

        // Update state with fetched events
        this.setState({ Events: items });
      } else {
        // Hide the events section and show the "no events" section
        document.querySelectorAll('#if-events-present').forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-events-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  public CreateList = async () => {
    spWeb = Web(this.props.siteurl);
    await spWeb.lists.add(this.props.name, "This is a description of doc lib.", 104, true, { OnQuickLaunch: true });


    await this.createColumn();

    await this.addData();

    // this.createSitePage();
    // fetchList = true;

    await this.GetAnnouncements();


  }

  public async createColumn() {
    await spWeb.lists.getByTitle(this.props.name).fields.createFieldAsXml(
      `<Field Type="Note" Name="Description" DisplayName="Description" Required="FALSE" RichText="TRUE" RichTextMode="FullHtml" />`);
    await spWeb.lists.getByTitle(this.props.name).fields.createFieldAsXml(
      `<Field Type="Note" Name="Body" DisplayName="Body" Required="FALSE" RichText="TRUE" RichTextMode="FullHtml" />`);
    await spWeb.lists.getByTitle(this.props.name).fields.addImageField("Image", { Group: "My Group" });
    await spWeb.lists.getByTitle(this.props.name).fields.createFieldAsXml('<Field Type="DateTime" DisplayName="Expire" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Format="DateOnly" Group="Custom Columns" FriendlyDisplayFormat="Disabled"></Field>')
    await spWeb.lists.getByTitle(this.props.name).fields.addBoolean("IsActive", { Group: "My Group" });
    await spWeb.lists.getByTitle(this.props.name).fields.addBoolean("EnableLikes", { Group: "My Group" });
    await spWeb.lists.getByTitle(this.props.name).fields.addBoolean("EnableComments", { Group: "My Group" });


  }

  private async addData() {
    await sp.web.lists.getByTitle(this.props.name).items.add({
      Title: " World Cup",
      Description: "The ICC Men's T20 World Cup (earlier known as ICC World Twenty20)[4] is the international championship of Twenty20 cricket.",
      IsActive: true,
      EnableLikes: true,
      EnableComments: true
    }).catch((error: any) => {
      console.log("Error: ", error);
    });
    // .then(function () {
    //   location.reload();
    // });
    // window.open(`/sites/SPTraineeBT/Lists/${listName}/AllItems.aspx`, '_blank');
  }


  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;
    const AnncItems: JSX.Element[] = this.state.Items.map((item, key) => {
      const dummyElement = document.createElement("div");
      dummyElement.innerHTML = item.Description;
      const outputText = dummyElement.innerText;

      const CreatedDate = moment(item.Created).format("DD/MM/YYYY");
      const CurrentDate = moment().format("DD/MM/YYYY");
      const DateofPublish = CreatedDate === CurrentDate ? "Today" : CreatedDate;

      return (
        <div className="sec gradient" key={key}>
          <div className="annoy-heading">
            <a href={`${handler.props.siteurl}/SitePages/Announcement-View-More.aspx?ItemID=${item.ID}&`} data-interception='off'>
              <h4> Announcements </h4>
            </a>
            <p> {DateofPublish}  </p>
          </div>
          <div className="ann-detibck">
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?ItemID=${item.ID}&`} data-interception='off'>
              <h2>{item.Title} </h2>
            </a>
            <p> {outputText}</p>
          </div>
        </div>
      );
    });

    const Events: JSX.Element[] = handler.state.Events.map((item, key) => {
      const Date = moment(item.EventDate).format("DD");
      const Month = moment(item.EventDate).format("MMM");

      const dummyElement = document.createElement("div");
      dummyElement.innerHTML = item.Description;
      const outputText = dummyElement.innerText;

      return (
        <li className="clearfix" key={key}>
          <div className="latest-eventsleft relative">
            <h2> {Date} </h2>
            <p> {Month} </p>
            <div className="inner-shaodw"> </div>
          </div>
          <div className="latest-eventsright" id="evocalendar">
            <h4><a href={`${handler.props.siteurl}/SitePages/EventsViewMore.aspx?Mode=EvRM&ItemID=${item.ID}&SelectedDate=${moment(item.EventDate).format("YYYYMMDD")}&`} data-interception='off' >{item.Title}</a> </h4>
            <p> {outputText}  </p>
          </div>
        </li>
      );
    });

    return (
      <div className={styles.remoHomePage} id="events-and-anncmnts">
        <div className="latest-news-announcemnst">
          <div >
            <div className="col-md-6">
              <div className="sec event-cal" id="if-events-present">
                <div className="heading clearfix">
                  <h4><a href={`${this.props.siteurl}/SitePages/EventsViewMore.aspx?`}>
                    Latest Events
                  </a>
                  </h4>

                </div>
                <div className="section-part clearfix latest-events-bck">
                  <ul>
                    {Events}
                  </ul>
                </div>
              </div>

              <div className="sec event-cal" id="if-no-events-present" style={{ display: "none" }}>
                <div className="heading">
                  Latest Events
                </div>
                <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>
              </div>
            </div>
            <div className="col-md-6" id="if-annc-present">
              {AnncItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
