import React from "react";
import { Box } from "@mui/material";

// Add your prop types as appropriate
export default function Packageacknowledgement({
  apiRef,
  rowsData,
  cols,
  rowModesModel,
  setRowModesModel,
  setRows,
  toolbar: Toolbar,
  handlePagination,
  paginationModel,
  rowCount,
  handleSortChange,
  sortModel,
  sortingMode,
  onRowDoubleCLick,
  ackDialog,      // <-- Dialog for acknowledge delivery
  detailsDialog,  // <-- Dialog for package details
}) {
  // ...your logic and grid code...
  return (
    <>
      {ackDialog}
      {detailsDialog}
      <Box>
        {/* Example: The grid, toolbar, etc. */}
        {Toolbar && <Toolbar />}
        {/* ... the rest of your grid ... */}
        {/* 
          Example grid usage:
          <DataGrid
            apiRef={apiRef}
            rows={rowsData}
            columns={cols}
            rowModesModel={rowModesModel}
            onRowDoubleClick={(params) => onRowDoubleCLick(params.row)}
            // ...other props...
          />
        */}
      </Box>
    </>
  );
}