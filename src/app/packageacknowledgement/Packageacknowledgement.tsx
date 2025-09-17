"use client";

import { MyDataGrid } from "@/components/CustomComponents";
import { GridRowsProp } from "@mui/x-data-grid";
import { GridEventListener, GridRowModesModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import { GridRowModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;

    }
}

export default function Packageacknowledgement(props: {
    apiRef?: any;
    rowsData: any[];
    cols: any[];
    rowModesModel: any;
    setRows: Dispatch<SetStateAction<any[]>>;
    setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
    handleRowModesModelChange?: (newRowModesModel: GridRowModesModel) => void;
    toolbar?: any;
    handleRowEditStop?: GridEventListener<"rowEditStop">;
    handleProcessRowUpdate?: (newRow: GridRowModel) => Promise<any>;
    preProcessEditCellProps?: (paams) => any;
    handlePagination?: (pagination: any) => void;
    rowCount?: any;
    paginationModel?: any;
    customFooter?: any;
    handleSortChange?: (sortMode: any) => void;
    sortModel?: any;
    sortingMode?: any;
    isRowSelectable?: any;
    getRowClassName?: any;
    onRowDoubleClick?: (any) => void;
}) {
    const setRows = props.setRows;
    const setRowModesModel = props.setRowModesModel;
    const router = useRouter();

    return (
        <>
            <MyDataGrid
                sortModel={props.sortModel}
                apiRef={props.apiRef}
                rows={props.rowsData}
                cols={props.cols}
                onSortModelChange={props.handleSortChange}
                onPaginationModelChange={props.handlePagination}
                onRowDoubleClick={props.onRowDoubleClick}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id:false,

                        },
                    },
                }}
                paginationModel={props.paginationModel}
                pageSizeOptions={[15, 25, 50, 100]}
                editMode="row"
                rowModesModel={props.rowModesModel}
                onRowEditStop={props.handleRowEditStop}
                onRowModesModelChange={props.handleRowModesModelChange}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                slots={{ toolbar: props.toolbar ?? null }}
                processRowUpdate={props.handleProcessRowUpdate}
                onProcessRowUpdateError={(e) => ""}
                rowCount={props.rowCount}
                paginationMode="server"
                sortingMode="server"
                checkboxSelection
                isRowSelectable={props.isRowSelectable}
                getRowClassName={props.getRowClassName}
                />
        </>
    );
}