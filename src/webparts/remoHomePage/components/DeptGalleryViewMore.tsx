import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { ISPFXContext } from '@pnp/common';
import { IDeptGalleryViewMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
// import * as $ from 'jquery';
import Slider from "react-slick";
import GlobalSideNav from "../../remoHomePage/components/Header/GlobalSideNav";
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { Web, sp } from "@pnp/sp/presets/all";
import { WEB, listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp from 'sp-pnp-js';

let PictureGalleryLib = listNames.PictureGallery;
const Analytics = listNames.Analytics;


export interface IGalleryVmState {
  Galleryitems: any[];
  VideoItemsss: any[];
  FolderItems: any[];
  nav1: Slider | null;
  nav2: Slider | null;
  FolderURL: string;
  Mode: string;
  Images: any[];
  Videos: any[];
  SliderIsOpen: boolean;
  Title: string;
}

// let ImgArr = [];
const WebUrl: any = Web(WEB.NewWeb);
var User = "";
var UserEmail = "";
var Designation = "";
var Department = "";
var NewWeb: any;
var Dept: any;
NewWeb = WebUrl;

export default class GalleryVm extends React.Component<IDeptGalleryViewMoreProps, IGalleryVmState, {}> {
  slider2: any;
  slider1: any;
  spfxContext: ISPFXContext;
  public lightGallery: any;
  private displayDataImages: JSX.Element[];
  // private displayDataVideos: JSX.Element[];


  public constructor(props: IDeptGalleryViewMoreProps) {
    super(props);
    this.displayDataImages = [];
    // this.displayDataVideos = [];
    this.appendRootFolder = this.appendRootFolder.bind(this); // Binding this method
    this.state = {
      Galleryitems: [],
      VideoItemsss: [],
      FolderItems: [],
      nav1: null,
      nav2: null,
      FolderURL: "",
      Mode: "",
      Images: [],
      Videos: [],
      SliderIsOpen: false,
      Title: ""
    };
  }

  public componentDidMount() {

    setTimeout(function () {
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('#CommentsWrapper').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');


      const commentsWrapper = document.getElementById('CommentsWrapper');
      if (commentsWrapper) {
        commentsWrapper.style.setProperty('display', 'none', 'important');
      }

      // Hide all div elements with the attribute data-automation-id="pageHeader"
      const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeaders.forEach((element: any) => {
        element.style.setProperty('display', 'none', 'important');
      });

      const spCommandBar = document.getElementById('spCommandBar');
      if (spCommandBar) {
        spCommandBar.style.setProperty('display', 'none', 'important');
      }
    }, 2000);

    this.getCurrentUser().then(() => {
      this.GetGalleryFilesFolder();
      // this.GetGalleryFilesFolderVideos();
    }).then(() => {
      this.LandingPageAnalytics()
    })

    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  public async LandingPageAnalytics() {
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }
    console.log(this.state.Title);

    try {
      const response = await NewWeb.lists.getByTitle(Analytics).items.add({
        Category: `Depart-${Dept} GalleryView-More`,
        UserId: User.toString(),
        Department: Department,
        Designation: Designation,
        Title: "NA",
        ItemId: "NA",
        UserEmail: UserEmail,
      });

      console.log('Data successfully added:', response);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  public async getCurrentUser() {
    try {
      const url: any = new URL(window.location.href);
      const fullPath = url.pathname;
      // Find the index of 'SitePages'
      const segment = "SitePages";
      const segmentIndex = fullPath.indexOf(`/${segment}`);
      if (segmentIndex === -1) {
        // If 'SitePages' is not found in the URL, return null
        // return null;
      }
      // Extract the part of the URL before 'SitePages'
      const relevantPart = fullPath.substring(0, segmentIndex);
      // Find the last segment before 'SitePages'
      const lastSegmentIndex = relevantPart.lastIndexOf('/');
      // Extract the last segment
      const lastSegment = relevantPart.substring(lastSegmentIndex + 1);
      Dept = lastSegment;
      var reacthandler = this;
      User = reacthandler.props.userid;
      const profile = await pnp.sp.profiles.myProperties.get();
      UserEmail = profile.Email;
      Designation = profile.Title;
      // Check if the UserProfileProperties collection exists and has the Department property
      if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        // Find the Department property in the profile
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
        console.log(departmentProperty);
        if (departmentProperty) {
          Department = departmentProperty.Value;
        }
      }
    }
    catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
  }

  public GetGalleryFilesFolder() {
    // ImgArr = [];
    const reactHandler = this;
    sp.web.lists.getByTitle(PictureGalleryLib).rootFolder
      .folders
      .select("ID", "Name", "ServerRelativeUrl")
      .get().then(async (rootFolders: any[]) => {

        // Iterate through the root folders
        rootFolders.forEach(async (rootFolder, index) => {
          const folderName = rootFolder.Name;
          const folderUrl = rootFolder.ServerRelativeUrl;

          // Exclude folder named "Forms"
          if (folderName !== "Forms") {
            try {
              // Fetch files from the folder
              const result = await sp.web.getFolderByServerRelativeUrl(folderUrl)
                .files.select("ID", "Name", "ServerRelativeUrl", "TimeCreated")
                .orderBy("TimeCreated", false).top(1).get();

              const folderImage = result.length > 0 ? result[0].ServerRelativeUrl : `${reactHandler.props.siteurl}/SiteAssets/img/empty_folder_v2.svg`;

              // Append only root folders to the display
              reactHandler.appendRootFolder(folderName, folderUrl, folderImage, "", index);
            } catch (error) {
              console.error("Error fetching folder media:", error);
              // Handle error if needed
            }
          }
        });
      }).catch(error => {
        console.error("Error fetching root folders:", error);
        // Handle error here, e.g., show an error message to the user
      });
  }


  public appendRootFolder(folderName: string, folderUrl: string, thumbnailUrl: string, altText: string, key: number) {
    var reactHandler = this;
    try {
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(thumbnailUrl);
      const isVideo = /\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/i.test(thumbnailUrl);
      if (folderName != "_t" && folderName != "_w") {
        reactHandler.displayDataImages.push(
          <li key={key}> {/* Add key prop to each list item */}
            <a href="#" onClick={() => reactHandler.GetImagesInsideFolder(folderUrl, "Image", key)} data-interception="off">
              <div className='gallery-vm'>
                {/* Display the folder icon or thumbnail */}
                {isImage && <img src={thumbnailUrl} alt={altText} data-interception="off" />}
                {isVideo && (
                  <video controls>
                    <source src={thumbnailUrl} type="video/mp4" />
                    {/* Add more video source types if needed */}
                    Your browser does not support the video tag.
                  </video>
                )}
                {!isImage && !isVideo && <img src={`${reactHandler.props.siteurl}/SiteAssets/img/empty_folder_v2.svg`} alt={altText} data-interception="off" />}
              </div>
              <p>{folderName}</p>
            </a>
          </li>
        );
      }
      reactHandler.setState({
        Images: reactHandler.displayDataImages
      });
    }
    catch (error) {
      console.error("Error appending root folders:", error);
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

  // public GetImagesInsideFolder(FolderURL: string, Mode: string, key: number) {
  //   const FolderUrl = FolderURL.replace(/['"]+/g, '');
  //   const reactHandler = this;
  //   this.setState({ FolderURL: FolderUrl, SliderIsOpen: true, Mode: Mode });
  //   try {
  //     // Show or hide triggers based on mode
  //     if (Mode === "Image") {
  //       // $("#trigger-image").hide();
  //       // $("#trigger-video").show();
  //       document.querySelectorAll('#trigger-video').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //       document.querySelectorAll('#trigger-image').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //     } else if (Mode === "Video") {
  //       // $("#trigger-video").hide();
  //       // $("#trigger-image").show();
  //       document.querySelectorAll('#trigger-video').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       document.querySelectorAll('#trigger-image').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //     }

  //     // Fetch files from the specified folder URL
  //     sp.web.getFolderByServerRelativeUrl(FolderUrl).files.get()
  //       .then(async (items) => {
  //         // Filter files based on mode (image or video)
  //         const imageItems = items.filter((item) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.Name));
  //         const videoItems = items.filter((item) => /\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/i.test(item.Name));

  //         // If mode is "Image" and there are video files, hide image trigger
  //         if (Mode === "Image" && videoItems.length === 0) {
  //           // $("#trigger-video").hide();
  //           // Select the element with the ID 'trigger-video'
  //           const triggerVideoElement: any = document.querySelector('#trigger-video');
  //           // Check if the element exists before trying to hide it
  //           if (triggerVideoElement) {
  //             // Hide the element with the ID 'trigger-video'
  //             triggerVideoElement.style.display = 'none'; // Hide the element
  //           } else {
  //             console.warn("Element with ID 'trigger-video' not found.");
  //           }

  //           document.querySelectorAll('#trigger-video').forEach(element => {
  //             (element as HTMLElement).style.display = 'none';
  //           });
  //         }

  //         // If mode is "Video" and there are no video files, hide video trigger
  //         if (Mode === "Video" && imageItems.length === 0) {
  //           // $("#trigger-image").hide();
  //           document.querySelectorAll('#trigger-image').forEach(element => {
  //             (element as HTMLElement).style.display = 'none';
  //           });
  //         }

  //         // Set the folder items in the state and open the lightbox
  //         reactHandler.setState({ FolderItems: Mode === "Image" ? imageItems : videoItems });
  //         // $(".lightbox").addClass("open");

  //         const lightboxElement = document.querySelector('.lightbox');

  //         // Add the "open" class to the selected element
  //         if (lightboxElement) {
  //           lightboxElement.classList.add('open');
  //         }
  //         // Navigate to the specified key in the slider
  //         reactHandler.slider1.slickGoTo(key);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching folder items:', error);
  //         // Handle error if needed
  //         if (Mode === "Video") {
  //           // $("#trigger-video").hide();

  //           document.querySelectorAll('#trigger-video').forEach(element => {
  //             (element as HTMLElement).style.display = 'none';
  //           });
  //         }
  //       });
  //   }
  //   catch (error) {
  //     console.error("An error occurred while fetching images inside the folder:", error);
  //   }
  // }

  // Optimized code 

  public async GetImagesInsideFolder(FolderURL: string, Mode: string, key: number) {
    const folderUrl = FolderURL.replace(/['"]+/g, '');
    this.setState({ FolderURL: folderUrl, SliderIsOpen: true, Mode });

    try {
      // Toggle visibility of triggers based on mode
      this.toggleTriggerVisibility(Mode);

      // Fetch files from the specified folder URL
      const items = await sp.web.getFolderByServerRelativeUrl(folderUrl).files.get();

      // Filter files based on mode
      const imageItems = items.filter(item => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.Name));
      const videoItems = items.filter(item => /\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/i.test(item.Name));

      // Update trigger visibility based on available files
      this.updateTriggerVisibilityBasedOnFiles(Mode, imageItems, videoItems);

      // Set folder items and open lightbox
      this.setState({ FolderItems: Mode === "Image" ? imageItems : videoItems });
      this.toggleLightbox(true);

      // Navigate to the specified key in the slider
      this.slider1.slickGoTo(key);
    } catch (error) {
      console.error('Error fetching folder items:', error);
      if (Mode === "Video") {
        this.setTriggerVisibility('#trigger-video', false);
      }
    }
  }

  // Utility function to toggle trigger visibility based on mode
  private toggleTriggerVisibility(mode: string) {
    const isImageMode = mode === "Image";
    this.setTriggerVisibility('#trigger-video', isImageMode);
    this.setTriggerVisibility('#trigger-image', !isImageMode);
  }

  // Utility function to update trigger visibility based on available files
  private updateTriggerVisibilityBasedOnFiles(mode: string, imageItems: any[], videoItems: any[]) {
    if (mode === "Image" && videoItems.length === 0) {
      this.setTriggerVisibility('#trigger-video', false);
    } else if (mode === "Video" && imageItems.length === 0) {
      this.setTriggerVisibility('#trigger-image', false);
    }
  }

  // Utility function to show/hide elements based on selector
  private setTriggerVisibility(selector: string, isVisible: boolean) {
    document.querySelectorAll<HTMLElement>(selector).forEach(element => {
      element.style.display = isVisible ? 'block' : 'none';
    });
  }

  // Utility function to toggle the lightbox visibility
  private toggleLightbox(isOpen: boolean) {
    const lightboxElement = document.querySelector('.lightbox');
    if (lightboxElement) {
      if (isOpen) {
        lightboxElement.classList.add('open');
      } else {
        lightboxElement.classList.remove('open');
      }
    }
  }

  public ShowHideVideos(FolderURL: string, Mode: any) {
    const FolderPath = FolderURL.replace(/[']/g, '');
    const FolderServerRelativeUrl = `${FolderPath}`;

    // Update the component state with the folder URL and mode
    this.setState({ FolderURL: FolderURL, Mode: Mode });

    // Open the lightbox
    // $(".lightbox").addClass("open");
    const lightboxElement = document.querySelector('.lightbox');

    // Add the "open" class to the selected element
    if (lightboxElement) {
      lightboxElement.classList.add('open');
    }

    // Hide the video trigger by default
    // $("#trigger-video").hide();
    document.querySelectorAll('#trigger-video').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    try {
      // Fetch all files from the specified folder or subfolder
      sp.web.getFolderByServerRelativeUrl(FolderServerRelativeUrl).files.get()
        .then((items) => {
          // Check if there are any video files
          const hasVideos = items.some((item) => {
            const fileName = item.Name.toLowerCase();
            return /\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/i.test(fileName);

          });

          // If there are video files, show the video trigger
          if (hasVideos) {
            // $("#trigger-video").show();

            document.querySelectorAll('#trigger-video').forEach(element => {
              (element as HTMLElement).style.display = 'block';
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching folder items:', error);
          // Handle error if needed
          // $("#trigger-video").hide();

          document.querySelectorAll('#trigger-video').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
        });
    } catch (err) {
      console.error('Error fetching folder:', err);
      // Handle error if needed
      // $("#trigger-video").hide();

      document.querySelectorAll('#trigger-video').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
    }
  }
  public CloseLightBox() {

    // $(".lightbox").removeClass("open");

    const lightboxElement = document.querySelector('.lightbox');

    // Add the "open" class to the selected element
    if (lightboxElement) {
      lightboxElement.classList.add('open');
    }
    this.setState({ SliderIsOpen: false, FolderItems: [] })

  }

  public render(): React.ReactElement<IDeptGalleryViewMoreProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
            arrows: true,
            autoplay: false,
            centerMode: false,
          }
        }
      ]
    };

    var reactHandler = this;




    const MAslider2: JSX.Element[] = this.state.FolderItems.map(function (item) {
      if (item) {
        var Mode = reactHandler.state.Mode;
        var filename = item.Name;
        var Len = filename.length;
        var Dot = filename.lastIndexOf(".");
        var res = filename.substring(Dot + 1, Len);
        var ext = res.toLowerCase();
        const validVideoExtensions = ["mp4", "mov", "wmv", "flv", "avi", "avchd", "webm", "mkv"];
        if (Mode === "Image" && validVideoExtensions.indexOf(ext) === -1) {
          return (
            <li>
              <a href="#" data-interception="off">
                <img src={`${item.ServerRelativeUrl}`} alt="image" />
              </a>
            </li>
          );
        } else if (Mode === "Video") {
          return (
            <li>
              <a href="#" data-interception="off">
                <video className="lg-video-object lg-html5" src={`${item.ServerRelativeUrl}`} />
                {/* <source src={`${item.ServerRelativeUrl}`} type="video/mp4" /> */}
              </a>
            </li>
          );
        }
        return null; // Return null for other cases
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`



    return (
      <div className={styles.remoHomePage} id="galleryVm">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={"https://remodigital.sharepoint.com/sites/DemoIntranet1"} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Gallery </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Gallery Folders </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents gallery-viewall-folders" >
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="section-part clearfix">
                          <ul className="clearfix img-block-area">

                            <div id="img">
                              {this.state.Images}
                            </div>
                            <div id="vid">
                              {this.state.Videos}
                            </div>

                          </ul>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} onReadMoreClick={null} id={null} />

            </div>
          </div>

        </section>

        <div className="lightbox">
          <div className="gallery-lightbox-contents">
            <div className="lightbox-contents-img">
              <div className="lightbox-contents-header clearfix">

                <ul>
                  <li id="trigger-image" className={this.state.Mode == "Image" ? "imageblock" : ""} > <a href="#" onClick={() => reactHandler.GetImagesInsideFolder(this.state.FolderURL, "Image", 0)} data-interception="off"> Images  </a> </li>
                  <li id="trigger-video" className={this.state.Mode == "Video" ? "videoblock" : ""} > <a href="#" onClick={() => reactHandler.GetImagesInsideFolder(this.state.FolderURL, "Video", 0)} data-interception="off"> Videos  </a> </li>
                  <li> <a href={this.props.siteurl + "/SitePages/Gallery-Grid-View.aspx?FolderName='" + this.state.FolderURL + "'&Type=Img"} data-interception="off"> Grid View  </a> </li>
                </ul>
              </div>
              <div className="lightbox-contents-body">
                {this.state.SliderIsOpen && (
                  <Slider
                    {...settings}
                    asNavFor={this.state.nav2 || undefined}
                    ref={slider => (this.slider1 = slider)}
                  >
                    {this.state.FolderItems && this.state.FolderItems.length > 0 ? (
                      this.state.FolderItems.map((item) => {
                        if (reactHandler.state.Mode === "Image") {
                          var filename = item.Name;
                          console.log(item.ServerRelativeUrl);
                          var Len = filename.length;
                          var Dot = filename.lastIndexOf(".");
                          var res = filename.substring(Dot + 1, Len);
                          var ext = res.toLowerCase();

                          if (
                            ext !== "mp4" &&
                            ext !== "mov" &&
                            ext !== "wmv" &&
                            ext !== "flv" &&
                            ext !== "avi" &&
                            ext !== "avchd" &&
                            ext !== "webm" &&
                            ext !== "mkv"
                          ) {

                            return (
                              <>
                                <img
                                  src={`${item.ServerRelativeUrl}`}
                                  alt="image"
                                  style={{ width: '900px' }}
                                />
                                <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                              </>
                            );

                          }
                        } else if (reactHandler.state.Mode === "Video") {

                          return (
                            <>
                              <video
                                className="lg-video-object lg-html5"
                                src={`${item.ServerRelativeUrl}`}
                                style={{ width: '810px' }}
                                controls
                              >
                                {/* <source src={`${item.ServerRelativeUrl}`} type="video/mp4" /> */}
                              </video>
                              <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                            </>
                          );

                        }
                      })
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`}
                          alt="No Content Found"
                          style={{ width: '900px' }}
                        />
                        {/* <h4 style={{ color: '#ffffff' }}>No Content Found</h4> */}
                      </div>
                    )}
                  </Slider>
                )}
              </div>
              <div className="lightbox-conent-thumbnails">
                <ul className="clearfix">
                  {this.state.SliderIsOpen == true &&
                    <Slider
                      asNavFor={this.state.nav1 || undefined}
                      ref={slider => (this.slider2 = slider)}
                      slidesToShow={4}
                      swipeToSlide={true}
                      focusOnSelect={true}
                      infinite={false}
                      autoplay={false}
                      arrows={false}
                      centerMode={false}
                      responsive={[
                        {
                          breakpoint: 1000,
                          settings: {
                            slidesToShow: 4,
                            swipeToSlide: true,
                            focusOnSelect: true,
                            infinite: false,
                            autoplay: false,
                            arrows: false,
                            centerMode: false
                          }
                        }
                      ]
                      }
                    >
                      {MAslider2}
                    </Slider>
                  }
                </ul>
              </div>
              <div className="lightbox-close">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/close.svg`} alt="close" onClick={() => this.CloseLightBox()} />

              </div>
            </div>
          </div>
        </div>
        <RemoResponsive siteurl={"https://remodigital.sharepoint.com/sites/DemoIntranet1"} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}