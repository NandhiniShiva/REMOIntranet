import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IHeroBannerViewMoreProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import * as $ from 'jquery';
import * as moment from 'moment';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp from 'sp-pnp-js';
import ReactPaginate from 'react-paginate';

let Hero_Bannerlist = listNames.Hero_Banner;
let Designation: any;
let Department: any;

export interface IHeroBannerVmState {
  Items: any[];
  ItemID: any;
  Title: string;
  currentPage: number;
  pageCount: number;
  searchQuery: string;
  filteredItems: any[];
}


export default class HeroBannerViewMore extends React.Component<IHeroBannerViewMoreProps, IHeroBannerVmState> {
  constructor(props: IHeroBannerViewMoreProps) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null,
      Title: "",
      currentPage: 0,
      pageCount: 0,
      searchQuery: '',
      filteredItems: [],
    };
  }

  // public componentDidMount() {
  //   setTimeout(function () {
  //     // $('#spCommandBar').attr('style', 'display: none !important');
  //     // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
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

  //     const spCommandBar = document.getElementById('spCommandBar');
  //     if (spCommandBar) {
  //       spCommandBar.style.setProperty('display', 'none', 'important');
  //     }
  //   }, 2000);

  //   this.getCurrentUser().then(() => {
  //     this.GetBanner();
  //   });
  // }

  // Optimized code
  public componentDidMount() {
    setTimeout(() => {
      this.hideElement('#CommentsWrapper');
      this.hideElement('#spCommandBar');
      const pageHeaders: any = document.querySelectorAll('div[data-automation-id="pageHeader"]');
      pageHeaders.forEach((element: any) => {
        element.style.setProperty('display', 'none', 'important');
      });

    }, 2000);

    this.getCurrentUser().then(() => {
      this.GetBanner();
    });


  }

  // Helper function to hide an element by its ID
  private hideElement(selector: string) {
    const element = document.querySelector(selector);
    if (element) {
      (element as HTMLElement).style.setProperty('display', 'none', 'important');
    }
  }


  public async getCurrentUser() {
    try {
      const profile = await pnp.sp.profiles.myProperties.get();
      Designation = profile.Title;
      if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
        const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
        if (departmentProperty) {
          Department = departmentProperty.Value;
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching the user profile:", error);
    }
  }

  public async LandingPageAnalytics() {
    if (!Department) {
      Department = "NA";
    }
    if (!Designation) {
      Designation = "NA";
    }

    try {
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  private async GetBanner() {
    try {
      const d = new Date().toISOString();
      const items = await sp.web.lists.getByTitle(Hero_Bannerlist).items.select("Title", "Description", "Created", "Image", "ID", "*").filter(`IsActive eq 1 and ExpiresOn ge datetime'${d}'`).get();
      const itemsPerPage = 6;
      const pageCount = Math.ceil(items.length / itemsPerPage);
      this.setState({
        Items: items,
        filteredItems: items,
        pageCount: pageCount,
      });
    }
    catch (error) {
      console.error("An error occurred while fetching the user Banner:", error);
    }
  }

  private handlePageClick = (data: { selected: number }) => {
    this.setState({ currentPage: data.selected });
  };

  public handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredItems = this.state.Items.filter(item =>
      item.Title.toLowerCase().includes(searchQuery)
    );

    this.setState({
      searchQuery,
      filteredItems,
      currentPage: 0,
      pageCount: Math.ceil(filteredItems.length / 1), // Adjust items per page if needed
    });
  };

  public render(): React.ReactElement<IHeroBannerViewMoreProps> {
    const { currentPage, filteredItems, searchQuery } = this.state;
    const itemsPerPage = 6;
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredItems.slice(offset, offset + itemsPerPage);

    const BannerAllDetails: JSX.Element[] = currentItems.map((item, key) => {
      const { Image, Description, Created, ID, Title } = item;
      const dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = Description;
      const RawPublishedDt = moment(Created).format("DD/MM/YYYY");
      let Dt;

      const tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt === tdaydt) {
        Dt = "Today";
      } else {
        Dt = moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");
      }

      let serverRelativeUrl;
      if (Image && Image !== "") {
        const ImgObj = JSON.parse(Image);
        serverRelativeUrl = ImgObj.serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${ID}/${ImgObj.fileName}`;
      } else {
        serverRelativeUrl = `${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`;
      }

      return (
        <li key={key}>
          <div className="top-img-wrap">
            <img src={serverRelativeUrl} alt="image" />
          </div>
          <a href="#" className="tags" data-interception="off">{Dt}</a>
          <div className="ns-tag-duration">
            <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off' className="nw-list-main top-news-a">{Title}</a>
          </div>
        </li>
      );
    });

    return (
      <div className={styles.remoHomePage} id="heroBannerVm">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Home Banner </h1>
                  <ul className="breadcums">
                    <li> <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home</a> </li>
                    <li> <a href="#" style={{ pointerEvents: "none" }} data-interception="off">Hero Banner View More </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents banner-viewall">
                <div className="search-bar">
                  <label>
                    <img src={`${this.props.siteurl}/SiteAssets/img/search-solid.svg`} />
                    <input
                      type="text"
                      id="searchText"
                      placeholder="Search"
                      onChange={this.handleSearchChange}
                      value={searchQuery}
                    />
                  </label>
                </div>
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="section-part clearfix">
                          <ul>
                            {BannerAllDetails.length > 0 ? BannerAllDetails : <p>No search results match your query.</p>}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='pagination_center'>
                      <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={''} createList={false} name={''} />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
