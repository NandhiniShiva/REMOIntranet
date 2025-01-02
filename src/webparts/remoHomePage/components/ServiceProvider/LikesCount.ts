import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";

const LikesCountMasterlist = listNames.LikesCountMaster;

export class LikesCount {
    public async likesCount(ID: number | string): Promise<number> {
        try {
            const items = await sp.web.lists
                .getByTitle(LikesCountMasterlist)
                .items.filter(`ContentPage eq 'Announcements' and ContentID eq '${ID}'`)
                .get();

            const likes = items.length;
            console.log("Like count:", likes);

            return likes; // Return the like count
        } catch (error) {
            console.error("Error fetching like count:", error);
            throw error; // Propagate the error to the caller
        }
    }
}
