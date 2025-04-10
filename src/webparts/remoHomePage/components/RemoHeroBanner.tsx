import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { sp, Web } from "@pnp/sp/presets/all";
import Slider from "react-slick";
import { listNames, WEB } from '../Configuration';
// import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';
let Hero_Bannerlist = listNames.Hero_Banner;
let NewWeb: any = Web(WEB.NewWeb);
var IsAdminUser: boolean = false;
var IsMode: string = "add_mode";
var IsDraggable: boolean = true;
// var Count: number = 0;


console.log('NewWeb', NewWeb);

enum ResolutionCategory {
  Low,
  Medium,
  High
}

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
  currentSlide: number;
  AnncCount: number;
  TotalItem: number;
  isDataAvailable: boolean;
  componentMasterItems: any[];
  selectedValue: string;
  progress: any,
  isCreatingLists: boolean,
  loadContent: boolean,
  currentList: any,
  showProgessar: boolean
}

export default class HeroBanner extends React.Component<IRemoHomePageProps, IHeroBannerState, {}> {
  constructor(props: IRemoHomePageProps) {
    super(props);
    const [isAdmin, Mode, Dragmode] = this.props.description.split(',').map(value => value.trim());
    IsAdminUser = Boolean(isAdmin);
    IsMode = Mode;
    IsDraggable = Boolean(Dragmode);
    console.log("iscurrentuserisanadmi:", IsAdminUser, "Iseditmode:", IsMode);

    this.state = {
      Items: [],
      currentSlide: 0, // tracks current active slide
      AnncCount: 0,
      TotalItem: 0,
      isDataAvailable: false,
      componentMasterItems: [],
      selectedValue: "",
      progress: 0,
      isCreatingLists: false,
      loadContent: false,
      currentList: "",
      showProgessar: false

    };
  }

  public async componentDidMount() {
    // console.log('Component Name', this.props.name);
    const listCreation = new ListCreation();
    listCreation.createSharePointLists(Hero_Bannerlist);
    await this.hideProgessbar()
    this.GetBanner();
  }


  public hideProgessbar() {
    this.setState({
      showProgessar: false
    })
  }
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


  public async getComponent() {
    try {


      const items = await sp.web.lists
        .getByTitle("ComponentMaster")
        .items
        .select("Title", "*")
        // .filter(`IsActive eq '1'`)
        // .orderBy("Created", false)
        .getAll();

      console.log("ComponentMaster item", items);
      this.setState({
        componentMasterItems: items
      })

    } catch (error) {
      console.log("Error in getlayout", error);

    }
  }
  public async handleSelectChange(event: any) {
    console.log("selected option", event.target.value);

    this.setState({
      selectedValue: event.target.value
    })
  };
  public Validate() {
    const total = this.state.AnncCount;
    this.setState({ TotalItem: total });
  }

  public addData(event: any) {
    event.preventDefault();
    // const listUrl = `${NewWeb}/Lists/${Hero_Bannerlist}`; // Replace with your list URL
    const listUrl = `${this.props.siteurl}/Lists/${Hero_Bannerlist}`;
    console.log(listUrl);

    // const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${Hero_Bannerlist}`; // Replace with your list URL
    window.open(listUrl, "_blank");
  }

  public readMoreHandler(compName: any, itemId: any) {
    this.props.onReadMoreClick({ Name: compName, Id: itemId })
  }
  goToPrevSlide = () => {
    this.setState((prevState) => ({
      currentSlide: Math.max(prevState.currentSlide - 1, 0)
    }));
  };

  goToNextSlide = () => {
    this.setState((prevState) => ({
      currentSlide: Math.min(prevState.currentSlide + 1, this.state.Items.length - 1)
    }));
  };

  goToSlide = (index: number) => {
    this.setState({ currentSlide: index });
  };

  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 2500,
      autoplay: (IsAdminUser && IsMode == "edit") ? false : true,
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
            {/* <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'> */}
            <a href='#' onClick={() => (IsMode !== "edit") && this.readMoreHandler("HeroBannerReadMore", ID)} data-interception='off'>
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
            {/* <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'> */}
            <a href='#' onClick={() => this.readMoreHandler("HeroBannerReadMore", ID)} data-interception='off'>

              <div className="banner-parts">
                <img src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/home_banner_noimage.png")} alt="image" />
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

