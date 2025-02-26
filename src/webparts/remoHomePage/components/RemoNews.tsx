import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { ISPFXContext } from '@pnp/common';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import Slider from "react-slick";
import { sp } from "@pnp/sp/presets/all";
import { listNames } from '../Configuration';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';

let Newslist = listNames.News;
let Location: any = '';

export interface INewsState {
  Items: any[];
  ItemCount: number;
  isDataAvailable: boolean
}

export default class RemoNews extends React.Component<IRemoHomePageProps, INewsState, {}> {
  slider: Slider;
  spfxContext: ISPFXContext;
  constructor(props: IRemoHomePageProps, state: INewsState) {
    super(props);
    Location = this.props.description;
    console.log(this.props.description);

    sp.setup({
      spfxContext: this.spfxContext
    });
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      Items: [],
      ItemCount: 2,
      isDataAvailable: false
    };
  }

  public componentDidMount() {
    const listCreation = new ListCreation();
    listCreation.createSharePointLists(Newslist);
    var reactHandler = this;
    reactHandler.CheckLocation();
    reactHandler.GetNews();

  }

  public CheckLocation() {
    if (Location === 1 || Location === 5 || Location === 10) {
      this.setState({ ItemCount: 3 });
    } else if (Location === 2 || Location === 11 || Location === 12 || Location === 6 || Location === 7) {
      this.setState({ ItemCount: 1 });
    } else if (Location === 3) {
      this.setState({ ItemCount: 4 });
    } else {
      this.setState({ ItemCount: 2 });
    }

  }


  // updated code 
  private async GetNews() {
    try {
      const reactHandler = this;
      const items = await sp.web.lists
        .getByTitle(Newslist)
        .items.select(
          "ID",
          "Title",
          "Description",
          "Created",
          "Dept/Title",
          "Image",
          "Tag",
          "DetailsPageUrl",
          "SitePageID/Id",
          "*"
        )
        .filter("IsActive eq 1")
        .orderBy("Created", false)
        .expand("Dept", "SitePageID")
        .get();

      const showNewsPresent = items.length > 0;

      document.querySelectorAll('#if-news-present').forEach(element => {
        (element as HTMLElement).style.display = showNewsPresent ? 'block' : 'none';
      });
      document.querySelectorAll('#if-no-news-present').forEach(element => {
        (element as HTMLElement).style.display = showNewsPresent ? 'none' : 'block';
      });

      reactHandler.setState({
        Items: items,
        isDataAvailable: true,
      });
    } catch (error) {
      console.error("Error fetching news items: ", error);
    }
  }


  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  public addData(event: any) {
    event.preventDefault();
    const listUrl = `${this.props.siteurl}/Lists/${Newslist}`;
    window.open(listUrl, "_blank");
  }
  public readMoreHandler(compName: any, itemId: any) {
    this.props.onReadMoreClick({ Name: compName, Id: itemId })
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: false,
      //arrows: true,
      infinite: true,
      speed: 500,
      autoplay: false,
      slidesToShow: this.state.ItemCount, //Value Comes From State
      slidesToScroll: 2,

    };
    // var viewall = `${this.props.siteurl}/SitePages/NewsViewMore.aspx?`;
    var reactHandler = this;
    var Dt = "";
    const Newsslider: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      var depttitle; // Declare here
      var sitepageid; // Declare here
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + RawPublishedDt + "";
      }
      if (item.Dept != undefined) {
        depttitle = item.Dept.Title; // Define here
        console.log("depttitle", depttitle);

      }
      if (item.SitePageID != undefined) {
        sitepageid = item.SitePageID.Id; // Define here
        console.log("sitepageid", sitepageid);

      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var serverRelativeUrl;
        if (ImgObj.serverRelativeUrl == undefined) {
          serverRelativeUrl = `${reactHandler.props.siteurl}/Lists/${Newslist}/Attachments/` + item.ID + "/" + ImgObj.fileName;
        } else {
          serverRelativeUrl = ImgObj.serverRelativeUrl;
        }
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${serverRelativeUrl}`} alt="image" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href='#' onClick={() => reactHandler.readMoreHandler("NewsReadMore", item.ID)} data-interception="off">{item.Title}</a> </h4>

              <h5> <img src={require("./ServiceProvider/Assets/Img/clock.svg")} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      } else {
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={require("./ServiceProvider/Assets/Img/ErrorHandlingImages/home_news_noimage.png")}  alt="no-image-uploaded" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href='#' onClick={() => reactHandler.readMoreHandler("NewsReadMore", item.ID)} data-interception="off">{item.Title}</a> </h4>

              <h5> <img src={require("./ServiceProvider/Assets/Img/clock.svg")}  alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      }
    });



    return (
      <div className="col-md-12 news">
        <div className={[styles.remoHomePage, "m-b-15 m-b-20-news"].join(' ')} id="m-b-20-news">
          <div className="news-wrap m-b-20">
            {this.state.isDataAvailable == true ?
              <div className="sec event-cal">
                <div className="heading clearfix ">
                  <h4>
                    {/* <a href={viewall}> */}
                    <a href='#' onClick={() => this.readMoreHandler("NewsViewMore", null)}
                    >

                      News
                    </a>
                  </h4>
                  <div className="prev-next">
                    <a href="#" onClick={this.previous} ><img src={require("./ServiceProvider/Assets/Img/previous.svg")}  alt="image" className="prev-img" /> </a>
                    <a href="#" onClick={this.next}><img src={require("./ServiceProvider/Assets/Img/next-2.svg")} alt="image" className="next-img" /> </a>
                  </div>
                </div>
                <div className="section-part clearfix">
                  <div className="news-section-wrap clearfix" >
                    <Slider ref={c => (this.slider = c!)} {...settings} className='hero-banner-container-wrap'>
                      {Newsslider}
                    </Slider>
                  </div>
                </div>
              </div>
              :
              <div>
                <button onClick={(e) => this.addData(e)}>Add Data</button>
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}