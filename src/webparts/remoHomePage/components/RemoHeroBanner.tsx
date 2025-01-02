import * as React from 'react';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { ChoiceFieldFormatType, FieldUserSelectionMode, sp, UrlFieldFormatType, Web } from "@pnp/sp/presets/all";
import Slider from "react-slick";
import { listNames, WEB } from '../Configuration';
import { ListLibraryColumnDetails } from './ServiceProvider/ListsLibraryColumnDetails';
import { ListCreation } from './ServiceProvider/List&ColumnCreation';
// import { ProgressBar } from 'react-bootstrap';
// import ProgressBar from 'react-bootstrap/ProgressBar';
let Hero_Bannerlist = listNames.Hero_Banner;
let NewWeb: any = Web(WEB.NewWeb);

console.log('NewWeb', NewWeb);

enum ResolutionCategory {
  Low,
  Medium,
  High
}

// function classifyImageResolution(width: number, height: number): ResolutionCategory {
//   const resolution = width * height;

//   if (resolution < 1000000) { // less than 1 MP
//     return ResolutionCategory.Low;
//   } else if (resolution < 3000000) { // between 1 MP and 3 MP
//     return ResolutionCategory.Medium;
//   } else { // greater than or equal to 3 MP
//     return ResolutionCategory.High;
//   }
// }

async function getImageResolution(imageUrl: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageUrl;
  });
}

export interface IHeroBannerState {
  Items: any[];
  AnncCount: number;
  TotalItem: number;
  isDataAvailable: boolean;
  componentMasterItems: any[];
  selectedValue: string;
  progress: any,
  isCreatingLists: boolean,
  loadContent: boolean,
  currentList: any,
  showProgessar: boolean
}

export default class HeroBanner extends React.Component<IRemoHomePageProps, IHeroBannerState, {}> {
  constructor(props: IRemoHomePageProps) {
    super(props);
    this.state = {
      Items: [],
      AnncCount: 0,
      TotalItem: 0,
      isDataAvailable: false,
      componentMasterItems: [],
      selectedValue: "",
      progress: 0,
      isCreatingLists: false,
      loadContent: false,
      currentList: "",
      showProgessar: false

    };
  }

  public async componentDidMount() {
    alert("hero banner")
    console.log('Component Name', this.props.name);
    const listCreation = new ListCreation();
    listCreation.createSharePointLists(this.props.name);
    // await this.createSharePointLists(this.props.name);
    await this.hideProgessbar()
    this.GetBanner();
    // this.getDeviceType()
  }
  //    public getDeviceType  (){
  //     const ua = navigator.userAgent;
  //     console.log(navigator);

  //   console.log(ua);

  //     // Mobile detection
  //     if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
  //       alert("Mobile")
  //       return 'Mobile';
  //     }

  //     // Tablet detection
  //    else if (/iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua)) {
  //       alert("Tablet")
  // //      return 'Tablet';
  //     }
  //     else{
  //       alert("Desktop")
  //     }

  //     // Default to Desktop
  //    // return 'Desktop';
  //   };
  // private async GetBannerold() {
  //   const d = new Date().toISOString();
  //   try {
  //     const items = await sp.web.lists.getByTitle(Hero_Bannerlist).items.select("Title", "Description", "ExpiresOn", "Image", "ID", "*")
  //     .filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`).orderBy("Created", false).getAll();

  //     const updatedItems = await Promise.all(items.map(async (item) => {
  //       let resolutionCategory = ResolutionCategory.Low; // Default category
  //       if (item.Image) {
  //         const ImgObj = JSON.parse(item.Image);
  //         const serverRelativeUrl = ImgObj.serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${ImgObj.fileName}`;
  //         try {
  //           const { width, height } = await getImageResolution(serverRelativeUrl);
  //           const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';

  //           console.log(serverRelativeUrl, width, height, orientation);


  //         } catch (error) {
  //           console.error("Error retrieving image resolution:", error);
  //         }
  //       }
  //       return {
  //         ...item,
  //         resolutionCategory
  //       };
  //     }));

