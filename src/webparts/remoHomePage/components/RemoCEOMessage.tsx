import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import { listNames } from '../Configuration';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';

let CEO_Messagelist = listNames.CEO_Message;
let CEOName: any;

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
    listCreation.createSharePointLists(CEO_Messagelist);
    await this.GetCEOMessage();
    await this.DynamicHeight();
  }


  public readMoreHandler(compName: any, itemId: any) {
    this.props.onReadMoreClick({ Name: compName, Id: itemId })
  }
  // Updated 
  private async GetCEOMessage() {
    var reactHandler = this;
    try {
      await sp.web.lists.getByTitle(CEO_Messagelist).items.select("ID", "Title", "Description", "Created", "CEOName", "Image", "Designation", "*").filter(`IsActive eq '1'`).orderBy("Created", false).top(1).get().then((items) => { // //orderby is false -> decending        
        if (items.length == 0) {

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

  public addData(event: any) {
    event.preventDefault();
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
      CEOName = item.Title;
      const RawImageTxt = item.Image;

      if (RawImageTxt && RawImageTxt !== "") {
        const ImgObj = JSON.parse(RawImageTxt);
        const serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${handler.props.siteurl}/Lists/${CEO_Messagelist}/Attachments/${item.ID}/${ImgObj.fileName}`;

        return (
          <div key={key} className="section-part clearfix">
            <div className="ceo-message-left">
              <h4>{item.CEOName}</h4>
              <h6>{date}</h6>
              <p>{outputText}</p>
              <a href="#" data-interception="off" className="readmore transition" onClick={() => this.readMoreHandler("CEOReadMore", item.ID)}>
                Read more
                <img src={require("./ServiceProvider/Assets/Img/right_arrow.svg")} className="transition" alt="image" />
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
              <h4>{item.CEOName}</h4>
              <h6>{date}</h6>
              <p>{outputText}</p>
              <a href='#' onClick={() => this.readMoreHandler("CEOReadMore", item.ID)} data-interception="off" className="readmore transition">
                Read more
                <img src={require("./ServiceProvider/Assets/Img/right_arrow.svg")} className="transition" alt="image" />
              </a>
            </div>
            <div className="ceo-message-right">
              <img src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/ceo_no_found.png")} alt="img" />
            </div>
          </div>
        );
      }
    });

    return (

      <div className="col-md-12">
        {this.state.isDataAvailable == true ?
          <>
            <div className="sec relative" id="if-ceo-msg-present">
              <div className="heading" id="ceo-title-dynamic">
                {CEOName}
              </div>
              {CEOMessage}
            </div>
            <div className="sec shadoww relative" id="if-no-ceo-msg-present" style={{ display: "none" }}>
              <div className="heading">
                CEO's Message
              </div>
              <img className="err-img" src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/ContentEmpty.png")} alt="ceoimg"></img>
            </div>
          </>
          :
          <div>
            <button onClick={(e) => this.addData(e)}>Add Data</button>
          </div>
        }
      </div>

    );
  }
}
