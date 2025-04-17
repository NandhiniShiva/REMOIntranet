import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/items/list";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { Web } from '@pnp/sp/webs';
import * as moment from 'moment';
import pnp from 'sp-pnp-js';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { listNames } from '../Configuration';
import { ServiceProvider } from '../components/ServiceProvider/Service';

let NotificationList = listNames.NotificationList
let newweb: any;
var User: any;

export interface ISideNavState {
    Docs: any[];
    Count: any;
    Toggle: boolean;
    Language: any[];
    EnglishLanguage: boolean;
    ArabicLanguage: boolean;
    CurrentUserName: string;
    CurrentUserDesignation: string;
    CurrentUserProfilePic: string;
    email: string;
    NotificationItems: any[];
    SidenavData: any[];
    NotificationCount: any;
    logodata: any[];
    Name_Ar: string;
    Designation_Ar: string;
    Userid: string
}

export default class SideNav extends React.Component<IRemoHomePageProps, ISideNavState, {}> {
    public serviceProvider;
    constructor(props: IRemoHomePageProps) {
        super(props);
        this.serviceProvider = new ServiceProvider(this.props.context);

        pnp.setup({
            spfxContext: this.props.context
        });
        User = this.props.userid;

        this.state = {
            Docs: [],
            Count: "",
            Toggle: true,
            Language: [],
            EnglishLanguage: true,
            ArabicLanguage: false,
            CurrentUserName: "",
            CurrentUserDesignation: "",
            CurrentUserProfilePic: "",
            email: "",
            NotificationItems: [],
            SidenavData: [],
            NotificationCount: [],
            logodata: [],
            Name_Ar: "",
            Designation_Ar: "",
            Userid: "",
        };
        newweb = Web(this.props.siteurl);
    }

    public async componentDidMount() {
        await this.GetCurrentUserDetails().then(async () => {
            await this.getNotification();
        })


    }
    public async GetCurrentUserDetails() {
        try {
            let CurrentUserID: any;
            await newweb.currentUser.get().then(function (res: any) {
                CurrentUserID = res.Id
            }).then(() => {
                this.setState({ Userid: CurrentUserID })
            })
        } catch (error) {
            console.error('Error fetching current user details:', error);
        }
    }

    public async getNotification() {
        try {
            const response = await newweb.lists.getByTitle(NotificationList).items
                .select("*")
                .filter(`AssignedToId eq ${this.state.Userid} and IsSeen ne '1'`)
                .orderBy('Created', false)
                .top(8000)
                .get();

            const totalcount = response.length;

            // Update state if notifications are found
            if (totalcount > 0) {
                this.setState({ NotificationItems: response });
            }

            // Determine display count based on total notifications
            let displayCount;
            if (totalcount < 10) {
                displayCount = totalcount;
            } else if (totalcount < 100) {
                displayCount = `${Math.floor(totalcount / 10) * 10}+`;
            } else {
                displayCount = "99+";
            }

            this.setState({ NotificationCount: displayCount });

        } catch (error) {
            console.error("Error in getNotification", error);
        }
    }

