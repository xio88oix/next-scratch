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
  ackDialog, // <-- Add the dialog prop here
}) {
  // Your DataGrid and grid logic goes here.
  // For illustration, this is a placeholder for your grid code.
  // Replace with your DataGrid (or similar) component.

  return (
    <>
      {/* Render the dialog at the root */}
      {ackDialog}

      <Box>
        {/* Example: The grid, toolbar, etc. */}
        {Toolbar && <Toolbar />}
        {/* ... the rest of your grid ... */}
      </Box>
    </>
  );
}