  //     this.setState({
  //       Items: updatedItems,
  //       AnncCount: updatedItems.length
  //     });

  //     this.Validate();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // new code
  // private async GetBanner() {
  //   const d = new Date().toISOString();
  //   try {
  //     const items = await sp.web.lists
  //       .getByTitle(Hero_Bannerlist)
  //       .items
  //       .select("Title", "Description", "ExpiresOn", "Image", "ID", "*")
  //       .filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`)
  //       .orderBy("Created", false)
  //       .getAll();


  //     const updatedItems = await Promise.all(items.map(async (item) => {
  //       const resolutionCategory = ResolutionCategory.Low; // Default category

  //       if (item.Image) {
  //         const { serverRelativeUrl, fileName } = JSON.parse(item.Image);
  //         const url = serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${fileName}`;

  //         try {
  //           const { width, height } = await getImageResolution(url);
  //           console.log(url, width, height, width > height ? 'landscape' : width < height ? 'portrait' : 'square');
  //         } catch (error) {
  //           console.error("Error retrieving image resolution:", error);
  //         }
  //       }
  //       return { ...item, resolutionCategory };
  //     }));

  //     if (updatedItems.length != 0) {
  //       this.setState({
  //         isDataAvailable: true
  //       })
  //     } else {
  //       alert("not")
  //       this.setState({
  //         isDataAvailable: false
  //       })
  //     }
  //     this.setState({
  //       Items: updatedItems,
  //       AnncCount: updatedItems.length
  //     });

  //     this.Validate();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // public async createSharePointLists(componantlistNames: any) {
  //   debugger;
  //   alert("List creatin is started")
  //   try {
  //     const listNames: string = componantlistNames
  //     // const listNamesColumn: any[] = ListLibraryColumnDetails.map(list => list.name); // Collect list names
  //     // const totalLists: number = listNamesColumn.length; // `totalLists` is the count of lists

  //     // Initialize progress
  //     // this.setState({
  //     //   showProgessar: true,
  //     //   isCreatingLists: true,
  //     //   progress: 0,
  //     //   loadContent: false,
  //     //   currentList: null, // Ensure the current list is initially null
  //     // });

  //     // Track if any list was newly created
  //     // let anyListCreated = false;

  //     // Loop over each list for creation
  //     // for (let i = 0; i < totalLists; i++) {
  //     //   const listName = listNames[i];
  //     //   if (componantlistNames == listName) {


  //     // Corrected list name assignment
  //     // const columns = ListLibraryColumnDetails[i].columns; // Retrieve columns for the current list

  //     // Update current progress and list name
  //     // this.setState({
  //     //   currentList: listName, // Dynamically update the list name being processed
  //     //   progress: Math.round(((i + 1) / totalLists) * 100), // Calculate progress
  //     // });

  //     // Check if the list exists; if not, create it
  //     const listEnsureResult = await sp.web.lists.ensure(listNames);

  //     if (listEnsureResult.created) {
  //       console.log(`List '${listNames}' created successfully.`);
  //       alert(`List '${listNames}' created successfully`);
  //       // await this.createSharePointColumns(listNames, columns); // Create columns if the list was newly created
  //       // anyListCreated = true;
  //     } else {
  //       // await this.createSharePointColumns(listNames, columns); // Create columns if the list was newly created
  //       console.log(`List '${listNames}' already exists.`);
  //     }
  //     // } else {

  //     // }
  //     // }

  //     // Final progress update
  //     // this.setState({
  //     //   progress: 100,
  //     //   isCreatingLists: false,
  //     //   loadContent: true,
  //     // });

  //     // Reset if no new lists were created
  //     // if (!anyListCreated) {
  //     //   console.log("All lists already existed. No new lists were created.");
  //     //   this.setState({
  //     //     isCreatingLists: false,
  //     //     loadContent: true,
  //     //     progress: 0,
  //     //   });
  //     // }
  //   } catch (error) {
  //     console.error("Error creating lists:", error);

