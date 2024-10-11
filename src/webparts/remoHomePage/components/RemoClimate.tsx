import * as React from 'react';
import { IWeatherCurrencyProps } from './IRemoHomePageProps';
import * as moment from 'moment';
// import * as $ from 'jquery';
import Select from 'react-select';
import { sp } from '@pnp/sp';
import { listNames } from '../Configuration';

let CurrencyMasterList = listNames.CurrencyMasterList;

export interface ISpfxWeatherState {
  skyimage: string;
  location: string;
  weatherid: string;
  temperature: string;
  windspeed: string;
  humidity: string;
}


export interface IWeatherCurrencyState {
  Temp: any;
  WeatherType: any;
  CurrencyValue: any;

  skyimage: string;
  location: string;
  weatherid: string;
  temperature: string;
  windspeed: string;
  humidity: string;
  From: string;
  To: string;
  CurrencyOptions: any[];

  selectedOption: any;
}

let AvailableCurrencies: { value: string; label: string; }[] = [];


export default class RemoClimate extends React.Component<IWeatherCurrencyProps, IWeatherCurrencyState, {}> {
  public constructor(props: IWeatherCurrencyProps, state: IWeatherCurrencyState) {
    super(props);
    this.state = {
      Temp: "",
      WeatherType: "",

      CurrencyValue: "",
      skyimage: '',
      location: '',
      weatherid: '',
      temperature: '',
      windspeed: '',
      humidity: '',
      From: "AED",
      To: "USD",
      CurrencyOptions: [],

      selectedOption: null,
    };
  }

  public async componentDidMount() {

    this.GetWeatherReport();
    this.GetNextPrayer();
    this.GetCurrencyValue();
    this.GetCurrencySymbols();

  }

  public GetWeatherReport() {
    fetch('https://api.weatherapi.com/v1/current.json?key=4745d1a343b849d58a7104337211904&q=Dubai&aqi=no')
      .then((response) => response.text())
      .then((responseData) => (responseData))
      .then((res) => {
        let WeatherDetails = JSON.parse(res);

        let WeatherImg = WeatherDetails.current.condition.icon;
        let Temperature = WeatherDetails.current.temp_c;
        let WeatherType = WeatherDetails.current.condition.text;
        this.setState({
          temperature: Temperature,
          WeatherType: WeatherType,
          skyimage: WeatherImg
        });
      });
  }

  public getDifferenceInhrsandmins(EndTime: moment.MomentInput, StartTime: moment.MomentInput) {
    let diff = moment(EndTime, 'HH:mm').diff(moment(StartTime, 'HH:mm'));
    let d = moment.duration(diff);
    let hours = Math.floor(d.asHours());
    let minutes = moment.utc(diff).format("mm");
    let RemainingTime = hours + ":" + minutes;
    return RemainingTime;
  }

