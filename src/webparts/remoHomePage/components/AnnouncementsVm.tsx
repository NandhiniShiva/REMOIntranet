import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IAnnouncementsVmProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../remoHomePage/components/Header/RemoResponsive';
import { listNames } from '../../remoHomePage/Configuration';
import Footer from '../../remoHomePage/components/Footer/Footer';
import pnp from 'sp-pnp-js';
import { Web } from '@pnp/sp/webs';
import ReactPaginate from 'react-paginate';

const Announcementlist = listNames.Announcement;
const Analytics = listNames.Analytics;
let NewWeb: any;

export interface IAnnouncementsVmState {
  Items: any[];
  currentUser: any;
  Department: string;
  Designation: string;
  UserEmail: string;
  currentPage: number;
  pageCount: number;
  searchQuery: string;
  filteredItems: any[];
}

export default class AnnouncementsVm extends React.Component<IAnnouncementsVmProps, IAnnouncementsVmState> {
  constructor(props: IAnnouncementsVmProps) {
    super(props);
    this.state = {
      Items: [],
      currentUser: null,
      Department: 'NA',
      Designation: 'NA',
      UserEmail: '',
      currentPage: 0,
      pageCount: 0,
      searchQuery: '',
      filteredItems: [],
    };
    NewWeb = Web(`${this.props.siteurl}`);
  }

  public async componentDidMount() {
    // Hide elements after 2 seconds (adjust as needed)
    this.hideElements();
    // setTimeout(() => {
    //   $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    //   $('#spCommandBar').attr('style', 'display: none !important');
    //   $('#CommentsWrapper').attr('style', 'display: none !important');
    // }, 2000);

    await this.getCurrentUser();
    this.GetAllAnnouncements();
    this.LandingPageAnalytics();
  }

  private hideElements() {
    const elements: any = document.querySelectorAll('#spCommandBar, div[data-automation-id="pageHeader"], #CommentsWrapper');
    elements.forEach((element: { style: { display: string; }; }) => {
      element.style.display = 'none';
    });
  }

  private async getCurrentUser() {
    try {
      const profile = await pnp.sp.profiles.myProperties.get();
      console.log('User Profile:', profile); // Debug log

      const userEmail = profile.Email || "No Email";
      const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
      const department = departmentProperty && departmentProperty.Value !== "" ? departmentProperty.Value : "NA";
      const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Title');
      const designation = designationProperty ? designationProperty.Value : "NA";

      this.setState({
        currentUser: this.props.userid,
        UserEmail: userEmail,
        Department: department,
        Designation: designation
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  private async GetAllAnnouncements() {
    try {
      const items = await sp.web.lists.getByTitle(Announcementlist).items.select("*", "Title", "Image", "ID", "Created").filter("IsActive eq 1").getAll();
      const itemsPerPage = 6;
      const pageCount = Math.ceil(items.length / itemsPerPage);

      this.setState({
        Items: items,
        filteredItems: items,
        pageCount: pageCount
      });
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }

  private async LandingPageAnalytics() {
    const { currentUser, UserEmail, Department, Designation } = this.state;
    const ItemId = "NA";

    try {
      await NewWeb.lists.getByTitle(Analytics).items.add({
        Category: "Announcements View-More",
        UserId: currentUser,
        Department: Department,
        Designation: Designation,
        Title: "NA",
        ItemId: ItemId,
        UserEmail: UserEmail,
      });
    } catch (error) {
      console.error('Error logging analytics data:', error);
    }
  }

  handlePageClick = (data: { selected: number }) => {
    this.setState({ currentPage: data.selected });
  };

  public SearchChild = (keyword: string) => {
    const searchQuery = keyword.toLowerCase();
    const { Items } = this.state;

    const filteredItems = Items.filter(item =>
      item.Title.toLowerCase().includes(searchQuery)
    );

    this.setState({
      searchQuery,
      filteredItems,
      currentPage: 0,
      pageCount: Math.ceil(filteredItems.length / 1) // Assuming 6 items per page
    });
  };

  public render(): React.ReactElement<IAnnouncementsVmProps> {
    const { currentPage, filteredItems } = this.state;
    const itemsPerPage = 6;
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredItems.slice(offset, offset + itemsPerPage);

    const AnncAllDetails: JSX.Element[] = currentItems.map((item, key) => {
      let RawImageTxt = item.Image;
      const RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      const tdaydt = moment().format("DD/MM/YYYY");
      const Dt = RawPublishedDt === tdaydt ? "Today" : moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY");

      let serverRelativeUrl = `${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`;

      if (RawImageTxt && RawImageTxt !== "") {
        const ImgObj = JSON.parse(RawImageTxt);
        serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${this.props.siteurl}/Lists/${Announcementlist}/Attachments/${item.ID}/${ImgObj.fileName}`;
      }

      return (
        <li key={key}>
          <div className="top-img-wrap">
            <img src={serverRelativeUrl} alt="image" />
          </div>
          <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off">{Dt}</a>
          <div className="ns-tag-duration">
            <a href={`${this.props.siteurl}/SitePages/Announcement-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="nw-list-main top-news-a">{item.Title}</a>
          </div>
        </li>
      );
    });

    return (
      <div className={styles.remoHomePage}> <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="relative container">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1>Announcements</h1>
                  <ul className="breadcums">
                    <li><a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off">Home</a></li>
                    <li><a href="#" data-interception="off" style={{ pointerEvents: "none" }}>All Announcements</a></li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents banner-viewall">
                <div className="search-bar">
                  <label>
                    <img src={`${this.props.siteurl}/SiteAssets/img/search-solid.svg`} alt="Search Icon" />
                    <input
                      type="text"
                      id="searchText"
                      placeholder="Search"
                      onKeyUp={(e) => this.SearchChild(e.currentTarget.value)}
                    />
                  </label>
                </div>
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="section-part clearfix">
                          <ul id="Files-Data">
                            {filteredItems.length > 0 ? AnncAllDetails : <p>No search results match your query.</p>}
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
              <Footer siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} createList={false} name={''}  />

            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