  //     // Handle errors and reset the state
  //     this.setState({
  //       isCreatingLists: false,
  //       currentList: null,
  //       progress: 0,
  //       loadContent: true,
  //     });
  //   }
  // }

  public async createSharePointLists(componentListName: string) {
    try {
      console.log("List creation process started...");

      // Find the list details based on the provided name
      const listDetails = ListLibraryColumnDetails.find(
        (list) => list.name.toLowerCase() === componentListName.toLowerCase()
      );

      if (!listDetails) {
        console.error(`List details for '${componentListName}' not found.`);
        return;
      }

      // Ensure the list exists; create it if it doesn't
      const listEnsureResult = await sp.web.lists.ensure(componentListName);

      if (listEnsureResult.created) {
        console.log(`List '${componentListName}' created successfully.`);
      } else {
        console.log(`List '${componentListName}' already exists.`);
      }

      // Create columns for the list
      console.log(`Adding columns to '${componentListName}'...`);
      await this.createSharePointColumns(componentListName, listDetails.columns);
      console.log(`Columns for '${componentListName}' created successfully.`);
    } catch (error) {
      console.error("Error creating lists or columns:", error);
    }
  }
  public async createSharePointColumns(name: string, columns: any[]): Promise<void> {
    try {
      for (const column of columns) {
        if (!column.columnName || !column.type) {
          console.error("Invalid column data:", column);
          continue;
        }

        let columnExist = false;
        try {
          columnExist = await sp.web.lists.getByTitle(name).fields.getByTitle(column.columnName).get();
        } catch {
          columnExist = false; // Column does not exist
        }

        if (!columnExist) {
          switch (column.type) {
            case "addImageField":
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName, 6, false);
              console.log(`Column '${column.columnName}' added as Image Field.`);
              break;

            case "addBoolean":
              await sp.web.lists.getByTitle(name).fields.addBoolean(column.columnName);
              console.log(`Column '${column.columnName}' added as Boolean.`);
              break;

            case "addTextField":
              await sp.web.lists.getByTitle(name).fields.addText(column.columnName, 255);
              console.log(`Column '${column.columnName}' added as Text Field.`);
              break;

            case "addNumberField":
              await sp.web.lists.getByTitle(name).fields.addNumber(column.columnName);
              console.log(`Column '${column.columnName}' added as Number Field.`);
              break;

            case "addDateField":
              await sp.web.lists.getByTitle(name).fields.addDateTime(column.columnName);
              console.log(`Column '${column.columnName}' added as Date Field.`);
              break;

            case "addMultilineText":
              await sp.web.lists.getByTitle(name).fields.addMultilineText(column.columnName);
              console.log(`Column '${column.columnName}' added as Multiline Field.`);
              break;

            case "Person or Group":
              await sp.web.lists.getByTitle(name).fields.addUser(column.columnName, FieldUserSelectionMode.PeopleOnly);
              console.log(`Column '${column.columnName}' added as Person or Group Field.`);
              break;

            case "addMultiChoice":
              await sp.web.lists.getByTitle(name).fields.addMultiChoice(column.columnName, column.group, false);
              console.log(`Column '${column.columnName}' added as MultiChoice Field.`);
              break;

            case "addLookup":
              if (!column.targetListName || !column.targetListColumn) {
                console.error("Missing target list or column for lookup field:", column);
                break;
              }
              const targetList = await sp.web.lists.getByTitle(column.targetListName).get();
              await sp.web.lists
                .getByTitle(name)
                .fields.addLookup(column.columnName, targetList.Id, column.targetListColumn);
              console.log(`Column '${column.columnName}' added as Lookup Field.`);
              break;

            case "addUrl":
              await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Hyperlink);
              console.log(`Column '${column.columnName}' added as URL Field.`);
              break;

            case "Icon":
              await sp.web.lists.getByTitle(name).fields.addUrl(column.columnName, UrlFieldFormatType.Image);
              console.log(`Column '${column.columnName}' added as Icon (URL field with Image format).`);
              break;

            case "addChoice":
              await sp.web.lists.getByTitle(name).fields.addChoice(
                column.columnName,
                column.choices,
                ChoiceFieldFormatType.Dropdown
              );
              console.log(`Column '${column.columnName}' added as Choice Field.`);
              break;

            default:
              console.log(`Unknown column type: ${column.type}`);
          }

          try {
            await sp.web.lists.getByTitle(name).views.getByTitle("All Items").fields.add(column.columnName);
          } catch (viewError) {
            console.error(`Failed to add column '${column.columnName}' to 'All Items' view:`, viewError);
          }
        }
      }
    } catch (error) {
      console.error("Error during column creation process:", error);
    }
  }

  public hideProgessbar() {
    this.setState({
      showProgessar: false
    })
  }
  private async GetBanner() {
    const d = new Date().toISOString();
    try {
      const items = await sp.web.lists
        .getByTitle(Hero_Bannerlist)
        .items
        .select("Title", "Description", "ExpiresOn", "Image", "ID", "*")
        .filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`)
        .orderBy("Created", false)
        .getAll();


      const updatedItems = await Promise.all(items.map(async (item) => {
        const resolutionCategory = ResolutionCategory.Low; // Default category

        if (item.Image) {
          const { serverRelativeUrl, fileName } = JSON.parse(item.Image);
          const url = serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${item.ID}/${fileName}`;

          try {
            const { width, height } = await getImageResolution(url);
            console.log(url, width, height, width > height ? 'landscape' : width < height ? 'portrait' : 'square');
          } catch (error) {
            console.error("Error retrieving image resolution:", error);
          }
        }
        return { ...item, resolutionCategory };
      }));

      if (updatedItems.length != 0) {
        this.setState({
          isDataAvailable: true
        })
      } else {
        this.setState({
          isDataAvailable: false
        })
      }
      this.setState({
        Items: updatedItems,
        AnncCount: updatedItems.length
      });

      this.Validate();
    } catch (err) {
      console.error(err);
    }
  }


  public async getComponent() {
    try {


      const items = await sp.web.lists
        .getByTitle("ComponentMaster")
        .items
        .select("Title", "*")
        // .filter(`IsActive eq '1'`)
        // .orderBy("Created", false)
        .getAll();

      console.log("ComponentMaster item", items);
      this.setState({
        componentMasterItems: items
      })

    } catch (error) {
      console.log("Error in getlayout", error);

    }
  }
  public async handleSelectChange(event: any) {
    console.log("selected option", event.target.value);

    this.setState({
      selectedValue: event.target.value
    })
  };
  public Validate() {
    const total = this.state.AnncCount;
    this.setState({ TotalItem: total });
  }

  public addData() {
    debugger;
    // const listUrl = `${NewWeb}/Lists/${Hero_Bannerlist}`; // Replace with your list URL

    const listUrl = `${this.props.siteurl}/Lists/${Hero_Bannerlist}`;
    console.log(listUrl);

    // const listUrl = `https://6z0l7v.sharepoint.com/sites/SPTraineeBT/Lists/${Hero_Bannerlist}`; // Replace with your list URL
    window.open(listUrl, "_blank");
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 2500,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const MAslider: JSX.Element[] = this.state.Items.map(({ ID, Title, Image, Description, resolutionCategory }) => {
      let RawImageTxt = Image;
      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = Description;
      var outputText = dummyElement.innerText;

      let resolutionClass = '';
      switch (resolutionCategory) {
        case ResolutionCategory.Low:
          resolutionClass = 'low-resolution';
          break;
        case ResolutionCategory.Medium:
          resolutionClass = 'medium-resolution';
          break;
        case ResolutionCategory.High:
          resolutionClass = 'high-resolution';
          break;
      }

      if (RawImageTxt) {
        var ImgObj = JSON.parse(RawImageTxt);
        var serverRelativeUrl = ImgObj.serverRelativeUrl || `${this.props.siteurl}/Lists/${Hero_Bannerlist}/Attachments/${ID}/${ImgObj.fileName}`;

        return (
          <div className={`item active ${resolutionClass}`} key={ID}>
            <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={serverRelativeUrl} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4>{Title}</h4>
                  <p>{outputText}</p>
                </div>
              </div>
            </a>
          </div>
        );
      } else {
        return (
          <div className={`item ${resolutionClass}`} key={ID}>
            <a href={`${this.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={`${this.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4>{Title}</h4>
                  <p>{outputText}</p>
                </div>
              </div>
            </a>
          </div>
        );
      }
    });

    return (
      <div className="col-md-8 ">

        {this.state.isDataAvailable == true ?
          <div id="myCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div id="if-Banner-Exist" className='hero-banner-container-wrap'>
                <Slider {...settings} className='hero-banner-container-wrap' >
                  {MAslider}
                </Slider>
              </div>
              <div id="if-Banner-not-Exist" className="background" style={{ display: this.state.TotalItem === 0 ? "block" : "none" }}>
                <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/If_no_Content_to_show.png`} alt="no-image-uploaded" />
              </div>
            </div>
          </div>
          :
          // <div className="carousel slide">
          //   <button onClick={() => this.addData()}>Add Data</button>
          // </div>

          // <div id="myCarousel" className="carousel slide" data-ride="carousel">
          //   <div className="carousel-inner">
          <div id="if-Banner-Exist" className='hero-banner-container-wrap'>
            <button onClick={() => this.addData()}>Add Data</button>
            <img src="https://6z0l7v.sharepoint.com/sites/SPTraineeBT/SiteAssets/add_quick.png" alt="add icon" onClick={() => this.getComponent()} />
            <div>
              {/* <select value={this.state.selectedValue} onChange={(e) => this.handleSelectChange(e)}>
                {this.state.componentMasterItems.map((item: any) => {
                  <option key={item.id} value={item.value}>
                    {item.Title}
                  </option>

                })}
              </select> */}
            </div>
          </div>


          //   </div>
          // </div>
        }

      </div>

      // Updated code with progress bar

      // <div className="col-md-8">
      //   {
      //   this.state.showProgessar === false ? (
      //     this.state.isDataAvailable === true ? (
      //       <div id="myCarousel" className="carousel slide" data-ride="carousel">
      //         <div className="carousel-inner">
      //           {/* When banners exist */}
      //           <div id="if-Banner-Exist" className="hero-banner-container-wrap">
      //             <Slider {...settings} className="hero-banner-container-wrap">
      //               {MAslider}
      //             </Slider>
      //           </div>

      //           {/* When no banners exist */}
      //           <div
      //             id="if-Banner-not-Exist"
      //             className="background"
      //             style={{ display: this.state.TotalItem === 0 ? "block" : "none" }}
      //           >
      //             <img
      //               className="err-img"
      //               src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/If_no_Content_to_show.png`}
      //               alt="No content to show"
      //             />
      //           </div>
      //         </div>
      //       </div>
      //     ) : (
      //       <div id="if-Banner-Exist" className="hero-banner-container-wrap">
      //         <button onClick={() => this.addData()}>Add Data</button>
      //         <img
      //           src="https://6z0l7v.sharepoint.com/sites/SPTraineeBT/SiteAssets/add_quick.png"
      //           alt="Add icon"
      //           onClick={() => this.getComponent()}
      //         />
      //         <div>
      //           {/* Uncomment and modify the select dropdown if needed */}
      //           {/* <select value={this.state.selectedValue} onChange={(e) => this.handleSelectChange(e)}>
      //       {this.state.componentMasterItems.map((item: any) => (
      //         <option key={item.id} value={item.value}>
      //           {item.Title}
      //         </option>
      //       ))}
      //     </select> */}
      //         </div>
      //       </div>
      //     )
      //   ) : (
      //     <div id="progressContainer">
      //       <p id="currentListName">Creating: {this.state.currentList}</p>
      //       <ProgressBar
      //         now={this.state.progress}
      //         label={`${Math.round(this.state.progress)}%`}
      //       />
      //     </div>
      //   )}
      // </div>

    );
  }
}
