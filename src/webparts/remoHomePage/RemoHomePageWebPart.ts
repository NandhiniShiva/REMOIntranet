import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'RemoHomePageWebPartStrings';
import RemoHomePage from './components/RemoHomePage';
import { IRemoHomePageProps } from './components/IRemoHomePageProps';





export interface IRemoHomePageWebPartProps {
  description: string;
  createList: boolean;
  listName: string;



}

export default class RemoHomePageWebPart extends BaseClientSideWebPart<IRemoHomePageWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();

    // sp.setup({
    //   spfxContext: this.context
    // });
    return new Promise<void>((resolve, _reject) => {

      // this.properties.listName = Newslist;
      this.properties.createList = true;


      resolve(undefined);


    }
    )
  }




  public render(): void {
    const element: React.ReactElement<IRemoHomePageProps> = React.createElement(
      RemoHomePage,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        userid: this.context.pageContext.legacyPageContext["userId"],
        createList: this.properties.createList,
        name: this.properties.listName,

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }



  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
