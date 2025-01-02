export const ListLibraryColumnDetails = [
    {
        name: "AnalyticsMasterList",
        columns: []
    },
    {
        name: "Announcement",
        columns: [
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "Image", type: "addImageField", update: "false" },
            { columnName: "RMimage", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "EnableLikes", type: "addBoolean" },
            { columnName: "EnableComments", type: "addBoolean" },
            { columnName: "ShareAsEmail", type: "addBoolean" }
        ]
    },

    {
        name: "Birthday",
        columns: [
            { columnName: "Name", type: "addTextField" },
            { columnName: "DOB", type: "addDateField" },
            { columnName: "Picture", type: "addImageField" },
            { columnName: "RMimage", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Designation", type: "addTextField" },
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "EnableLikes", type: "addBoolean" },
            { columnName: "EnableComments", type: "addBoolean" },
            { columnName: "ShareAsEmail", type: "addBoolean" },
            { columnName: "DOJ", type: "addDateField" }

        ]
    },
    {
        name: "CEO Message",
        columns: [
            { columnName: "Name", type: "addTextField" },
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "Designation", type: "addTextField" },
            { columnName: "Image", type: "addImageField" },
            { columnName: "RMimage", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" },

        ]
    },

    {
        name: "CommentsCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group" },
            { columnName: "CommentedOn", type: "addDateField" },
            { columnName: "EmployeeEmail", type: "addTextField" },
            { columnName: "UserComments", type: "addMultilineText" },
            { columnName: "ContentPage", type: "addTextField" },
            { columnName: "ContentID", type: "addNumberField" },
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

            { columnName: "jobTitle", type: "addTextField" },
            { columnName: "givenName", type: "addTextField" },
            { columnName: "surname", type: "addTextField" },
            { columnName: "employeeId", type: "addTextField" },
            { columnName: "country", type: "addTextField" },
            { columnName: "businessPhones", type: "addTextField" },
            { columnName: "city", type: "addTextField" },
            { columnName: "mobilePhone", type: "addTextField" },
            { columnName: "mail", type: "addTextField" },
            { columnName: "ProfileImage", type: "addImageField" },
            { columnName: "department", type: "addTextField" },
            { columnName: "ProfilePictureURL", type: "addMultilineText" }
        ]
    }, {
        name: "LayoutComponentsAllocationMaster",
        columns: [
            { columnName: "Title", type: "addTextField" },
            { columnName: "Component", type: "addTextField" },
            { columnName: "ComponentID", type: "addTextField" },
            { columnName: "Position", type: "addTextField" },
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
            { columnName: "URL", type: "addUrl" },
            { columnName: "Icon", type: "Image" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "AccessibleTo", type: "Person or Group" },
            {
                columnName: "BelongsTo", type: "addLookup", targetListName: "Content Editor Master Category",
                targetListColumn: "Title"
            },
        ]
    },

    {
        name: "Content Editor Master Category",
        columns: [
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "AccessibleTo", type: "Person or Group" }
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
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "Department", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"] },
            { columnName: "Division", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"] },
        ]
    },
    {
        name: "DepartmentsMaster",
        columns: [
            { columnName: "URL", type: "addUrl" },
            { columnName: "Place Department Under", type: "addMultilineText" },
            { columnName: "Has Sub Department", type: "addBoolean" },
            { columnName: " Place Department Under", type: "addMultilineText" }, //lookup
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "OpenInNewTab", type: "addBoolean" },
            { columnName: "Order", type: "addNumberField" },
        ]
    },
    {
        name: "Employee Details",
        columns: [

            { columnName: "field_1", type: "addTextField" },
            { columnName: "field_2", type: "addTextField" },
            { columnName: "field_3", type: "addTextField" },
            { columnName: "field_4", type: "addTextField" },
            { columnName: "field_5", type: "addTextField" },

            { columnName: "field_6", type: "addTextField" },
            { columnName: "field_7", type: "addTextField" },
            { columnName: "field_8", type: "addTextField" },
            { columnName: "field_9", type: "addTextField" },
            { columnName: "field_10", type: "addTextField" },

            { columnName: "field_11", type: "addTextField" },
            { columnName: "field_12", type: "addTextField" },
            { columnName: "field_13", type: "addTextField" },
            { columnName: "field_14", type: "addTextField" },
            { columnName: "field_15", type: "addTextField" },

            { columnName: "field_16", type: "addTextField" },
            { columnName: "field_17", type: "addTextField" },
            { columnName: "field_18", type: "addTextField" },
            { columnName: "field_19", type: "addTextField" },
            { columnName: "field_20", type: "addTextField" },

            { columnName: "field_21", type: "addTextField" },
            { columnName: "field_22", type: "addTextField" },
            { columnName: "field_23", type: "addTextField" },
            { columnName: "field_24", type: "addTextField" },
            { columnName: "field_25", type: "addTextField" },

            { columnName: "field_26", type: "addTextField" },
            { columnName: "field_27", type: "addTextField" },
            { columnName: "field_28", type: "addTextField" },
            { columnName: "field_29", type: "addTextField" },
            { columnName: "field_30", type: "addTextField" },

            { columnName: "field_31", type: "addTextField" },
            { columnName: "field_32", type: "addTextField" },
            { columnName: "field_33", type: "addTextField" },
            { columnName: "field_34", type: "addTextField" },
            { columnName: "field_35", type: "addTextField" },

            { columnName: "field_36", type: "addTextField" },
            { columnName: "field_37", type: "addTextField" },
            { columnName: "field_38", type: "addTextField" },
            { columnName: "field_39", type: "addTextField" },
            { columnName: "field_40", type: "addTextField" },

            { columnName: "field_41", type: "addTextField" },
            { columnName: "field_42", type: "addTextField" },
            { columnName: "field_43", type: "addTextField" },
            { columnName: "field_44", type: "addTextField" },
            { columnName: "field_45", type: "addTextField" },

            { columnName: "field_46", type: "addTextField" },


        ]
    },

    {
        name: "Events",
        columns: [
            { columnName: "Image", type: "addImageField" },
            { columnName: "EndDate", type: "addDateField" },
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "EventDate", type: "addDateField" },
            { columnName: "Location", type: "addTextField" },

        ]
    },

    {
        name: "Hero Banner",
        columns: [
            { columnName: "Description", type: "addMultilineText" },
            { columnName: "ExpiresOn", type: "addDateField" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Image", type: "addImageField" },
            { columnName: "RMimage", type: "addImageField" },
            { columnName: "EnableLikes", type: "addBoolean" },
            { columnName: "EnableComments", type: "addBoolean" },
            { columnName: "ShareAsEmail", type: "addBoolean" },
            { columnName: "RecipientEmail", type: "Person or Group" },
            { columnName: "new", type: "addTextField" },
        ]
    },
    {
        name: "JobsMaster",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText" },
            { columnName: "Status", type: "Choice" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Image", type: "addImageField" },
            { columnName: "DateOfSubmission", type: "addDateField" },
            { columnName: "EmploymentType", type: "addTextField" },
            { columnName: "ExperienceLevel", type: "addTextField" },
            { columnName: "EmailID", type: "addTextField" },
        ]
    },
    {
        name: "Job Application Master",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText" },
            // { columnName: "Status", type: "Choice" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Image", type: "addImageField" },
            { columnName: "DateOfSubmission", type: "addDateField" },
            { columnName: "EmploymentType", type: "addTextField" },
            { columnName: "ExperienceLevel", type: "addTextField" },
            { columnName: "EmailID", type: "addTextField" },
        ]
    },
    {
        name: "LikesCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group" },
            { columnName: "LikedOn", type: "addDateField" },
            { columnName: "EmployeeEmail", type: "addTextField" },
            { columnName: "ContentPage", type: "addTextField" },
            { columnName: "ContentID", type: "addNumberField" },
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
        name: "NavigationsIDMaster",
        columns: [
            { columnName: "IDFor", type: "addTextField" },
        ]
    },
    {
        name: "Navigations",
        columns: [
            { columnName: "HoverOnIcon", type: "addImageField" },
            { columnName: "HoverOffIcon", type: "addImageField" },
            { columnName: "OpenInNewTab", type: "addBoolean" },
            { columnName: "Order0", type: "addNumberField" },
            { columnName: "Is Active", type: "addBoolean" },
            { columnName: "URL", type: "addMultilineText" },
            {
                columnName: "LinkMasterID", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title",
            }

        ]
    },

    {
        name: "NotificationTransactionMaster",
        columns: [
            { columnName: "AssignedTo", type: "Person or Group" },
            { columnName: "IsSeen", type: "addBoolean" },
            { columnName: "ItemId", type: "addTextField" },
            { columnName: "Catagory", type: "addTextField" },
            { columnName: "TitleEnglish", type: "addTextField" },
            { columnName: "TitleArabic", type: "addTextField" },
            { columnName: "CatagoryArabic", type: "addTextField" },
            { columnName: "SeenOn", type: "addDateField" },
            { columnName: "CoverImage", type: "addImageField" },
            { columnName: "Image", type: "addUrl" },
            { columnName: "ListName", type: "addTextField" },
            { columnName: "ItemLink", type: "addMultilineText" },
            { columnName: "Checkoutuser", type: "Person or Group" },
            // { columnName: "GeneralCatagory", type: "addMultiChoice", choice: ["Midea", "Trosten", "Clivet", "Clint", "Novair"] },
            { columnName: "Tag", type: "addTextField" },
            { columnName: "Dept", type: "addTextField" },
            { columnName: "EventDate", type: "addDateField" },
            { columnName: "EndDate", type: "addDateField" },



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
            { columnName: "Image", type: "addImageField" },
            { columnName: "ImageHover", type: "addImageField" },
            { columnName: "URL", type: "addUrl" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Order0", type: "addNumberField" },
            { columnName: "OpenInNewTab", type: "addBoolean" },

        ]
    },


    {
        name: "TransactionViewsCount",
        columns: [
            {
                columnName: "ActualNewsItemID", type: "addLookup", targetListName: "News",
                targetListColumn: "ID",
            },
            { columnName: "ShortTitle", type: "addTextField" },
            { columnName: "ViewCountofNews", type: "addNumberField" },

        ]
    },

    {
        name: "UsersQuickLinks",
        columns: [
            {
                columnName: "SelectedQuickLinks", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title",
            },
            {
                columnName: "SelectedQuickLinks_x003a_ID", type: "addLookup", targetListName: "Quick Links", // Specify the target list
                targetListColumn: "ID", // Specify the target column
            },
            { columnName: "Order0", type: "addNumberField" },
            { columnName: "ImageSrc", type: "addMultilineText" },
            { columnName: "URL", type: "addUrl" },
            { columnName: "HoverImageSrc", type: "addMultilineText" },

        ]
    },
    {
        name: "Version Master",
        columns: [

        ]
    },
    {
        name: "ViewsCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group" },
            { columnName: "EmployeeEmail", type: "addTextField" },
            { columnName: "ContentPage", type: "addTextField" },
            { columnName: "ContentID", type: "addNumberField" },
            { columnName: "ViewedOn", type: "addDateField" },



        ]
    },

    {
        name: "Component Configuration Master",
        columns: [
            { columnName: "ComponentId", type: "addTextField" },
        ]
    },

    {
        name: "Portal CSS Configuration Master",
        columns: [
            { columnName: "PrimaryColorCode", type: "addTextField" },
            { columnName: "SecondaryColorCode", type: "addTextField" },
            { columnName: "Custom", type: "addMultilineText" },

        ]
    },



];