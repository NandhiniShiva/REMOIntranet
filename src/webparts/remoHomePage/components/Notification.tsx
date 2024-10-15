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
    Noficationcount: any;
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
            Noficationcount: [],
            logodata: [],
            Name_Ar: "",
            Designation_Ar: "",
            Userid: "",
        };
        newweb = Web(this.props.siteurl);
    }

    public async componentDidMount() {
        await this.GetCurrentUserDetails().then(async () => {
            await this.getNotication();
        })


    }
    public async GetCurrentUserDetails() {
        try {
            let CurrentUserID: any;
            let curruser = await newweb.currentUser.get().then(function (res: any) {
                // let CurrentUserEmail = res.Email
                CurrentUserID = res.Id
            }).then(() => {
                console.log(curruser);
                this.setState({ Userid: CurrentUserID })
            })
        } catch (error) {
            console.error('Error fetching current user details:', error);
        }
    }

    public getNotication() {
        var totalcount: any;
        try {
            newweb.lists.getByTitle(NotificationList).items.select("*").filter(`AssignedToId eq ${this.state.Userid} and IsSeen ne '1'`).orderBy('Created', false).top(8000).get().then((response: any) => {
                totalcount = response.length;


                console.log(response);
                if (response.length != 0) {


                    this.setState({
                        NotificationItems: response,
                    })
                }
                if (totalcount < 10) {
                    totalcount = response.length;
                }
                else if (10 > totalcount && totalcount < 20) {
                    totalcount = "10+";
                }
                else if (20 > totalcount && totalcount < 30) {
                    totalcount = "20+";
                }
                else if (30 > totalcount && totalcount < 40) {
                    totalcount = "30+";
                }
                else if (40 > totalcount && totalcount < 50) {
                    totalcount = "40+";
                }
                else if (50 > totalcount && totalcount < 60) {
                    totalcount = "50+";
                }
                else if (60 > totalcount && totalcount < 70) {
                    totalcount = "60+";
                }
                else if (70 > totalcount && totalcount < 80) {
                    totalcount = "70+";
                }
                else if (80 > totalcount && totalcount < 90) {
                    totalcount = "80+";
                }
                else if (90 > totalcount && totalcount < 100) {
                    totalcount = "90+";
                }
                else {
                    totalcount = "99+";
                }

                this.setState({
                    Noficationcount: totalcount
                })

            })
        } catch (error) {
            console.log("Error in getNotication", error);

        }
    }


    public IsItemSeen(id: any, Currentcatagory: any, Listname: any, guID: any) {
        try {


            newweb.lists.getByTitle(NotificationList).items.filter(`ItemId eq '${id}'and AuthorId eq ${User} and GUID eq '${guID}'`).getAll().then(async (items: any) => { // //orderby is false -> decending
                if (items.length > 0) {
                    const itemId = items[0].Id;
                    // newweb.lists.getByTitle(NotificationList).items.getById(itemId).update({
                    //     SeenOn: currentdate,
                    //     IsSeen: "true"
                    // }).then(() => {
                    //     this.getNotication();
                    // })
                    // alert(itemId)
                    await newweb.lists.getByTitle(NotificationList).items.getById(itemId).delete()
                        .then(async () => {
                            await this.getNotication();

                        })
                }
            }).then(() => {
                // var href: string = `${this.props.siteurl}/SitePages/ECAVoice_RM.aspx?ItemID=${id}&List=${Listname}&Catagory=${Currentcatagory}`
                // window.open(href, ' ')
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

            // else if (Catagory_En == "Leadership Corner" || Catagory_En == "ECA Voice" || Catagory_En == "Discovery Day" || Catagory_En == "Monday Mental Breaks" || Catagory_En == "Meet Free Fridays") {
            //     var serverRelativeUrl = item.Image.Url;
            //     url = `${reactHandler.props.siteurl}/SitePages/ECAVoice_RM.aspx?ItemID=${itemiD}&List=${ListName}&Catagory=${Catagory_En}`;
            // }
            // else if (Catagory_En == "Maintenance" || Catagory_En == "Communications") {
            //     var serverRelativeUrl = item.Image.Url;
            //     url = `${reactHandler.props.siteurl}/SitePages/ECAVoice_RM.aspx?ItemID=${itemiD}&List=${ListName}&Catagory=${Catagory_En}`;
            // }
            // else {
            //     var serverRelativeUrl = item.Image.Url;
            //     url = `#`;
            // }
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
                        <a href="#"> <img id='Bell-img' className='notification_bell' src={`${this.props.siteurl}/SiteAssets/ECAImage/notification_img.svg`} /> <span id='Bell-img'> {reactHandler.state.Noficationcount} </span> </a>
                        <div className="notification_part">
                            <div className="noti_header clearfix">
                                <h3>Notification </h3>
                                <p> {reactHandler.state.Noficationcount} Unread</p>
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
