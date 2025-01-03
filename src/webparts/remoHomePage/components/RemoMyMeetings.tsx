import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as moment from 'moment';
// import * as $ from 'jquery';
import { ServiceProvider } from '../components/ServiceProvider/Service';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import ReactTooltip from "react-tooltip";

import { initializeIcons } from 'office-ui-fabric-react';
initializeIcons();

export interface IMyDayRoutineState {
    myroutineDatas: any[];
    mypastroutineDatas: any[];
    myfutureroutineDatas: any[];
    MyQuickLinksPrefference: any[];
    MyQuickLinkData: any[];
    MarginValue: any;
    DynamicSectionWidth: any;

    WeekDates: any[];

    skippedFutureDate: string;
    SelectedDate: any;
    myFutureEventDatas: any[];
    IsCurrentFuture: string;
    IsCuurentMeetingPresent: string;

    FirstLoop: boolean;
    isTodayRoutinesAvailable: boolean;
}




// var uniqueCountItem = [];
var uniqueCountItemFuture = [];
export default class RemoMyMeetings extends React.Component<IRemoHomePageProps, IMyDayRoutineState, {}> {
    private serviceProvider;
    public constructor(props: IRemoHomePageProps) {
        super(props);
        this.serviceProvider = new ServiceProvider(this.props.context);
        this.state = {
            myroutineDatas: [],
            mypastroutineDatas: [],
            myfutureroutineDatas: [],
            MyQuickLinksPrefference: [],
            MyQuickLinkData: [],
            MarginValue: 0,
            DynamicSectionWidth: 0,

            WeekDates: [],
            skippedFutureDate: "",
            SelectedDate: "",
            myFutureEventDatas: [],
            IsCurrentFuture: "",
            IsCuurentMeetingPresent: "",
            FirstLoop: true,
            isTodayRoutinesAvailable: false
        };

    }


    public componentDidMount() {
        var reacthandler = this;
        reacthandler.getmytodaysroutines();
        reacthandler.getmytodaysPastroutines();


    }

    // public getmytodaysroutines() {


    //     uniqueCountItem = [];
    //     this.serviceProvider.
    //         getMyTodaysRoutine()
    //         .then(
    //             (result: any[]): void => {
    //                 this.setState({ myroutineDatas: result });

    //                 for (var i = 0; i < result.length; i++) {
    //                     var Starttime = moment.utc(result[i].start.dateTime);
    //                     let CTime = moment().format('DD-MM-YYYY');
    //                     var subject = result[i].subject;

    //                     if (moment(CTime, 'DD-MM-YYYY').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY')) {
    //                         uniqueCountItem.push(subject);
    //                     }
    //                 }

    //                 if (uniqueCountItem.length == 0) {
    //                     // $(".present").hide();
    //                     // $("#current-event").hide();
    //                     // $(".future").show();

    //                     document.querySelectorAll('.present').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('#current-event').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });

    //                     this.getmyFutureEvents();
    //                 } else {
    //                     this.setState({ IsCurrentFuture: "" });
    //                     // $(".future").hide();
    //                     // $(".present").show();
    //                     // $("#current-event").show();

    //                     document.querySelectorAll('.present').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                     document.querySelectorAll('#current-event').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });

    //                     // $("#dt-current").text(" My Meetings");
    //                     let textContent: any = document.getElementById('dt-current');
    //                     textContent.textContent = ' My Meetings';

    //                     // setTimeout(function () {
    //                     //     let textField = $(".ms-TextField-field");
    //                     //     textField.val(moment().format("D/M/YYYY"));
    //                     // }, 1500);
    //                     setTimeout(function () {
    //                         // Select the text fields with the class 'ms-TextField-field'
    //                         let textFields = document.querySelectorAll<HTMLInputElement>(".ms-TextField-field");
    //                         // Get the formatted date
    //                         let formattedDate = moment().format("D/M/YYYY");
    //                         // Update the value of each text field
    //                         textFields.forEach(function (field) {
    //                             // Cast the field to HTMLInputElement to access the 'value' property
    //                             (field as HTMLInputElement).value = formattedDate;
    //                         });
    //                     }, 1500);
    //                 }
    //             }
    //         );

