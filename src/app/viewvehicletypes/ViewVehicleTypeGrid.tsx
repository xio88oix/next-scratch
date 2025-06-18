"use client";

import { MyDataGrid } from "@/components/CustomComponents";
import { GridRowsProp } from "@mui/x-data-grid";
import { GridEventListener, GridRowModesModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import { GridRowModel } from "@mui/x-data-grid";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;  
}   
}

export default function ViewVehicleTypeGrid(props: {
    rowsData: any[];
    cols: any[];
    rowModesModel: any;
    setRows: Dispatch<SetStateAction<any[]>>;
    setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
    handleRowModesModelChange?: (
        newRowModesModel: GridRowModesModel) => void;
        toolbar?: any;
        handleRowEditStop?: GridEventListener<"rowEditStop">;
        handleProcessRowUpdate?: (newRow: GridRowModel) => Promise<any>;
        preProcessRowUpdate?: (params) => any;
    }) {
        const setRows = props.setRows;
        const setRowModesModel = props.setRowModesModel;
        
        return (
            <>
            <MyDataGrid
                rows={props.rowsData}
                cols={props.cols}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25, {value: -1, label: "All"}]}
                editMode="row"
                rowModesModel={props.rowModesModel}
                onRowEditStop={props.handleRowEditStop}
                onRowModesModelChange={props.handleRowModesModelChange}
                slotProps={{
                    toolbar: {
                        setRows, setRowModesModel },
                }}
                slots={{
                    toolbar: props.toolbar ?? null}}
                onEditCellChange={(params, event) => {
                    console.log("the param value is : ", params);
                    console.log("the event value is : ", event);
                }}
                ProcessRowUpdate={props.handleProcessRowUpdate}
                onProcessRowUpdateError={(e)=>''}
            />
            </>
        );

    }

        