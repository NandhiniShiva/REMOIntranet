import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { sp } from '@pnp/sp';
import { listNames } from '../Configuration';

let UsersQuickLinkslist = listNames.UsersQuickLinks;
let QuickLinkslist = listNames.QuickLinks;

export interface IQuickLinkState {
  MyQuickLinksPrefference: any[];
}

export default class RemoQuickLinks extends React.Component<IRemoHomePageProps, IQuickLinkState, {}> {
  public constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      MyQuickLinksPrefference: [],
    };
  }

  public componentDidMount() {
    var reacthandler = this;
    reacthandler.getcurrentusersQuickLinks();


  }

  public async getcurrentusersQuickLinks() {
    var reactHandler = this;
    let UserID = reactHandler.props.userid;
    await sp.web.lists.getByTitle(UsersQuickLinkslist).items.select("ID", "SelectedQuickLinks/Title", "URL", "ImageSrc", "HoverImageSrc", "Order0", "SelectedQuickLinks/Id", "Author/Id").filter(`Author/Id eq '${UserID}'`).expand("SelectedQuickLinks", "Author").top(5).orderBy("Order0", true).get().then(async (items) => { // //orderby is false -> decending          
      let activeQuickLinks = await sp.web.lists.getByTitle(QuickLinkslist).items.select("ID").filter("IsActive eq '1'").get();

      // Store the IDs of active Quicklinks in a Set for efficient lookups
      const activeQuickLinkIds = new Set(activeQuickLinks.map((link) => link.Id));

      // Filter out Quicklinks from the "UsersQuickLinks" list that are not active in the "Quick Links" list
      let updatedQuickLinks = items.filter((item) => activeQuickLinkIds.has(item.SelectedQuickLinks.Id));

      reactHandler.setState({
        MyQuickLinksPrefference: updatedQuickLinks
      });
    });
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const QuickLinks: JSX.Element[] = this.state.MyQuickLinksPrefference.map((item, key) => (
      <li key={key}>
          <a href={item.URL} target="_blank" className="clearfix">
              <img src={item.ImageSrc} className="quick-def" />
              <img src={item.HoverImageSrc} className="quick-hov" />
              <p>{item.SelectedQuickLinks.Title}</p>
          </a>
      </li>
  ));
  
    return (
      <div className={[styles.remoHomePage, "m-b-20 if-no-qlinks"].join(' ')} id="m-b-20-PQlink">
        <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
          <div className="sec">
            <div className="heading clearfix">
              <div className="heading-left">
                Quick Links
              </div>
              <div className="heading-right">
                <a href={`${reactHandler.props.siteurl}/SitePages/Manage-Quick-Links.aspx?`} data-interception="off"> Manage Quick Links</a>
              </div>

            </div>

            <div className="section-part clearfix">
              <ul id="result">
                {QuickLinks}
              </ul>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