    // }

    // Updated code 
    // public async getmytodaysroutines() {
    //     try {
    //         uniqueCountItem = [];
    //         const result = await this.serviceProvider.getMyTodaysRoutine();
    //         this.setState({ myroutineDatas: result });

    //         for (let i = 0; i < result.length; i++) {
    //             const Starttime = moment.utc(result[i].start.dateTime);
    //             const CTime = moment().format('DD-MM-YYYY');
    //             const subject = result[i].subject;

    //             if (moment(CTime, 'DD-MM-YYYY').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY')) {
    //                 uniqueCountItem.push(subject);
    //             }
    //         }

    //         if (uniqueCountItem.length === 0) {
    //             document.querySelectorAll('.present').forEach(element => {
    //                 (element as HTMLElement).style.display = 'none';
    //             });
    //             document.querySelectorAll('#current-event').forEach(element => {
    //                 (element as HTMLElement).style.display = 'none';
    //             });
    //             document.querySelectorAll('.future').forEach(element => {
    //                 (element as HTMLElement).style.display = 'block';
    //             });

    //             this.getmyFutureEvents();
    //         } else {
    //             this.setState({ IsCurrentFuture: "" });

    //             document.querySelectorAll('.present').forEach(element => {
    //                 (element as HTMLElement).style.display = 'block';
    //             });
    //             document.querySelectorAll('#current-event').forEach(element => {
    //                 (element as HTMLElement).style.display = 'block';
    //             });
    //             document.querySelectorAll('.future').forEach(element => {
    //                 (element as HTMLElement).style.display = 'none';
    //             });

    //             const textContent = document.getElementById('dt-current');
    //             if (textContent) {
    //                 textContent.textContent = ' My Meetings';
    //             }

    //             setTimeout(() => {
    //                 const textFields = document.querySelectorAll<HTMLInputElement>(".ms-TextField-field");
    //                 const formattedDate = moment().format("D/M/YYYY");
    //                 textFields.forEach(field => {
    //                     field.value = formattedDate;
    //                 });
    //             }, 1500);
    //         }
    //     } catch (error) {
    //         console.error("Error in getmytodaysroutines:", error);
    //     }
    // }

    // Optimize this code

    public async getmytodaysroutines() {
        try {
            const uniqueCountItem: string[] = [];
            const result = await this.serviceProvider.getMyTodaysRoutine();
            if (result.length != 0) {
                this.setState({
                    myroutineDatas: result,
                    isTodayRoutinesAvailable: true
                });

            }

            // Get current time in the same format as the start time
            const currentDate = moment().format('DD-MM-YYYY');

            result.forEach(item => {
                const startTime = moment.utc(item.start.dateTime).local().format('DD-MM-YYYY');
                if (currentDate === startTime) {
                    uniqueCountItem.push(item.subject);
                }
            });

            // Update UI based on whether there are any items for today
            const displayStatus = uniqueCountItem.length === 0 ? 'none' : 'block';
            const futureStatus = uniqueCountItem.length === 0 ? 'block' : 'none';

            // Toggle display styles using utility function
            this.toggleDisplay('.present', displayStatus);
            this.toggleDisplay('#current-event', displayStatus);
            this.toggleDisplay('.future', futureStatus);

            if (uniqueCountItem.length === 0) {
                this.getmyFutureEvents();
            } else {
                this.setState({ IsCurrentFuture: "" });
                this.updateCurrentEventText(' My Meetings');
                this.updateTextFieldWithCurrentDate();
            }
        } catch (error) {
            console.error("Error in getmytodaysroutines:", error);
        }
    }

    // Utility function to toggle display styles
    private toggleDisplay(selector: string, display: string) {
        document.querySelectorAll<HTMLElement>(selector).forEach(element => {
            element.style.display = display;
        });
    }

    // Update the current event text
    private updateCurrentEventText(text: string) {
        const textContent = document.getElementById('dt-current');
        if (textContent) {
            textContent.textContent = text;
        }
    }

