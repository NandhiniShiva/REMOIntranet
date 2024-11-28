import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";

const CommentsCountMasterlist = listNames.CommentsCountMaster;

export class CheckUserAlreadyCommented {
    public async checkUserAlreadyCommented(
        ID: number | string,
        User: number | string
    ): Promise<boolean> {
        try {
            const items = await sp.web.lists
                .getByTitle(CommentsCountMasterlist)
                .items.filter(
                    `ContentPage eq 'Announcements' and ContentID eq '${ID}' and EmployeeName/Id eq '${User}'`
                )
                .get();

            if (items.length !== 0) {
                console.log("User has already commented on this item:", items);

                // Hide reply UI
                document.querySelectorAll(".reply-tothe-post").forEach((element) => {
                    (element as HTMLElement).style.display = "none";
                });

                return true; // User has commented
            } else {
                console.log("User has not commented on this item.");
                return false; // User has not commented
            }
        } catch (error) {
            console.error("Error in checkUserAlreadyCommented:", error);
            throw error; // Propagate error to caller
        }
    }
}
