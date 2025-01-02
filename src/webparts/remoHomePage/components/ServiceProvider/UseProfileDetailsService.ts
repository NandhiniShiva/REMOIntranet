import "@pnp/sp/webs";
import "@pnp/sp/site-users/web"

import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from "sp-pnp-js";
export class CurrentUserDetails {
    public async getCurrentUserDetailsworking() {
        try {
            // Fetch the profile data
            const profile = await pnp.sp.profiles.myProperties.get();
            if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
                const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
                const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
                console.log(departmentProperty, designationProperty);
                console.log("Department:", departmentProperty.Value);
                if (departmentProperty) {
                    let Department = departmentProperty.Value;
                    return Department;
                }
            }
        } catch (error) {
            console.error("An error occurred while fetching the current user:", error);
        }
    }


    // public async getCurrentUserDetails() {
    //     try {
    //       // const { userid } = this.props;
    //       const profile = await pnp.sp.profiles.myProperties.get();
    //       const departmentProperty = profile.UserProfileProperties?.find((prop: { Key: string; }) => prop.Key === 'Department');
    //       // const Department = departmentProperty?.Value ?? null;
    //       console.log(departmentProperty);
    //     }
    //     catch (error) {
    //       console.error('Error Feching current User Details:', error);
    //     }
    //   }

    //   public async getCurrentUser() {
    //     try {
    //     //   var reacthandler = this;
    //     //   User = reacthandler.props.userid;

    //       // Fetch the profile data
    //       const profile = await pnp.sp.profiles.myProperties.get();

    //       console.log("profile birthday", profile);

    //       // Check if profile object and email exist
    //       if (!profile || !profile.Email || !profile.Title) {
    //         throw new Error("Profile information is incomplete.");
    //       }

    //       // Assign user email and designation
    //     //   UserEmail = profile.Email;
    //     //   Designation = profile.Title;

    //       // Check if the UserProfileProperties collection exists and has the Department property
    //       if (profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
    //         // Find the Department property in the profile
    //         const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
    //         console.log(departmentProperty);

    //         // Check if departmentProperty exists
    //         if (departmentProperty) {
    //         //   Department = departmentProperty.Value;

    //           return {
    //                         // user: currentUser
    //                         Department : departmentProperty.Value
    //                     }
    //         } else {
    //           console.warn("Department property not found in the user profile.");
    //         }
    //       } else {
    //         console.warn("UserProfileProperties collection is empty or undefined.");
    //       }
    //     } catch (error) {
    //       console.error("An error occurred while fetching the current user:", error);
    //     }
    //   }

    // public async getCurrentUserDetailsss() {
    //     try {
    //         let Department: any;
    //         // Fetch the profile data
    //         const profile = await pnp.sp.profiles.myProperties.get();

    //         console.log("Profile data:", profile);

    //         // Validate essential profile fields
    //         if (!profile?.Email || !profile?.Title) {
    //             throw new Error("Profile information is incomplete.");
    //         }

    //         // Retrieve Department from UserProfileProperties if it exists
    //         const departmentProperty = profile.UserProfileProperties?.find(
    //             (prop: { Key: string }) => prop.Key == "Department"
    //         );

    //         if (departmentProperty) {
    //             console.log("Department:", departmentProperty.Value);
    //             return Department = departmentProperty.Value;
    //         } else {
    //             console.warn("Department property not found in the user profile.");
    //         }
    //     } catch (error) {
    //         console.error("An error occurred while fetching the current user:", error);
    //     }
    // }

    public async getCurrentUserDetails() {
        try {
            const profile = await pnp.sp.profiles.myProperties.get();
            console.log("Profile data:", profile);
            // Check if UserProfileProperties exist and are populated
            if (profile?.UserProfileProperties?.length > 0) {
                // Find the Department, Email, and Designation properties
                const departmentProperty = profile.UserProfileProperties.find(
                    (prop: { Key: string }) => prop.Key === "Department"
                );
                const email = profile.Email; // Profile's email
                const designation = profile.Title; // Profile's title (designation)

                console.log("Department Property:", departmentProperty);
                console.log("Email:", email);
                console.log("Designation:", designation);

                // Return the structured data
                return {
                    Department: departmentProperty?.Value ?? null,
                    userEmail: email ?? null,
                    Designation: designation ?? null,
                };
            } else {
                console.warn("UserProfileProperties is empty or undefined.");
                return null;
            }
        } catch (error) {
            console.error("An error occurred while fetching the user profile:", error);
            return null;
        }
    }


}