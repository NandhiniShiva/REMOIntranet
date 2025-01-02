import { sp } from "@pnp/sp/presets/all";
import { listNames } from "../../Configuration";
const ViewsCountMasterlist = listNames.ViewsCountMaster;

// export class AddViews{

//     public async addViews( userId: number,
//         userEmail: string,
//         contentID: number | string,
//         title: string) {
//         await sp.web.lists.getByTitle(ViewsCountMasterlist).items.add({
//           EmployeeNameId: userId,
//           ViewedOn: CurrentDate,
//           EmployeeEmail: UserEmail,
//           ContentPage: "Announcements",
//           Title: this.state.Title,
//           ContentID: contentID,
//         });
//       }
// }

export class AddViews {
    public async addViews(
        userId: any,
        userEmail: string,
        contentID: number | string,
        title: string
    ): Promise<void> {
        try {
            const currentDate = new Date().toISOString(); // Ensure the current date is in a valid ISO format

            await sp.web.lists.getByTitle(ViewsCountMasterlist).items.add({
                EmployeeNameId: userId,
                ViewedOn: currentDate,
                EmployeeEmail: userEmail,
                ContentPage: "Announcements",
                Title: title,
                ContentID: contentID,
            });

            console.log("View added successfully");
        } catch (error) {
            console.error("Error adding view:", error);
        }
    }
}
