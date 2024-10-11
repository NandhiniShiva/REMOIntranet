// export interface IRemoHomePageProps {
//   description: string;
//   isDarkTheme: boolean;
//   environmentMessage: string;
//   hasTeamsContext: boolean;
//   userDisplayName: string;
// }

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from '@microsoft/sp-http'; 


export interface IRemoHomePageProps {
  description: string;
  siteurl: string;
  userid: any;
  context: WebPartContext;
  createList: boolean;
  name: string;

}
export interface IWeatherCurrencyProps {
  description: string;
  context: any;
  siteurl: string;
}

export interface IOrganizationChartProps {
  description: string;
  siteurl: string;
}

export interface ICeoMessageReadMoreProps {
  description: string;
  siteurl:string;
  context:WebPartContext;
  userid:any;
}
export interface IAnnouncementsRmProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  userid: any;
  useremail: any;
  createList: boolean;
}

export interface IAnnouncementsVmProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid: string;  
}
export interface IBirthdayRmProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
  useremail:any;
}
export interface IContentEditorProps {
  description: string;
  siteurl: string;
  UserId:any;
  context:WebPartContext;
}
export interface IDeptGalleryGridViewProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  homepage: string;
  userid:any
}
export interface IDeptGalleryViewMoreProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  homepage: string;
  userid:any;
}
export interface IEventsViewMoreProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
}
export interface IGalleryGridViewProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
}

export interface IGalleryViewMoreProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  context:WebPartContext;
  userid:any;
}

export interface IHeroBannerReadMoreProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
  useremail:any;
}

export interface IHeroBannerViewMoreProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
}

export interface IJobsMasterProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
}

export interface IJobsRmProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
}

export interface IManageQuickLinksProps {
  description: string;
  siteurl:string;
  userid:any;
  spHttpClient: SPHttpClient;  
  context:WebPartContext;
}

export interface INewsCategoryBasedProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  userid:any;
}

export interface INewsReadMoreProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  userid:any;
  siteID:any;
  useremail:any;
}

export interface INewsViewMoreProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  userid:any;
}

export interface IPoliciesProceduresProps {
  description: string;
  siteurl: string;
  UserId:any;
  context:WebPartContext;
}

export interface IRemoDeptLandingPageProps {
  PageName: string;
  siteurl: string;
  userid: any;
  context: WebPartContext;
  homepage: string;
}
