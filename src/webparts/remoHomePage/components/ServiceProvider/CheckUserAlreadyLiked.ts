import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";
const LikesCountMasterlist = listNames.LikesCountMaster;

export class CheckUserAlreadyLiked {
    public async checkUserAlreadyLiked(ID: any, User: any) {
        try {
            const items = await sp.web.lists
                .getByTitle(LikesCountMasterlist)
                .items
                .filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`)
                .top(5000).get();

            console.log("checkUserAlreadyLiked", items);
            return items;
        }
        catch (error) {
            console.error(error);
        }
    }
}
