import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { ISPFXContext } from '@pnp/common';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
// import * as $ from 'jquery';
import Slider from "react-slick";
import { sp } from "@pnp/sp/presets/all";
import { listNames } from '../Configuration';

let Newslist = listNames.News;

export interface INewsState {
  Items: any[];
  ItemCount: number;
}

export default class RemoNews extends React.Component<IRemoHomePageProps, INewsState, {}> {
  slider: Slider;
  spfxContext: ISPFXContext;
  constructor(props: IRemoHomePageProps, state: INewsState) {
    super(props);
    sp.setup({
      spfxContext: this.spfxContext
    });
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      Items: [],
      ItemCount: 2
    };
  }

  public componentDidMount() {

    var reactHandler = this;
    reactHandler.GetNews();

  }
  private async GetNews() {
    var reactHandler = this;
    await sp.web.lists.getByTitle(Newslist).items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "*").filter("IsActive eq 1").orderBy("Created", false).expand("Dept", "SitePageID").get().then((items) => {
      if (items.length == 0) {
        // $("#if-news-present").hide();
        // $("#if-no-news-present").show();

        document.querySelectorAll('#if-news-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-news-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      } else {
        // $("#if-news-present").show();
        // $("#if-no-news-present").hide();

        document.querySelectorAll('#if-news-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-news-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      }
      if (items.length <= 1) {
        reactHandler.setState({ ItemCount: 1 });
      } else {
        reactHandler.setState({ ItemCount: 2 });
      }
      reactHandler.setState({
        Items: items
      });
    });
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
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
    var viewall = `${this.props.siteurl}/SitePages/NewsViewMore.aspx?`;
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
      }
      if (item.SitePageID != undefined) {
        sitepageid = item.SitePageID.Id; // Define here
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
              <h4>  <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off">{item.Title}</a> </h4>
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      } else {
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="no-image-uploaded" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href={`${reactHandler.props.siteurl}/SitePages/NewsReadMore.aspx?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&`} data-interception="off">{item.Title}</a> </h4>
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      }
    });



    return (
      <div className={[styles.remoHomePage, "m-b-15 m-b-20-news"].join(' ')} id="m-b-20-news">
        <div className="news-wrap m-b-20">
          <div className="sec event-cal">
            <div className="heading clearfix ">
              <h4>
                <a href={viewall}>
                  News
                </a>
              </h4>
              <div className="prev-next">
                <a href="#" onClick={this.previous} ><img src={`${this.props.siteurl}/SiteAssets/img/previous.svg`} alt="image" className="prev-img" /> </a>
                <a href="#" onClick={this.next}><img src={`${this.props.siteurl}/SiteAssets/img/next-2.svg`} alt="image" className="next-img" /> </a>
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
        </div>
      </div>
    )
  }
}