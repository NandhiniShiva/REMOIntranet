// import {SPFI,spfi,SPFx} from "@pnp/sp";
// import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web"

import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
// import { sp } from "@pnp/sp/presets/all";
import pnp from "sp-pnp-js";
export class CurrentUserDetails {
    // sp: any;
    // sp:SPFI
    // private sp = spfi(); 
    //    public constructor(context:any){
    //     this.sp = spfi().using(SPFx(context));
    //    }

    //    public async getCurrentUser() {
    //     try {
    //       const url: URL = new URL(window.location.href);
    //       console.log(url);

    //       const reactHandler = this;
    //       User = reactHandler.props.userid;

    //       const profile = await pnp.sp.profiles.myProperties.get();
    //       UserEmail = profile.Email;
    //       const Name = profile.DisplayName;
    //       console.log(Name);
    //       Designation = profile.Title;

    //       // Check if the UserProfileProperties collection exists and has the Department and Designation properties
    //       if (profile && profile.UserProfileProperties && profile.UserProfileProperties.length > 0) {
    //         const departmentProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Department');
    //         const designationProperty = profile.UserProfileProperties.find((prop: { Key: string; }) => prop.Key === 'Designation');
    //         console.log(departmentProperty, designationProperty);

    //         if (departmentProperty) {
    //           Department = departmentProperty.Value;
    //         }


    //       }
    //     } catch (error) {
    //       console.error('Error fetching user profile:', error);
    //     }
    //   }

    // public  async getCurrentUserDetails() {
    //     try {

    //         const currentUser = await sp.web.currentUser();
    //         console.log("user details", currentUser);
    //         const profile = await pnp.sp.profiles.myProperties.get();
    //         console.log("properties", profile);

    //         return {
    //             user: currentUser
    //         }
    //     } catch (error) {
    //         console.log("Error in getcurrentuser", error);

    //     }
    // }

    public async getCurrentUserDetailsworking() {
        try {
            // Fetch the profile data
            const profile = await pnp.sp.profiles.myProperties.get();

            console.log("Profile data:", profile);

            // Validate essential profile fields
            // if (!profile?.Email || !profile?.Title) {
            //     throw new Error("Profile information is incomplete.");
            // }

            // Retrieve Department from UserProfileProperties if it exists
            // const departmentProperty = profile.UserProfileProperties?.find(
            //     (prop: { Key: string }) => prop.Key === 'Department'
            // );
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
            // if (departmentProperty) {
            //     console.log("Department:", departmentProperty.Value);
            //     return { Department: departmentProperty.Value };
            // } else {
            //     console.warn("Department property not found in the user profile.");
            // }
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
            // Fetch the profile data
            const profile = await pnp.sp.profiles.myProperties.get();

            console.log("Profile data:", profile);

            // Check if UserProfileProperties exist and are populated
            if (profile?.UserProfileProperties?.length > 0) {
                // Retrieve Department and Designation properties
                const departmentProperty = profile.UserProfileProperties.find(
                    (prop: { Key: string }) => prop.Key === 'Department'
                );
                const designationProperty = profile.UserProfileProperties.find(
                    (prop: { Key: string }) => prop.Key === 'Designation'
                );

                // Log properties only if found and have values
                if (departmentProperty?.Value) {
                    console.log("Department:", departmentProperty.Value);
                } else {
                    console.warn("Department property is empty or not found.");
                }

                if (designationProperty?.Value) {
                    console.log("Designation:", designationProperty.Value);
                } else {
                    console.warn("Designation property is empty or not found.");
                }

                // Return both properties if they have values
                return {
                    Department: departmentProperty?.Value ?? null,
                    Designation: designationProperty?.Value ?? null,
                    userEmail: profile.Email,

                };
            } else {
                console.warn("UserProfileProperties is empty or undefined.");
                return null;
            }
        } catch (error) {
            console.error("An error occurred while fetching the current user:", error);
        }
    }

}