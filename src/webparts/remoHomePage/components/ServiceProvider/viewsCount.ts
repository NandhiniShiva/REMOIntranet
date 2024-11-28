import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";
const ViewsCountMasterlist = listNames.ViewsCountMaster;

export class ViewsCount {
    public async viewsCount(ID: number | string): Promise<number> {
        try {
            const items = await sp.web.lists
                .getByTitle(ViewsCountMasterlist)
                .items.filter(`ContentPage eq 'Announcements' and ContentID eq '${ID}'`)
                .get();

            const views = items.length;
            console.log("Views count:", views);

            return views; // Return the views count
        } catch (error) {
            console.error("Error fetching views count:", error);
            throw error; // Propagate the error to the caller
        }
    }
}
