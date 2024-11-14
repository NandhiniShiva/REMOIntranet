import * as React from 'react';
import { IRemoDeptLandingPageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import { IWeb, Web } from "@pnp/sp/webs";
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';

let PictureGalleryLib = listNames.PictureGallery;

export interface IDepartmentGalleryState {
  Items: any[];
  Galleryitems: any[];
  VideoItemsss: any[];
}

var NewWeb: IWeb & IInvokable<any>
export default class DepartmentGallery extends React.Component<IRemoDeptLandingPageProps, IDepartmentGalleryState, {}> {
  public constructor(props: IRemoDeptLandingPageProps) {
    super(props);
    this.state = {
      Items: [],
      Galleryitems: [],
      VideoItemsss: []
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }

  public componentDidMount() {

    this.GetGalleryFilesFolder();
  }

  // public GetGalleryFilesFolder() {
  //   var reactHandler = this;
  //   NewWeb.lists.getByTitle(PictureGalleryLib).items.expand("Folder", "File").top(1000).orderBy("Created", false).select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name").get().then((items: any[]) => {
  //     if (items.length != 0) {
  //       // $("#if-gallery-present").show();
  //       // $("#if-no-gallery-present").hide();

  //       document.querySelectorAll('#if-gallery-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //       document.querySelectorAll('#if-no-gallery-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       reactHandler.setState({
  //         Galleryitems: items
  //       });
  //     } else {
  //       // $("#if-gallery-present").hide();
  //       // $("#if-no-gallery-present").show();

  //       document.querySelectorAll('#if-gallery-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       document.querySelectorAll('#if-no-gallery-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //     }
  //   });

  // }

  // Updated code

  public async GetGalleryFilesFolder() {
    try {
      const items = await NewWeb.lists
        .getByTitle(PictureGalleryLib)
        .items
        .expand("Folder", "File")
        .top(1000)
        .orderBy("Created", false)
        .select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name")
        .get();

      if (items.length !== 0) {
        // Show gallery present section, hide no gallery present section
        document.querySelectorAll('#if-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        this.setState({
          Galleryitems: items
        });
      } else {
        // Hide gallery present section, show no gallery present section
        document.querySelectorAll('#if-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    } catch (error) {
      console.error("Error fetching gallery files:", error);
    }
  }
  public findValueInArray(value: any, arr: string | any[]) {
    var result = false;

    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (name == value) {
        result = true;
        break;
      }
    }
    return result;
  }

  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    var reactHandler = this;
    const Images: JSX.Element[] = this.state.Galleryitems
      .filter(item => item.FileSystemObjectType !== 1) // Filter out non-files
      .filter(item => {
        const filename = item.File.Name;
        const ext = filename.split('.').pop()?.toLowerCase(); // Extract file extension
        return ext && ['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv'].indexOf(ext) === -1; // Filter out video file extensions
      })
      .slice(0, 5) // Limit the number of items to render
      .map((item, key) => {
        const foldernameval = item.File.ServerRelativeUrl.split('/').slice(-2, -1)[0];
        return (
          <li key={key}>
            <a className="relative image-hover-gal" href={`${reactHandler.props.siteurl}/SitePages/Gallery-Grid-View.aspx?FolderName='${item.File.ServerRelativeUrl}'&Type=Img&`} data-interception="off">
              <img src={item.File.ServerRelativeUrl} alt={item.File.Name} />
              <p>{foldernameval}</p>
            </a>
          </li>
        );
      });


    return (
      <div id="dept-gallery-home-inner">
        <div className="images-social">
          <div className="row-dummy">
            <div className="col-md-6-dummy" id="if-gallery-present">
              <div className="sec event-cal image-videos">
                <div className="heading clearfix hr_gallery">
                  <h3> <a href={`${this.props.siteurl}/SitePages/Gallery-View-More.aspx?`} data-interception="off"> Gallery </a> </h3>
                  {/*<h3 className=""><a href="#" onClick={()=> this.ShowVideos()}>Videos</a> </h3>*/}
                </div>

                <div className="section-part clearfix latest-events-bck">
                  <ul className="clearfix img-block-area">
                    {Images}
                  </ul>

                  {/*<ul className="clearfix vdo-block-area" style={{display:"none"}}>
                  </ul>*/}
                </div>
              </div>
            </div>

            <div className="col-md-6-dummy" id="if-no-gallery-present" style={{ display: "none" }}>
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3 className="images active">
                    <a href="#" data-interception="off"> Gallery </a> </h3>
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <div className="clearfix img-block-area">
                    <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />
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