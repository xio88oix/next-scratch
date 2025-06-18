import React from "react";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Save, Cancel, Edit } from "@mui/icons-material";

export function getActionsColumn({ rowModesModel, handleUpdateClick, handleCancelClick, handleEditClick, addDisabled }) {
  return {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    headerClassName: "col-header",
    cellClassName: "actions",
    getActions: ({ id }) => {
      const inEdit = rowModesModel[id]?.mode === GridRowModes.Edit;
      if (inEdit) {
        return [
          <GridActionsCellItem key="save" icon={<Save />} label="Save" onClick={handleUpdateClick(id)} color="inherit" />,
          <GridActionsCellItem key="cancel" icon={<Cancel />} label="Cancel" onClick={handleCancelClick(id)} color="inherit" />
        ];
      }
      return [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          title="Edit"
          size="large"
          sx={addDisabled ? { display: "none" } : {
            color: "#122C38",
            "& .MuiSvgIcon-root": { fontSize: "2.6rem" }
          }}
          onClick={handleEditClick(id)}
        />
      ];
    }
  };
}