    // Update text fields with the current date
    private updateTextFieldWithCurrentDate() {
        setTimeout(() => {
            const formattedDate = moment().format("D/M/YYYY");
            const textFields = document.querySelectorAll<HTMLInputElement>(".ms-TextField-field");
            textFields.forEach(field => {
                field.value = formattedDate;
            });
        }, 1500);
    }



    // public getmytodaysPastroutines() {
    //     this.serviceProvider.
    //         getMyTodaysRoutinePast()
    //         .then(
    //             (result: any[]): void => {
    //                 this.setState({ mypastroutineDatas: result });
    //                 var myMeetingscount = this.state.mypastroutineDatas.length;
    //                 for (var i = 0; i < myMeetingscount; i++) {
    //                     var PastMeetingTime = this.state.mypastroutineDatas[i].end.dateTime;
    //                     let ShortEndTime = moment.utc(PastMeetingTime).local().format("HHMM");
    //                     var now = moment().format("HHMM");
    //                     if (ShortEndTime < now) {
    //                         // $("#past-event").show();

    //                         document.querySelectorAll('#past-event').forEach(element => {
    //                             (element as HTMLElement).style.display = 'block';
    //                         });
    //                     }
    //                 }
    //             }
    //         );
    // }

    // Updated code 

    // public async getmytodaysPastroutines() {
    //     try {
    //         const result = await this.serviceProvider.getMyTodaysRoutinePast();
    //         this.setState({ mypastroutineDatas: result });

    //         const myMeetingsCount = this.state.mypastroutineDatas.length;
    //         const now = moment().format("HHMM");

    //         for (let i = 0; i < myMeetingsCount; i++) {
    //             const PastMeetingTime = this.state.mypastroutineDatas[i].end.dateTime;
    //             const ShortEndTime = moment.utc(PastMeetingTime).local().format("HHMM");

    //             if (ShortEndTime < now) {
    //                 document.querySelectorAll('#past-event').forEach(element => {
    //                     (element as HTMLElement).style.display = 'block';
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error in getmytodaysPastroutines:", error);
    //     }
    // }


    // Optimized code 

    public async getmytodaysPastroutines() {
        try {
            const result = await this.serviceProvider.getMyTodaysRoutinePast();
            this.setState({ mypastroutineDatas: result });

            const now = moment().format("HHMM");
            const pastEventsVisible = result.some(meeting => {
                const pastMeetingTime = meeting.end.dateTime;
                const shortEndTime = moment.utc(pastMeetingTime).local().format("HHMM");
                return shortEndTime < now;
            });

            // Toggle display based on whether any past meeting times are before the current time
            document.querySelectorAll<HTMLElement>('#past-event').forEach(element => {
                element.style.display = pastEventsVisible ? 'block' : 'none';
            });

        } catch (error) {
            console.error("Error in getmytodaysPastroutines:", error);
        }
    }

    // public getmytodaysFutureroutines(date: moment.MomentInput) {
    //     uniqueCountItemFuture = [];
    //     this.serviceProvider.
    //         getMyTodaysRoutineFuture(date)
    //         .then(
    //             (result: any[]): void => {
    //                 this.setState({ myfutureroutineDatas: result });
    //                 this.setState({ IsCurrentFuture: "true" });


    //                 for (var i = 0; i < result.length; i++) {
    //                     var Starttime = moment.utc(result[i].start.dateTime);
    //                     var subject = result[i].subject;

    //                     if (moment(date).format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY')) {
    //                         uniqueCountItemFuture.push(subject);
    //                     }
    //                 }


    //                 if (uniqueCountItemFuture.length == 0) {
    //                     // $(".future").hide();
    //                     // $(".present").hide();
    //                     // $(".no-upcoming-events").show();
    //                     // $("#dt-upcoming").text("Plan your Schedule");

    //                     document.querySelectorAll('.present').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.no-upcoming-events').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });

    //                     let textContent: any = document.getElementById('dt-upcoming');
    //                     textContent.textContent = 'Plan your Schedule';
    //                 } else {
    //                     // $(".present").hide();
    //                     // $(".no-upcoming-events").hide();
    //                     // $(".future").show();

