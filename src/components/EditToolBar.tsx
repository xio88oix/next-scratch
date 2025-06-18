import React from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

interface EditToolbarProps {
  addDisabled: boolean;
  onAdd: () => void;
  label?: string;
}

export default function EditToolbar({ addDisabled, onAdd, label = "Add Item" }: EditToolbarProps) {
  return (
    <GridToolbarContainer>
      <Button
        disabled={addDisabled}
        startIcon={<Add />}
        color="primary"
        onClick={onAdd}
      >
        {label}
      </Button>
    </GridToolbarContainer>
  );
}