// import { sp } from "sp-pnp-js";
// import { listNames } from "../../Configuration";

// const CommentsCountMasterlist = listNames.CommentsCountMaster;

// export class ShowComments{
//     private async showComments() {
//         // $(".all-commets").toggle();
//         try {
//           document.querySelectorAll('.all-comments').forEach(element => {
//             const htmlElement = element as HTMLElement;
//             htmlElement.style.display = htmlElement.style.display === 'none' ? 'block' : 'none';
//           });
//           const items = await sp.web.lists.getByTitle(CommentsCountMasterlist).items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get();
//           return items;
//         }
//         catch {
//           console.error("Element with ID 'Comment' not found.");
//         }
//       }
// }