    //                     document.querySelectorAll('.present').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.no-upcoming-events').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                 }


    //                 let dt = moment(date, "D/M/YYYY").format("YYYY-M-D");

    //                 let now = moment();
    //                 let then = moment(dt);

    //                 if (now > then) {
    //                     // $("#dt-upcoming").text("Past Events");

    //                     let textContent: any = document.getElementById('dt-upcoming');
    //                     textContent.textContent = 'Past Events';
    //                 } else if (now < then) {
    //                     // $("#dt-upcoming").text("Upcoming Events");
    //                     let textContent: any = document.getElementById('dt-upcoming');
    //                     textContent.textContent = 'Upcoming Events';
    //                     // Past Events
    //                     // $(".fut-dt").hide();
    //                     document.querySelectorAll('.fut-dt').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                 }

    //             }
    //         );
    //     // var dywidth = $(".dynamic-innerwidth-calc").width() - 6;
    //     // var $element = $(".dynamic-innerwidth-calc");
    //     // var dywidth = $element ? $element.width()! - 6 : 0;
    //     // $(".ul-group").css("width", "" + dywidth + "");

    //     var element = document.querySelector('.dynamic-innerwidth-calc');
    //     var dywidth = element ? element.clientWidth - 6 : 0; // Use clientWidth for width calculation
    //     let groupElement: any = document.querySelector('.ul-group')
    //     groupElement.style.width = dywidth + 'px'; // Set width with 'px' unit

    // }

    // Updated code

