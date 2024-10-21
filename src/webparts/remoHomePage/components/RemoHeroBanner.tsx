import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { sp } from "@pnp/sp/presets/all";
import Slider from "react-slick";
import { listNames } from '../Configuration';
// import ProgressBar from 'react-bootstrap/ProgressBar';
let Hero_Bannerlist = listNames.Hero_Banner;

enum ResolutionCategory {
  Low,
  Medium,
  High
}

// function classifyImageResolution(width: number, height: number): ResolutionCategory {
//   const resolution = width * height;

//   if (resolution < 1000000) { // less than 1 MP
//     return ResolutionCategory.Low;
//   } else if (resolution < 3000000) { // between 1 MP and 3 MP
//     return ResolutionCategory.Medium;
//   } else { // greater than or equal to 3 MP
//     return ResolutionCategory.High;
//   }
// }

async function getImageResolution(imageUrl: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageUrl;
  });
}

export interface IHeroBannerState {
  Items: any[];
  AnncCount: number;
  TotalItem: number;
  isDataAvailable: boolean
}

export default class HeroBanner extends React.Component<IRemoHomePageProps, IHeroBannerState, {}> {
  constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      AnncCount: 0,
      TotalItem: 0,
      isDataAvailable: false
    };
  }

  public componentDidMount() {
    this.GetBanner();
    // this.getDeviceType()
  }
  //    public getDeviceType  (){
  //     const ua = navigator.userAgent;
  //     console.log(navigator);

  //   console.log(ua);

  //     // Mobile detection
  //     if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
  //       alert("Mobile")
  //       return 'Mobile';
  //     }

  //     // Tablet detection
  //    else if (/iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua)) {
  //       alert("Tablet")
  // //      return 'Tablet';
  //     }
  //     else{
  //       alert("Desktop")
  //     }

  //     // Default to Desktop
  //    // return 'Desktop';
  //   };
  // private async GetBannerold() {
  //   const d = new Date().toISOString();
  //   try {
  //     const items = await sp.web.lists.getByTitle(Hero_Bannerlist).items.select("Title", "Description", "ExpiresOn", "Image", "ID", "*")
  //     .filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`).orderBy("Created", false).getAll();

  //     const updatedItems = await Promise.all(items.map(async (item) => {
  //       let resolutionCategory = ResolutionCategory.Low; // Default category
  //       if (item.Image) {
  //         const ImgObj = JSON.parse(item.Image);
  //         const serverRelativeUrl = ImgObj.serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${ImgObj.fileName}`;
  //         try {
  //           const { width, height } = await getImageResolution(serverRelativeUrl);
  //           const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';

  //           console.log(serverRelativeUrl, width, height, orientation);


  //         } catch (error) {
  //           console.error("Error retrieving image resolution:", error);
  //         }
  //       }
  //       return {
  //         ...item,
  //         resolutionCategory
  //       };
  //     }));

  //     this.setState({
  //       Items: updatedItems,
  //       AnncCount: updatedItems.length
  //     });

  //     this.Validate();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // new code
  private async GetBanner() {
    const d = new Date().toISOString();
    try {
      const items = await sp.web.lists
        .getByTitle(Hero_Bannerlist)
        .items
        .select("Title", "Description", "ExpiresOn", "Image", "ID", "*")
        .filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`)
        .orderBy("Created", false)
        .getAll();


      const updatedItems = await Promise.all(items.map(async (item) => {
        const resolutionCategory = ResolutionCategory.Low; // Default category

        if (item.Image) {
          const { serverRelativeUrl, fileName } = JSON.parse(item.Image);
          const url = serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${fileName}`;

          try {
            const { width, height } = await getImageResolution(url);
            console.log(url, width, height, width > height ? 'landscape' : width < height ? 'portrait' : 'square');
          } catch (error) {
            console.error("Error retrieving image resolution:", error);
          }
        }
        return { ...item, resolutionCategory };
      }));

      if (updatedItems.length != 0) {
        this.setState({
          isDataAvailable: true
        })
      } else {
        alert("not")
        this.setState({
          isDataAvailable: false
        })
      }
      this.setState({
        Items: updatedItems,
        AnncCount: updatedItems.length
      });

      this.Validate();
    } catch (err) {
      console.error(err);
    }
  }

  public Validate() {
    const total = this.state.AnncCount;
    this.setState({ TotalItem: total });
  }

  public addData() {
    const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${Hero_Bannerlist}`; // Replace with your list URL
    window.open(listUrl, "_blank");
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 2500,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const MAslider: JSX.Element[] = this.state.Items.map(({ ID, Title, Image, Description, resolutionCategory }) => {
      let RawImageTxt = Image;
      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = Description;
      var outputText = dummyElement.innerText;

      let resolutionClass = '';
      switch (resolutionCategory) {
        case ResolutionCategory.Low:
          resolutionClass = 'low-resolution';
          break;
        case ResolutionCategory.Medium:
          resolutionClass = 'medium-resolution';
          break;
        case ResolutionCategory.High:
          resolutionClass = 'high-resolution';
          break;
      }

      if (RawImageTxt) {
        var ImgObj = JSON.parse(RawImageTxt);
        var serverRelativeUrl = ImgObj.serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${ID}/${ImgObj.fileName}`;

        return (
          <div className={`item active ${resolutionClass}`} key={ID}>
            <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={serverRelativeUrl} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4>{Title}</h4>
                  <p>{outputText}</p>
                </div>
              </div>
            </a>
          </div>
        );
      } else {
        return (
          <div className={`item ${resolutionClass}`} key={ID}>
            <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={`${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4>{Title}</h4>
                  <p>{outputText}</p>
                </div>
              </div>
            </a>
          </div>
        );
      }
    });

    return (
      <div className="col-md-8">
        {this.state.isDataAvailable == true ?
          <div id="myCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div id="if-Banner-Exist" className='hero-banner-container-wrap'>
                <Slider {...settings} className='hero-banner-container-wrap' >
                  {MAslider}
                </Slider>
              </div>
              <div id="if-Banner-not-Exist" className="background" style={{ display: this.state.TotalItem === 0 ? "block" : "none" }}>
                <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/If_no_Content_to_show.png`} alt="no-image-uploaded" />
              </div>
            </div>
          </div>
          :
          <div>
            <button onClick={() => this.addData()}>Add Data</button>
          </div>
        }
      </div>
    );
  }
}
