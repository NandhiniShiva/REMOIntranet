import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import * as $ from 'jquery';
import Slider from 'react-slick';
import { sp } from '@pnp/sp'
import * as moment from 'moment';
import { listNames } from '../Configuration';
import { ChoiceFieldFormatType, FieldUserSelectionMode, UrlFieldFormatType } from 'sp-pnp-js';
import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';
// import { ListCreation } from './ServiceProvider/ListCreation';
// import { Web } from '@pnp/sp/webs';

let Birthdaylist = listNames.Birthday;

// let spWeb: any;


export interface IBirthdayState {
  Items: any[];
  TodayBirthday: any[];
  UpcomingBirthday: any[];
  FirstBdayDate: any;
  LastBdayDate: any;
  Dates: any;
  TotalBirthday: number;
}

export default class RemoBirthday extends React.Component<IRemoHomePageProps, IBirthdayState, {}> {

  public constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      TodayBirthday: [],
      UpcomingBirthday: [],
      FirstBdayDate: "",
      LastBdayDate: "",
      Dates: [],
      TotalBirthday: 0
    };
    // spWeb = Web(this.props.siteurl);


  }

  public async componentDidMount() {
    // await this.createSharePointLists(this.props.name);
    const listCreation = new ListCreation();
    listCreation.createSharePointLists(this.props.name);
    this.GetBirthday();


  }

  // public async GetBirthday() {
  //   var reactHandler = this;

  //   await sp.web.lists.getByTitle(Birthdaylist).items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created").
  //     orderBy("DOB", true).filter(`IsActive eq '1'`).get().then((items) => {

  //       if (items.length != 0) {
  //         // $("#today-bday").show();
  //         document.querySelectorAll('#today-bday').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         });

  //         reactHandler.setState({
  //           TodayBirthday: items,
  //         });

  //         for (var i = 0; i < items.length; i++) {

  //           var tdaydate = moment().format('MM/DD');
  //           var bdaydates = moment(items[i].DOB).format('MM/DD')

  //           if (tdaydate == bdaydates) {
  //             this.setState({ TotalBirthday: items.length })
  //           }
  //         }
  //       } else {
  //         // $("#today-bday").hide();
  //         // $("#upcoming-bday").show();

  //         document.querySelectorAll('#today-bday').forEach(element => {
  //           (element as HTMLElement).style.display = 'none';
  //         }); document.querySelectorAll('#upcoming-bday').forEach(element => {
  //           (element as HTMLElement).style.display = 'block';
  //         });
  //       }

  //     });
  //   reactHandler.GetUpcomingBirthday();
  // }

  public async createSharePointLists(componentListName: string) {
    try {
      console.log("List creation process started...");

      // Find the list details based on the provided name
      const listDetails = ListLibraryColumnDetails.find(
        (list) => list.name.toLowerCase() === componentListName.toLowerCase()
      );

      if (!listDetails) {
        console.error(`List details for '${componentListName}' not found.`);
        return;
      }

      // Ensure the list exists; create it if it doesn't
      const listEnsureResult = await sp.web.lists.ensure(componentListName);

      if (listEnsureResult.created) {
        console.log(`List '${componentListName}' created successfully.`);
        // alert(`List '${componentListName}' created successfully.`);
      } else {
        console.log(`List '${componentListName}' already exists.`);
        // alert(`List '${componentListName}' already exists.`);
      }

      // Create columns for the list
      console.log(`Adding columns to '${componentListName}'...`);
      await this.createSharePointColumns(componentListName, listDetails.columns);
      console.log(`Columns for '${componentListName}' created successfully.`);
    } catch (error) {
      console.error("Error creating lists or columns:", error);
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
  // Updated code 

  public async GetBirthday() {
    try {
      const items = await sp.web.lists
        .getByTitle(Birthdaylist)
        .items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created")
        .orderBy("DOB", true)
        .filter(`IsActive eq '1'`)
        .get();

      if (items.length !== 0) {
        document.querySelectorAll('#today-bday').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });

        this.setState({ TodayBirthday: items });

        const todayDate = moment().format('MM/DD');
        const birthdaysToday = items.filter(item => moment(item.DOB).format('MM/DD') === todayDate);

        if (birthdaysToday.length > 0) {
          this.setState({ TotalBirthday: birthdaysToday.length });
        }
      } else {
        document.querySelectorAll('#today-bday').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#upcoming-bday').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }

      this.GetUpcomingBirthday();
    } catch (error) {
      console.error("Error fetching birthday data: ", error);
    }
  }

  // public async GetUpcomingBirthday() {
  //   var reactHandler = this;
  //   var FutureDate1 = moment().add(1, "days").format('MM/DD');
  //   var FutureDate2 = moment().add(2, "days").format('MM/DD');
  //   var FutureDate3 = moment().add(3, "days").format('MM/DD');

  //   reactHandler.setState({
  //     FirstBdayDate: moment(FutureDate1, 'MM/DD'),
  //     LastBdayDate: moment(FutureDate3, 'MM/DD'),
  //   });
  //   await sp.web.lists.getByTitle(Birthdaylist).items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created",).top(1000).
  //     orderBy("DOB", true).filter(`IsActive eq '1'`).get().then((items) => {

  //       reactHandler.setState({
  //         UpcomingBirthday: items,
  //       });
  //       for (var i = 0; i < items.length; i++) {
  //         var bdaydates = moment(items[i].DOB).format('MM/DD');

  //         if (FutureDate1 == bdaydates || FutureDate2 == bdaydates || FutureDate3 == bdaydates) {
  //           reactHandler.setState({
  //             TotalBirthday: reactHandler.state.TotalBirthday + items.length
  //           });
  //         }
  //       }
  //       reactHandler.checkBirthdayAvailability();
  //     });
  // }

  // Updated code 

  public async GetUpcomingBirthday() {
    try {
      const reactHandler = this;
      const FutureDate1 = moment().add(1, "days").format('MM/DD');
      const FutureDate2 = moment().add(2, "days").format('MM/DD');
      const FutureDate3 = moment().add(3, "days").format('MM/DD');

      reactHandler.setState({
        FirstBdayDate: moment(FutureDate1, 'MM/DD'),
        LastBdayDate: moment(FutureDate3, 'MM/DD'),
      });

      const items = await sp.web.lists
        .getByTitle(Birthdaylist)
        .items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created")
        .top(1000)
        .orderBy("DOB", true)
        .filter(`IsActive eq '1'`)
        .get();

      reactHandler.setState({
        UpcomingBirthday: items,
      });

      for (var i = 0; i < items.length; i++) {
        var bdaydates = moment(items[i].DOB).format('MM/DD');

        if (FutureDate1 == bdaydates || FutureDate2 == bdaydates || FutureDate3 == bdaydates) {
          reactHandler.setState({
            TotalBirthday: reactHandler.state.TotalBirthday + items.length
          });
        }
      }
      reactHandler.checkBirthdayAvailability();
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  }

  public checkBirthdayAvailability() {

    if (this.state.TotalBirthday == 0) {

      // $("#if-birthdays-present").hide();
      // $("#if-no-birthdays-present").show();

      document.querySelectorAll('#if-birthdays-present').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      }); document.querySelectorAll('#if-no-birthdays-present').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
    } else {

      // $("#if-birthdays-present").show();
      // $("#if-no-birthdays-present").hide();
      document.querySelectorAll('#if-birthdays-present').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      }); document.querySelectorAll('#if-no-birthdays-present').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
    }
  }

  // New code autolistcreation

  // public CreateList = async () => {
  //   //  spWeb = Web(this.props.siteurl);
  //   let listEnsureResult = await spWeb.lists.ensure(this.props.name);
  //   // debugger;
  //   if (listEnsureResult.created === true) {

  //     await this.createColumn();


  //     await this.addData();

  //   } else {

  //   }

  // }

  // public async createColumn() {

  //   await spWeb.lists.getByTitle(this.props.name).fields.addBoolean("IsActive", { Group: "My Group" });
  //   await spWeb.lists.getByTitle(this.props.name).fields.addImageField("Image", { Group: "My Group" });

  // }

  // private async addData() {
  //   sp.web.lists.getByTitle(this.props.name).items.add({
  //     Title: "Sajjad",
  //     IsActive: true,
  //     Image: "",

  //   }).catch((error: any) => {
  //     console.log("Error: ", error);
  //   });

  // }


  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 1500,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      //  fade: true,
    };
    const TodayBirthday: JSX.Element[] = this.state.TodayBirthday.map((item, key) => {
      const Tday1Bday = moment().format("MM-DD");
      const RawImageTxt = item.Picture;
      const Bdaydate = moment(item.DOB).format("MM-DD");
      const ItemId = item.ID;

      if (Tday1Bday === Bdaydate) {
        const Name = item.Name;
        const imgSrc = (RawImageTxt && RawImageTxt !== "") ?
          ((JSON.parse(RawImageTxt).serverRelativeUrl === undefined) ?
            `${reactHandler.props.siteurl}/Lists/${Birthdaylist}/Attachments/${item.ID}/${JSON.parse(RawImageTxt).fileName}` :
            JSON.parse(RawImageTxt).serverRelativeUrl) :
          `${reactHandler.props.siteurl}/SiteAssets/img/userphoto.jpg`;

        return (
          <div key={key}>
            <div className="heading clearfix" id="spotlight-title">
              <span id="highlights-type"> Birthday </span>
            </div>
            <div className="section-part clearfix">
              <div className="birthday-image relative">
                <img src={imgSrc} alt="image" />
                <div className="birday-icons">
                  <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                </div>
              </div>
              <div className="birthday-details">
                <a href={`${reactHandler.props.siteurl}/SitePages/birthday.aspx?ItemID=${ItemId}`} data-interception="off">
                  <h4 data-tip data-for={`React-tooltip-title-today-${key}`} data-custom-class="tooltip-custom">{Name}</h4>
                </a>
                <p data-tip data-for={`React-tooltip-Desig-today-${key}`} data-custom-class="tooltip-custom">{item.Designation}</p>
              </div>
            </div>
          </div>
        );
      }

      return null;
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    const UpcomingBirthday: JSX.Element[] = this.state.UpcomingBirthday.map((item, key) => {
      const ItemId = item.Id;
      let Name = "";
      const Tday1Bday = moment().format("MM/DD");
      const RawImageTxt = item.Picture;
      const Bdaydate = moment(item.DOB).format("MM/DD");

      if (item.Name && Bdaydate > Tday1Bday && moment(Bdaydate, 'MM/DD').isBetween(moment(reactHandler.state.FirstBdayDate, 'MM/DD'), moment(reactHandler.state.LastBdayDate, 'MM/DD'), undefined, '[]')) {
        Name = item.Name;

        const imgSrc = RawImageTxt && RawImageTxt !== "" ?
          JSON.parse(RawImageTxt).serverRelativeUrl ?? `${reactHandler.props.siteurl}/Lists/${Birthdaylist}/Attachments/${item.ID}/${JSON.parse(RawImageTxt).fileName}` :
          `${reactHandler.props.siteurl}/SiteAssets/img/userphoto.jpg`;

        return (
          <div key={key}>
            <div className="heading" id="spotlight-title">
              <span id="highlights-type" className="clearfix" style={{ cursor: "default" }}> Upcoming Birthday </span>
            </div>
            <div className="section-part clearfix">
              <div className="birthday-image relative">
                <img src={imgSrc} alt="image" />
                <div className="birday-icons">
                  <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                </div>
              </div>
              <div className="birthday-details">
                <a href={`${reactHandler.props.siteurl}/SitePages/birthday.aspx?ItemID=${ItemId}`} data-interception="off">
                  <h4 data-tip data-for={`React-tooltip-title-today-${key}`} data-custom-class="tooltip-custom">{Name}</h4>
                </a>
                <p data-tip data-for={`React-tooltip-Desig-today-${key}`} data-custom-class="tooltip-custom">{item.Designation}</p>
              </div>
            </div>
          </div>
        );
      }

      return null;
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`



    return (
      <div className={styles.remoHomePage} id="bday-highlights">
        <div className="birthday-wrap m-b-20" id="if-birthdays-present">
          <div id="today-bday" style={{ display: "none" }}>
            <div className="sec">
              <Slider {...settings} className='hero-banner-container-wrap' >
                {TodayBirthday}
                {UpcomingBirthday}
              </Slider>
            </div>
          </div>
          <div id="upcoming-bday" style={{ display: "none" }}>
            <div className="sec">
              <Slider {...settings} className='hero-banner-container-wrap' >
                {UpcomingBirthday}
              </Slider>
            </div>
          </div>
        </div>
        <div className="birthday-wrap m-b-20" id="if-no-birthdays-present" style={{ display: "none" }} >
          <div className="sec">
            <div className="heading clearfix ">
              <h4 >
                Birthday
              </h4>
            </div>
            <p className="text-center" > No Birthday's at this moment.  </p>
          </div>
        </div>
      </div>
    )
  }
}