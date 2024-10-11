import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { ServiceProvider } from '../components/services/ServiceProvider';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import * as $ from 'jquery';
import "@pnp/sp/folders";
import * as moment from 'moment';

export interface IMyRecentFilesState {
  myonedriveRecentData: any[];
}

export default class RemoRecentFiles extends React.Component<IRemoHomePageProps, IMyRecentFilesState, {}> {
  private serviceProvider;
  public constructor(props: IRemoHomePageProps, state: IMyRecentFilesState) {
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);

    this.state = {
      myonedriveRecentData: [],
    }
  }

  public componentDidMount() {

    this.GetMyOneDriveRecents();
    this.calculateDynamicHeight();

  }


  public GetMyOneDriveRecents() {
    this.serviceProvider.
      getMyDriveRecents()
      .then(
        (result: any[]): void => {
          this.setState({ myonedriveRecentData: result });
        }
      )
      .catch(error => {
        console.log(error);
      });
  }

  public OpenRecentfiles(url: string) {
    window.open("" + url + "", "_blank");
  }

  public calculateDynamicHeight() {
    const calculateHeight = () => {
      let nwsHeight = document.getElementById('m-b-20-news')?.offsetHeight || 0;
      let socialHeight = document.getElementById('latest-news-announcemnst')?.offsetHeight || 0;
      let videoHeight = document.getElementById('social-and-gallery')?.offsetHeight || 0;
      let weatherHeight = document.getElementById('m-b-20-weather')?.offsetHeight || 0;
      let highlightsHeight = document.getElementById('bday-highlights')?.offsetHeight || 0;

      // let nwsHeight = document.getElementById('m-b-20-news').offsetHeight;
      // let socialHeight = document.getElementById('latest-news-announcemnst').offsetHeight;
      // let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
      // let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
      // let highlightsHeight = document.getElementById('bday-highlights').offsetHeight;
      let pQlinkHeight = 0;

      const pQlinkElement = document.getElementById('m-b-20-PQlink');
      if (pQlinkElement) {
        pQlinkHeight = pQlinkElement.offsetHeight;
      }

      let totalHeightLeft = nwsHeight + socialHeight + videoHeight;
      let totalHeightRight = weatherHeight + highlightsHeight + pQlinkHeight;

      let totalCalculatedHeight = totalHeightLeft - totalHeightRight + 25;

      // $("#dynamic-height-recentsfiles").css("height", `${totalCalculatedHeight}px`);
      const dynamicHeightElement = document.getElementById("dynamic-height-recentsfiles");
      if (dynamicHeightElement) {
        dynamicHeightElement.style.height = `${totalCalculatedHeight}px`;
      }
    };

    setTimeout(calculateHeight, 1500);
    setTimeout(calculateHeight, 2000);
    setTimeout(calculateHeight, 4000);
    setTimeout(calculateHeight, 7000);
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const OneDriveRecents: JSX.Element[] = reactHandler.state.myonedriveRecentData.map(function (item, key) {
      const filename = item.name;
      const extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
      let fileTypeImg: string | undefined;

      switch (extension) {
        case "docx":
        case "doc":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/WordFluent.png`;
          break;
        case "pdf":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/pdf.svg`;
          break;
        case "xlsx":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/ExcelFluent.png`;
          break;
        case "pptx":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/PPTFluent.png`;
          break;
        case "url":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/URL.png`;
          break;
        case "txt":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/txt.svg`;
          break;
        case "css":
        case "sppkg":
        case "ts":
        case "tsx":
        case "html":
        case "aspx":
        case "js":
        case "map":
        case "php":
        case "json":
        case "xml":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/Code.svg`;
          break;
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "svg":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/photo.svg`;
          break;
        case "zip":
        case "rar":
          fileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/zip.svg`;
          break;
        default:
          break;
      }

      if (fileTypeImg) {
        const url: string = item.webUrl;
        const location: string = url && url.indexOf("remodigital-my.sharepoint.com") !== -1 ? "OneDrive" : "SharePoint";

        return (
          <li key={key}>
            <a href={item.webUrl} data-interception="off" target="_blank" className="clearfix">
              <img src={fileTypeImg} alt="images" />
              <div className="recent-files-block clearfix">
                <div className="recent-files-wrap-left">
                  <h4 className="name-resp"> {filename} </h4>
                  <h5> {extension} | {location}</h5>
                </div>
                <div className="recent-files-wrap-right">
                  <h5> {moment(item.lastModifiedDateTime).format('MMM DD h:mm a')} </h5>
                </div>
              </div>
            </a>
          </li>
        );
      }

      return null;
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className={styles.remoHomePage}>
        <div className="recent-file-wrap">
          <div className="sec" id="dynamic-height-recentsfiles-1">
            <div className="heading" style={{ cursor: "pointer" }} onClick={() => this.OpenRecentfiles("https://remodigital-my.sharepoint.com/personal/test_remodigital_in/_layouts/15/onedrive.aspx?view=1")}>
              Recent Files

            </div>
            <div className="section-part clearfix" id="dynamic-height-recentsfiles">
              <ul>
                {OneDriveRecents}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
