import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { listNames } from '../../remoHomePage/Configuration';

let PictureGalleryLib = listNames.PictureGallery;

export interface IDepartmentGalleryState {
  Items: any[];
  Galleryitems: any[];
  VideoItemsss: any[];
  isDataAvailable: boolean
}
var FolderNames: any[] = [];
var FolderNamesExits: any[] = [];


export default class RemoImagesandVideos extends React.Component<IRemoHomePageProps, IDepartmentGalleryState, {}> {
  public constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      Galleryitems: [],
      VideoItemsss: [],
      isDataAvailable: false
    };
  }

  public componentDidMount() {

    this.GetGalleryFilesFolder();


  }


  public async GetGalleryFilesFolder() {
    try {
      const items = await sp.web.lists.getByTitle(PictureGalleryLib)
        .items.expand("Folder", "File")
        .top(1000)
        .orderBy("Created", false)
        .select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name")
        .get();

      const { length } = items;

      if (length !== 0) {
        // $("#if-gallery-present").show();
        // $("#if-no-gallery-present").hide();

        document.querySelectorAll('#if-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        this.setState({
          Galleryitems: items,
          isDataAvailable: true
        });
      } else {
        // $("#if-gallery-present").hide();
        // $("#if-no-gallery-present").show();

        document.querySelectorAll('#if-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-gallery-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
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

  public addImageVideo() {
    const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${PictureGalleryLib}`; // Replace with your list URL
    window.open(listUrl, "_blank");
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;

    var viewall = `${this.props.siteurl}/SitePages/Gallery-View-More.aspx?`;

    var reactHandler = this;
    let x: number = 1;
    const Images: JSX.Element[] = this.state.Galleryitems.map(function (item) {
      if (item.FileSystemObjectType == 1) {
      }
      if (item.FileSystemObjectType != 1) {
        var filename = item.File.Name;
        var completeurl = item.File.ServerRelativeUrl;
        var Len = filename.length;
        var Dot = filename.lastIndexOf(".");
        var res = filename.substring(Dot + 1, Len);
        var ext = res.toLowerCase();


        var string = completeurl.split('/');

        var str2 = "Videos";

        if (string.indexOf(str2) != -1) {
          // alert("video chk")
          var foldernameval = string[string.length - 2];

          var gFolderUrl = (completeurl).replace(filename, '');

          FolderNames.push(foldernameval);

          if (!reactHandler.findValueInArray(foldernameval, FolderNames)) { }
          else {

            if (ext == "mp4" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mov" || ext == "avi" || ext == "avchd" || ext == "webm" && ext == "mkv") {

              if (x <= 1) {
                // alert("true")
                x = x + 1;
                return (

                  <li>
                    <div className="images-videos-inner">

                      <a className="relative image-hover-gal" href={reactHandler.props.siteurl + "/SitePages/Gallery-Grid-View.aspx?FolderName='" + gFolderUrl + "'&Type=Video"} data-interception="off">
                        <video className="lg-video-object lg-html5" >
                          <source src={`${item.File.ServerRelativeUrl}`} type="video/mp4" />
                        </video>
                        <div className="pasue_img">
                          <img src={reactHandler.props.siteurl + "/sites/DemoIntranet1/SiteAssets/img/video_img.svg"} alt="images" />
                        </div>
                      </a>
                    </div>

                  </li>

                );
              }

            }
          }
        }
        else {
          if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {
            var foldernameval = string[string.length - 2];

            var gFolderUrl = (completeurl).replace(filename, '');

            FolderNames.push(foldernameval);
            if (reactHandler.findValueInArray(foldernameval, FolderNamesExits)) {

            }

            else {
              if (reactHandler.findValueInArray(foldernameval, FolderNames)) {
                FolderNamesExits.push(foldernameval);
                console.log("foldernameval check ext", foldernameval);


                if (x <= 2) {
                  x = x + 1;
                  return (

                    <li>
                      <div className="images-videos-inner">
                        <a className="relative image-hover-gal" href={reactHandler.props.siteurl + "/SitePages/Gallery-Grid-View.aspx?FolderName='" + gFolderUrl + "'&Type=Img"} data-interception="off">
                          <img src={`${item.File.ServerRelativeUrl}`} alt={item.File.Name} />
                          <p>{foldernameval} </p>
                        </a>
                      </div>
                    </li>

                  );
                }

              }
            }
          }
          else {
            var foldernameval = string[string.length - 2];
            console.log("foldernameval dec 2", foldernameval);

            var gFolderUrl = (completeurl).replace(filename, '');
            FolderNames.push(foldernameval);
            if (reactHandler.findValueInArray(foldernameval, FolderNamesExits)) {

            }

          }
        }
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`





    return (
      <div id="dept-gallery-home">
        {this.state.isDataAvailable == true ?

          <>
            <div className="col-md-6" id="if-gallery-present">
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h4> <a href={`${this.props.siteurl}/SitePages/Gallery-View-More.aspx`} data-interception="off">
                    Images and Videos</a>
                  </h4>

                  <div className='heading-right'>

                    {/* <a href={`${this.props.siteurl}/SitePages/EventsViewMore.aspx?`}> */}
                    <a href={viewall}>

                      View All

                    </a>
                  </div>
                </div>

                <div className="section-part clearfix">
                  {/* latest-events-bck"> */}
                  <ul className="clearfix img-block-area">
                    {Images}
                  </ul>

                  {/*<ul className="clearfix vdo-block-area" style={{display:"none"}}>
                  </ul>*/}
                </div>
              </div>
            </div>

            <div className="col-md-6" id="if-no-gallery-present" style={{ display: "none" }}>
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3 className="images active">
                    <a href="#" data-interception="off"> Gallery </a> </h3>
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <div className="clearfix img-block-area">
                    <img className="err-img" src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <div>
            <button onClick={() => this.addImageVideo()}>addImage&Video</button>
          </div>
        }
      </div>
    )
  }
}