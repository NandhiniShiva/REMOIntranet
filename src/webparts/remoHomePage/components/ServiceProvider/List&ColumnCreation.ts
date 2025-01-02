import { sp, FieldUserSelectionMode, UrlFieldFormatType, ChoiceFieldFormatType } from "sp-pnp-js";
import { ListLibraryColumnDetails } from "./ListsLibraryColumnDetails";


export class ListCreation {
    public async createSharePointLists(componentListName: string) {
        try {
            console.log("List creation process started...");

            // Find the list details based on the provided name
            const listDetails = ListLibraryColumnDetails.find(
                (list) => list.name.toLowerCase() === componentListName.toLowerCase()
            );

            if (!listDetails) {
                // alert(`List details for '${componentListName}' not found.`)
                console.error(`List details for '${componentListName}' not found.`);
                return;
            }

            // Ensure the list exists; create it if it doesn't
            const listEnsureResult = await sp.web.lists.ensure(componentListName);

            if (listEnsureResult.created) {
                console.log(`List '${componentListName}' created successfully.`);
                // alert(`List '${componentListName}' created successfully.`);
            } else {
                console.log(`List '${componentListName}' already exists.`);
                // alert(`List '${componentListName}' already exists.`);
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
                // alert("list and column created")
            }
        } catch (error) {
            console.error("Error during column creation process:", error);
        }
    }
}