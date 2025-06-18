import React, { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { GridRenderCellParams, useGridApiContext } from "@mui/x-data-grid";

interface EditableTextFieldProps {
  params: GridRenderCellParams;
  limit: number;
}

export default function EditableTextField({ params, limit }: EditableTextFieldProps) {
  const { id, value, field, hasFocus } = params;
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.value });
  };

  useEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>(`input[value="${value}"]`);
      input?.focus();
    }
  }, [hasFocus, value]);

  return (
    <TextField
      ref={ref}
      placeholder="*Required"
      inputProps={{ maxLength: limit }}
      error={typeof value === "string" && value.trim() === ""}
      value={value}
      onChange={handleChange}
      required
      sx={{
        width: "100%",
        "& .MuiInputBase-input": { fontSize: "1.6rem", color: "black" },
      }}
    />
  );
}