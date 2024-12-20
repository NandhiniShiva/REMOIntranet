import * as React from 'react';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import { listNames } from '../../Configuration';
import { IRemoHomePageProps } from '../IRemoHomePageProps';
import { ListCreation } from '../ServiceProvider/List&ColumnCreation';

let VersionMasterlist = listNames.VersionMaster;


export interface IFooterState {
    VersionData: string;
    isDataAvailable: boolean
}

export default class Footer extends React.Component<IRemoHomePageProps, IFooterState> {

    constructor(props: IRemoHomePageProps) {
        super(props);
        this.state = {
            VersionData: '',
            isDataAvailable: false
        };

        this.GetVersionData = this.GetVersionData.bind(this);
    }

    public async componentDidMount() {
        const listCreation = new ListCreation();
        listCreation.createSharePointLists(this.props.name);
        await this.GetVersionData();
    }

    public async GetVersionData() {
        try {
            const NewWeb = Web(this.props.siteurl);
            const items = await NewWeb.lists.getByTitle(VersionMasterlist)
                .items.select("Title")
                .orderBy("Created", false)
                .top(1)
                .get();

            if (items.length != 0) {
                this.setState({
                    VersionData: items[0].Title,
                    isDataAvailable: true
                });
            }
        } catch (error) {
            console.log("Unable to get VersionData due to: " + error);
        }
    }
    public addData() {
        // const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${VersionMasterlist}`; // Replace with your list URL
        const listUrl = `${this.props.siteurl}/Lists/${VersionMasterlist}`;

        window.open(listUrl, "_blank");
    }


    public render(): React.ReactElement<IRemoHomePageProps> {
        return (
            // <footer>
            //     <div style={{ position: "relative" }} className="footer-name">
            //         <div style={{ position: "absolute", right: "-2px", bottom: "-25px" }} className="footer-head">
            //             <div className="footer-sub">
            //                 <a href='https://technomaxsystems.com' target='blank'>  Crafted by Technomax Systems  |</a> <span>Release:{this.state.VersionData}</span>
            //             </div>
            //         </div></div>
            // </footer>


            <>
                {this.state.isDataAvailable ? (
                    <footer>
                        <div style={{ position: "relative" }} className="footer-name">
                            <div style={{ position: "absolute", right: "-2px", bottom: "-25px" }} className="footer-head">
                                <div className="footer-sub">
                                    <a href='https://technomaxsystems.com' target='_blank' rel='noopener noreferrer'>
                                        Crafted by Technomax Systems |
                                    </a>
                                    <span>Release: {this.state.VersionData}</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                ) : (
                    <div>
                        <button onClick={this.addData}>Add Data</button>
                    </div>
                )}
            </>
        );
    }
}
