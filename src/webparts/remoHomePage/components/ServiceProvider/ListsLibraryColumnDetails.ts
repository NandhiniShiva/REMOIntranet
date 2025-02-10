export const ListLibraryColumnDetails = [
    {
        name: "AnalyticsMasterList",
        columns: []
    },
    {
        name: "Announcement",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: true, isIndexed: true },
            { columnName: "Image", type: "addImageField", update: "false", isRequired: true, isIndexed: true },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: true },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true },
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false, isIndexed: true },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false, isIndexed: true },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false, isIndexed: true },
        ]
    },

    {
        name: "Birthday",
        columns: [
            { columnName: "EmployeeName", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "DOB", type: "addDateField", isRequired: true, isIndexed: true },
            { columnName: "Picture", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true },
            { columnName: "Designation", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false, isIndexed: false },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false, isIndexed: false },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false, isIndexed: false },
            { columnName: "DOJ", type: "addDateField", isRequired: false, isIndexed: false },

        ]
    },


    {
        name: "CEO Message",
        columns: [
            { columnName: "CEOName", type: "addTextField", isRequired: true },
            { columnName: "Description", type: "addMultilineText", isRequired: true },
            { columnName: "Designation", type: "addTextField", isRequired: true },
            { columnName: "Image", type: "addImageField", isRequired: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },

        ]
    },

    {
        name: "CommentsCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false },
            { columnName: "CommentedOn", type: "addDateField", isRequired: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false },
            { columnName: "UserComments", type: "addMultilineText", isRequired: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false },
        ]
    },
    {
        name: "ContactConfigTransaction",
        columns: [

        ]
    },
    {
        name: "ContactDirectoryMaster",
        columns: [

            { columnName: "jobTitle", type: "addTextField", isRequired: false },
            { columnName: "givenName", type: "addTextField", isRequired: false },
            { columnName: "surname", type: "addTextField", isRequired: false },
            { columnName: "employeeId", type: "addTextField", isRequired: false },
            { columnName: "country", type: "addTextField", isRequired: false },
            { columnName: "businessPhones", type: "addTextField", isRequired: false },
            { columnName: "city", type: "addTextField", isRequired: false },
            { columnName: "mobilePhone", type: "addTextField", isRequired: false },
            { columnName: "mail", type: "addTextField", isRequired: false },
            { columnName: "ProfileImage", type: "addImageField", isRequired: false },
            { columnName: "department", type: "addTextField", isRequired: false },
            { columnName: "ProfilePictureURL", type: "addMultilineText", isRequired: false },
        ]
    },
    {
        name: "LayoutComponentsAllocationMaster",
        columns: [
            { columnName: "Title", type: "addTextField", isRequired: false },
            { columnName: "Component", type: "addTextField", isRequired: false },
            { columnName: "ComponentID", type: "addTextField", isRequired: false },
            { columnName: "Position", type: "addTextField", isRequired: false },
            // { columnName: "Target_x0020_Audiences", type: "addTextField" },
            // { columnName: "Report_x0020_Description", type: "addTextField" },
        ]
    },
    // {
    //     name: "Content and Structure Reports",
    //     columns: [
    //         // { columnName: "Image", type: "addImageField", },
    //         // { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Title", type: "addMultilineText" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x", type: "addTextField" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x1", type: "addTextField" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x2", type: "addTextField" },
    //         { columnName: "Target_x0020_Audiences", type: "addTextField" },
    //         { columnName: "Report_x0020_Description", type: "addTextField" },


    //     ]
    // },
    {
        name: "Content Editor Master",
        columns: [
            { columnName: "URL", type: "addUrl", isRequired: false },
            { columnName: "Icon", type: "addImageField", isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false },
            {
                columnName: "BelongsTo", type: "addLookup", targetListName: "Content Editor Master Category",
                targetListColumn: "Title", isRequired: false
            },

        ]
    },

    {
        name: "Content Editor Master Category",
        columns: [
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false },
        ]
    },
    {
        name: "CurrencyMasterList",
        columns: [

        ]
    },
    {
        name: "DefinitionsMaster",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: false },
            { columnName: "Department", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"], isRequired: false },
            { columnName: "Division", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"], isRequired: false },
        ]
    },
    {
        name: "DepartmentsMaster",
        columns: [
            { columnName: "URL", type: "addUrl" },
            { columnName: "Place Department Under", type: "addMultilineText", isRequired: false },
            { columnName: "Has Sub Department", type: "addBoolean", isRequired: false },
            { columnName: " Place Department Under", type: "addMultilineText", isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false },
            { columnName: "Order", type: "addNumberField", isRequired: false },
            { columnName: "Shortfield", type: "addTextField", isRequired: false },
        ]
    },
    {
        name: "Employee Details",
        columns: [

            { columnName: "field_1", type: "addTextField", isRequired: false },
            { columnName: "field_2", type: "addTextField", isRequired: false },
            { columnName: "field_3", type: "addTextField", isRequired: false },
            { columnName: "field_4", type: "addTextField", isRequired: false },
            { columnName: "field_5", type: "addTextField", isRequired: false },

            { columnName: "field_6", type: "addTextField", isRequired: false },
            { columnName: "field_7", type: "addTextField", isRequired: false },
            { columnName: "field_8", type: "addTextField", isRequired: false },
            { columnName: "field_9", type: "addTextField", isRequired: false },
            { columnName: "field_10", type: "addTextField", isRequired: false },

            { columnName: "field_11", type: "addTextField", isRequired: false },
            { columnName: "field_12", type: "addTextField", isRequired: false },
            { columnName: "field_13", type: "addTextField", isRequired: false },
            { columnName: "field_14", type: "addTextField", isRequired: false },
            { columnName: "field_15", type: "addTextField", isRequired: false },

            { columnName: "field_16", type: "addTextField", isRequired: false },
            { columnName: "field_17", type: "addTextField", isRequired: false },
            { columnName: "field_18", type: "addTextField", isRequired: false },
            { columnName: "field_19", type: "addTextField", isRequired: false },
            { columnName: "field_20", type: "addTextField", isRequired: false },

            { columnName: "field_21", type: "addTextField", isRequired: false },
            { columnName: "field_22", type: "addTextField", isRequired: false },
            { columnName: "field_23", type: "addTextField", isRequired: false },
            { columnName: "field_24", type: "addTextField", isRequired: false },
            { columnName: "field_25", type: "addTextField", isRequired: false },

            { columnName: "field_26", type: "addTextField", isRequired: false },
            { columnName: "field_27", type: "addTextField", isRequired: false },
            { columnName: "field_28", type: "addTextField", isRequired: false },
            { columnName: "field_29", type: "addTextField", isRequired: false },
            { columnName: "field_30", type: "addTextField", isRequired: false },

            { columnName: "field_31", type: "addTextField", isRequired: false },
            { columnName: "field_32", type: "addTextField", isRequired: false },
            { columnName: "field_33", type: "addTextField", isRequired: false },
            { columnName: "field_34", type: "addTextField", isRequired: false },
            { columnName: "field_35", type: "addTextField", isRequired: false },

            { columnName: "field_36", type: "addTextField", isRequired: false },
            { columnName: "field_37", type: "addTextField", isRequired: false },
            { columnName: "field_38", type: "addTextField", isRequired: false },
            { columnName: "field_39", type: "addTextField", isRequired: false },
            { columnName: "field_40", type: "addTextField", isRequired: false },

            { columnName: "field_41", type: "addTextField", isRequired: false },
            { columnName: "field_42", type: "addTextField", isRequired: false },
            { columnName: "field_43", type: "addTextField", isRequired: false },
            { columnName: "field_44", type: "addTextField", isRequired: false },
            { columnName: "field_45", type: "addTextField", isRequired: false },

            { columnName: "field_46", type: "addTextField", isRequired: false },


        ]
    },

    {
        name: "Events",
        columns: [
            { columnName: "Image", type: "addImageField", isRequired: false },
            { columnName: "EndDate", type: "addDateField", isRequired: false },
            { columnName: "Description", type: "addMultilineText", isRequired: false },
            { columnName: "EventDate", type: "addDateField", isRequired: false },
            { columnName: "Location", type: "addTextField", isRequired: false },

        ]
    },

    {
        name: "Hero Banner",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: true },
            { columnName: "ExpiresOn", type: "addDateField", isRequired: true },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "Image", type: "addImageField", isRequired: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false },
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false },
            { columnName: "RecipientEmail", type: "Person or Group", isRequired: false },
            { columnName: "new", type: "addTextField", isRequired: false },
        ]
    },
    {
        name: "JobsMaster",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText", isRequired: false },
            { columnName: "Status", type: "Choice", isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "Image", type: "addImageField", isRequired: false },
            { columnName: "DateOfSubmission", type: "addDateField", isRequired: false },
            { columnName: "EmploymentType", type: "addTextField", isRequired: false },
            { columnName: "ExperienceLevel", type: "addTextField", isRequired: false },
            { columnName: "EmailID", type: "addTextField", isRequired: false },
        ]
    },
    {
        name: "Job Application Master",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText", isRequired: false },
            // { columnName: "Status", type: "Choice" , isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "Image", type: "addImageField", isRequired: false },
            { columnName: "DateOfSubmission", type: "addDateField", isRequired: false },
            { columnName: "EmploymentType", type: "addTextField", isRequired: false },
            { columnName: "ExperienceLevel", type: "addTextField", isRequired: false },
            { columnName: "EmailID", type: "addTextField", isRequired: false },
        ]
    },
    {
        name: "LikesCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false },
            { columnName: "LikedOn", type: "addDateField", isRequired: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false },
        ]
    },
    {
        name: "Logo Master",
        columns: [
            { columnName: "Logo", type: "addImageField", isRequired: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
        ]
    },
    {
        name: "NavigationsIDMaster",
        columns: [
            { columnName: "IDFor", type: "addTextField", isRequired: false },
        ]
    },
    {
        name: "Navigations",
        columns: [
            { columnName: "HoverOnIcon", type: "addImageField", isRequired: true },
            { columnName: "HoverOffIcon", type: "addImageField", isRequired: true },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false },
            { columnName: "Order0", type: "addNumberField", isRequired: false },
            { columnName: "Is Active", type: "addBoolean", isRequired: false },
            { columnName: "URL", type: "addMultilineText", isRequired: true },
            {
                columnName: "LinkMasterID", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title", isRequired: false
            }

        ]
    },

    {
        name: "NotificationTransactionMaster",
        columns: [
            { columnName: "AssignedTo", type: "Person or Group", isRequired: false },
            { columnName: "IsSeen", type: "addBoolean", isRequired: false },
            { columnName: "ItemId", type: "addTextField", isRequired: false },
            { columnName: "Catagory", type: "addTextField", isRequired: false },
            { columnName: "TitleEnglish", type: "addTextField", isRequired: false },
            { columnName: "TitleArabic", type: "addTextField", isRequired: false },
            { columnName: "CatagoryArabic", type: "addTextField", isRequired: false },
            { columnName: "SeenOn", type: "addDateField", isRequired: false },
            { columnName: "CoverImage", type: "addImageField", isRequired: false },
            { columnName: "Image", type: "addUrl", isRequired: false },
            { columnName: "ListName", type: "addTextField", isRequired: false },
            { columnName: "ItemLink", type: "addMultilineText", isRequired: false },
            { columnName: "Checkoutuser", type: "Person or Group", isRequired: false },
            // { columnName: "GeneralCatagory", type: "addMultiChoice", choice: ["Midea", "Trosten", "Clivet", "Clint", "Novair"] },
            { columnName: "Tag", type: "addTextField", isRequired: false },
            { columnName: "Dept", type: "addTextField", isRequired: false },
            { columnName: "EventDate", type: "addDateField", isRequired: false },
            { columnName: "EndDate", type: "addDateField", isRequired: false },



        ]
    },

    {
        name: "OrgChartExceptions",
        columns: [

        ]
    },
    // {
    //     name: "OrgChartMaster",
    //     columns: [
    //     ]
    // },

    // {
    //     name: "ProductSegmentation",
    //     columns: [
    //         // { columnName: "Description", type: "addMultilineText" },
    //         // { columnName: "ProductImage", type: "addImageField" },
    //         // { columnName: "Group", type: "addChoice" },
    //         // { columnName: "ProductType", type: "addChoice" },
    //         // { columnName: "ProductVariants", type: "addChoice" },
    //         { columnName: "Category", type: "addMultiChoice", choice: ["Midea", "Trosten", "Clivet", "Clint", "Novair"] },
    //     ]
    // },

    {
        name: "Quick Links",
        columns: [
            { columnName: "Hover On Icon", type: "addImageField", isRequired: true },
            { columnName: "Hover Off Icon", type: "addImageField", isRequired: true },
            // { columnName: "Image", type: "addImageField" },
            // { columnName: "ImageHover", type: "addImageField" },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false },
            { columnName: "URL", type: "addUrl", isRequired: true },
            { columnName: "IsActive", type: "addBoolean", isRequired: false },
            { columnName: "Order0", type: "addNumberField", isRequired: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false },

        ]
    },
    {
        name: "TransactionViewsCount",
        columns: [
            {
                columnName: "ActualNewsItemID", type: "addLookup", targetListName: "News",
                targetListColumn: "ID", isRequired: false
            },
            { columnName: "ShortTitle", type: "addTextField", isRequired: false },
            { columnName: "ViewCountofNews", type: "addNumberField", isRequired: false },

        ]
    },

    {
        name: "UsersQuickLinks",
        columns: [
            {
                columnName: "SelectedQuickLinks", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title", isRequired: false
            },
            {
                columnName: "SelectedQuickLinks_x003a_ID", type: "addLookup", targetListName: "Quick Links", // Specify the target list
                targetListColumn: "ID", isRequired: false
            },
            { columnName: "Order0", type: "addNumberField", isRequired: false },
            { columnName: "ImageSrc", type: "addMultilineText", isRequired: false },
            { columnName: "URL", type: "addUrl", isRequired: false },
            { columnName: "HoverImageSrc", type: "addMultilineText", isRequired: false },

        ]
    },
    // {
    //     name: "UsersQuickLinksNew",
    //     columns: [
    //         {
    //             columnName: "SelectedQuickLinks", type: "addLookup", targetListName: "Quick Links",
    //             targetListColumn: "Title",
    //         },
    //         {
    //             columnName: "SelectedQuickLinks_x003a_ID", type: "addLookup", targetListName: "Quick Links", // Specify the target list
    //             targetListColumn: "ID", // Specify the target column
    //         },
    //         { columnName: "Order0", type: "addNumberField" },
    //         { columnName: "ImageSrc", type: "addMultilineText" },
    //         { columnName: "URL", type: "addUrl" },
    //         { columnName: "HoverImageSrc", type: "addMultilineText" },

    //     ]
    // },
    {
        name: "Version Master",
        columns: [

        ]
    },
    {
        name: "ViewsCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false },
            { columnName: "ViewedOn", type: "addDateField", isRequired: false },
        ]
    },

    {
        name: "Component Configuration Master",
        columns: [
            { columnName: "ComponentId", type: "addTextField", isRequired: false },
        ]
    },

    {
        name: "Portal CSS Configuration Master",
        columns: [
            { columnName: "PrimaryColorCode", type: "addTextField", isRequired: false },
            { columnName: "SecondaryColorCode", type: "addTextField", isRequired: false },
            { columnName: "Custom", type: "addMultilineText", isRequired: false },

        ]
    },




];

export const DepartmentListDetails = [
    {
        name: "AboutDepartment",
        columns: [
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "DepartmentBannerImage", type: "addImageField" },
            { columnName: "Image URL", type: "addMultilineText" },
            { columnName: "IsURLUpdated", type: "addBoolean" },
        ]
    },
    {
        name: "Logo Master",
        columns: [
            { columnName: "Logo", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" }
        ]
    },
    {
        name: "Quick Links",
        columns: [
            { columnName: "Image", type: "addImageField" },
            { columnName: "ImageHover", type: "addImageField" },
            { columnName: "URL", type: "addUrl" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Order0", type: "addNumberField" },
            { columnName: "OpenInNewTab", type: "addBoolean" },

        ]
    },
    {
        name: "Services",
        columns: [
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Order0", type: "addNumberField" },
        ]
    },
    {
        name: "Version Master",
        columns: [

        ]
    },
]