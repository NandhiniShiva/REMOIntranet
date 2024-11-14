import * as React from 'react';
import { IRemoDeptLandingPageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import * as $ from 'jquery';
import { IWeb, Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';

let Serviceslist = listNames.Services;

export interface IDepartmentServicesState {
  Items: any[];
  ServiceDescription: string;
  isDataAvailable: boolean
}
var NewWeb: IWeb & IInvokable<any>
export default class DepartmentServices extends React.Component<IRemoDeptLandingPageProps, IDepartmentServicesState, {}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IDepartmentServicesState) {
    super(props);
    this.state = {
      Items: [],
      ServiceDescription: "",
      isDataAvailable: false
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }

  public componentDidMount() {
    this.GetDepartmentServices();



  }

  // private GetDepartmentServices() {
  //   var reactHandler = this;
  //   NewWeb.lists.getByTitle(Serviceslist).items.select("ID", "Title", "Description").filter(`IsActive eq 1`).orderBy("Order0", true).get().then((items) => {
  //     if (items.length == 0) {
  //       // $("#if-service-present").hide();
  //       // $("#if-no-service-present").show();

  //       document.querySelectorAll('#if-service-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       document.querySelectorAll('$("#if-no-service-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //     } else {
  //       // $("#if-service-present").show();
  //       // $("#if-no-service-present").hide();

  //       document.querySelectorAll('#if-service-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'block';
  //       });
  //       document.querySelectorAll('#if-no-service-present').forEach(element => {
  //         (element as HTMLElement).style.display = 'none';
  //       });
  //       reactHandler.setState({
  //         Items: items,
  //         ServiceDescription: items[0].Description
  //       });
  //     }
  //   });
  // }

  // Updated code 
  private async GetDepartmentServices() {
    try {
      const items = await NewWeb.lists
        .getByTitle(Serviceslist)
        .items.select("ID", "Title", "Description")
        .filter(`IsActive eq 1`)
        .orderBy("Order0", true)
        .get();

      if (items.length === 0) {
        // Hide service present section, show no-service section
        document.querySelectorAll('#if-service-present').forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('#if-no-service-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });
      } else {
        // Show service present section, hide no-service section
        document.querySelectorAll('#if-service-present').forEach((element) => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('#if-no-service-present').forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });

        // Update state with items and description
        this.setState({
          Items: items,
          ServiceDescription: items[0].Description,
          isDataAvailable: true
        });
      }
    } catch (error) {
      console.error("Error fetching department services:", error);
    }
  }


  public LoadServiceDescription(ItemID: any) {

    var reactHandler = this;
    NewWeb.lists.getByTitle(Serviceslist).items.select("ID", "Title", "Description").filter(`ID eq ${ItemID}`).get().then((items) => {
      reactHandler.setState({
        ServiceDescription: items[0].Description
      });
    });
  }
  public addData() {
    const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${Serviceslist}`; // Replace with your list URL
    window.open(listUrl, "_blank");
  }

  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    // $(document).ready(function () {
    //   $("#service-main li").on("click", function () {
    //     $(this).siblings().removeClass("active");
    //     $(this).addClass("active");

    //   });
    // })

    document.addEventListener("DOMContentLoaded", function () {
      const listItems = document.querySelectorAll("#service-main li");

      listItems.forEach(function (item) {
        item.addEventListener("click", function () {
          // Remove "active" class from all siblings
          listItems.forEach(function (sibling) {
            sibling.classList.remove("active");
          });

          // Add "active" class to the clicked item
          item.classList.add("active");
        });
      });
    });

    var reactHandler = this;
    const DeptServices: JSX.Element[] = this.state.Items.map(function (item, key) {
      if (key == 0) {
        return (
          <li className="active" onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      } else {
        return (
          <li onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      }
    });
    return (

      <div className="relative">
        <div className="section-rigth section_hr">
          {this.state.isDataAvailable == true ?
            <div className="depat-key-people m-b-20">
              <div className="sec">
                <div className="heading">
                  Our Services
                </div>
                <div className="section-part clearfix" id="if-service-present">

                  <div className="ourservices-left">
                    <ul id="service-main">
                      {DeptServices}
                    </ul>
                  </div>
                  <div className="ourservices-right">
                    <p> <Markup content={this.state.ServiceDescription} /> </p>
                  </div>

                </div>
                <div className="row" style={{ display: "none" }} id="if-no-service-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-content"></img>
                  </div>
                </div>
              </div>
            </div>
            :
            <div>
              <button onClick={() => this.addData()}>Add Data Services</button>
            </div>
          }
        </div>
      </div>

    );
  }
}
