export const ListLibraryColumnDetails = [
    {
        name: "AnalyticsMasterList",
        columns: []
    },
    {
        name: "Announcements",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: true, isIndexed: false },
            { columnName: "Image", type: "addImageField", update: "false", isRequired: false, isIndexed: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false , DefaultFormula: "=FALSE"},
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
        ]
    },

    {
        name: "Birthday",
        columns: [
            { columnName: "EmployeeName", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "DOB", type: "addDateField", isRequired: true, isIndexed: true },
            { columnName: "Picture", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true , DefaultFormula: "=FALSE"},
            { columnName: "Designation", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "DOJ", type: "addDateField", isRequired: false, isIndexed: false },

        ]
    },


    {
        name: "CEO Message",
        columns: [
            { columnName: "CEOName", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "Description", type: "addMultilineText", isRequired: true, isIndexed: false },
            { columnName: "Designation", type: "addTextField", isRequired: true, isIndexed: false },
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true, DefaultFormula: "=FALSE" },

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

            { columnName: "jobTitle", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "givenName", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "surname", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "employeeId", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "country", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "businessPhones", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "city", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "mobilePhone", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "mail", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ProfileImage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "department", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ProfilePictureURL", type: "addMultilineText", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "LayoutComponentsAllocationMaster",
        columns: [
            { columnName: "Title", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Component", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ComponentID", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Position", type: "addTextField", isRequired: false, isIndexed: false },

        ]
    },
    {
        name: "DraftMaster",
        columns: [
            { columnName: "Title", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Component", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ComponentID", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Position", type: "addTextField", isRequired: false, isIndexed: false },

        ]
    },

    {
        name: "Content Editor Master",
        columns: [
            { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "Icon", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false, isIndexed: false },
            {
                columnName: "BelongsTo", type: "addLookup", targetListName: "Content Editor Master Category",
                targetListColumn: "Title", isRequired: false
                , isIndexed: false
            },

        ]
    },

    {
        name: "Content Editor Master Category",
        columns: [
            { columnName: "IsActive", type: "addBoolean", isRequired: false, DefaultFormula: "=FALSE" },
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
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "Department", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"], isRequired: false, isIndexed: false },
            { columnName: "Division", type: "addChoice", choices: ["Choice 1", "Choice 2", "Choice 3"], isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "DepartmentsMaster",
        columns: [
            { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "Place Department Under", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "Has Sub Department", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: " Place Department Under", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true,DefaultFormula: "=FALSE" },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Order", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "Shortfield", type: "addTextField", isRequired: false, isIndexed: false },
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
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "EndDate", type: "addDateField", isRequired: false, isIndexed: true },
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "EventDate", type: "addDateField", isRequired: false, isIndexed: true },
            { columnName: "Location", type: "addTextField", isRequired: false, isIndexed: false },

        ]
    },

    {
        name: "Hero Banner",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: true, isIndexed: false },
            { columnName: "ExpiresOn", type: "addDateField", isRequired: true, isIndexed: true },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true, DefaultFormula: "=FALSE" },
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "RMimage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "EnableLikes", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "EnableComments", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "ShareAsEmail", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "RecipientEmail", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "new", type: "addTextField", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "JobsMaster",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "Status", type: "Choice", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "DateOfSubmission", type: "addDateField", isRequired: false, isIndexed: false },
            { columnName: "EmploymentType", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ExperienceLevel", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "EmailID", type: "addTextField", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "Job Application Master",
        columns: [
            { columnName: "JobSummary", type: "addMultilineText", isRequired: false, isIndexed: false },
            // { columnName: "Status", type: "Choice" , isRequired: false  ,isIndexed: false},
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "DateOfSubmission", type: "addDateField", isRequired: false, isIndexed: false },
            { columnName: "EmploymentType", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ExperienceLevel", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "EmailID", type: "addTextField", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "LikesCountMaster",
        columns: [
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "LikedOn", type: "addDateField", isRequired: false, isIndexed: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "Logo Master",
        columns: [
            { columnName: "Logo", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
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
            { columnName: "HoverOnIcon", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "HoverOffIcon", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "Is Active", type: "addBoolean", isRequired: false, isIndexed: false ,DefaultFormula: "=FALSE"},
            { columnName: "URL", type: "addMultilineText", isRequired: true, isIndexed: false },
            {
                columnName: "LinkMasterID", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title", isRequired: true, isIndexed: false
            }

        ]
    },

    {
        name: "NotificationTransactionMaster",
        columns: [
            { columnName: "AssignedTo", type: "Person or Group", isRequired: false, isIndexed: true },
            { columnName: "IsSeen", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "ItemId", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Catagory", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "TitleEnglish", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "TitleArabic", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "CatagoryArabic", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "SeenOn", type: "addDateField", isRequired: false, isIndexed: false },
            { columnName: "CoverImage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "Image", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "ListName", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ItemLink", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "Checkoutuser", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "Tag", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Dept", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "EventDate", type: "addDateField", isRequired: false, isIndexed: false },
            { columnName: "EndDate", type: "addDateField", isRequired: false, isIndexed: false },



        ]
    },

    {
        name: "OrgChartExceptions",
        columns: [

        ]
    },
    {
        name: "Quick Links",
        columns: [
            { columnName: "ImageHover", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "Image", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "URL", type: "addUrl", isRequired: true, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true, DefaultFormula: "=FALSE" },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
 
        ]
    },
    // {
    //     name: "Quick Links",
    //     columns: [
    //         { columnName: "Hover On Icon", type: "addImageField", isRequired: true, isIndexed: false },
    //         { columnName: "Hover Off Icon", type: "addImageField", isRequired: true, isIndexed: false },

    //         { columnName: "AccessibleTo", type: "Person or Group", isRequired: false, isIndexed: false },
    //         { columnName: "URL", type: "addUrl", isRequired: true, isIndexed: false },
    //         { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: true, DefaultFormula: "=FALSE" },
    //         { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
    //         { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },

    //     ]
    // },
    {
        name: "TransactionViewsCount",
        columns: [
            {
                columnName: "ActualNewsItemID", type: "addLookup", targetListName: "News",
                targetListColumn: "ID", isRequired: false, isIndexed: false
            },
            { columnName: "ShortTitle", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ViewCountofNews", type: "addNumberField", isRequired: false, isIndexed: false },

        ]
    },
    {
        name: "UsersQuickLinks",
        columns: [
            {
                columnName: "SelectedQuickLinks", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title",
            },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false  },
            { columnName: "ImageSrc", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "HoverImageSrc", type: "addImageField", isRequired: false, isIndexed: false  },

        ]
    },
    // {
    //     name: "UsersQuickLinks",
    //     columns: [
    //         {
    //             columnName: "SelectedQuickLinks", type: "addLookup", targetListName: "Quick Links",
    //             targetListColumn: "Title", isRequired: false, isIndexed: true
    //         }
    //         ,
    //         {
    //             columnName: "SelectedQuickLinks:ID", type: "addLookup", targetListName: "Quick Links", // Specify the target list
    //             targetListColumn: "ID", isRequired: false, isIndexed: false
    //         },
    //         { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
    //         { columnName: "ImageSrc", type: "addImageField", isRequired: false, isIndexed: false },
    //         { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
    //         { columnName: "HoverImageSrc", type: "addImageField", isRequired: false, isIndexed: false },

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
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "ViewedOn", type: "addDateField", isRequired: false, isIndexed: false },
        ]
    },

    {
        name: "Component Configuration Master",
        columns: [
            { columnName: "ComponentId", type: "addTextField", isRequired: false, isIndexed: false },
        ]
    },

    {
        name: "Portal CSS Configuration Master",
        columns: [
            { columnName: "PrimaryColorCode", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "SecondaryColorCode", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Custom", type: "addMultilineText", isRequired: false, isIndexed: false },

        ]
    },




];

export const DepartmentListDetails = [
    {
        name: "AboutDepartment",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false,DefaultFormula: "=FALSE" },
            { columnName: "DepartmentBannerImage", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "Image URL", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "IsURLUpdated", type: "addBoolean", isRequired: false, isIndexed: false,DefaultFormula: "=FALSE" },
        ]
    },
    {
        name: "Logo Master",
        columns: [
            { columnName: "Logo", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false,DefaultFormula: "=FALSE" }
        ]
    },
    {
        name: "Quick Links",
        columns: [
            { columnName: "Image", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "ImageHover", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false,DefaultFormula: "=FALSE" },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },

        ]
    },
    {
        name: "Services",
        columns: [
            { columnName: "Description", type: "addMultilineText", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
        ]
    },
    {
        name: "Version Master",
        columns: [

        ]
    },
]

export const LandingPageListDetails = [
    {
        name: "LayoutComponentsAllocationMaster",
        columns: [
            { columnName: "Title", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Component", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ComponentID", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Position", type: "addTextField", isRequired: false, isIndexed: false },

        ]
    },
    {
        name: "DraftMaster",
        columns: [
            { columnName: "Title", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Component", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ComponentID", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Position", type: "addTextField", isRequired: false, isIndexed: false },

        ]
    },

    {
        name: "Content Editor Master",
        columns: [
            { columnName: "URL", type: "addUrl", isRequired: false, isIndexed: false },
            { columnName: "Icon", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE"},
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false, isIndexed: false },
            {
                columnName: "BelongsTo", type: "addLookup", targetListName: "Content Editor Master Category",
                targetListColumn: "Title", isRequired: false
                , isIndexed: false
            },

        ]
    },

    {
        name: "Content Editor Master Category",
        columns: [
            { columnName: "IsActive", type: "addBoolean", isRequired: false, DefaultFormula: "=FALSE" },
            { columnName: "AccessibleTo", type: "Person or Group", isRequired: false },
        ]
    },

    {
        name: "Logo Master",
        columns: [
            { columnName: "Logo", type: "addImageField", isRequired: false, isIndexed: false },
            { columnName: "IsActive", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
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
            { columnName: "HoverOnIcon", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "HoverOffIcon", type: "addImageField", isRequired: true, isIndexed: false },
            { columnName: "OpenInNewTab", type: "addBoolean", isRequired: false, isIndexed: false, DefaultFormula: "=FALSE" },
            { columnName: "Order0", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "Is Active", type: "addBoolean", isRequired: false, isIndexed: false,  DefaultFormula: "=FALSE" },
            { columnName: "URL", type: "addMultilineText", isRequired: true, isIndexed: false },
            {
                columnName: "LinkMasterID", type: "addLookup", targetListName: "Quick Links",
                targetListColumn: "Title", isRequired: true, isIndexed: false
            }

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
            { columnName: "EmployeeName", type: "Person or Group", isRequired: false, isIndexed: false },
            { columnName: "EmployeeEmail", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentPage", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "ContentID", type: "addNumberField", isRequired: false, isIndexed: false },
            { columnName: "ViewedOn", type: "addDateField", isRequired: false, isIndexed: false },
        ]
    },

    {
        name: "Component Configuration Master",
        columns: [
            { columnName: "ComponentId", type: "addTextField", isRequired: false, isIndexed: false },
        ]
    },

    {
        name: "Portal CSS Configuration Master",
        columns: [
            { columnName: "PrimaryColorCode", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "SecondaryColorCode", type: "addTextField", isRequired: false, isIndexed: false },
            { columnName: "Custom", type: "addMultilineText", isRequired: false, isIndexed: false },

        ]
    },




];