    public async getmytodaysFutureroutines(date: moment.MomentInput) {
        try {
            uniqueCountItemFuture = [];

            const result = await this.serviceProvider.getMyTodaysRoutineFuture(date);
            this.setState({ myfutureroutineDatas: result, IsCurrentFuture: "true" });

            // Filter and collect future events
            result.forEach((item) => {
                const startTime = moment.utc(item.start.dateTime);
                if (moment(date).format('DD-MM-YYYY') === moment(startTime).local().format('DD-MM-YYYY')) {
                    uniqueCountItemFuture.push(item.subject);
                }
            });

            // Update UI based on the availability of future events
            if (uniqueCountItemFuture.length === 0) {
                document.querySelectorAll('.present').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.no-upcoming-events').forEach(element => {
                    (element as HTMLElement).style.display = 'block';
                });
                document.querySelectorAll('.future').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });

                const textContent = document.getElementById('dt-upcoming');
                if (textContent) textContent.textContent = 'Plan your Schedule';
            } else {
                document.querySelectorAll('.present').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.no-upcoming-events').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.future').forEach(element => {
                    (element as HTMLElement).style.display = 'block';
                });
            }

            // Determine if the date is past, present, or future
            const formattedDate = moment(date, "D/M/YYYY").format("YYYY-M-D");
            const now = moment();
            const then = moment(formattedDate);

            const textContent = document.getElementById('dt-upcoming');
            if (now > then) {
                if (textContent) textContent.textContent = 'Past Events';
            } else if (now < then) {
                if (textContent) textContent.textContent = 'Upcoming Events';
                document.querySelectorAll('.fut-dt').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
            }

            // Adjust the width of the element dynamically
            const element = document.querySelector('.dynamic-innerwidth-calc');
            const dywidth = element ? element.clientWidth - 6 : 0;
            const groupElement = document.querySelector('.ul-group');
            if (groupElement) {
                (groupElement as HTMLElement).style.width = `${dywidth}px`;
            }

        } catch (error) {
            console.error("Error in getmytodaysFutureroutines:", error);
        }
    }



    // public getmyFutureEvents() {
    //     this.serviceProvider.
    //         getMyFutureMeetings()
    //         .then(
    //             (result: any[]): void => {
    //                 this.setState({ myfutureroutineDatas: result });
    //                 var myFutureMeetingscount = this.state.myfutureroutineDatas.length;

    //                 if (myFutureMeetingscount == 0) {
    //                     // $(".future").hide();
    //                     // $(".no-upcoming-events").show();
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.no-upcoming-events').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                 } else {
    //                     // $(".present").hide();
    //                     // $(".no-upcoming-events").hide();
    //                     // $(".future").show();

    //                     document.querySelectorAll('.present').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.no-upcoming-events').forEach(element => {
    //                         (element as HTMLElement).style.display = 'none';
    //                     });
    //                     document.querySelectorAll('.future').forEach(element => {
    //                         (element as HTMLElement).style.display = 'block';
    //                     });
    //                     setTimeout(function () {
    //                         // $(".fut-dt").show();
    //                         document.querySelectorAll('.fut-dt').forEach(element => {
    //                             (element as HTMLElement).style.display = 'block';
    //                         });
    //                     }, 200);
    //                 }
    //             }
    //         );
    // }

    // Updated code 

    public async getmyFutureEvents() {
        try {
            const result: any[] = await this.serviceProvider.getMyFutureMeetings();
            this.setState({ myfutureroutineDatas: result });

            const myFutureMeetingsCount = this.state.myfutureroutineDatas.length;

            if (myFutureMeetingsCount === 0) {
                // Hide future events and show "no upcoming events" message
                document.querySelectorAll('.future').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.no-upcoming-events').forEach(element => {
                    (element as HTMLElement).style.display = 'block';
                });
            } else {
                // Hide present events and "no upcoming events" message, and show future events
                document.querySelectorAll('.present').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.no-upcoming-events').forEach(element => {
                    (element as HTMLElement).style.display = 'none';
                });
                document.querySelectorAll('.future').forEach(element => {
                    (element as HTMLElement).style.display = 'block';
                });

                setTimeout(() => {
                    // Show future event details
                    document.querySelectorAll('.fut-dt').forEach(element => {
                        (element as HTMLElement).style.display = 'block';
                    });
                }, 200);
            }
        } catch (error) {
            console.error("Error fetching future events:", error);
        }
    }

    public openoutlookcal = () => {
        window.open(
            'https://outlook.office.com/calendar/view/month',
            '_blank'
        );
    }

    public openteamsmeeting = (url: string) => {
        window.open(
            '' + url + '',
            '_blank'
        );
    }

    public handler = (URL: string) => {
        window.open(
            '' + URL + '',
            '_blank'
        );
    }


    private _onSelectDate = (date: Date | null | undefined): void => {
        this.setState({ SelectedDate: date });
        this.getmytodaysFutureroutines(date);

        if (date) {
            const selecteddt = moment(date).format("DDMMYYYY");
            const tdaydt = moment().format("DDMMYYYY");

            if (selecteddt === tdaydt) {
                // $("#dt-current").text(" My Meetings");
                let addText: any = document.getElementById('dt-current')
                addText.textContent = ' My Meetings';

                // $("#dt-upcoming").empty();
                let emptyText: any = document.getElementById('dt-upcoming')
                emptyText.innerHTML = '';

                setTimeout(function () {
                    // $("#dt-upcoming").text(" My Meetings");

                    let addText: any = document.getElementById('dt-upcoming')
                    addText.textContent = ' My Meetings';

                }, 800);
            }
        }
    }


    private _onFormatDate = (date: Date): string => {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    public render(): React.ReactElement<IRemoHomePageProps> {

        // var Focusthis = $('#current-event');
        // let Focusthis: any = document.getElementById("current-event")
        // if (Focusthis.length) {
        //     // var TopValue = Focusthis.offset().top;
        //     if (Focusthis) {
        //         // var TopValue = Focusthis.offset()?.top || 0;
        //         // $('.routine-timeline-scroll').animate({
        //         //     scrollTop: TopValue
        //         // }, 'slow');


        //         // Converted code 
        //         // Assuming Focusthis is a DOM element
        //         var TopValue = Focusthis.getBoundingClientRect().top + window.scrollY || 0;
        //         // Animate scrolling to the specified position
        //         let scrollElement: any = document.querySelector('.routine-timeline-scroll')
        //         scrollElement.scrollTo({
        //             top: TopValue,
        //             behavior: 'smooth'
        //         });

        //     }


        // }


        const Focusthis = document.getElementById("current-event");

        if (Focusthis) {
            // Get the top position of the element relative to the viewport and add the scroll position
            const TopValue = Focusthis.getBoundingClientRect().top + window.scrollY;

            // Select the scroll container element
            const scrollElement = document.querySelector('.routine-timeline-scroll') as HTMLElement;
            if (scrollElement) {
                // Scroll to the specified position smoothly
                scrollElement.scrollTo({
                    top: TopValue,
                    behavior: 'smooth'
                });
            }
        }
        var reacthandler = this;

        const AllMyEvents: JSX.Element[] = this.state.myroutineDatas.map(function (item, key) {
            const Starttime = moment.utc(item.start.dateTime);
            const Endtime = moment.utc(item.end.dateTime);
            const localStart = moment(Starttime).local().format("h:mma");
            const localEnd = moment(Endtime).local().format("h:mma");
            const isTeamsMeeting = item.isOnlineMeeting;
            const bodypreview = item.bodyPreview;
            const ETime = moment(Endtime).local().format('DD-MM-YYYY h:mma');
            const EnTime = moment(Endtime).local().format('YYYY-MM-DD h:mma');
            const CuTime = moment().format('YYYY-MM-DD h:mma');
            const CTime = moment().format('DD-MM-YYYY h:mma');
            const isSameDayAsCuTime = moment(CTime, 'DD-MM-YYYY h:mma').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY');
            const isAfterCuTime = moment(EnTime, 'YYYY-MM-DD h:mma').isAfter(moment(CuTime, 'YYYY-MM-DD h:mma'));
            const isBeforeEndtime = moment().format("DD-MM-YYYY") <= moment.utc(Endtime).local().format("DD-MM-YYYY");

            if (!item.isAllDay) {
                if (isSameDayAsCuTime && isAfterCuTime) {
                    if (isTeamsMeeting) {
                        return (
                            <li className="clearfix relative" id={ETime}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <span id="teamsmeetingjoinlink-yes">
                                    <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip" + key} data-custom-class="tooltip-custom" data-interception="off">
                                        <img src={`${reacthandler.props.siteurl}/SiteAssets/img/microsoft-teams-logo.svg`}></img>
                                    </a>
                                    <ReactTooltip id={"React-tooltip" + key} place="right" type="dark" effect="solid">
                                        <span>Click to Join</span>
                                    </ReactTooltip>
                                </span>
                                <div className="new-tooltip-event">
                                    <div className="wrapper-of-tooltip clearfix clearfix">
                                        <h4>{item.subject}</h4>
                                        <p> {bodypreview} </p>
                                    </div>
                                </div>
                            </li>
                        );
                    } else {
                        return (
                            <li className="clearfix relative" id={ETime}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4>
                                <div className="new-tooltip-event">
                                    <div className="wrapper-of-tooltip clearfix">
                                        <h4>{item.subject}</h4>
                                        <p> {bodypreview} </p>
                                    </div>
                                </div>
                            </li>
                        );
                    }
                }
            } else {
                if (isSameDayAsCuTime && isAfterCuTime || isBeforeEndtime) {
                    if (isTeamsMeeting) {
                        return (
                            <li className="clearfix relative" id={ETime}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <span id="teamsmeetingjoinlink-yes">
                                    <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip" + key} data-custom-class="tooltip-custom" data-interception="off">
                                        <img src={`${reacthandler.props.siteurl}/SiteAssets/img/microsoft-teams-logo.svg`}></img>
                                    </a>
                                    <ReactTooltip id={"React-tooltip" + key} place="right" type="dark" effect="solid">
                                        <span>Click to Join</span>
                                    </ReactTooltip>
                                </span>
                                <div className="new-tooltip-event">
                                    <div className="wrapper-of-tooltip clearfix clearfix">
                                        <h4>{item.subject}</h4>
                                        <p> {bodypreview} </p>
                                    </div>
                                </div>
                            </li>
                        );
                    } else {
                        return (
                            <li className="clearfix relative" id={ETime}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4>
                                <div className="new-tooltip-event">
                                    <div className="wrapper-of-tooltip clearfix">
                                        <h4>{item.subject}</h4>
                                        <p> {bodypreview} </p>
                                    </div>
                                </div>
                            </li>
                        );
                    }
                }
            }
        })
            .filter((element): element is JSX.Element => element !== null);  // Filter out `null`



        const AllMyPastEvents: JSX.Element[] = this.state.mypastroutineDatas.map(function (item, key) {
            const Starttime = moment.utc(item.start.dateTime);
            const Endtime = moment.utc(item.end.dateTime);
            const localStart = Starttime.local().format("h:mma");
            const localEnd = Endtime.local().format("h:mma");
            const isTeamsMeeting = item.isOnlineMeeting;
            const bodypreview = item.bodyPreview;
            const ETime = Endtime.local().format("YYYY-MM-DD h:mma");
            const CTime = moment().format("YYYY-MM-DD h:mma");

            if (!item.isAllDay) {
                if (isTeamsMeeting && moment(CTime, 'YYYY-MM-DD h:mma').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime, 'YYYY-MM-DD h:mma').isBefore(moment(CTime, 'YYYY-MM-DD h:mma'))) {
                    return (
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip" + key} data-custom-class="tooltip-custom" data-interception="off" >
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/img/microsoft-teams-logo.svg`} alt="Teams" />
                                </a>
                                <ReactTooltip id={"React-tooltip" + key} place="right" type="dark" effect="solid">
                                    <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip clearfix">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                } else if (!isTeamsMeeting && moment(CTime, 'YYYY-MM-DD h:mma').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime, 'YYYY-MM-DD h:mma').isBefore(moment(CTime, 'YYYY-MM-DD h:mma'))) {
                    return (
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <h4>{item.subject}</h4>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip clearfix">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }
            } else {
                if (isTeamsMeeting && moment(CTime, 'YYYY-MM-DD h:mma').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime, 'YYYY-MM-DD h:mma').isBefore(moment(CTime, 'YYYY-MM-DD h:mma'))) {
                    return (
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip" + key} data-custom-class="tooltip-custom" data-interception="off">
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/img/microsoft-teams-logo.svg`} alt="Teams" />
                                </a>
                                <ReactTooltip id={"React-tooltip" + key} place="right" type="dark" effect="solid">
                                    <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip clearfix">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                } else if (!isTeamsMeeting && moment(CTime, 'YYYY-MM-DD h:mma').format('DD-MM-YYYY') === moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime, 'YYYY-MM-DD h:mma').isBefore(moment(CTime, 'YYYY-MM-DD h:mma'))) {
                    return (
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                            <h4>{item.subject}</h4>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip clearfix">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }
            }
        })
            .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


        const AllMyEventsFuture: JSX.Element[] = this.state.myfutureroutineDatas.map(function (item, key) {
            const Starttime = moment(item.start.dateTime);
            const Endtime = moment(item.end.dateTime);
            const localStartDate = Starttime.local().format("DD-MM-YYYY,");
            const localStart = Starttime.local().format("hh:mma");
            const localEnd = Endtime.local().format("hh:mma");
            const isTeamsMeeting = item.isOnlineMeeting;
            const bodypreview = item.bodyPreview;

            const selectedDate = reacthandler.state.SelectedDate !== "" ? moment(reacthandler.state.SelectedDate).format("YYYY-MM-DD") : "";

            if ((reacthandler.state.IsCurrentFuture === "" && isTeamsMeeting) || (selectedDate !== "" && (selectedDate === Starttime.local().format("YYYY-MM-DD") || selectedDate <= Endtime.local().format("YYYY-MM-DD")))) {
                return (
                    <li className="clearfix relative" id={Starttime.local().format("DD-MM-YYYY")}>
                        <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> <span className="fut-dt" style={{ display: "none" }}>{localStartDate} </span>{localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                        <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                        <span id="teamsmeetingjoinlink-yes">
                            <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip" + key} data-custom-class="tooltip-custom" data-interception="off">
                                <img src={`${reacthandler.props.siteurl}/SiteAssets/img/microsoft-teams-logo.svg`} alt="Teams" />
                            </a>
                            <ReactTooltip id={"React-tooltip" + key} place="right" type="dark" effect="solid">
                                <span>Click to Join</span>
                            </ReactTooltip>
                        </span>
                        <div className="new-tooltip-event">
                            <div className="wrapper-of-tooltip clearfix">
                                <h4>{item.subject}</h4>
                                <p> {bodypreview} </p>
                            </div>
                        </div>
                    </li>
                );
            } else if ((reacthandler.state.IsCurrentFuture === "" && !isTeamsMeeting) || (selectedDate !== "" && (selectedDate === Starttime.local().format("YYYY-MM-DD") || selectedDate <= Endtime.local().format("YYYY-MM-DD")))) {
                return (
                    <li className="clearfix relative" id={Starttime.local().format("DD-MM-YYYY")}>
                        <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time" /> <span className="fut-dt" style={{ display: "none" }}>{localStartDate} </span> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/img/line.svg`} alt="line" />
                        <h4>{item.subject}</h4>
                        <div className="new-tooltip-event">
                            <div className="wrapper-of-tooltip clearfix">
                                <h4>{item.subject}</h4>
                                <p> {bodypreview} </p>
                            </div>
                        </div>
                    </li>
                );
            }
        })
            .filter((element): element is JSX.Element => element !== null);  // Filter out `null`




        return (

            <div className={[styles.remoHomePage, "m-b-20 m-b-50 m-b-routine clearfix"].join(' ')}>
                <div className="routine-wrap">
                    <div className="sec dynamic-innerwidth-calc shadoww">
                        <div className="Ssec-wrapper">
                            {/*For Present*/}
                            <div className="today-routine-blockk present" >
                                <div className="routine-Heading clearfix" id="current-date">
                                    <span id="dt-current"> My Meetings </span>
                                    <DatePicker placeholder="Select a date..."
                                        onSelectDate={this._onSelectDate}
                                        value={this.state.SelectedDate}
                                        formatDate={this._onFormatDate}
                                        isMonthPickerVisible={false}
                                    />

                                </div>

                                <div className="routine-time-wrap scroller">
                                    <div className="routine-timeline routine-timeline-scroll" id="top-parent-event" style={{ 'position': 'relative', 'marginLeft': '' + this.state.MarginValue + '' }}>
                                        <ul id="past-event" style={{ display: "none" }}>
                                            {AllMyPastEvents}
                                        </ul>
                                        <ul id="current-event">
                                            {AllMyEvents}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/*For Future*/}
                            <div className="today-routine-blockk future" style={{ display: "none" }}>
                                <div className="routine-Heading clearfix" id="current-date-future">
                                    <span id="dt-upcoming"> Upcoming Events </span>
                                    <DatePicker placeholder="Select a date..."
                                        onSelectDate={this._onSelectDate}
                                        value={this.state.SelectedDate}
                                        formatDate={this._onFormatDate}
                                        isMonthPickerVisible={false}
                                    />
                                </div>

                                <div className="routine-time-wrap scroller">
                                    <div className="routine-timeline routine-timeline-noscroll" style={{ 'position': 'relative', 'marginLeft': '' + this.state.MarginValue + '' }}>
                                        <ul id="current-event-future">
                                            {AllMyEventsFuture}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/*For No Events*/}
                            <div className="today-routine-blockk no-upcoming-events" style={{ display: "none" }}>
                                <div className="routine-Heading clearfix">
                                    <span id="dt-upcoming-no-events"> Schedule your Event </span>
                                    <DatePicker placeholder="Select a date..."
                                        onSelectDate={this._onSelectDate}
                                        value={this.state.SelectedDate}
                                        formatDate={this._onFormatDate}
                                        isMonthPickerVisible={false}
                                    //showMonthPickerAsOverlay={true}
                                    />

                                </div>

                                <div className="routine-time-wrap scroller">
                                    <div className="routine-timeline" style={{ 'position': 'relative', 'marginLeft': '' + this.state.MarginValue + '' }}>
                                        <div className="Schedule-ur-event">
                                            <a href="#" onClick={() => this.openoutlookcal()}><i className="fa fa-calendar" aria-hidden="true" data-interception="off"></i>Schedule Now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

