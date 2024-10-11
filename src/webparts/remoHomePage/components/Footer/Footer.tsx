import * as React from 'react';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import { listNames } from '../../Configuration';
import { IRemoHomePageProps } from '../IRemoHomePageProps';

let VersionMasterlist = listNames.VersionMaster;


export interface IFooterState {
    VersionData: string;
}

export default class Footer extends React.Component<IRemoHomePageProps, IFooterState> {

    constructor(props: IRemoHomePageProps) {
        super(props);
        this.state = {
            VersionData: ''
        };

        this.GetVersionData = this.GetVersionData.bind(this);
    }

    public async componentDidMount() {
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
                    VersionData: items[0].Title
                });
            }
        } catch (error) {
            console.log("Unable to get VersionData due to: " + error);
        }
    }

    public render(): React.ReactElement<IRemoHomePageProps> {
        return (
            <footer>
                <div style={{ position: "relative" }} className="footer-name">
                    <div style={{ position: "absolute", right: "-2px", bottom: "-25px" }} className="footer-head">
                        <div className="footer-sub">
                            <a href='https://technomaxsystems.com' target='blank'>  Crafted by Technomax Systems  |</a> <span>Release:{this.state.VersionData}</span>
                        </div>
                    </div></div>
            </footer>
        );
    }
}
