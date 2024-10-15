import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import * as moment from 'moment';

export class ServiceProvider {
  private _graphClient: MSGraphClientV3;
  private spcontext: WebPartContext;

  constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
  }

  // Get recent files from OneDrive
  public getMyDriveRecents = async (): Promise<any[]> => {
    try {
      this._graphClient = await this.spcontext.msGraphClientFactory.getClient("3");
      const teamsResponse = await this._graphClient.api('/me/drive/recent').version('v1.0').get();
      return teamsResponse.value as any[];
    } catch (error) {
      console.log('Unable to get recent files from OneDrive', error);
      return [];
    }
  }

  // Get unread mail count from Inbox
  public getMyMailCount = async (): Promise<any[]> => {
    try {
      this._graphClient = await this.spcontext.msGraphClientFactory.getClient("3");
      const mailResponse = await this._graphClient.api('me/mailFolders/Inbox/messages?$filter=isRead ne true&$count=true&$top=5000').version('v1.0').get();
      return mailResponse.value as any[];
    } catch (error) {
      console.log('Unable to get unread mail count', error);
      return [];
    }
  }

  // Get current and upcoming meetings
  public getMyMeetingsCount = async (): Promise<any[]> => {
    try {
      this._graphClient = await this.spcontext.msGraphClientFactory.getClient("3");
      const today = moment().format('YYYY-MM-DD');
      const enddate = moment(today).add(30, "days").format("YYYY-MM-DD");
      const meetingResponse = await this._graphClient.api(`/me/calendarview?startdatetime=${today}&enddatetime=${enddate}&$orderBy=end/dateTime`).top(499).version('v1.0').get();
      return meetingResponse.value as any[];
    } catch (error) {
      console.log('Unable to get meetings', error);
      return [];
    }
  }
}
