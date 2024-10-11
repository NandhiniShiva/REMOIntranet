import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import * as moment from 'moment';

interface IMeetingData {
  end: { dateTime: string };
  start: { dateTime: string };
  subject: string;
}

export class ServiceProvider {
  private graphClient: MSGraphClientV3;
  private spContext: WebPartContext;

  constructor(spContext: WebPartContext) {
    this.spContext = spContext;
  }

  private async getGraphClient(): Promise<MSGraphClientV3> {
    if (!this.graphClient) {
      // Initialize graphClient if it's not already initialized
      this.graphClient = await this.spContext.msGraphClientFactory.getClient("3");
    }
    return this.graphClient;
  }

  private async fetchMeetings(startDateTime: string, endDateTime: string): Promise<IMeetingData[]> {
    try {
      const graphClient = await this.getGraphClient();
      const meetingResponse = await graphClient.api(`/me/calendarView`)
        .query({
          startDateTime,
          endDateTime,
          $orderBy: "start/dateTime",
          $top: 499,
        })
        .version('v1.0')
        .get();
      return meetingResponse.value as IMeetingData[];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw new Error('Failed to fetch meetings');
    }
  }

  public async getMyTodaysRoutine(): Promise<IMeetingData[]> {
    const today = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const enddate = moment().add(1, 'days').format('YYYY-MM-DD');
    return this.fetchMeetings(`${today}T21:00:00.000Z`, `${enddate}T21:00:00.000Z`);
  }

  public async getMyFutureMeetings(): Promise<IMeetingData[]> {
    const today = moment().format('YYYY-MM-DD');
    const endDate = moment(today).add(14, 'days').format('YYYY-MM-DD');
    return this.fetchMeetings(`${today}T21:00:00.000Z`, `${endDate}T21:00:00.000Z`);
  }

  public async getMyTodaysRoutinePast(): Promise<IMeetingData[]> {
    const today = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const endDate = moment().add(1, 'days').format('YYYY-MM-DD');
    return this.fetchMeetings(`${today}T21:00:00.000Z`, `${endDate}T21:00:00.000Z`);
  }

  public async getMyTodaysRoutineFuture(selectedDate: moment.MomentInput): Promise<IMeetingData[]> {
    const formattedSelectedDate = moment(selectedDate).subtract(2, 'days').format('YYYY-MM-DD');
    const endDate = moment(formattedSelectedDate).add(2, 'days').format('YYYY-MM-DD');
    return this.fetchMeetings(`${formattedSelectedDate}T21:00:00.000Z`, `${endDate}T21:00:00.000Z`);
  }
}
