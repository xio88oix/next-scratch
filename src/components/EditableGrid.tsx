import React from "react";
import { DataGrid, GridColDef, GridRowModesModel } from "@mui/x-data-grid";

interface EditableGridProps {
  rows: any[];
  columns: GridColDef[];
  rowModesModel: GridRowModesModel;
  setRowModesModel: (model: GridRowModesModel) => void;
  setRows: (rows: any[]) => void;
  toolbar?: React.ElementType;
  handleRowEditStop: any;
  handleRowModesModelChange: (model: GridRowModesModel) => void;
  handleProcessRowUpdate: (row: any) => Promise<any>;
}

export default function EditableGrid({
  rows,
  columns,
  rowModesModel,
  setRowModesModel,
  setRows,
  toolbar: ToolbarComponent,
  handleRowEditStop,
  handleRowModesModelChange,
  handleProcessRowUpdate
}: EditableGridProps) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      processRowUpdate={handleProcessRowUpdate}
      onRowEditStop={handleRowEditStop}
      components={{
        Toolbar: ToolbarComponent,
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
    />
  );
}