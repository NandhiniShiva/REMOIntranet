import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import { listNames } from '../Configuration';

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

  public componentDidMount() {

    this.GetCEOMessage();
    this.DynamicHeight();


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

  // Updated 
  private async GetCEOMessage() {
    var reactHandler = this;
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
            Items: items
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

  public addData() {
    const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${CEO_Messagelist}`; // Replace with your list URL
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
              <a href={`${handler.props.siteurl}/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="readmore transition">
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
