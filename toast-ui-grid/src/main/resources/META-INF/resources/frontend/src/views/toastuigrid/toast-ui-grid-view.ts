import "@vaadin/button";
import "@vaadin/text-field";
import {FeatureTable} from "../../views/components/Table/FeaturesTable";
import "tui-grid/dist/tui-grid.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
// import {createRoot} from "react-dom/client";
import ReactDOM from "react-dom";
import {OptColumn, OptSummaryData} from "tui-grid/types/options";
import CustomTextEditor from "../../views/components/Table/CustomeEditor";

window["toastuigrid"] = {
    _createGrid: function (container: HTMLElement, itemsJson: any, optionsJson: any, _: any) {
        let parsedItems = JSON.parse(itemsJson);
        let parsedOptions = JSON.parse(optionsJson);

        // Implementation goes here
        let gridTable: FeatureTable = new FeatureTable({
            TableData: this.getTableData(parsedItems),
            columns: this.getColumns(JSON.parse(parsedOptions.columns)),
            summary: this.getSummary(parsedOptions.summary),
            columnOptions: parsedOptions.columnOptions,
            header: this.getHeader(parsedOptions.header),
            width: parsedOptions.width,
            bodyHeight: parsedOptions.bodyHeight,
            scrollX: parsedOptions.scrollX,
            scrollY: parsedOptions.scrollY,
            rowHeaders: parsedOptions.rowHeaders ? this.getRowHeaders(parsedOptions.rowHeaders) : null,
            treeColumnOptions: parsedOptions.treeColumnOptions ? JSON.parse(parsedOptions.treeColumnOptions) : null,
        });
        container.grid = gridTable;
        container.grid.expand = (ev: any) => {
            const {rowKey} = ev;
            const descendantRows = container.grid.getDescendantRows(rowKey);

            //console.log('rowKey: ' + rowKey);
            //console.log('descendantRows: ' + descendantRows);

            if (!descendantRows.length) {
                container.grid.appendRow(
                    {
                        name: 'dynamic loading data',
                        _children: [
                            {
                                name: 'leaf row'
                            },
                            {
                                name: 'internal row',
                                _children: []
                            }
                        ]
                    },
                    {parentRowKey: rowKey}
                );
            }
        };
        container.grid.collapse = (ev: any) => {
            const {rowKey} = ev;
            const descendantRows = container.grid.getDescendantRows(rowKey);

            //console.log('rowKey: ' + rowKey);
            //console.log('descendantRows: ' + descendantRows);
        };

        ReactDOM.render(gridTable.render(), container);
        // createRoot(container).render(gridTable.render());
    },
    create(container: HTMLElement, itemsJson: any, optionsJson: any) {
        setTimeout(() => this._createGrid(container, itemsJson, optionsJson, null));
    },
    _setColumnContentMatchedName(columnContent) {
        const onSum = () => {
            return {
                template: (valueMap) => {
                    return `Sum: ${valueMap.sum}`;
                }
            }
        };
        const onAvg = () => {
            return {
                template: (valueMap) => {
                    return `AVG: ${valueMap.avg.toFixed(2)}`;
                }
            }
        };
        const onMax = () => {
            return {
                template: (valueMap) => {
                    return `MAX: ${valueMap.max}`;
                }
            }
        };

        switch (columnContent[Object.keys(columnContent)[0]]) {
            case "sum":
                columnContent[Object.keys(columnContent)[0]] = onSum();
                break;
            case "avg":
                columnContent[Object.keys(columnContent)[0]] = onAvg();
                break;
            case "max":
                columnContent[Object.keys(columnContent)[0]] = onMax();
                break;
            default:
                columnContent[Object.keys(columnContent)[0]] = onSum();
                break;
        }
    },
    getHeader(parsedHeader) {
        if (!parsedHeader.hasOwnProperty('complexColumns'))
            return null;
        else {
            let header = parsedHeader.height != 0 ? {
                height: parsedHeader.height,
                complexColumns: this.getComplexColumns(parsedHeader.columnContent)
            } : {
                complexColumns: this.getComplexColumns(parsedHeader.columnContent)
            };
            return header;
        }
    },
    getTableData(parsedData) {
        let listData = parsedData;
        for (const data of listData) {

            if (data.hasOwnProperty('_attributes') &&
                data.hasOwnProperty('_children')) {
                data._children = this.getTableData(JSON.parse(data._children));
                // data._children = JSON.parse(data._children);
            }
        }
        return listData;
    },
    getRowHeaders(parsedRowHeaders) {
        return parsedRowHeaders.slice(1, -1).split(",").map((item) => item.trim());
    },
    getComplexColumns(parsedColumnContent) {
        let complexColumns = JSON.parse(parsedColumnContent);
        for (const complexColumn of complexColumns) {
            complexColumn.childNames = complexColumn.childNames.slice(1, -1).split(", ").map((item) => item.trim());
        }
        return complexColumns;
    },
    getSummary(parsedSummary) {
        if (parsedSummary == undefined || !parsedSummary.hasOwnProperty('columnContent'))
            return null;
        let summaries: OptSummaryData = parsedSummary;
        let columnContents = JSON.parse(summaries.columnContent);
        for (const columnContent of columnContents) {
            this._setColumnContentMatchedName(columnContent);
        }

        return summaries = {
            height: summaries.height ? summaries.height : 40,
            position: summaries.position,
            columnContent: columnContents.reduce((acc, obj) => {
                const key = Object.keys(obj)[0];
                const value = obj[key];
                acc[key] = value;
                return acc;
            }, {})
        }
    },
    getColumns(parsedColumn) {
        let columns: OptColumn[] = parsedColumn;
        for (const column of columns) {
            if (column.editor && column.editor.type == "input") {
                column.editor.type = CustomTextEditor;
            }
            if (column.hasOwnProperty('editor') &&
                column.editor.hasOwnProperty('options') &&
                !column.editor.options.hasOwnProperty('maxLength')) {

                column.editor.options = JSON.parse(column.editor.options);
                if (column.editor.options.hasOwnProperty('fromYear') &&
                    parseInt(column.editor.options.fromYear) > 0) {
                    let fromYear = parseInt(column.editor.options.fromYear);
                    let fromMonth = parseInt(column.editor.options.fromMonth);
                    let fromDay = parseInt(column.editor.options.fromDay);
                    let toYear = parseInt(column.editor.options.toYear);
                    let toMonth = parseInt(column.editor.options.toMonth);
                    let toDay = parseInt(column.editor.options.toDay);
                    column.editor.options = {
                        selectableRanges: [[new Date(fromYear, fromMonth - 1, fromDay), new Date(toYear, toMonth - 1, toDay)]]
                    };
                }
            }
        }
        return columns;
    },
    setOptions: function (container, optionsJson) {
        container.grid.setOption(optionsJson);
    },
    setTest: function (container, content) {
        console.log("Event Test: ", content);
    },
}