    public IsItemSeen(id: any, Currentcatagory: any, Listname: any, guID: any) {
        try {
            newweb.lists.getByTitle(NotificationList).items.filter(`ItemId eq '${id}'and AuthorId eq ${User} and GUID eq '${guID}'`).getAll().then(async (items: any) => { // //orderby is false -> decending
                if (items.length > 0) {
                    const itemId = items[0].Id;

                    await newweb.lists.getByTitle(NotificationList).items.getById(itemId).delete()
                        .then(async () => {
                            await this.getNotification();

                        })
                }
            }).then(() => {

            })
        } catch (error) {
            console.log("Error in IsItemSeen", error);

        }
    }
    public render(): React.ReactElement<IRemoHomePageProps> {
        var reactHandler = this;
        var hoursElapsed: any;
        const ShowNotificationItems: JSX.Element[] = reactHandler.state.NotificationItems.map(function (item) {
            var Catagory_En = item.Catagory;
            var timecreated = item.Created;
            if (reactHandler.state.EnglishLanguage) {
                moment.locale('en');
            } else {
                moment.locale('ar');
            }
            var creationTime = moment(timecreated);
            var formattedTime = creationTime.format('MMM YYYY');
            var now = moment();
            var duration = moment.duration(now.diff(creationTime));
            var minutesElapsed = Math.floor(duration.asMinutes());
            var guID = item.GUID;
            var itemiD = item.ItemId;
            var ListName = item.ListName;
            var Tag = item.Tag;
            var Dept = item.Dept;
            var url;

            if (minutesElapsed > 60) {
                hoursElapsed = Math.floor(duration.asHours());
            }
            if (Catagory_En == "News") {
                var serverRelativeUrl = item.Image.Url;
                url = `${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${itemiD}&AppliedTag=${Tag}&Dept=${Dept}`;
            }
            if (Catagory_En == "CEO Message") {
                var serverRelativeUrl = item.Image.Url;
                url = `${reactHandler.props.siteurl}/SitePages/CEO-Read-More.aspx?ItemID=${itemiD}`;
            }
            if (Catagory_En == "Hero Banner") {
                var serverRelativeUrl = item.Image.Url;
                url = `${reactHandler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${itemiD}`;
            }
            if (Catagory_En == "Announcement") {
                var serverRelativeUrl = item.Image.Url;
                url = `${reactHandler.props.siteurl}/SitePages/Announcement-Read-More.aspx?ItemID=${itemiD}`;
            }
            if (Catagory_En == "Events" && new Date(item.EventEnd).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)) {
                var serverRelativeUrl = item.Image.Url;
                url = `${reactHandler.props.siteurl}/SitePages/EventsViewMore.aspx?Mode=EvRM&ItemID=${item.ID}&SelectedDate=${moment(item.EventDate).format("YYYYMMDD")}&`;
            }

            return (
                <>
                    <li id={itemiD} className="clearfix" onClick={() => reactHandler.IsItemSeen(itemiD, Catagory_En, ListName, guID)}>
                        <a href={url} data-interception="off">
                            <div className="notifi_left">
                                <img id='noti-left-img' src={serverRelativeUrl} />
                            </div>
                            <div className="notifi_right">
                                <h2> {Catagory_En} <span> New post is added </span> </h2>
                                {minutesElapsed < 60 && minutesElapsed == 0 &&
                                    <p>Just Now</p>
                                }
                                {minutesElapsed < 60 && minutesElapsed == 1 &&
                                    <p>{minutesElapsed} Min ago </p>
                                }
                                {minutesElapsed < 60 && minutesElapsed > 1 &&
                                    <p>{minutesElapsed} Mins ago </p>
                                }
                                {minutesElapsed > 60 && hoursElapsed == 1 && hoursElapsed < 24 &&
                                    <p>{hoursElapsed} Hour ago </p>
                                }
                                {minutesElapsed > 60 && hoursElapsed > 1 && hoursElapsed < 24 &&
                                    <p>{hoursElapsed} Hours ago </p>
                                }
                                {minutesElapsed > 60 && hoursElapsed > 24 &&
                                    <p> {formattedTime} </p>
                                }
                            </div>
                        </a>
                    </li>
                </>
            );

        });

        return (
            <div>
                <div className="li_profile user-image-block left_notification">
                    <div className="notification_banner">
                        <a href="#"> <img id='Bell-img' className='notification_bell' src={require("./ServiceProvider/Assets/Img/notification_img.svg")} /> <span id='Bell-img'> {reactHandler.state.NotificationCount} </span> </a>
                        <div className="notification_part">
                            <div className="noti_header clearfix">
                                <h3>Notification </h3>
                                <p> {reactHandler.state.NotificationCount} Unread</p>
                            </div>
                            <ul className="notification_ul">
                                {ShowNotificationItems}
                            </ul>
                        </div>
                    </div>
                </div>


            </div>

        )
    }

}
