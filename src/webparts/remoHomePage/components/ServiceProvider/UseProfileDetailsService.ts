// import {SPFI,spfi,SPFx} from "@pnp/sp";
// import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web"

import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
// import { sp } from "@pnp/sp/presets/all";
import pnp from "sp-pnp-js";
export class CurrentUserDetails {
    public async getCurrentUserDetailsworking() {
        try {
            // Fetch the profile data
            const profile = await pnp.sp.profiles.myProperties.get();

            console.log("Profile data:", profile);

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