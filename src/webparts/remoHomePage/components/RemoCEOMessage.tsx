import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { ChoiceFieldFormatType, FieldUserSelectionMode, sp, UrlFieldFormatType } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import { listNames } from '../Configuration';
import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';

let CEO_Messagelist = listNames.CEO_Message;

export interface ICeoMessageState {
  Items: any[];
  isDataAvailable: boolean;
}
export default class RemoCEOMessage extends React.Component<IRemoHomePageProps, ICeoMessageState, {}> {
  public constructor(props: IRemoHomePageProps, state: ICeoMessageState) {
    super(props);
    this.state = {
      Items: [],
      isDataAvailable: false
    };
  }

  public async componentDidMount() {

    const listCreation = new ListCreation();
    listCreation.createSharePointLists(this.props.name);
    // await this.createSharePointLists(this.props.name);
    await this.GetCEOMessage();
    await this.DynamicHeight();


  }
  // private async GetCEOMessage() {
  //   var reactHandler = this;
  //   await sp.web.lists.getByTitle(CEO_Messagelist).items.select("ID", "Title", "Description", "Created", "Name", "Image", "Designation", "Name", "*").filter(`IsActive eq '1'`).orderBy("Created", false).top(1).get().then((items) => { // //orderby is false -> decending        

  //     if (items.length == 0) {
  //       // $("#if-no-ceo-msg-present").show();
  //       // $("#if-ceo-msg-present").hide();
  //       document.querySelectorAll('#if-no-ceo-msg-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       }); document.querySelectorAll('#if-ceo-msg-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //     } else {
  //       reactHandler.setState({
  //         Items: items
  //       });
  //       // $("#if-no-ceo-msg-present").hide();
  //       // $("#if-ceo-msg-present").show();

  //       document.querySelectorAll('#if-no-ceo-msg-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       }); document.querySelectorAll('#if-ceo-msg-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //     }

  //   });

  // }

  public handleReadMoreClick(ItemID: any) {
    let itemObj = { yesNo: "yes", id: ItemID }
    this.props.onReadMoreClick(itemObj)
  }
  // Updated 
  private async GetCEOMessage() {
    var reactHandler = this;
    debugger;
    try {

      await sp.web.lists.getByTitle(CEO_Messagelist).items.select("ID", "Title", "Description", "Created", "Name", "Image", "Designation", "Name", "*").filter(`IsActive eq '1'`).orderBy("Created", false).top(1).get().then((items) => { // //orderby is false -> decending        

        if (items.length == 0) {
          // $("#if-no-ceo-msg-present").show();
          // $("#if-ceo-msg-present").hide();
          document.querySelectorAll('#if-no-ceo-msg-present').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          }); document.querySelectorAll('#if-ceo-msg-present').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
        } else {
          reactHandler.setState({
            Items: items,
            isDataAvailable: true
          });
          // $("#if-no-ceo-msg-present").hide();
          // $("#if-ceo-msg-present").show();

          document.querySelectorAll('#if-no-ceo-msg-present').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          }); document.querySelectorAll('#if-ceo-msg-present').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });
        }

      });
    } catch (err) {
      console.error("Error fetching CEO message:", err);
    }

  }

  // public DynamicHeight() {
  //   setTimeout(() => {
  //     var ceotitleheight = $("#ceo-title-dynamic").height();
  //     var herobannerheight = $("#myCarousel").height();
  //     if(ceotitleheight != undefined && herobannerheight != undefined){
  //       var total = ceotitleheight - herobannerheight + 109;
  //       var pheight = Math.round(Math.abs(total));
  //       $(".ceo-message-left p").css("height", "" + pheight + "")
  //     }
  //   }, 2000);
  // }

  DynamicHeight() {
    setTimeout(() => {
      // Select the elements by their IDs
      const ceoTitleElement = document.getElementById('ceo-title-dynamic');
      const heroBannerElement = document.getElementById('myCarousel');

      // Get the heights if the elements exist
      const ceoTitleHeight = ceoTitleElement ? ceoTitleElement.offsetHeight : 0;
      const heroBannerHeight = heroBannerElement ? heroBannerElement.offsetHeight : 0;

      if (ceoTitleHeight && heroBannerHeight) {
        const total = ceoTitleHeight - heroBannerHeight + 109;
        const pHeight = Math.round(Math.abs(total));

        // Select the paragraph inside ".ceo-message-left" and set its height
        const ceoMessageParagraph: any = document.querySelector('.ceo-message-left p');
        if (ceoMessageParagraph) {
          ceoMessageParagraph.style.height = `${pHeight}px`;
        }
      }
    }, 2000);
  }

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
      } else {
        console.log(`List '${componentListName}' already exists.`);
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
  public addData() {
    const listUrl = `${this.props.siteurl}/Lists/${CEO_Messagelist}`;

    window.open(listUrl, "_blank");
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;


    const CEOMessage: JSX.Element[] = this.state.Items.map((item, key) => {
      const dummyElement = document.createElement("DIV");
      const date = moment(item.Created).format("DD/MM/YYYY");
      dummyElement.innerHTML = item.Description;
      const outputText = dummyElement.innerText;

      // $("#ceo-title-dynamic").html(`${item.Title}`);

      const ceoTitleElement = document.getElementById('ceo-title-dynamic');

      // Check if the element exists before setting the HTML content
      if (ceoTitleElement) {
        ceoTitleElement.innerHTML = `${item.Title}`;
      }
      const RawImageTxt = item.Image;

      if (RawImageTxt && RawImageTxt !== "") {
        const ImgObj = JSON.parse(RawImageTxt);
        const serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${handler.props.siteurl}/Lists/${CEO_Messagelist}/Attachments/${item.ID}/${ImgObj.fileName}`;

        return (
          <div key={key} className="section-part clearfix">
            <div className="ceo-message-left">
              <h4>{item.Name}</h4>
              <h6>{date}</h6>
              <p>{outputText}</p>
              {/* <a href={`${handler.props.siteurl}/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="readmore transition" onClick={() => this.readMoreHandler()}> */}
              <a href="#" data-interception="off" className="readmore transition" onClick={() => this.handleReadMoreClick(item.ID)}>

                Read more
                <img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} className="transition" alt="image" />
              </a>
            </div>
            <div className="ceo-message-right">
              <img src={serverRelativeUrl} alt="no-image-uploaded" />
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} className="section-part relative clearfix">
            <div className="ceo-message-left">
              <h4>{item.Name}</h4>
              <h6>{date}</h6>
              <p>{outputText}</p>
              <a href={`${handler.props.siteurl}/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="readmore transition">
                Read more
                <img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} className="transition" alt="image" />
              </a>
            </div>
            <div className="ceo-message-right">
              <img src={`${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ceo_no_found.png`} alt="img" />
            </div>
          </div>
        );
      }
    });

    return (

      <div className="col-md-4">

        {this.state.isDataAvailable == true ?
          <>
            <div className="sec relative" id="if-ceo-msg-present">
              <div className="heading" id="ceo-title-dynamic">
                {/* CEO's Message */}
              </div>
              {CEOMessage}
            </div>
            <div className="sec shadoww relative" id="if-no-ceo-msg-present" style={{ display: "none" }}>
              <div className="heading">
                CEO's Message
              </div>
              <img className="err-img" src={`${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>
            </div>
          </>
          :
          <div>
            <button onClick={() => this.addData()}>Add Data</button>
          </div>
        }
      </div>

    );
  }
}
