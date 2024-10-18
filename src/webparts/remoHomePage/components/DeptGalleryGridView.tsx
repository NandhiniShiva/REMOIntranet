import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { ISPFXContext } from '@pnp/common';
import { IDeptGalleryGridViewProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
// import * as $ from 'jquery';
import Slider from "react-slick";
import { Web } from '@pnp/sp/webs';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { sp } from "@pnp/sp/presets/all";
import Footer from '../../remoHomePage/components/Footer/Footer'
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { listNames, WEB } from '../../remoHomePage/Configuration';
import pnp from 'sp-pnp-js';

export interface IGalleryGridViewState {
  Folders: any[]
  Images: any[];
  Videos: any[];
  items: any[];
  type: string | null;
  FolderItems: any[];
  nav1: Slider | null;
  nav2: Slider | null;
  FolderURL: string;
  Mode: string;
  slideIndex: number;
  updateCount: number;
  Type: string | null;
  SliderIsOpen: boolean;
  Subfolderurl: string;
  MyFolderName: string;
  Title: string;
}
var Breadcrumb: any = [];
var Global_Type: any = "";
var GlobalUrl: any;
const validExtensions = new Set(["mp4", "mov", "wmv", "flv", "avi", "avchd", "webm", "mkv"]);
const Analytics = listNames.Analytics;
const WebUrl: any = Web(WEB.NewWeb);
var User = "";
var UserEmail = "";
var Designation = "";
var Department = "";
var NewWeb: any;
var Dept: any;

const encodeUrl = (url: string): string => {
  return encodeURI(url);
};

const getThumbnailUrl = (imageUrl: string): string => {
  const splitUrl = imageUrl.split("/");
  const lastFilename = splitUrl.pop() || ""; // test.png
  const thumbUrlHardcode = `_t/${lastFilename}`; // /_t/test.png
  const newPath = thumbUrlHardcode.replace(".", "_"); // /_t/test_png
  const finalUrl = imageUrl.replace(lastFilename, `${newPath}.jpg`); // https://tenant/site/doclib/doclibfolder/_t/test_png.jpg
  return encodeUrl(finalUrl);
};
export default class DeptGalleryGridView extends React.Component<IDeptGalleryGridViewProps, IGalleryGridViewState, {}> {
  slider2: any;
  slider1: any;
  spfxContext: ISPFXContext;
  public constructor(props: IDeptGalleryGridViewProps) {
    super(props);
    sp.setup({
      ie11: false,
      sp: {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        }
      },
      spfxContext: this.spfxContext
    });
    this.state = {
      Folders: [],
      Images: [],
      Videos: [],
      items: [],
      type: "",
      FolderItems: [],
      nav1: null,
      nav2: null,
      FolderURL: "",
      Mode: "",
      slideIndex: 0,
      updateCount: 0,
      Type: "",
      SliderIsOpen: false,
      Subfolderurl: "",
      MyFolderName: "",
      Title: "",
    };
    NewWeb = WebUrl;

  }

  // public componentDidMount() {
  //   setTimeout(() => {
  //     // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
  //     // $('#spCommandBar').attr('style', 'display: none !important');
  //     // $('#webPartContainer').attr('style', 'display: none !important');
  //     // $('#CommentsWrapper').attr('style', 'display: none !important');

  //     const commentsWrapper = document.getElementById('CommentsWrapper');
  //     if (commentsWrapper) {
  //       commentsWrapper.style.setProperty('display', 'none', 'important');
  //     }

  //     // Hide all div elements with the attribute data-automation-id="pageHeader"
  //     const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
  //     pageHeaders.forEach((element: any) => {
  //       element.style.setProperty('display', 'none', 'important');
  //     });

  //     // Show the element with ID "ceoMessageReadMore"
  //     const webPartContainer = document.getElementById('webPartContainer');
  //     if (webPartContainer) {
  //       webPartContainer.style.display = 'none';
  //     }

  //     const spCommandBar = document.getElementById('spCommandBar');
  //     if (spCommandBar) {
  //       spCommandBar.style.setProperty('display', 'none', 'important');
  //     }
  //   }, 2000);
  //   const url: any = new URL(window.location.href);
  //   const FolderUrl = url.searchParams.get("FolderName");
  //   // console.log(FolderUrl);
  //   const Type = url.searchParams.get("Type");
  //   Global_Type = Type;
  //   if (Type == "Img") {
  //     document.querySelectorAll('.image-gallery-allimg-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //     document.querySelectorAll('.video-gallery-allimg-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });

  //     // $(".image-gallery-allimg-block").show();
  //     // $(".video-gallery-allimg-block").hide();
  //   } else {
  //     // $(".image-gallery-allimg-block").hide();
  //     // $(".video-gallery-allimg-block").show();

  //     document.querySelectorAll('.image-gallery-allimg-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });
  //     document.querySelectorAll('.video-gallery-allimg-block').forEach(element => {
  //       (element as HTMLElement).style.display = 'block';
  //     });
  //   }
  //   var folderurl = FolderUrl.replace(/['"]+/g, '');
  //   // Remove trailing slash if it exists
  //   folderurl = folderurl.replace(/\/$/, '');
  //   // Split the URL to get the segments
  //   const segments = folderurl.split('/');
  //   // Get the last segment which is the folder name
  //   const folderName = segments[segments.length - 1];
  //   console.log(folderName); // Output: Test
  //   this.setState({
  //     nav1: this.slider1,
  //     nav2: this.slider2,
  //     Type: Type,
  //     type: Type,
  //     MyFolderName: folderName
  //   });
  //   this.getCurrentUser().then(() => {
  //     this.GetSubFolder(folderurl, Type, "")
  //   }).then(() => {
  //     this.LandingPageAnalytics();
  //   });

  //   GlobalUrl = folderurl
  //   // this.GetGalleryFilesFolder("Main");
  //   if (Type == "Img") {
  //     // $(".vdo-block-cntnt").removeClass("active");
  //     // $(".img-block-cntnt").addClass("active");

  //     const vdoBlockElements = document.querySelectorAll('.vdo-block-cntnt');
  //     vdoBlockElements.forEach(element => {
  //       element.classList.remove('active');
  //     });

  //     // Add the "active" class to all elements with the class "img-block-cntnt"
  //     const imgBlockElements = document.querySelectorAll('.img-block-cntnt');
  //     imgBlockElements.forEach(element => {
  //       element.classList.add('active');
  //     });
  //   } else {
  //     this.ShowVideos()
  //     // $(".img-block-cntnt").removeClass("active");
  //     // $(".vdo-block-cntnt").addClass("active");

  //     const vdoBlockElements = document.querySelectorAll('.vdo-block-cntnt');
  //     vdoBlockElements.forEach(element => {
  //       element.classList.add('active');
  //     });

  //     // Add the "active" class to all elements with the class "img-block-cntnt"
  //     const imgBlockElements = document.querySelectorAll('.img-block-cntnt');
  //     imgBlockElements.forEach(element => {
  //       element.classList.remove('active');
  //     });
  //   }
  //   // $(".img-galler-section-cls ul li").on("click", function () {
  //   //   $(this).siblings().removeClass("active");
  //   //   $(this).addClass("active");
  //   // });
  //   // Select the parent <ul> element under ".img-galler-section-cls"
  //   const ulElement: any = document.querySelector('.img-galler-section-cls ul');

  //   // Attach a single click event listener to the <ul> element
  //   ulElement.addEventListener('click', function (event: any) {
  //     // Check if the clicked target is an <li> element
  //     if (event.target.tagName === 'LI') {
  //       // Remove the "active" class from all sibling <li> elements
  //       const listItems = ulElement.querySelectorAll('li');
  //       listItems.forEach((sibling: { classList: { remove: (arg0: string) => any; }; }) => sibling.classList.remove('active'));

  //       // Add the "active" class to the clicked <li> element
  //       event.target.classList.add('active');
  //     }
  //   });

  // }

  // Optimized code

  public componentDidMount() {
    setTimeout(() => {
      // Hide elements by IDs or attributes
      const selectors = ['#CommentsWrapper', 'div[data-automation-id="pageHeader"]', '#webPartContainer', '#spCommandBar'];
      selectors.forEach(selector => {
        document.querySelectorAll<HTMLElement>(selector).forEach(element => {
          element.style.setProperty('display', 'none', 'important');
        });
      });
    }, 2000);

    const url = new URL(window.location.href);
    const folderUrl = (url.searchParams.get("FolderName")?.replace(/['"]+/g, '').replace(/\/$/, '')) || '';
    const type = url.searchParams.get("Type");
    Global_Type = type;

    // Toggle display and active classes based on type
    this.toggleGallery(type === "Img");

    const folderName = folderUrl.split('/').pop() || '';

    this.setState({

      nav1: this.slider1,
      nav2: this.slider2,
      Type: type,
      type: type,
      MyFolderName: folderName

    });

    this.getCurrentUser()
      .then(() => this.GetSubFolder(folderUrl, type || "", ""))
      .then(() => this.LandingPageAnalytics());

    GlobalUrl = folderUrl;
  }

  // Unified function for toggling gallery display and active classes
  private toggleGallery(isImageType: boolean) {
    const elements = [
      { selector: '.image-gallery-allimg-block', display: isImageType ? 'block' : 'none' },
      { selector: '.video-gallery-allimg-block', display: isImageType ? 'none' : 'block' },
      { selector: '.vdo-block-cntnt', classToggle: !isImageType },
      { selector: '.img-block-cntnt', classToggle: isImageType }
    ];

    elements.forEach(({ selector, display, classToggle }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (display !== undefined) {
          el.style.display = display;
        }
        if (classToggle !== undefined) {
          el.classList.toggle('active', classToggle);
        }
      });
    });

    // Initialize click handler for gallery section
    const ulElement = document.querySelector('.img-galler-section-cls ul');
    if (ulElement) {
      ulElement.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'LI') {
          ulElement.querySelectorAll('li').forEach(li => li.classList.remove('active'));
          target.classList.add('active');
        }
      });
    }
  }

  public loaderInProgress() {
    setTimeout(() => {

      document.querySelectorAll('#load-content').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });

      document.querySelectorAll('#loader-Icon').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });

      // $('#load-content').show()
      // $('#loader-Icon').hide()
    }, 2000);
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
        Category: `Depart-${Dept} GalleryGridView`,
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
      const segment = "SitePages";
      const segmentIndex = fullPath.indexOf(`/${segment}`);
      if (segmentIndex === -1) {
        console.warn("SitePages not found in the URL.");
        return;
      }
      const relevantPart = fullPath.substring(0, segmentIndex);
      const lastSegmentIndex = relevantPart.lastIndexOf('/');
      const lastSegment = relevantPart.substring(lastSegmentIndex + 1);
      Dept = lastSegment;
      var reacthandler = this;
      User = reacthandler.props.userid;
      // Fetch user profile data
      const profile = await pnp.sp.profiles.myProperties.get();
      // Ensure the profile contains necessary information
      if (!profile || !profile.Email || !profile.Title) {
        throw new Error("Incomplete profile data.");
      }
      UserEmail = profile.Email;
      Designation = profile.Title;
      if (profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string }) => prop.Key === 'Department');
        console.log(departmentProperty);
        if (departmentProperty) {
          Department = departmentProperty.Value;
        } else {
          console.warn("Department property not found in user profile.");
        }
      } else {
        console.warn("UserProfileProperties is empty or undefined.");
      }
    } catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
  }


  // public async getCurrentUser() {
  //   const url: any = new URL(window.location.href);
  //   const fullPath = url.pathname;
  //   // Find the index of 'SitePages'
  //   const segment = "SitePages";
  //   const segmentIndex = fullPath.indexOf(`/${segment}`);
  //   if (segmentIndex === -1) {
  //     // If 'SitePages' is not found in the URL, return null
  //     // return null;
  //   }
  //   // Extract the part of the URL before 'SitePages'
  //   const relevantPart = fullPath.substring(0, segmentIndex);
  //   // Find the last segment before 'SitePages'
  //   const lastSegmentIndex = relevantPart.lastIndexOf('/');
  //   // Extract the last segment
  //   const lastSegment = relevantPart.substring(lastSegmentIndex + 1);
  //   Dept = lastSegment;
  //   var reacthandler = this;
  //   User = reacthandler.props.userid;
  //   const profile = await pnp.sp.profiles.myProperties.get();
  //   UserEmail = profile.Email;
  //   Designation = profile.Title;
  //   // Check if the UserProfileProperties collection exists and has the Department property
  //   if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
  //     // Find the Department property in the profile
  //     const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
  //     console.log(departmentProperty);
  //     if (departmentProperty) {
  //       Department = departmentProperty.Value;
  //     }
  //   }
  // }

  public async GetSubFolder(FolderURL: any, type: any, foldername: any) {
    // $("#no-img").hide();
    // $("#no-video").hide();

    // document.querySelectorAll('#no-img').forEach(element => {
    //   (element as HTMLElement).style.display = 'none';
    // });
    // document.querySelectorAll('#no-video').forEach(element => {
    //   (element as HTMLElement).style.display = 'block';
    // });
    this.setState({
      Subfolderurl: FolderURL,
      Images: [],
      Videos: [],
      Folders: [],
    });

    try {
      if (foldername !== "Handleclick") {
        Breadcrumb.push({ "Title": foldername, "Url": FolderURL });
      }
      if (foldername == "Breadcrumb") {
        // IsclickeBreadcrump=false  
        Breadcrumb = [];
      }
      const folder = sp.web.getFolderByServerRelativeUrl(FolderURL);
      const [files, folders] = await Promise.all([
        folder.files.select("ID", "Name", "ServerRelativeUrl", "TimeCreated").get(),
        folder.folders.select("ID", "Name", "ServerRelativeUrl").get()
      ]);

      // Check if both files and folders arrays are empty
      if (files.length === 0 && folders.length === 0) {
        // Handle the case where the folder is empty
        if (type === "Img") {
          // $("#no-img").show();
          document.querySelectorAll('#no-img').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });

        } else {
          // $("#no-video").show();
          document.querySelectorAll('#no-video').forEach(element => {
            (element as HTMLElement).style.display = 'block';
          });

        }
        // Exit the function since there's nothing more to do
        return;
      }

      // Continue processing files and folders if the folder is not empty

      if (files.length !== 0) {
        const images = files.filter((file: any) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.Name));
        const videos = files.filter((file: any) => /\.(mp4|avi|mov|wmv|flv|avchd|webm|mkv)$/i.test(file.Name));

        if (type === "Img") {

          const noImgElement = document.getElementById('no-img');
          // Toggle visibility based on the condition
          if (noImgElement) {
            noImgElement.style.display = images.length === 0 ? 'block' : 'none';
          }
          const noVdoElement = document.getElementById('no-video');
          // Toggle visibility based on the condition
          if (noVdoElement) {
            noVdoElement.style.display = images.length === 0 && videos.length === 0 ? 'block' : 'none';
          }
          // $("#no-img").toggle(images.length === 0);
          // $("#no-video").toggle(images.length === 0 && videos.length === 0);
        } else {


          // $("#no-video").toggle(videos.length === 0);
          // $("#no-img").toggle(images.length === 0 && videos.length === 0);

          const noImgElement = document.getElementById('no-video');
          // Toggle visibility based on the condition
          if (noImgElement) {
            noImgElement.style.display = images.length === 0 ? 'block' : 'none';
          }
          const noVdoElement = document.getElementById('no-img');
          // Toggle visibility based on the condition
          if (noVdoElement) {
            noVdoElement.style.display = images.length === 0 && videos.length === 0 ? 'block' : 'none';
          }
        }

        this.setState({
          Images: images,
          Videos: videos
        });
      }

      if (folders.length !== 0) {
        // $("#no-img").hide();
        // $("#no-video").hide();

        document.querySelectorAll('#no-img').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        }); document.querySelectorAll('#no-video').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        const updatedFolders = await Promise.all(folders.map(async (folderItem: any) => {
          try {
            if (folderItem.Name !== "_t" && folderItem.Name !== "_w") {
              const folderFiles = await sp.web.getFolderByServerRelativeUrl(folderItem.ServerRelativeUrl)
                .files.select("ID", "Name", "ServerRelativeUrl", "TimeCreated").get();

              folderFiles.sort((a: any, b: any) => new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime());
              const images = folderFiles.filter((file: any) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.Name));
              const videos = folderFiles.filter((file: any) => /\.(mp4|avi|mov|wmv|flv|avchd|webm|mkv)$/i.test(file.Name));
              const recentMedia = type === "Img" ? (images.length > 0 ? images[0].ServerRelativeUrl : `${this.props.siteurl}/SiteAssets/img/empty_folder_v2.svg`) : (videos.length > 0 ? videos[0].ServerRelativeUrl : "");

              return {
                ...folderItem,
                recentImage: recentMedia
              };

            } else {
              return folderItem;
            }
          } catch (error) {
            console.error('Error fetching folder media:', error);
            return folderItem;
          }
        }));

        this.setState({
          Folders: updatedFolders
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      // Handle error if needed
    }
  }

  public async ShowImages() {
    Breadcrumb = [];
    this.setState({
      Images: [],
      Videos: [],
    });
    Global_Type = "Img"
    await this.setState({ type: "Img" });
    document.querySelectorAll('.image-gallery-allimg-block').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });

    document.querySelectorAll('.image-gallery-allimg-block').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    // $(".image-gallery-allimg-block").show();
    // $(".video-gallery-allimg-block").hide();
    const url: any = new URL(window.location.href);

    const FolderUrl = url.searchParams.get("FolderName");
    // console.log(FolderUrl);

    var folderurl = FolderUrl.replace(/['"]+/g, '')
    this.GetSubFolder(folderurl, "Img", "")
    // this.GetGalleryFilesFolder("ImgBlock");
  }
  public async ShowVideos() {
    Breadcrumb = [];
    this.setState({
      Images: [],
      Videos: [],
    });
    Global_Type = "";
    // $("#lightgallery").hide();
    document.querySelectorAll('#lightgallery').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    await this.setState({ type: "Video" });
    document.querySelectorAll('.image-gallery-allimg-block').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
    document.querySelectorAll('.video-gallery-allimg-block').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });
    // $(".image-gallery-allimg-block").hide();
    // $(".video-gallery-allimg-block").show();
    const url: any = new URL(window.location.href);

    const FolderUrl = url.searchParams.get("FolderName");
    // console.log(FolderUrl);

    var folderurl = FolderUrl.replace(/['"]+/g, '')
    this.GetSubFolder(folderurl, "VdoBlock", "")
    // this.GetGalleryFilesFolder("VdoBlock");
  }

  public GetImagesInsideFolder(FolderURL: string, Mode: string, key: number) {
    const FolderUrl = FolderURL.replace(/['"]+/g, '');
    const reactHandler = this;

    this.setState({ FolderURL: FolderUrl, SliderIsOpen: true, Mode: Mode });

    // Show or hide triggers based on mode
    if (Mode === "Image") {
      // $("#trigger-image").hide();
      // $("#trigger-video").show();

      document.querySelectorAll('#trigger-image').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      document.querySelectorAll('#trigger-video').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
    } else if (Mode === "Video") {
      // $("#trigger-video").hide();
      // $("#trigger-image").show();
      document.querySelectorAll('#trigger-video').forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      document.querySelectorAll('#trigger-image').forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
    }

    // Fetch files from the specified folder URL
    try {
      sp.web.getFolderByServerRelativeUrl(FolderUrl).files.get()
        .then(async (items) => {
          // Filter files based on mode (image or video)
          const imageItems = items.filter((item) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.Name));
          const videoItems = items.filter((item) => /\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/i.test(item.Name));

          // If mode is "Image" and there are video files, hide image trigger
          if (Mode === "Image" && videoItems.length === 0) {
            // $("#trigger-video").hide();
            document.querySelectorAll('#trigger-video').forEach(element => {
              (element as HTMLElement).style.display = 'none';
            });
          }

          // If mode is "Video" and there are no video files, hide video trigger
          if (Mode === "Video" && imageItems.length === 0) {
            // $("#trigger-image").hide();
            document.querySelectorAll('#trigger-image').forEach(element => {
              (element as HTMLElement).style.display = 'none';
            });
          }

          // Set the folder items in the state and open the lightbox
          reactHandler.setState({ FolderItems: Mode === "Image" ? imageItems : videoItems });
          // $(".lightbox").addClass("open");

          const lightboxElement = document.querySelector('.lightbox');

          // Add the "open" class to the selected element
          if (lightboxElement) {
            lightboxElement.classList.add('open');
          }
          // Navigate to the specified key in the slider
          reactHandler.slider1.slickGoTo(key);
        })
        .catch((error) => {
          console.error('Error fetching folder items:', error);
          // Handle error if needed
          if (Mode === "Video") {
            // $("#trigger-video").hide();
            document.querySelectorAll('#trigger-video').forEach(element => {
              (element as HTMLElement).style.display = 'none';
            });
          }
        });
    }
    catch (error) {
      console.error('Error fetching folder items:', error);
    }
  }

  public ShowHideVideos(FolderURL: string, Mode: any) {
    const FolderPath = FolderURL.replace(/[']/g, '');
    const FolderServerRelativeUrl = `${FolderPath}`;
    this.setState({ FolderURL: FolderURL, Mode: Mode });
    const lightboxElement = document.querySelector('.lightbox');
    if (lightboxElement) {
      lightboxElement.classList.add('open');
    }
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
      lightboxElement.classList.remove('open');
    }

    this.setState({ SliderIsOpen: false, FolderItems: [] })
  }
  public handleClick = (Name: any, key: any, ClickFrom: any, e: any, gFolderUrl: any) => {
    if (ClickFrom == "Breadcrumb") {
      var IndexValue = key;
      for (var i = 0; i < Breadcrumb.length; i++) {
        if (i > IndexValue) {
          Breadcrumb.splice(i);
        }
      }
      // this.GetSubFolderFromBreadcrumb(gFolderUrl, Global_Type, Name);
      this.GetSubFolder(gFolderUrl, Global_Type, "Handleclick");

    }
    else {

      Breadcrumb.push({ "Title": Name, "Url": gFolderUrl });
    }
  }


  public render(): React.ReactElement<IDeptGalleryGridViewProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: () =>
        this.setState(state => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current: any, next: any) => this.setState({ slideIndex: next })
    };


    const Images: JSX.Element[] = this.state.Images
      .filter(item => {
        const filename = item.Name;
        const ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
        return !validExtensions.has(ext);
      })
      .map((item, key) => {
        const finalThumbnailURL = getThumbnailUrl(item.ServerRelativeUrl);
        // console.log("Original URL:", item.ServerRelativeUrl);
        // console.log("Thumbnail URL:", finalThumbnailURL);

        return (
          <li key={key} className="li-img-area" data-value={key} onClick={() => reactHandler.GetImagesInsideFolder(reactHandler.state.Subfolderurl, "Image", key)}>
            <img src={finalThumbnailURL} alt="Image" onError={(e) => e.currentTarget.src = `${this.props.siteurl}/Site%20Asset/Remo%20Portal%20Assets/img/Error%20Handling%20Images/other_images_not_found.png`} />
            {/* <img src={finalThumbnailURL} alt="Image" /> */}

          </li>
        );
      });

    const Folder: JSX.Element[] = this.state.Folders.map(function (item, key) {
      if (item) {
        if (item.Name != "_t" && item.Name != "_w") {
          return (
            <li className="li-img-area" data-value={key} onClick={() => reactHandler.GetSubFolder(item.ServerRelativeUrl, Global_Type, item.Name)}>

              {/* <img src={`${item.recentImage}`} alt="Image" id={`mythumb-${key}`} /> */}
              {Global_Type === "Img" ? (
                // Render image if Global_Type is "Img"
                <img src={item.recentImage} alt="Image" id={`mythumb-${key}`} />
              ) : (
                item.recentImage ? (
                  <video src={item.recentImage} controls id={`mythumb-${key}`} />
                ) : (
                  // Render default image if there is no video
                  <img src={`${reactHandler.props.siteurl}/SiteAssets/img/empty_folder_v2.svg`} alt="Default Image" id={`mythumb-${key}`} />
                )
              )}
              {item.Name}
            </li>
          );
        }
      }
      return null;
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`

    const Videos: JSX.Element[] = this.state.Videos.filter(item => {
      const filename = item.Name;
      const Dot = filename.lastIndexOf(".");
      const ext = filename.substring(Dot + 1).toLowerCase();
      const validExtensions: any = ["mp4", "mov", "wmv", "flv", "avi", "avchd", "webm", "mkv"];
      return validExtensions.includes(ext);
    })
      .map((item, key) => (
        <li key={key} className="li-video-area" onClick={() => { reactHandler.GetImagesInsideFolder(reactHandler.state.Subfolderurl, "Video", key); reactHandler.slider1.slickGoTo(key) }}>
          <video className="lg-video-object lg-html5">
            <source src={item.ServerRelativeUrl} type="video/mp4" />
          </video>
        </li>
      ));

    const MAslider2: JSX.Element[] = this.state.FolderItems.map((item, key) => {
      if (reactHandler.state.Mode === "Image") {
        const filename = item.Name;
        const completeurl = item.ServerRelativeUrl;
        const Dot = filename.lastIndexOf(".");
        const ext = filename.substring(Dot + 1).toLowerCase();
        const validExtensions: any = ["mp4", "mov", "wmv", "flv", "avi", "avchd", "webm", "mkv"];
        if (!validExtensions.includes(ext)) {
          return (
            <li key={key}>
              <a href="#" data-interception="off">
                <img src={completeurl} alt="image" />
              </a>
            </li>
          );
        }
      } else if (reactHandler.state.Mode === "Video") {
        return (
          <li key={key}>
            <a href="#" data-interception="off">
              <video className="lg-video-object lg-html5">
                <source src={item.ServerRelativeUrl} type="video/mp4" />
              </video>
            </a>
          </li>
        );
      }
      return null; // Handle other modes or invalid cases
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className={styles.remoHomePage} id="galleryGridView">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={"https://remodigital.sharepoint.com/sites/DemoIntranet1"} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Gallery Grid View </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/Gallery-View-More.aspx`} data-interception="off"> Gallery Folders </a> </li>
                    <li>  <a href="off" style={{ pointerEvents: "none" }}> Grid View </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents gallery-viewall-imgs">
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="img-galler-section-cls">
                          <ul>
                            <li className="img-block-cntnt">
                              <a href="#" onClick={() => this.ShowImages()}> Images </a>
                            </li>
                            <li className="vdo-block-cntnt">  <a href="#" onClick={() => this.ShowVideos()}> Videos </a>  </li>
                            <div>
                              <ul className="breadcums clearfix Sub_breadcums" >
                                <li className='home'> <a onClick={() => reactHandler.GetSubFolder(GlobalUrl, Global_Type, "Breadcrumb")} > {reactHandler.state.MyFolderName} </a></li>
                                {Breadcrumb.map((item: any, key: any) => (
                                  <li className='folder' id={`${key}-folder`}>
                                    <a className="O" id="b-d-crumb" data-index={key} onClick={(e) => this.handleClick(item.Title, key, "Breadcrumb", e, item.Url)}>
                                      <span> {item.Title} </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="section-part clearfix latest-events-bck" id="no-video" style={{ display: "none" }}>
                              <div className="clearfix img-block-area">
                                <img className="err-img" src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-Video-uploaded" />
                              </div>
                            </div>
                            <div className="section-part clearfix latest-events-bck" id="no-img" style={{ display: "none" }}>
                              <div className="clearfix img-block-area">
                                <img className="err-img" src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />
                              </div>
                            </div>
                          </ul>

                        </div>
                        <div className="section-part clearfix">
                          <ul className="clearfix image-gallery-allimg-block" id="lightgallery" style={{ display: "none" }}>
                            {Images}
                            {Folder}
                          </ul>
                          <ul className="clearfix video-gallery-allimg-block" id="videogallery" style={{ display: "none" }}>
                            {Videos}
                            {Folder}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

            </div>
          </div>
          <div className="lightbox">
            <div className="gallery-lightbox-contents">
              <div className="lightbox-contents-img">
                <div className="lightbox-contents-header clearfix">
                  <ul>
                    <li id="trigger-image" className={this.state.Mode == "Image" ? "imageblock" : ""} > <a href="#" onClick={() => this.GetImagesInsideFolder(this.state.FolderURL, "Image", 0)}> Images  </a> </li>
                    <li id="trigger-video" className={this.state.Mode == "Video" ? "videoblock" : ""} > <a href="#" onClick={() => this.GetImagesInsideFolder(this.state.FolderURL, "Video", 0)}> Videos  </a> </li>
                    {/*<li> <a href={this.props.siteurl+"/SitePages/Gallery-Grid-View.aspx?FolderName='"+this.state.FolderURL+"'&Type=Img&env=WebViewList"} data-interception="off"> Grid View  </a> </li>*/}
                  </ul>
                </div>
                <div className="lightbox-contents-body">
                  {this.state.SliderIsOpen && (
                    <Slider
                      {...settings}
                      // asNavFor={this.state.nav2}
                      asNavFor={this.state.nav2 as Slider | undefined}
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
                        // asNavFor={this.state.nav1}
                        asNavFor={this.state.nav1 as Slider | undefined}
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
                              slidesToShow: 3,
                              slidesToScroll: 1,
                              infinite: false,
                              dots: false,
                              arrows: false,
                              autoplay: false,
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
                  <img src={`${this.props.siteurl}/SiteAssets/img/close.svg`} alt="close" onClick={() => this.CloseLightBox()} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <RemoResponsive siteurl={"https://remodigital.sharepoint.com/sites/DemoIntranet1"} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
