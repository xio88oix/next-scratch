"use client";

import { Cancel, Save, Edit, Add } from "@mui/icons-material"; 
import {
    GridColDef,
    GridRowModes,
    GridActionsCellItem,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
  GridRowModesModel,
  GridSlotProps,    
  GridToolbarContainer,
  GridRowModel,
  GridRenderCellParams,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import {    useFetchVehicleTypes } from "../ServiceHooks/services";
import { useEffect, useRef, useState } from "react
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import ViewVehicleTypeGrid from "./ViewVehicleTypeGrid";
import {
  MyDialog,
  MySimpleTextDialog,
  WarningAlert,
} from "@/components/CustomComponents";
import MySnackbar from "@/components/MySnackbar";
import BackropLoader from "@/components/BackdropLoader";
import dayjs from "dayjs";
import AdvancedSearchDiscrepancyManagement from "./AdvancedSearchDiscrepancyManagemente";
import { loadEnvironment } from "@/utils/EnvironmentUtils";
import { error } from "console";
import { useApiUrl } from "@/utils/ApiUtils";
import { useGroupedRows } from "@/hooks/useGroupedRows";
import { sortByDescription } from "@/utils/Utils";
import { ArrowRight, PrintOutlined } from "@mui/icons-material";

export default function VehicleTypesController() {
  const { count, data: vehicleTypeData, loading: vehicleTypeLoading } = useFetchVehicleTypes();  
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const[addDisabled, setAddDisabled] = useState(false);
  const [rows, setRows] = useState([]);
  const postApi = useApiUrl("/vehicletype/");
  constupdateApi = useApiUrl("/vehicletype/");

  const [apiResonse, setApiResponse] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);

    function EditTextField(parentProp: {
        props: GridRenderCellParams;
        limit: number;
    }) {
        const { id, value, field, hasFocus } = parentProp.props;
        const apiRef = useGridApiRef();
        const ref = useRef<HTMLDivElement>(null);
        const handleChange = (event: any) => {
            apiRef.current.setEditCellValue({
                id,
                field,
                value: event.target.value,
            });
        };
        useEffect(() => {
            if (hasFocus && ref.current) {
                    const input = ref.current.querySelector<HTMLInputElement> (`input[value="${value}"]`
                    );


                input?.focus();
            }
    });
        return (
            <TextField
                ref={ref}
                placeholder="*Required"
                inputProps={{maxLength: parentProp.limit }}
                error={value.trim() ===""}
                value={value}
                onChange={handleChange}
                className="body1"
                required
                sx={{
                    width: "100%",
                    "& .MuiInputBase-input": {
                        fontSize: "1.6rem",
                        color: "black",
                    },

                }}
                />
            );
        }
         

const renderEditTextField = (maxLength) => (params) => {
    return <EditTextField props={{...params}} limit={maxLength} />;
}

const  handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (apiResponse) {
      setOpenLoader(false);

    }
  }, [apiResponse]);

  useEffect(() => {
    if (!vehicleTypeLoading) {
      setRows(vehicleTypeData);
    }
  }, [vehicleTypeLoading, vehicleTypeData]);    

  useEffect(() => {
    if (Object.keys(rowModesModel).length === 0) {
        setAddDisabled(false);
    } else {
        setAddDisabled(true);
    }
  }, [rowModesModel]);

  
  function EditToolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
        const id = rows.length + 1;
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                shortDescription: "",
                longDescription: "",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            [-1]: {
                mode: GridRowModes.Edit,
                fieldToFocus: "shortDescription",
            },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                disabled={addDisabled}
                className="button-light"
                startIcon={<Add />}
                color="primary"
                onClick={handleClick}
                >Add Item</Button>
                </GridToolbarContainer>
    );
}

const isRowValid = (row) => {
  let valid = true;
  if (!row.shortDescription || row.shortDescription.trim() === "") {
    valid = false;
  }
  if (!row.longDescription || row.longDescription.trim() === "") {
    valid = false;
  }
  const existingDiscrepancy = rows.find(
    (r) => r.shortDescription === row.shortDescription && r.id !== row.id
  );
  if (existingDiscrepancy) {
    valid = false;
  }

  return valid;    
};

const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "shortDescription" },
    });
};

const handleCancelClick = (id: GridRowId) => () => {
  const indexToFocus = cols.findIndex((c) => c.editable === true);
  setRowModesModel({
    ...rowModesModel, 
    [id]: { mode: GridRowModes.Edit, fieldToFocus: cols[indexToFocus].field },
  });
  const editedRow = rows.find((row) => row.id === id);
  if (editedRow.isNew) {
    setRows(rows.filter((row) => row.id !== id));
  }
};

const handleUpdateClick = (id: GridRowId) => async () => {
  setRowModesModel({
    ...rowModesModel,
    [id]: { mode: GridRowModes.View },
  });
};

const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
  setRowModesModel(newRowModesModel);
};

