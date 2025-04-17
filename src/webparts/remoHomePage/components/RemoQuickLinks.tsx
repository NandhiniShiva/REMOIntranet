import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { sp } from '@pnp/sp';
import { listNames } from '../Configuration';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';

let UsersQuickLinkslist = listNames.UsersQuickLinks;
let QuickLinkslist = listNames.QuickLinks;
const Listtobecreated: any[] = [UsersQuickLinkslist, QuickLinkslist];


export interface IQuickLinkState {
  MyQuickLinksPrefference: any[];
  isDataAvailable: boolean;
}

export default class RemoQuickLinks extends React.Component<IRemoHomePageProps, IQuickLinkState, {}> {
  public constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      MyQuickLinksPrefference: [],
      isDataAvailable: false
    };
  }

  public componentDidMount() {
    var reacthandler = this;
    const listCreation = new ListCreation();
    Listtobecreated.forEach((Item) => {
      listCreation.createSharePointLists(Item)
        .then(() => console.log(`List ${Item} created successfully`))
        .catch((error) => console.error(`Failed to create list ${Item}:`, error));
    });
    reacthandler.getcurrentusersQuickLinks();


  }

  public async getcurrentusersQuickLinks() {
    try {
      const { userid: UserID } = this.props;

      // Fetch user-specific quick links and active quick links concurrently
      const [userQuickLinks, activeQuickLinks] = await Promise.all([
        sp.web.lists
          .getByTitle("UsersQuickLinks")
          .items.select(
            "ID",
            "Title",
            "Order0",
            "ImageSrc",
            "HoverImageSrc",
            "URL",
            "SelectedQuickLinks/ID",  // Fetch lookup ID
            "SelectedQuickLinks/Title", // Fetch lookup title
            "Created",
            "Modified",
            "Author/ID",  // Fetch created by (person field)
            "Editor/Title"   // Fetch modified by (person field)
          )
          .filter(`Author/Id eq '${UserID}'`)
          .expand("SelectedQuickLinks", "Author", "Editor")
          .orderBy("Order0", true) // Order by Order0 in ascending order
          .get(),
        sp.web.lists
          .getByTitle(QuickLinkslist)
          .items.select("ID")
          .filter("IsActive eq '1'")
          .get()
      ]);

      // Create a Set of active quick link IDs for efficient lookup
      const activeQuickLinkIds = new Set(activeQuickLinks.map(link => link.ID));

      // Filter user quick links to only include active ones
      const updatedQuickLinks = userQuickLinks.filter(item =>
        activeQuickLinkIds.has(item.SelectedQuickLinks.ID)
      );

      // Update the state with the filtered quick links
      if (updatedQuickLinks.length != 0) {
        this.setState({
          MyQuickLinksPrefference: updatedQuickLinks,
          isDataAvailable: true
        });

      }

    } catch (error) {
      console.error("Error fetching user quick links:", error);
    }
  }

  public addData(event: any) {
    event.preventDefault();
    const listUrl = `${this.props.siteurl}/Lists/${UsersQuickLinkslist}`;
    window.open(listUrl, "_blank");
  }
  public readMoreHandler(compName: any) {
    this.props.onReadMoreClick({ Name: compName })
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    const QuickLinks: JSX.Element[] = this.state.MyQuickLinksPrefference.map((item, key) => {
      const ImgObj = JSON.parse(item.ImageSrc);
      const serverRelativeUrl = ImgObj.serverRelativeUrl ?? `${this.props.siteurl}/Lists/${UsersQuickLinkslist}/Attachments/${item.ID}/${ImgObj.fileName}`;
      const ImgObjonHover = JSON.parse(item.HoverImageSrc);
      const serverRelativeUrlonHover = ImgObjonHover.serverRelativeUrl ?? `${this.props.siteurl}/Lists/${UsersQuickLinkslist}/Attachments/${item.ID}/${ImgObjonHover.fileName}`;
      return (
        <li key={key}>
          <a href={item.URL} target="_blank" className="clearfix">
            <img src={serverRelativeUrl} className="quick-def" />
            <img src={serverRelativeUrlonHover} className="quick-hov" />
            <p>{item.SelectedQuickLinks.Title}</p>
          </a>
        </li>
      )
    });

    return (
      <div className="col-md-12 Quicklinks">
        <div className={[styles.remoHomePage, "m-b-20 if-no-qlinks"].join(' ')} id="m-b-20-PQlink">
          {this.state.isDataAvailable == true ?
            <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
              <div className="sec">
                <div className="heading clearfix">
                  <div className="heading-left">
                    Quick Links
                  </div>
                  <div className="heading-right">
                    <a href='#' data-interception="off" onClick={() => this.readMoreHandler("ManageQuickLinks")} > Manage Quick Links</a>
                  </div>
                </div>
                <div className="section-part clearfix">
                  <ul id="result">
                    {QuickLinks}
                  </ul>
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
    );
  }
}

