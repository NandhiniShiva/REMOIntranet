import * as React from 'react';
import { IRemoDeptLandingPageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/sites";
// import * as $ from 'jquery';
import { IWeb, Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import pnp from 'sp-pnp-js';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';

let AboutDepartmentlist = listNames.AboutDepartment;

export interface IAboutDepartmentState {
  Items: any[];
}
var NewWeb: IWeb & IInvokable<any>
export default class AboutDepartment extends React.Component<IRemoDeptLandingPageProps, IAboutDepartmentState, {}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IAboutDepartmentState) {
    super(props);
    pnp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      Items: []
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }

  public componentDidMount() {

    this.GetDepartmentAbout();

  }

  // private GetDepartmentAbout() {
  //   var reactHandler = this;
  //   NewWeb.lists.getByTitle(AboutDepartmentlist).items.select("ID", "Title", "Description", "DepartmentBannerImage", "*").filter(`IsActive eq 1`).orderBy("Created", false).top(1).get().then((items) => {
  //     if (items.length == 0) {
  //       // $("#if-about-present").hide();
  //       // $("#if-no-about-present").show();

  //       document.querySelectorAll('#if-about-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       }); document.querySelectorAll('#if-no-about-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //     } else {
  //       // $("#if-about-present").show();
  //       // $("#if-no-about-present").hide();

  //       document.querySelectorAll('#if-about-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       }); document.querySelectorAll('#if-no-about-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       reactHandler.setState({
  //         Items: items
  //       });
  //     }
  //   });
  // }
  // Updated code 

  private async GetDepartmentAbout() {
    try {
      const reactHandler = this;
      const items = await NewWeb.lists
        .getByTitle(AboutDepartmentlist)
        .items.select("ID", "Title", "Description", "DepartmentBannerImage", "*")
        .filter(`IsActive eq 1`)
        .orderBy("Created", false)
        .top(1)
        .get();

      if (items.length === 0) {
        document.querySelectorAll('#if-about-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-about-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      } else {
        document.querySelectorAll('#if-about-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-about-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });

        reactHandler.setState({
          Items: items
        });
      }
    } catch (error) {
      console.error("Error fetching department information:", error);
    }
  }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    var reactHandler = this;
    const AboutDept: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.DepartmentBannerImage;

      if (RawImageTxt && RawImageTxt != null) {
        try {
          var ImgObj = JSON.parse(RawImageTxt);
          var serverRelativeUrl = ImgObj.serverRelativeUrl || `${reactHandler.props.siteurl}/Lists/${AboutDepartmentlist}/Attachments/` + item.ID + "/" + ImgObj.fileName;

          return (
            <div className="col-md-12 m-b-0 clearfix" key={key}>
              <div className="department-detailsi-img">
                <img src={serverRelativeUrl} alt="image" />
              </div>
              <div className="department-detailsi-conts">
                <h2>{item.Title}</h2>
                <p><Markup content={item.Description} /></p>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error parsing image data:', error);
          return null; // Render nothing if there's an error parsing image data
        }
      } else {
        return null; // Render nothing if image data is empty or null
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (
      <div className="relative">
        <div className="section-rigth section_hr">
          <div className="inner-banner-header relative m-b-20">
            <div className="inner-banner-overlay"></div>
            <div className="inner-banner-contents">
              <h1> Department </h1>
              <ul className="breadcums">
                <li>  <a href={`${this.props.homepage}/SitePages/HomePage.aspx`} data-interception="off" > Home </a> </li>
                <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> {this.props.PageName} </a> </li>
              </ul>
            </div>
          </div>
          <div className="inner-page-contents">
            <div className="sec">
              <div className="row" style={{ display: "none" }} id="if-about-present">
                {AboutDept}
              </div>

              <div className="row" style={{ display: "none" }} id="if-no-about-present">
                <div className="col-md-12 m-b-0 clearfix">
                  <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-content"></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