const handleRowEditStop: GridEventListener<"rowEditStop"> = (
  params,
  events
) => {
  if (params.reason === GridRowEditStopReasons.RowFocusOut) {
    events.defaultMuiPrevented = true;
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View, ignoreModifications: true },});
      const editedRow = rows.find((row) => row.id === params.id);
      if (editedRow!.isNew) {
        setRows(rows.filter((row) => row.id !== params.id));
      }
    }
  };

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    let updatedRow = { ...newRow };
    let somethingChanged = false;
    cols.map((col) => {
      let field = col.field;
      let existingRow = rows.find((row) => row.id === updatedRow.id);
      if (existingRow < 0) {
        somethingChanged = true;
      } else {
        if (rows[existingRow][field] !== updatedRow[field]) {
          somethingChanged = true;
        }
      }
      });
      let currentRow = rows.find((r) => r.id === updatedRow.id);
      let updateSuccess = false;
      if (somethingChanged && isRowValid(updatedRow)) {
        if (updatedRow.id < 0) {
          setOpenLoader(true);
          const newBody = {
            id: null,
            shortDescription: updatedRow.shortDescription,
            longDescription: updatedRow.longDescription,  
          };
          try {
            await fetch(postApi, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newBody),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data) {
                  setApiResponse(data);
                  if (data.success) {
                    updatedRow = {...updatedRow, id: data.data.id};
                    setMessage("save Succesful");
                    setSeverity("success");
                    setOpenSnackbar(true);
                    setRows(rows.map((r) => r.id !== -1));
                    }
                  });
                } catch (e) {
                  console.log(e);
                  setMessage("Sever Error");
                  setSeverity("error");
                  setOpenSnackbar(true);
                  setRows(rows);
                  setOpenLoader(false);
                }
              } else {
                setOpenLoader(true);
                try {
                  await fetch(updateApi + newRow.id, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedRow),
                  })
              .then((res) => res.json())
              .then((data) => {
                setApiResponse(data);
                if (data.success) {
                  setMessage("Update Successful");
                  setSeverity("success");
                  setOpenSnackbar(true);
                  setRows(rows.map((row) => (r.id === newRowid ? updatedRow : r)));
                  updateSuccess = true;
                } else {
                  setMessage(data.failureMessage);
                  setSeverity("error");
                  setOpenSnackbar(true);
                  setRows(rows);
                }
              });
            } catch (e) {
              console.log(e);
              setMessage("Server Error");
              setSeverity("error");
              setOpenSnackbar(true);
              setRows(rows.filter((r) => r.id !== -1));
              setOpenLoader(false);
            }
          }
        }
        if (!isRowValid(updateRow)) {
          setMessage("invalid Input Values!");
          setSeverity("error");
          setOpenSnackbar(true);
          return;
        }
        return updateSuccess ? updatedRow : currentRow;
      };

      const cols = [
        {field: "id" },
        {
          field: "shortDescription",
          headerName: "Type",
          flex: 1,
          headerClassName: "col-header",
          type: "string",
          editable: true,
          renderEditCell: renderEditTextField(10),
        },
        {
          field: "longDescription",
          headerName: "Description",
          flex: 1,
          headerClassName: "col-header",
          type: "string",
          editable: true,
          renderEditCell: renderEditTextField(255),
        },
        {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          headerClassName: "col-header",
          cellClassName: "actions",
          preProcessEditCellProps: (params) => {
            console.log("The params are ", params);
            return { ...params } ;
          },
          getActions: ({ id }) => {
            const inEdit = rowModesModel[id]?.mode === GridRowModes.Edit;
            if (inEdit) {
              return [
                <GridActionsCellItem
                  key="save"
                  icon={<Save />}
                  label="Save"
                  className="textPrimary"
                  onClick={handleUpdateClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  key="cancel"
                  icon={<Cancel />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
            return [
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                title="Edit"
                size="large"
                sx={
                  addDisabled
                    ? { display: "none" }
                    : {
                      color: "#122C38",
                      "& .MuiSvgIcon-root": {
                        fontSize: "2.6rem",
                      },
                    }
                }
                onClick={handleEditClick(id)}
              />,
            ];

          },

        },
        
      ];

      return vehicleTypeLoading ? (
        <>
          <Box sx={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                height: "70vh",
                flexGrow: "1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          </Box>
        </>
      ) : (
        <Box className="simpleGrid">
          <MySnackbar
            open={openSnackbar}
            onClose={handleClose}
            autoHideDuration={8000}
            message={message}
            severity={severity}
          />
          <BackropLoader open={openLoader} />
          <Box className="simpleGrid__headerBox">
            <h1>Vehicle Types</h1>
          </Box>
          <ViewVehicleTypeGrid
            rowsData={rows}
            cols={cols}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            setRows={setRows}
            toolbar={EditToolbar}
            handleRowEditStop={handleRowEditStop}
            handleRowModesModelChange={handleRowModesModelChange}
            handleProcessRowUpdate={handleProcessRowUpdate}
            />
        </Box>
      );  
    }