    const MAsliderEdit: JSX.Element[] = this.state.Items.map(
      ({ ID, Title, Image, Description }, index) => {
        let RawImageTxt = Image;
        let dummyElement = document.createElement("DIV");
        dummyElement.innerHTML = Description;
        let outputText = dummyElement.innerText;

        let serverRelativeUrl = "";
        if (RawImageTxt) {
          const ImgObj = JSON.parse(RawImageTxt);
          serverRelativeUrl =
            ImgObj.serverRelativeUrl ||
            `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${ID}/${ImgObj.fileName}`;
        } else {
          serverRelativeUrl = require("./ServiceProvider/Assets/Img/ErrorHandlingImages/home_banner_noimage.png");
        }
        // Show only the active slide
        if (index !== this.state.currentSlide) return null;

        return (
          <>
            {/* <div className="item active" style={{ width: "100%", display: "inline-block;" }}>
              <div className="banner-parts">
                <img src="https://remodigital.sharepoint.com/sites/RemoIntranetProduct/Lists/Hero Banner/Attachments/2/Reserved_ImageAttachment_[5]_[Image][32]_[dd26242bcf494fc99db6845ad9520c65][1]_[1].jpg" alt="image" data-themekey="#" />
                <div className="banner-impot-contents">
                  <h4>Test banner 1</h4><p>Test banner 2</p>
                </div>
              </div>
            </div> */}

            <div className="item active" style={{ width: "100%", display: "inline-block;" }}>
              <div className="banner-parts">
                <img src={serverRelativeUrl} alt="image" data-themekey="#" />
                <div className="banner-impot-contents">
                  <h4>{Title}</h4>
                  <p>{outputText}</p>
                </div>
                {this.state.Items.length > 1 && (
                  <>
                    {this.state.currentSlide > 0 && (
                      <button
                        className="hero-banner-btn prev-btn"
                        onClick={this.goToPrevSlide}
                      >
                        ‹
                      </button>
                    )}
                    {this.state.currentSlide < this.state.Items.length - 1 && (
                      <button
                        className="hero-banner-btn next-btn"
                        onClick={this.goToNextSlide}
                      >
                        ›
                      </button>
                    )}
                    <div className="hero-banner-dots">
                      {this.state.Items.map((_, dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`dot ${dotIndex === this.state.currentSlide ? "active" : ""}`}
                          onClick={() => this.goToSlide(dotIndex)}
                        ></span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        );
      }
    ).filter(Boolean) as JSX.Element[];


    return (
      <div className="col-md-12 herobanner">
        {this.state.isDataAvailable === true ? (
          IsMode === "edit" ? (
            <>
              {/* <div className="item active" style={{width: "100%", display: "inline-block;"}}><div className="banner-parts"><img src="https://remodigital.sharepoint.com/sites/RemoIntranetProduct/Lists/Hero Banner/Attachments/2/Reserved_ImageAttachment_[5]_[Image][32]_[dd26242bcf494fc99db6845ad9520c65][1]_[1].jpg" alt="image" data-themekey="#"/><div className="banner-impot-contents"><h4>Test banner 1</h4><p>Test banner 2</p></div></div></div> */}
              {/* <div className="hero-banner-image-wrapper"><img src="https://remodigital.sharepoint.com/sites/RemoIntranetProduct/Lists/Hero Banner/Attachments/1/Reserved_ImageAttachment_[5]_[Image][32]_[a40c51a79a7b4751b7c2765200e173fe][2]_[14].jpg" alt="banner" className="hero-banner-image" data-themekey="#" /></div><div className="hero-banner-content"><h4 className="hero-banner-title">Test banner</h4><p className="hero-banner-description">Test banner data</p></div> */}
              {MAsliderEdit}
            </>
          ) : (
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div id="if-Banner-Exist" className="hero-banner-container-wrap">
                  <Slider
                    {...settings}
                    draggable={IsDraggable}
                    swipe={IsDraggable}
                    className="hero-banner-container-wrap"
                  >
                    {MAslider}
                  </Slider>
                </div>
                <div
                  id="if-Banner-not-Exist"
                  className="background"
                  style={{ display: this.state.TotalItem === 0 ? "block" : "none" }}
                >
                  <img
                    className="err-img"
                    src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/If_no_Content_to_show.png")}
                    alt="no-image-uploaded"
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          <div id="if-Banner-Exist" className="hero-banner-container-wrap">
            <button onClick={(e) => this.addData(e)}>Add Data</button>
          </div>
        )}
      </div>
    );

  }
}
