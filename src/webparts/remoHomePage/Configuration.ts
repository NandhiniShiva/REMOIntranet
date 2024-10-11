export const listNames: { [key: string]: string } = {

    VersionMaster: "Version Master",
    Logo: "Logo Master",
    Navigations: "Navigations",
    DepartmentsMaster: "DepartmentsMaster",
    QuickLinks: "Quick Links",
    ViewsCountMaster: "ViewsCountMaster",
    Announcement: "Announcement",
    LikesCountMaster: "LikesCountMaster",
    CommentsCountMaster: "CommentsCountMaster",
    Birthday: "Birthday",
    CEO_Message: "CEO Message",
    Content_Editor_Master_Category: "Content Editor Master Category",
    Content_Editor_Master: "Content Editor Master",
    Events: "Events",
    Hero_Banner: "Hero Banner",
    JobsMaster: "JobsMaster",
    UsersQuickLinks: "UsersQuickLinks",
    News: "News",
    TransactionViewsCount: "TransactionViewsCount",
    PolicyandProcedureMaster: "PolicyandProcedureMaster",
    AboutDepartment: "AboutDepartment",
    Services: "Services",
    CurrencyMasterList: "CurrencyMasterList",
    JobApplicationMaster: "Job Application Master",
    Analytics: "AnalyticsMasterList",
    NotificationList: "NotificationTransactionMaster"

};
export const PictureLib: { [key: string]: string } = {
    PictureGallery: "Picture Gallery",

}
export const WEB: { [key: string]: string } = {
    NewWeb: "https://remodigital.sharepoint.com/sites/DemoIntranet1/",
    // NewWeb: "https://6z0l7v.sharepoint.com/sites/SPTraineeBT/"

}
// export const totalList: { [key: string]: { name: string, columns?: Array<{ columnName: string, type: string }> } } = {
//     VersionMaster: {
//         name: "Version Master",
//         columns: [
//             { columnName: "Image", type: "addImageField" },
//             { columnName: "IsActive", type: "addBoolean" }
//         ]
//     },
//     LogoMaster: {
//         name: "Logo Masters",
//         columns: [
//             { columnName: "LogoImage", type: "addImageField" },
//             { columnName: "IsActive", type: "addBoolean" }
//         ]
//     },
// }

export const totalList = [
    {
        name: "Version Master Test",
        columns: [
            { columnName: "Image", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" }
        ]
    },
    {
        name: "Logo Master Test",
        columns: [
            { columnName: "LogoImage", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" }
        ]
    },
    {
        name: "Navigations Test",
        columns: [
            { columnName: "NavLink", type: "addTextField" },
            { columnName: "IsActive", type: "addBoolean" }
        ]
    },
    {
        name: "DepartmentsMaster Test",
        columns: [
            { columnName: "DepartmentName", type: "addTextField" },
            { columnName: "IsActive", type: "addBoolean" }
        ]
    },
    {
        name: "Quick Links",
        columns: [
            { columnName: "LinkTitle", type: "addTextField" },
            { columnName: "LinkUrl", type: "addTextField" }
        ]
    },
    {
        name: "ViewsCountMaster",
        columns: [
            { columnName: "ViewsCount", type: "addNumberField" },
            { columnName: "Date", type: "addDateField" }
        ]
    },
    // Add other lists here...
];