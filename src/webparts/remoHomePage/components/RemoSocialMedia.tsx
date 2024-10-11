import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";

export default class RemoSocialMedia extends React.Component<IRemoHomePageProps, {}> {
  public OpenSocialMedia = (selectedMedium: string) => {
    const elements:any = {
      fb: { class: "facebook", id: "FB" },
      insta: { class: "instagram", id: "INSTA" },
      twitter: { class: "twitter", id: "TWITT" },
      linkedin: { class: "linkedin", id: "LINKEDIN" }
    };

    for (const key in elements) {
      const element = elements[key];
      const isActive = key === selectedMedium;
      const $el = $("." + element.class);
      $el.toggleClass("active", isActive);
      $("#" + element.id).toggle(isActive);
    }
  };

  public render(): React.ReactElement<IRemoHomePageProps> {
    return (
      <div className="col-md-6">
        <div className="social-medial-wrap">
          <ul className="clearfix">
            <li className="facebook active"><a href="#" onClick={() => this.OpenSocialMedia("fb")}> <img src={`${this.props.siteurl}/SiteAssets/img/s1.svg`} alt="image" /></a> </li>
            <li className="instagram"><a href="#" onClick={() => this.OpenSocialMedia("insta")}>  <img src={`${this.props.siteurl}/SiteAssets/img/s2.svg`} alt="image" /></a> </li>
            <li className="twitter"><a href="#" onClick={() => this.OpenSocialMedia("twitter")}> <img src={`${this.props.siteurl}/SiteAssets/img/s3.svg`} alt="image" /></a> </li>
            <li className="linkedin"><a href="#" onClick={() => this.OpenSocialMedia("linkedin")}> <img src={`${this.props.siteurl}/SiteAssets/img/s4.svg`} alt="image" /> </a></li>
          </ul>
          <div className="main-social-media-block sec" id="LINKEDIN">
            <iframe src='https://www.sociablekit.com/app/embed/64771' width='100%' height='290'></iframe>
          </div>
          <div className="main-social-media-block sec" id="TWITT" style={{ display: "none" }}>
            <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000' style={{ width: "100%" }}></iframe>
          </div>
          <div className="main-social-media-block sec" id="FB" style={{ display: "none" }}>
            <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000'></iframe>
          </div>
          <div className="main-social-media-block sec" id="INSTA" style={{ display: "none" }}>
            <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000' style={{ width: "100%" }}></iframe>
          </div>
        </div>
      </div>
    );
  }
}
