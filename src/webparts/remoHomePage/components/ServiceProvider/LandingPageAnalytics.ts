import { sp } from "@pnp/sp/presets/all";
import { listNames } from '../../Configuration';

const Analytics = listNames.Analytics;


// export class PageAnalytics {

//     public async LandingPageAnalytics() {
//         // if (!Department) {
//         //     Department = "NA";
//         // }
//         // if (!Designation) {
//         //     Designation = "NA";
//         // }
//         // console.log(this.state.Title);

//         try {
//             const response = await sp.web.lists.getByTitle(Analytics).items.add({
//                 Category: "Announcements Read-More",
//                 UserId: User,
//                 Department: Department,
//                 Designation: Designation,
//                 Title: this.state.Title,
//                 ItemId: ItemID,
//                 UserEmail: UserEmail,
//             });

//             // console.log('Data successfully added:', response);
//         } catch (error) {
//             console.error('Error adding data:', error);
//         }
//     }
// }

// new code

export class PageAnalytics {
    private category: string;
    private user: string;
    private department: string;
    private designation: string;
    private title: string;
    private itemId: number;
    private userEmail: string;

    constructor(category: string, user: string, department: string, designation: string, title: string, itemId: any, userEmail: string) {
        this.category = category;
        this.user = user;
        this.department = department || "NA"; // Default to "NA" if undefined
        this.designation = designation || "NA"; // Default to "NA" if undefined
        this.title = title;
        this.itemId = itemId;
        this.userEmail = userEmail;
    }

    public async LandingPageAnalytics(): Promise<void> {
        // alert("page analytics")
        try {
            const response = await sp.web.lists.getByTitle(Analytics).items.add({
                Category: this.category,
                UserId: this.user,
                Department: this.department,
                Designation: this.designation,
                Title: this.title,
                ItemId: this.itemId,
                UserEmail: this.userEmail,
            });

            console.log("Data successfully added:", response);
        } catch (error) {
            console.error("Error adding data:", error);
        }
    }
}