"use client";

import {
  GridToolbarContainer,
  useGridApiRef,
  GridColDef,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Packageacknowledgement from "./Packageacknowledgement";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useFetchPackageacknowledgement } from "../ServiceHooks/services";
import AdvancedSearchPackageacknowledgement from "./AdvancedSearchPackageacknowledgement";
import {
  MyDialog,
  WarningAlert,
} from "@/components/CustomComponents";
import MySnackbar from "@/components/MySnackbar";
import Loading from "@/components/Loading";
import { QuickActionSelect } from "@/components/toolbar/QuickActionSelect";
import dayjs from "dayjs";
import { useApiUrl } from "@/utils/ApiUtils";

export default function PackageacknowledgementController() {
  // --- Dialog state for acknowledge delivery ---
  const [ackDialogOpen, setAckDialogOpen] = useState(false);
  const [ackDialogRows, setAckDialogRows] = useState<any[]>([]);
  const [receivedDate, setReceivedDate] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  // --- Dialog state for details dialog ---
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsDialogRow, setDetailsDialogRow] = useState<any | null>(null);

  // --- Misc state ---
  const apiRef = useGridApiRef();
  const postApiMark = useApiUrl("/discrepancy/markReadyToReceive");
  const postApiComment = useApiUrl("/discrepancy/addNewComment");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState([]);
  const [discrepancyStatus, setDiscrepancyStatus] = useState([null]);
  const [discrepancyType, setDiscrepancyType] = useState([null]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarSeverity, setSnackBarSeverity] = useState<string | null>(null);
  const [warningAlertOpen, setWarningAlertOpen] = useState(false);
  const [warningAlertTitle, setWarningAlertTitle] = useState("");
  const [warningAlertMessage, setWarningAlertMessage] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const defaultSearchParams = {
    type: "json",
    son: null,
    acknowledgementDateFrom: null,
    acknowledgementDateTo: null,
    finalDestination: null,
    offloadLocation: null,
    page: paginationModel.page + 1,
    start: 0,
    limit: paginationModel.pageSize,
    sort: null,
    dir: "ASC",
  };
  const [userSearchParam, setUserSearchParam] = useState(defaultSearchParams);

  const { count, data, loading } = useFetchPackageacknowledgement(userSearchParam);

  const [sortModel, setSortModel] = useState([
    { field: "startTimestamp", sort: "asc"},
  ]);

  useEffect(() => {
    if (!loading) {
      setRows(data);
    }
  }, [loading, data]);

  const showWarningAlert = (title: string, message: string) => {
    setWarningAlertTitle(title);
    setWarningAlertMessage(message);
    setWarningAlertOpen(true);
  };
  
  const showSnackBar = (message: string, severity: string) => {
    setSnackBarSeverity(severity);
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  }

  const handlePaginationChange = (pagination) => {
    setPaginationModel(pagination);
  };

  const handleSortChange = (newSortModel) => {
    setSortModel(newSortModel);
  };

  const handleSnackbarClose = () => setSnackBarOpen(false);

  // --- Quick Actions: Acknowledge Delivery opens dialog instead of direct POST ---
  const quickActions = [
    {
      label: "Acknowledge Delivery",
      needsDialog: false,
      dialogTitle: "Acknowledge Delivery",
      dialogFieldLabel: "Comment",
      dialogFieldMultiline: true,
      onClick: (rows) => {
        const nonLiveRows = rows.filter((row) => row.receivedByCustomer);
        if (nonLiveRows.length > 0) {
          showWarningAlert(
            "Invalid Package(s)",
            "One or more packages selected have already been acknowledged."
          );
          return;
        }
        setAckDialogRows(rows);
        setReceivedDate('');
        setDetails('');
        setAckDialogOpen(true);
      },
    },
    // ...other actions...
  ];

  // --- Handler for dialog save ---
  const handleAckDialogSave = async () => {
    const rows = ackDialogRows;
    const ids = rows.map((row) => row.id);
    const formBody = new URLSearchParams();
    formBody.append("ids", ids.join(","));
    formBody.append("receivedDate", receivedDate);
    formBody.append("details", details);

    await fetch("/packageacknowledgement/acknowledgeDelivery", {
      method: "POST",
      body: formBody,
    });
    setAckDialogOpen(false);
    showSnackBar("Acknowledgement recorded.", "success");
  };

  // --- Handler for dialog close/cancel ---
  const handleAckDialogClose = () => {
    setAckDialogOpen(false);
  };

  // --- Handler for row double click: open details dialog ---
  const handleRowDoubleClick = (row) => {
    setDetailsDialogRow(row);
    setDetailsDialogOpen(true);
  };
  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setDetailsDialogRow(null);
  };

  // --- DataGrid columns (example) ---
  const cols: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, headerClassName: "col-header", type: "string",
      renderCell: (params) => params.row.isGroup || !params.value ? "" : params.value,
      editable: true,
    },
    { field: "packageId", headerName: "SON", flex: 1, headerClassName: "col-header", type: "string",
      renderCell: (params) => params.row.isGroup || !params.value ? "" : params.value,
      editable: true,
    },
    { field: "cargoStatusDisplay", headerName: "Status", flex: 1, headerClassName: "col-header", type: "string",
      renderCell: (params) => params.row.isGroup || !params.value ? "" : params.value,
      editable: true,
    },
    { field: "missionOffloadName", headerName: "Mission Offload", flex: 1, headerClassName: "col-header", type: "string",
      renderCell: (params) => params.row.isGroup || !params.value ? "" : params.value,
      editable: true,
    },
    { field: "finalDestinationName", headerName: "Final Destination", flex: 1, headerClassName: "col-header", type: "string",
      renderCell: (params) => params.row.isGroup || !params.value ? "" : params.value,
      editable: true,
    },
    { field: "receivedDate", headerName: "Acknowledgement Date", flex: 1, headerClassName: "col-header", type: "Date",
      minWidth:200,   
      renderCell: (params) => params.row.isGroup || !params.value ? "" : dayjs(new Date(params.value)).format("DD MMM YYYY HH:mm"),
      valueGetter: (val) => {
        return val.value ? new Date(val) : null;
      },
      valueFormatter: (val) => {
        if (!val) return "";
        return dayjs(new Date(val.value)).format("DD MMM YYYY HH:mm");
      },
      editable: true,
    },
  ];

  // --- Dialog JSX for acknowledge delivery ---
  const ackDialog = (
    <Dialog open={ackDialogOpen} onClose={handleAckDialogClose}>
      <DialogTitle>Acknowledge Delivery</DialogTitle>
      <DialogContent>
        <TextField
          label="Received Date"
          type="date"
          value={receivedDate}
          onChange={(e) => setReceivedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAckDialogClose} color="secondary">Close</Button>
        <Button onClick={handleAckDialogSave} color="primary" variant="contained" disabled={!receivedDate}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  // --- Dialog JSX for package details ---
  const detailsDialog = (
    <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Package Details</DialogTitle>
      <DialogContent dividers>
        {detailsDialogRow && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Field label="Package ID" value={detailsDialogRow.packageId} />
            <Field label="Package Status" value={detailsDialogRow.cargoStatusDisplay} />
            <Field label="Offload Location" value={detailsDialogRow.offloadName} />
            <Field label="Destination" value={detailsDialogRow.finalDestinationName} />
            <Field label="Acknowledgement Date" value={detailsDialogRow.receivedDate} />
            <Field label="Acknowledgement User" value={detailsDialogRow.packageRecipient} />
            <Field label="Acknowledgement Receipt" value={detailsDialogRow.receivedByCustomer ? "Yes" : "No"} />
            <Field label="Receive Comments" value={detailsDialogRow.comments} />
            <Field label="Delivery Comments" value={detailsDialogRow.deliveryComments} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDetailsDialogClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // --- Helper field display component ---
  function Field({ label, value }) {
    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography variant="subtitle2" sx={{ minWidth: 180 }}>{label}:</Typography>
        <Typography variant="body1">{value ?? ""}</Typography>
      </Box>
    );
  }

  // --- Toolbar ---
  function EditToolbar() {
    const [advanceSearchOpen, setAdvanceSearchOpen] = useState(false);
    const [advanceSearchStart, setAdvanceSearchStart] = useState(false);
    const handleAdvanceSearchClose = () => setAdvanceSearchOpen(false);
    const handleAdvanceSearchClick = () => setAdvanceSearchOpen(true);
    const handleAdvanceSearchClear = () => setUserSearchParam(defaultSearchParams);

    return (
      <GridToolbarContainer>
        <MyDialog
          props={{
            title: "Advanced Search",
            childred: AdvancedSearchPackageacknowledgement({
              discrepancyStatus: discrepancyStatus,
              discrepancyType: discrepancyType,
              startSearch: advanceSearchStart,
              setUserSearchParam: setUserSearchParam,
              userSearchParam: userSearchParam,
            }),
          }}
          open={advanceSearchOpen ?? false}
          advanceSearch={true}
          handleClick={handleAdvanceSearchClick}
          handleClose={handleAdvanceSearchClose}
          label="Advanced Search"
          variant="text"
          handleSave={() => setAdvanceSearchStart(true)}
        />
        <Button className="button-light" onClick={handleAdvanceSearchClear}>
          Clear Search
        </Button>
        <QuickActionSelect 
          apiRef={apiRef}
          actions={quickActions}
          showWarningAlert={showWarningAlert}
        />
      </GridToolbarContainer>
    );
  }

  return loading ? (
    <Loading />
  ) : (
    <Box className="simpleGrid">
      <MySnackbar
        open={snackBarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={8000}
        message={snackBarMessage}
        severity={snackBarSeverity}
      />
      <WarningAlert
        open={warningAlertOpen}
        onClose={() => setWarningAlertOpen(false)}
        title={warningAlertTitle}
        message={warningAlertMessage}
      />
      <Box className="simpleGrid__headerBox">
        <h1>Package Acknowledgement</h1>
      </Box>
      <Packageacknowledgement
        apiRef={apiRef}
        rowsData={rows}
        cols={cols}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        setRows={setRows}
        toolbar={EditToolbar}
        handlePagination={handlePaginationChange}
        paginationModel={paginationModel}
        rowCount={count}
        handleSortChange={handleSortChange}
        sortModel={sortModel}
        sortingMode={"client"}
        onRowDoubleCLick={handleRowDoubleClick}
        ackDialog={ackDialog}
        detailsDialog={detailsDialog}
      />
    </Box>
  );
}