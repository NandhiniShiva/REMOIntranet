import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IOrganizationChartProps } from './IRemoHomePageProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

export default class OrganizationChart extends React.Component<IOrganizationChartProps> {
  public componentDidMount() {
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/css/OrgChartStyle.css`);
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/css/style.css?v=1.2`);
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/css/responsive.css`);
    this.getGraphDataFromList();
    this.saveData();
  }

  private async getGraphDataFromList() {
    const response = await fetch(`${this.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$top=1000&$select=ID,Title,Name,Email,Designation,Manager_code,Manager_name,Employee_status,UserProfileUrl&$filter=Employee_status eq 'Active'`, {
      headers: {
        "Accept": "application/json;odata=verbose",
      }
    });
    const data = await response.json();
    if (data.d.results.length > 0) {
      const nodes = data.d.results.map((employee: any) => ({
        id: employee.Title,
        pid: employee.Manager_code || "0",
        Name: employee.Name,
        Designation: employee.Designation,
        "Manager Name": employee.Manager_name || "None",
        Picture: employee.UserProfileUrl.Url
      }));
      this.generateChart(nodes);
    }
  }

  private async generateChart(nodes: any[]) {
    const OrgChart = await import(`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/External/MasterOrganizationChart.js`);
    const chart = new OrgChart(document.getElementById("OrgChart"), {
      template: "ula",
      showXScroll: OrgChart.scroll.visible,
      layout: OrgChart.mixed,
      mouseScrool: OrgChart.action.none,
      scaleInitial: 0.8,
      zoom: { speed: 30, smooth: 10 },
      toolbar: { zoom: true, fullScreen: true },
      collapse: { level: 2, allChildren: true },
      nodeBinding: { field_0: "Name", field_1: "Designation", img_0: "Picture" },
      nodes
    });

    chart.on('expcollclick', (sender: any, isCollpasing: any, id: any, ids: any) => {
      if (!isCollpasing) {
        const collapseIds = [];
        const clickedNode = chart.getNode(id);
        let neighbor = clickedNode.leftNeighbor;
        while (neighbor) {
          collapseIds.push(...neighbor.childrenIds);
          neighbor = neighbor.leftNeighbor;
        }
        neighbor = clickedNode.rightNeighbor;
        while (neighbor) {
          collapseIds.push(...neighbor.childrenIds);
          neighbor = neighbor.rightNeighbor;
        }
        chart.collapse(id, collapseIds, () => {
          chart.expand(id, clickedNode.childrenIds);
        });
        return false;
      }
    });
  }
  

  private saveData() {
    document.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('btnSavetoList')) {
        alert("Data saved!");
      }
    });
  }

  public render(): React.ReactElement<IOrganizationChartProps> {
    return (
      <div className={styles.remoHomePage}>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1>Organization Chart </h1>
                  <ul className="breadcums">
                    <li><a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off">Home</a></li>
                    <li><a href="#" style={{ pointerEvents: "none" }} data-interception="off">Org.Chart</a></li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div id='OrgChart' style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
