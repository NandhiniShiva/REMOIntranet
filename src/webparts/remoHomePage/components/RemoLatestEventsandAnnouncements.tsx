import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import * as moment from 'moment';
import { listNames } from '../Configuration';
import "@pnp/sp/clientside-pages/web";
import { ListCreation } from './ServiceProvider/List&ColumnCreation';

let Announcementlist = listNames.Announcement;
let Eventslist = listNames.Events;

export interface IEventsAnnouncementsState {
  Items: any[];
  Events: any[];
  isDataAvailable: boolean;
  isDataAvailableAnnc: boolean;
}

SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css");
SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");


export default class RemoLatestEventsandAnnouncements extends React.Component<IRemoHomePageProps, IEventsAnnouncementsState, {}> {
  constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      Events: [],
      isDataAvailable: false,
      isDataAvailableAnnc: false
    };

  }

  public async componentDidMount() {
    var reactHandler = this;
    const listCreation = new ListCreation();
    await listCreation.createSharePointLists(Announcementlist);
    await listCreation.createSharePointLists(Eventslist);
    await reactHandler.GetAnnouncements();
    await reactHandler.GetEvents();

  }


  private async GetAnnouncements() {
    try {
      const items = await sp.web.lists
        .getByTitle(Announcementlist)
        .items.select("Title", "Description", "Created", "ID")
        .filter(`IsActive eq '1'`)
        .orderBy("Created", false)
        .top(1)
        .get();
      // debugger;
      if (items.length !== 0) {
        // Show the announcement section
        document.querySelectorAll('#if-annc-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });

        // Update the state with fetched items
        this.setState({
          Items: items,
          isDataAvailableAnnc: true
        });
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
        this.setState({
          Events: items,
          isDataAvailable: true
        });
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

  public addDataEvenlist(event: any) {
    event.preventDefault();
    const listUrl = `${this.props.siteurl}/Lists/${Eventslist}`;
    window.open(listUrl, "_blank");
  }

  public addDataAncc(event: any) {
    event.preventDefault();
    const listUrl = `${this.props.siteurl}/Lists/${Announcementlist}`;

    window.open(listUrl, "_blank");
  }
  public readMoreHandler(compName: any, itemId: any) {
    this.props.onReadMoreClick({ Name: compName, Id: itemId })
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
            <a href='#' onClick={() => this.readMoreHandler("AnnouncementViewMore", item.ID)} data-interception='off'>

              <h4> Announcements </h4>
            </a>
            <p> {DateofPublish}  </p>
          </div>
          <div className="ann-detibck">
            <a href='#' onClick={() => this.readMoreHandler("AnnouncementReadMore", item.ID)} data-interception='off'>

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
            <h4>
              <a href='#' onClick={() => this.readMoreHandler("EventsViewMore", item.ID)} data-interception='off' >{item.Title}</a>
            </h4>
            <p> {outputText}  </p>
          </div>
        </li>
      );
    });

    return (
      <div className='col-md-12 eventsandannouncements'>
        <div className={styles.remoHomePage} id="events-and-anncmnts">
          <div className="latest-news-announcemnst">
            <div >
              {this.state.isDataAvailable == true ?
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
                    <img className="err-img" src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/ContentEmpty.png")} alt="ceoimg"></img>
                  </div>
                </div>
                :
                <div>
                  <button onClick={(e) => this.addDataEvenlist(e)}>Add Data In Events</button>
                </div>
              }
              {this.state.isDataAvailableAnnc ?
                <div className="col-md-6" id="if-annc-present">
                  {AnncItems}
                </div>
                :
                <div>
                  <button onClick={(e) => this.addDataAncc(e)}>Add Data In Announcement List</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
