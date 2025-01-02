import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";

const CommentsCountMasterlist = listNames.CommentsCountMaster;

export class CommentsCount {
    public async commentsCount(ID: number | string): Promise<number> {
        try {
            const items = await sp.web.lists
                .getByTitle(CommentsCountMasterlist)
                .items.filter(`ContentPage eq 'Announcements' and ContentID eq '${ID}'`)
                .get();

            const commentsCount = items.length;
            console.log("Comments count:", commentsCount);

            return commentsCount; // Return the comments count
        } catch (error) {
            console.error("Error fetching comments count:", error);
            throw error; // Propagate the error to the caller
        }
    }
}
