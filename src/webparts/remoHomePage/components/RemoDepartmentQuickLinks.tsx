import * as React from 'react';
import { IRemoDeptLandingPageProps } from './IRemoHomePageProps';
// import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { IWeb, Web } from "@pnp/sp/webs";
import { IInvokable } from '@pnp/odata';
import { listNames } from '../../remoHomePage/Configuration';

let QuickLinkslist = listNames.QuickLinks;

export interface IDepartmentQuickLinkState {
  QuickLinkData: any[];
}
var NewWeb: IWeb & IInvokable<any>
export default class DepartmentQuickLink extends React.Component<IRemoDeptLandingPageProps, IDepartmentQuickLinkState, {}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IDepartmentQuickLinkState) {
    super(props);
    this.state = {
      QuickLinkData: []
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }

  public componentDidMount() {
    var reacthandler = this;
    reacthandler.getcurrentusersQuickLinks();

  }

  public getcurrentusersQuickLinks() {
    var reactHandler = this;
    NewWeb.lists.getByTitle(QuickLinkslist).items.select("ID", "Title", "URL", "HoverOffIcon", "HoverOnIcon", "OpenInNewTab", "*").filter(`IsActive eq 1`).top(5).orderBy("Order0", true).get().then((items) => {
      reactHandler.setState({
        QuickLinkData: items
      });
      if (items.length == 0) {
        // $(".if-no-qlinks-present").show();
        // $(".if-qlinks-present").hide();

        document.querySelectorAll('.if-no-qlinks-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
        document.querySelectorAll('.if-qlinks-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      } else {
        // $(".if-no-qlinks-present").hide();
        // $(".if-qlinks-present").show();

        document.querySelectorAll('.if-no-qlinks-present').forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('.if-qlinks-present').forEach(element => {
          (element as HTMLElement).style.display = 'block';
        });
      }
    });
  }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    var reactHandler = this;
    const DeptQuickLinks: JSX.Element[] = this.state.QuickLinkData.map((item, key) => {
      const { HoverOffIcon, HoverOnIcon, URL, Title, ID } = item;

      if (HoverOffIcon && HoverOnIcon && URL && URL.Url && Title) {
        const ImgObj = JSON.parse(HoverOffIcon);
        const ImgObj2 = JSON.parse(HoverOnIcon);

        const serverRelativeUrl = ImgObj.serverRelativeUrl || `${reactHandler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/${ID}/${ImgObj.fileName}`;
        const serverRelativeUrl2 = ImgObj2.serverRelativeUrl || `${reactHandler.props.siteurl}/Lists/${QuickLinkslist}/Attachments/${ID}/${ImgObj2.fileName}`;

        return (
          <li key={key}>
            <a href={URL.Url} target="_blank" data-interception="off" className="clearfix">
              <img src={serverRelativeUrl} alt="image" className="quick-def" />
              <img src={serverRelativeUrl2} alt="image" className="quick-hov" />
              <p>{Title}</p>
            </a>
          </li>
        );
      }
    })
      .filter((element): element is JSX.Element => element !== null);  // Filter out `null`


    return (

      <div className="relative">
        <div className="section-rigth section_hr">
          <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
            <div className="sec">
              <div className="heading">
                Quick Links
              </div>
              <div className="section-part clearfix if-qlinks-present">
                <ul>
                  {DeptQuickLinks}
                </ul>
              </div>

              <div className="section-part clearfix if-no-qlinks-present" style={{ display: "none" }}>
                <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-content"></img>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
