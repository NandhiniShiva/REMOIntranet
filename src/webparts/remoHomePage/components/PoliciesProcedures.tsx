import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IPoliciesProceduresProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from 'sp-pnp-js';
import GlobalSideNav from '../../remoHomePage/components/Header/GlobalSideNav';
import { listNames } from '../../remoHomePage/Configuration';

let PolicyandProcedureMasterlist = listNames.PolicyandProcedureMaster;

export interface IPoliciesProcedureState {
  items: any[];
}

export default class PoliciesProcedures extends React.Component<IPoliciesProceduresProps, IPoliciesProcedureState> {
  public constructor(props: IPoliciesProceduresProps) {
    super(props);
    this.state = {
      items: [],
    };
  }

  public componentDidMount() {
    this.GetDocumentCenterLinks();
  }
  // Updated code
  public async GetDocumentCenterLinks() {
    try {
      const { UserId } = this.props;
      const results = await sp.web.lists.getByTitle(PolicyandProcedureMasterlist).items
        .select('*,Title,HoverOnImage,AccessibleTo/Title,HoverOffImage,URL')
        .expand('AccessibleTo')
        .filter(`IsActive eq 1 and AccessibleTo/Id eq ${UserId}`)
        .orderBy('Order0', true)
        .get();
      this.setState({
        items: results
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  public render(): React.ReactElement<IPoliciesProceduresProps> {
    const { items } = this.state;
    return (
      <div className={styles.remoHomePage}>
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="relative">
            <div className="section-rigth"></div>
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Policy & Procedure </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Policy &amp; Procedure </a> </li>
                </ul>
              </div>
            </div>
            <div className="direct-conttent-sreas">
              <div className="sec">
                <ul className="clearfix">
                  {items.map((item, key) => {
                    let Title = item.Title;
                    let RawImageTxt = item.HoverOnImage;
                    let RawHoverOffImage = item.HoverOffImage;
                    if (RawImageTxt != "" && RawHoverOffImage != "") {
                      var ImgObj = JSON.parse(RawImageTxt);
                      var ImgObjHoverImage = JSON.parse(RawHoverOffImage);
                      if (ImgObj.serverRelativeUrl == undefined) {
                        var serverRelativeUrl = `${this.props.siteurl}/Lists/${PolicyandProcedureMasterlist}/Attachments/` + item.ID + "/" + ImgObj.fileName
                      } else {
                        serverRelativeUrl = ImgObj.serverRelativeUrl
                      }
                      if (ImgObjHoverImage.serverRelativeUrl == undefined) {
                        var hoverserverRelativeUrl = `${this.props.siteurl}/Lists/${PolicyandProcedureMasterlist}/Attachments/` + item.ID + "/" + ImgObjHoverImage.fileName
                      } else {
                        hoverserverRelativeUrl = ImgObjHoverImage.serverRelativeUrl
                      }
                      return (
                        <li key={key}>
                          <a href={`${item.URL.Url}`} data-interception="off" target="_blank">
                            <img className="DarkImage" src={hoverserverRelativeUrl} alt="image" />
                            <img className="LightImage" src={serverRelativeUrl} alt="image" />
                            <p>{Title}</p>
                          </a>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

