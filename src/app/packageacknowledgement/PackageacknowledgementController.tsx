"use client";

import {
  GridSlotProps,    
  GridToolbarContainer,
  GridToolbarFilterBUtton,
  useGridApiRef,
  useGridApiContext,
  GridColDef,
  GridRowModesModel,
} from "@mui/x-data-grid";

import { useEffect, useRef, useState } from "react";
import Packageacknowledgement from "./Packageacknowledgement";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";

import {
    useFetchPackageacknowledgement } from "../ServiceHooks/services";

import AdvancedSearchPackageacknowledgement from "./AdvancedSearchPackageacknowledgement";

import {
  MyDialog,
  MySimpleTextDialog,
  WarningAlert,
} from "@/components/CustomComponents";

import MySnackbar from "@/components/MySnackbar";
import BackdropLoader from "@/components/BackdropLoader";

import Loading from "@/components/Loading";
import { getActionsColumn } from "@/components/getActionsColumn";

import dayjs from "dayjs";
import { getApiUrl, useApiUrl } from "@/utils/ApiUtils";
import { sortByDescription } from "@/utils/Utils";

import { QuickActionSelect } from "@/components/toolbar/QuickActionSelect";


//import AdvancedSearchDiscrepancyManagement from "./AdvancedSearchDiscrepancyManagemente";
//import { loadEnvironment } from "@/utils/EnvironmentUtils";
//import { error } from "console";

//import { useGroupedRows } from "@/hooks/useGroupedRows";

//import { ArrowRight, PrintOutlined } from "@mui/icons-material";

export default function PackageacknowledgementController() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState([]);

  //const [openSnackbar, setOpenSnackbar] = useState(false);
  //const [message, setMessage] = useState(null);
  //const [severity, setSeverity] = useState(null);
  //const [openForm, setOpenForm] = useState(false);
  //const [receivingGroup, setReceivingGroup] = useState(null);
  //const [discrepancyStatus, setDiscrepancyStatus] = useState(null);
  //const [discrepancyType, setDiscrepancyTType] = useState(null);
  //const [internalRoute, setInternalRoute] = useState(null);
  //const [alertOpen, setAlertOpen] = useState(false);
  //const [alertTitle, setAlertTitle] = useState("");
  //const [alertMessage, setAlertMessage] = useState("");

  //const [groupBy, setGroupBy] = useState("");
  //const groupedRows = useGroupedRows(rows, groupBy); //apply grouping

  const apiRef = useGridApiRef();
  //const today = new Date();
  //const defaultReceivingDate = new Date(today);
  //defaultReceivingDate.setDate(defaultReceivingDate.getDate() - 3);
  const postApiMark = useApiUrl("/discrepancy/markReadyToReceive");
  const postApiComment = useApiUrl("/discrepancy/addNewComment");
  //Lookup

  //Snackbar
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const [snackBarSeverity, setSnackBarSeverity] = useState(null);

  //WWarning Alert Dialog
  const [warningAlertOpen, setWarningAlertOpen] = useState(false);
  const [warningAlertTitle, setWarningAlertTitle] = useState("");
  const [warningAlertMessage, setWarningAlertMessage] = useState("");
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

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const defaultSearchParams = {
    type: "json",

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
  }, [loading]);


  //const handleGroupChange = (e) => {
  //  setGroupBy(e.target.value);
  //  setUserSearchParam({
  //    ...userSearchParam,
  //    group: e.target.value ? e.target.value : null,
  //    sort: e.target.value ? e.target.value : null,
  //  });
  //};

  const handlePaginationChange = (pagination) => {
    console.log("pagination is now ", pagination);
    setPaginationModel(pagination);
    setUserSearchParam({
      ...userSearchParam,
      limit: pagination.pageSize ?? 15,
      page: pagination.page + 1,
      start: pagination.page * pagination.pageSize,
    });
  };

  const handleSortChange = (newSortModel) => {
    console.log("Sort Model is now ", newSortModel);
    setSortModel(newSortModel);
    if (newSortModel.length > 0) {
      setUserSearchParam({
      ...userSearchParam,
      sort: newSortModel[0].field,
      dir: newSortModel[0].sort.toUpperCase(),
    });
  } else {
    setSortModel([{ field: "startTimestamp", sort: "asc" }]);
    setUserSearchParam({
      ...userSearchParam,
      sort: "ts",
      dir: "DESC",
    });
  }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      setOpenSnackbar(false);
      return;
    }
    setOpenSnackbar(false);
  };

  //PrintQueue

  //Quick Actions
  const quickActions = [

  ];

function EditToolbar() {
  //AdvanceSearch 
  const [advanceSearchOpen, setAdvanceSearchOpen] = useState(false);
  const [advanceSearchStart, setAdvanceSearchStart] = useState(false);
  const handleAdvanceSearchClose = () => {
    setAdvanceSearchOpen(false);
  };
  const handleAdvanceSearchClick = () => {
    setAdvanceSearchOpen(true);
  };
  const handleAdvanceSearchClear = () => {
    setUserSearchParam(defaultSearchParams);
  };

   return (
    <GridToolbarContainer>
      <MyDialog
        props={{
          title: "Advanced Search",
          childred:: AdvancedSearchPackageacknowledgement({
            startSearch: advanceSearchStart,
            setUserSearchParam: setUserSearchParam,
            userSearchParam: userSearchParam,
          })
        }}
        open={advanceSearchOpen ?? false}
        advanceSearch={true}
        handleClick={handleAdvanceSearchClick}
        handleClose={handleAdvanceSearchClose}
        label="Advanced Search"
        variant="text"
        handleSave={() => {
          setAdvanceSearchStart(true);
        }}

      />
      <Button className="button-light" onClick={handleAdvanceSearchClear}>
        Clear Search
      </Button>
      <GridToolbarFilterBButton
        slotProps={{
          button: { className: "button-light" },
        }}
        />
      <QuickActionSelect 
        apiRef={apiRef}
        actions={quickActions}
        showWarningAlert={showWarningAlert}
        />
    </GridToolbarContainer>

   );
}

const cols: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, headerClassName: "col-header" },
];


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
          onClose={() => {
            setAlertOpen(false);
          }}
          title={warningAlertMessage}
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
            onRowDoubleCLick={async (row) => {
              console.log("Double Click! row data is ");
            }}
            />
    </Box>
);
}