  public GetNextPrayer() {
    var reactHandler = this;
    var curDate = moment(new Date()).format("DD-MM-YYYY");
    fetch(`https://api.aladhan.com/v1/timingsByAddress/'${curDate}'?address=Dubai,UAE&method=8&tune=2,3,4,5,2,3,4,5,-3`)
      .then((response) => response.text())
      .then((responseData) => (responseData))
      .then((res) => {
        let PrayerData = JSON.parse(res);
        let PrayerDetails = PrayerData.data.timings;
        let CurrentTime: any = moment(new Date()).format("HH:mm");

        setTimeout(function () {
          if (PrayerDetails["Fajr"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Fajr"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Fajr"]);
            // $("#prayer-type").html(`Fajr <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Fajr"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Fajr"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Fajr <span>in</span> ${RemainingTime} Hrs`;
            }
          } else if (PrayerDetails["Sunrise"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Sunrise"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Sunrise"]);
            // $("#prayer-type").html(`Sunrise <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Sunrise"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Sunrise"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Sunrise <span>in</span> ${RemainingTime} Hrs`;
            }
          } else if (PrayerDetails["Dhuhr"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Dhuhr"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Dhuhr"]);
            // $("#prayer-type").html(`Dhuhr <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Dhuhr"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Dhuhr"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Dhuhr <span>in</span> ${RemainingTime} Hrs`;
            }
          } else if (PrayerDetails["Asr"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Asr"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Asr"]);
            // $("#prayer-type").html(`Asr <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Asr"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Asr"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Asr <span>in</span> ${RemainingTime} Hrs`;
            }
          } else if (PrayerDetails["Maghrib"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Maghrib"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Maghrib"]);
            // $("#prayer-type").html(`Maghrib <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Maghrib"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Maghrib"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Maghrib <span>in</span> ${RemainingTime} Hrs`;
            }
          } else if (PrayerDetails["Isha"] > CurrentTime) {
            // let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Isha"], CurrentTime);
            // $("#prayer-time").html(PrayerDetails["Isha"]);
            // $("#prayer-type").html(`Isha <span>in</span> ${RemainingTime} Hrs`);
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Isha"], CurrentTime);
            const prayerTimeElement = document.querySelector("#prayer-time");
            if (prayerTimeElement) {
              prayerTimeElement.innerHTML = PrayerDetails["Isha"];
            }
            const prayerTypeElement = document.querySelector("#prayer-type");
            if (prayerTypeElement) {
              prayerTypeElement.innerHTML = `Isha <span>in</span> ${RemainingTime} Hrs`;
            }
          }
        }, 1000);
      });
  }


  public GetCurrencyValue() {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "6RaCIlf1R8C4viHMAQATs6kbVKeU2LlQ");
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    fetch("https://api.apilayer.com/exchangerates_data/convert?to=USD&from=AED&amount=1", requestOptions)
      .then(resp => resp.json())
      .then((data) => {
        var num = parseFloat(data.result);
        var new_num = num.toFixed(2);
        this.setState({
          CurrencyValue: new_num
        });
      });
  }

  public async GetCurrencySymbols() {
    var reactHandler = this;
    AvailableCurrencies = [];
    await sp.web.lists.getByTitle(CurrencyMasterList).items.top(300).get().then((items) => {
      reactHandler.setState({
        CurrencyOptions: items
      });
      for (var i = 0; i < items.length; i++) {
        AvailableCurrencies.push({ value: '' + items[i].Title + '', label: '' + items[i].Title + '' });
      }
    });
  }

  handleChange = (selectedOption: { value: any; }) => {
    this.setState({ selectedOption });
    var selval = selectedOption.value;
    var myHeaders = new Headers();
    myHeaders.append("apikey", "6RaCIlf1R8C4viHMAQATs6kbVKeU2LlQ");
    var requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${selval}&from=AED&amount=1`, requestOptions)
      .then(resp => resp.json())
      .then((data) => {
        var num = parseFloat(data.result);
        var new_num = num.toFixed(2);
        this.setState({
          CurrencyValue: new_num
        });
      });
  };

  public render(): React.ReactElement<IWeatherCurrencyProps> {
    const { selectedOption } = this.state;
    return (
      <div id="m-b-20-weather">
        <div className="climate-wrap m-b-20">
          <div className="sec climate-prayer-exchage m-b-20">
            <ul className="clearfix">
              <li >
                <h4> <img src={`${this.props.siteurl}/SiteAssets/img/c1.svg`} alt="img" />  Dubai, UAE </h4>
                <h2> {this.state.temperature}°C </h2>
                <p> {this.state.WeatherType} </p>
              </li>
              <li>
                <h4> <img src={`${this.props.siteurl}/SiteAssets/img/c2.svg`} alt="img" />  Next Prayer </h4>
                <h2 id="prayer-time">  </h2>
                <p id="prayer-type">  </p>
              </li>
              <li className="stocksxchange">
                <h4> <img src={`${this.props.siteurl}/SiteAssets/img/c3.svg`} alt="img" />  1.00 AED </h4>
                <p> Equals to  </p>
                <h2> {this.state.CurrencyValue} </h2>
                <span className="ddl-currency">

                  <Select
                    id="combo-box-currency"
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={AvailableCurrencies}
                    placeholder={'USD'}
                    styles={{
                      placeholder: (base: any) => ({
                        ...base,
                      }),
                    }}
                  />
                </span>
              </li>
            </ul>
          </div >
        </div >
      </div >
    )
  }
}