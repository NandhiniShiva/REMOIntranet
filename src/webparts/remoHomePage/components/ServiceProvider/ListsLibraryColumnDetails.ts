export const ListLibraryColumnDetails = [
    {
        name: "AnnouncementKkGL",
        columns: [
            { columnName: "Image", type: "addImageField", update: "false" },
            { columnName: "IsActive", type: "addBoolean" },
            // { columnName: "Description", type: "Multiple lines of text" },
            { columnName: "EnableLikes", type: "addBoolean" },
            { columnName: "EnableComments", type: "addBoolean" },
            { columnName: "ShareAsEmail", type: "addBoolean" }
        ]
    },
    // {
    //     Analytics: "AnalyticsMasterList",
    //     columns: []
    // },
    // {
    //     name: "BirthdayKK",
    //     columns: [
    //         { columnName: "DOB", type: "Date and Time" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Description", type: "Multiple lines of text" },
    //         { columnName: "Picture", type: "addImageField" },
    //         { columnName: "DOJ", type: "Date and Time" },
    //         { columnName: "Designation", type: "addTextField" },
    //         { columnName: "Name", type: "addTextField" },
    //         { columnName: "EnableLikes", type: "addBoolean" },
    //         { columnName: "EnableComments", type: "addBoolean" },
    //         { columnName: "ShareAsEmail", type: "addBoolean" }

    //     ]
    // },
    {
        name: "CEO Messagekk",
        columns: [
            { columnName: "Name", type: "addTextField" },
            { columnName: "Designation", type: "addTextField" },
            { columnName: "Description", type: "Multiple lines of text" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Image", type: "addImageField" },
        ]
    },

    {
        name: "CommentsCountMasterKk",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group" },
            { columnName: "ContentPage", type: "addTextField" },
            { columnName: "UserComments", type: "Multiple lines of text" },
            { columnName: "ContentID", type: "Number" },
            { columnName: "CommentedOn", type: "addDateField" },
            { columnName: "EmployeeEmail", type: "addTextField" },
        ]
    },
    {
        name: "ContactConfigTransactionKk",
        columns: [
            { columnName: "Image", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Description", type: "Multiple lines of text" }
        ]
    },

    // {
    //     name: "ContactDirectoryMaster",
    //     columns: [

    //         { columnName: "jobTitle", type: "addTextField" },
    //         { columnName: "givenName", type: "addTextField" },
    //         { columnName: "surname", type: "addTextField" },
    //         { columnName: "employeeId", type: "addTextField" },
    //         { columnName: "country", type: "addTextField" },
    //         { columnName: "businessPhones", type: "addTextField" },
    //         { columnName: "city", type: "addTextField" },
    //         { columnName: "mobilePhone", type: "addTextField" },
    //         { columnName: "mail", type: "addTextField" },
    //         { columnName: "ProfileImage", type: "addImageField" },
    //         { columnName: "department", type: "addTextField" },
    //         { columnName: "ProfilePictureURL", type: "Multiple lines of text" }
    //     ]
    // },
    // {
    //     name: " Content and Structure Reports",
    //     columns: [
    //         // { columnName: "Image", type: "addImageField", },
    //         // { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Title", type: "Multiple lines of text" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x", type: "addTextField" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x1", type: "addTextField" },
    //         { columnName: "_x0024_Resources_x003a_cmscore_x2", type: "addTextField" },
    //         { columnName: "Target_x0020_Audiences", type: "addTextField" },
    //         { columnName: "Report_x0020_Description", type: "addTextField" },


    //     ]
    // },
    // {
    //     name: "Content Editor Master",
    //     columns: [
    //         { columnName: "Image", type: "Icon" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "AccessibleTo", type: "Person or Group" },
    //         { columnName: "URL", type: "addUrl" },
    //         { columnName: "BelongsTo", type: "addLookup" },
    //     ]
    // },

    // {
    //     name: "Content Editor Master Category",
    //     columns: [
    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "AccessibleTo", type: "Person or Group" }
    //     ]
    // },

    // {
    //     name: "CurrencyMasterList",
    //     columns: [
    //         // { columnName: "Image", type: "addImageField" },
    //         // { columnName: "IsActive", type: "addBoolean" },
    //         // { columnName: "Description", type: "Multiple lines of text" }
    //     ]
    // },

    // {
    //     name: "DefinitionsMaster",
    //     columns: [
    //         { columnName: "Term", type: "addTextField" },
    //         { columnName: "Product", type: "addChoice" },
    //         { columnName: "Department", type: "addChoice" },
    //         { columnName: "Division", type: "addChoice" },
    //         { columnName: "Division", type: "Tags" },
    //     ]
    // },
    // {
    //     name: "DepartmentsMaster",
    //     columns: [
    //         { columnName: "URL", type: "addUrl" },
    //         { columnName: "Place Department Under", type: "Multiple lines of text" },
    //         { columnName: "Has Sub Department", type: "addBoolean" },
    //         { columnName: " Place Department Under", type: "Multiple lines of text" }, //lookup
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "OpenInNewTab", type: "addBoolean" },
    //         { columnName: "Order", type: "Number" },
    //     ]
    // },
    // {
    //     name: "Digital Business Card Banner Master",
    //     columns: [
    //         { columnName: "BannerImage", type: "addImageField" }
    //     ]
    // },
    // {
    //     name: "Events",
    //     columns: [
    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "EndDate", type: "addDateField" },
    //         { columnName: "Description", type: "Multiple lines of text" },
    //         { columnName: "EventDate", type: "addDateField" },
    //         { columnName: "Location", type: "addTextField" },

    //     ]
    // },
    // {
    //     name: "Floor Master",
    //     columns: [

    //         { columnName: "OrderNo", type: "Number" },
    //         { columnName: "Floor", type: "addTextField" },

    //     ]
    // },
    // {
    //     name: "Birthday",
    //     columns: [
    //         { columnName: "Description", type: "Multiple lines of text" },
    //         { columnName: "ExpiresOn", type: "Date and Time" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "DOJ", type: "Date and Time" },
    //         { columnName: "Designation", type: "addTextField" },
    //         { columnName: "EnableLikes", type: "addBoolean" },
    //         { columnName: "EnableComments", type: "addBoolean" },
    //         { columnName: "ShareAsEmail", type: "addBoolean" }

    //     ]
    // },
    // {
    //     name: "JobsMaster",
    //     columns: [
    //         { columnName: "JobSummary", type: "Multiple lines of text" },
    //         // { columnName: "Status", type: "Choice" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "DateOfSubmission", type: "Date and Time" },
    //         { columnName: "EmploymentType", type: "addTextField" },
    //         { columnName: "ExperienceLevel", type: "addTextField" },
    //         { columnName: "EmailID", type: "addTextField" },



    //     ]
    // },
    // {
    //     name: "LikesCountMaster",
    //     columns: [
    //         { columnName: "EmployeeName", type: "Person or Group" },
    //         // { columnName: "Status", type: "Choice" },
    //         { columnName: "LikedOn", type: "Date and Time" },
    //         { columnName: "EmployeeEmail", type: "addTextField" },
    //         { columnName: "ContentPage", type: "addTextField" },
    //         { columnName: "ContentID", type: "Number" },



    //     ]
    // },

    // {
    //     name: "Logo Master Test",
    //     columns: [
    //         { columnName: "Logo", type: "addImageField" },
    //         { columnName: "IsActive", type: "addBoolean" }
    //     ]
    // },
    // {
    //     name: "Navigations",
    //     columns: [
    //         { columnName: "HoverOnIcon", type: "addImageField" },
    //         { columnName: "HoverOffIcon", type: "addImageField" },
    //         { columnName: "OpenInNewTab", type: "addBoolean" },
    //         { columnName: "Order0", type: "Number" },
    //         { columnName: "Is Active", type: "addBoolean" },
    //         { columnName: "URL", type: "Multiple lines of text" }
    //         // { columnName: "LinkMasterID", type: "Multiple lines of text" } lookup field

    //     ]
    // },



    // {
    //     name: "NavigationsIDMaster",
    //     columns: [
    //         { columnName: "IDFor", type: "addTextField" },
    //     ]
    // },
    // {
    //     name: "Birthday",
    //     columns: [
    //         { columnName: "Description", type: "Multiple lines of text" },
    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "DetailsPageUrl", type: "Multiple lines of text" },
    //         { columnName: "ShortTitle", type: "addTextField" },
    //         { columnName: "Department", type: "Choice" },
    //         // TransactionItemID look up column
    //         // Dept look up column
    //         // SitePageID look up 

    //         { columnName: "RecipientEmail", type: "Person or Group" },
    //         { columnName: "EnableLikes", type: "addBoolean" },
    //         { columnName: "EnableComments", type: "addBoolean" },
    //         { columnName: "ShareAsEmail", type: "addBoolean" },
    //         { columnName: "Tag", type: "Choice" },



    //     ]
    // },

    // {
    //     name: "OrgChartExceptions",
    //     columns: [

    //     ]
    // },
    // {
    //     name: "OrgChartMaster",
    //     columns: [

    //     ]
    // },

    // {
    //     name: "ProductSegmentationK",
    //     columns: [
    //         // { columnName: "Description", type: "Multiple lines of text" },
    //         // { columnName: "ProductImage", type: "addImageField" },
    //         // { columnName: "Group", type: "addChoice" },
    //         // { columnName: "ProductType", type: "addChoice" },
    //         // { columnName: "ProductVariants", type: "addChoice" },
    //         { columnName: "Category", type: "addMultiChoice", choice: ["Midea", "Trosten", "Clivet", "Clint", "Novair"] },

    //     ]
    // },
    // {
    //     name: "DepartmentsMaster Test",
    //     columns: [
    //         { columnName: "DepartmentName", type: "addTextField" },
    //         { columnName: "IsActive", type: "addBoolean" }
    //     ]
    // },
    // {
    //     name: "Quick Links",
    //     columns: [

    //         { columnName: "Image", type: "addImageField" },
    //         { columnName: "ImageHover", type: "addImageField" },
    //         { columnName: "URL", type: "addUrl" },
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Order0", type: "Number" },
    //         { columnName: "centernavigationicon", type: "addImageField" },
    //         { columnName: "OpenInNewTab", type: "addBoolean" },

    //     ]
    // },




    // {
    //     name: "RemoSolNavigations",
    //     columns: [
    //         { columnName: "IsActive", type: "addBoolean" },
    //         { columnName: "Order0", type: "Number" },
    //         { columnName: "URL", type: "addUrl" },
    //         { columnName: "OpenInNewTab", type: "addBoolean" },
    //         { columnName: "ImageHover", type: "addImageField" },
    //         { columnName: "Category", type: "addChoice" },

    //     ]
    // },
    {
        name: "ScheduleK",
        columns: [
            { columnName: "Schedule", type: "addTextField" },

        ]
    },

    // {
    //     name: "Schedule DepartmentMaster",
    //     columns: [
    //         { Department: "Schedule", type: "addTextField" },
    //         // { Floor: "Schedule", type: "Lookup" }, 
    //     ]
    // },

    {
        name: "Schedule Masterk",
        columns: [
            { columnName: "Doctor_x0020_Name", type: "addTextField" },
            // { columnName: "EndTiming", type: "addDateTime" },
            // { columnName: "OTEndTime", type: "addDateTime" },
            // { columnName: " OT", type: "addDateTime" },
            // { columnName: "DepartmentBelongsTo", type: "Lookup" },
            // { columnName: "FloorBelongsTo", type: "Lookup" },
            { columnName: "Schedules", type: "addLookup", targetListName: "ScheduleK", targetListColumn: "Schedule" },
            // { columnName: " Timing", type: "addDateTime" },

        ]
    },

    {
        name: " Taqeef Digital Business Card Master",
        columns: [
            { columnName: "JobTilte", type: "addTextField" },
            { columnName: "DigitalBusinessCardLink", type: "addUrl" },
            { columnName: "IsActive", type: "addBoolean" },

        ]
    },

    {
        name: "TransactionViewsCount",
        columns: [
            { columnName: "ActualNewsItemID", type: "lookup" },
            { columnName: "ShortTitle", type: "addTextField" },
            { columnName: "ViewCountofNews", type: "addNumberField" },

        ]
    },

    {
        name: "UsersQuickLinks",
        columns: [
            { columnName: "SelectedQuickLinks", type: "Lookup" },
            { columnName: "SelectedQuickLinks_x003a_ID", type: "lookup" },
            { columnName: "Order0", type: "Number" },
            { columnName: "ImageSrc", type: "Multiple lines of text" },
            { columnName: "URL", type: "addUrl" },
            { columnName: "HoverImageSrc", type: "Multiple lines of text" },

        ]
    },
    {
        name: "Version Master Test",
        columns: [
            // { columnName: "Image", type: "addImageField" },
            { columnName: "IsActive", type: "addBoolean" },
            { columnName: "Description", type: "Multiple lines of text" }
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
        name: " Component Configuration List",
        columns: [
            { columnName: "LayoutId", type: "addTextField" },

        ]
    },

    {
        name: "Portal CSS Configuration List",
        columns: [
            { columnName: "PrimaryColorCode", type: "addTextField" },
            { columnName: "SecondaryColorCode", type: "addTextField" },
            { columnName: "Custom", type: "Multiple lines of text" },

        ]
    },


    {
        name: "Portal Font Configuration List",
        columns: [
            { columnName: " FontUrl", type: "addUrl" },

        ]
    },
    // Add other lists here...
];