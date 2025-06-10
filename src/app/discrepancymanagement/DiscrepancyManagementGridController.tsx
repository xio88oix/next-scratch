"use client";

import {
  GridRowModesModel,
  GridSlotProps,    
  GridToolbarContainer,
  GridToolbarFilterBUtton,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
    useFetchBaseUrl,
    useFetchDiscrepancyData,
    useFetchDiscrepancyStatus,
    useFetchDiscrepancyType,
} from "../ServiceHooks/services";
import { useEffect, useRef, useState } from "react";
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
  Paper,
  Select,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import DiscrepancyManagementGrid from "./DiscrepancyManagementGrid";
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

export default function DiscrepancyManagementGridController() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [receivingGroup, setReceivingGroup] = useState(null);
  const [discrepancyStatus, setDiscrepancyStatus] = useState(null);
  const [discrepancyType, setDiscrepancyTType] = useState(null);
  const [internalRoute, setInternalRoute] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [groupBy, setGroupBy] = useState("");
  const groupedRows = useGroupedRows(rows, groupBy); //apply grouping

  const apiRef = useGridApiRef();
  const today = new Date();
  const defaultReceivingDate = new Date(today);
  defaultReceivingDate.setDate(defaultReceivingDate.getDate() - 3);
  const postApiMark = useApiUrl("/discrepancy/markReadyToReceive");
  const postApiComment = useApiUrl("/discrepancy/addNewComment");

  const showWarningAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  }

  const showSnackBar = (message: string, severity: string) => {
    setSeverity(severity);
    setMessage(message);
    setAlertOpen(true);
  }

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const defaultSearchParams = {
    type: "json",
    discrepancyStatus: 1,
    son: null,
    dateIdentifiedStart: null,
    dateIdnetifiedEnd: null,
    dateResolveStart: null,
    dateResolveEnd: null,
    description: null,
    comments: null,
    trackingNumber: null,
    discrepancyType: null,
    discrepancyId: null,
    group: groupBy ? groupBy : null,
    page: paginationModel.page + 1,
    start: 0,
    limit: paginationModel.pageSize,
    sort: groupBy ? groupBy : null,
    dir: "ASC",
  };
  const [userSearchParam, setUserSearchParam] = useState(defaultSearchParams);

  const { count, data, loading } = useFetchDiscrepancyData(userSearchParam);
  const { data: dsData, loading: dsLoading } = useFetchDiscrepancyStatus();
  const { data: dtData, loading: dtLoading } = useFetchDiscrepancyType();
  const { baseUrl, baseUrlLoading } = useFetchBaseUrl();
  const [sortModel, setSortModel] = useState([
    { field: "startTimestamp", sort: "asc"},
  ]);

  const handleGroupChange = (e) => {
    setGroupBy(e.target.value);
    setUserSearchParam({
      ...userSearchParam,
      group: e.target.value ? e.target.value : null,
      sort: e.target.value ? e.target.value : null,
    });
  };

  const handlePaginationChange = (pagination) => {
    console.log("pagination is now ", pagination);
    setPaginationModel(pagination);
    setUserSearchParam({
      ...userSearchParam,
      limit: pagination.pageSize ?? 15,
      page: pagination.page + 1,
      group: groupBy ? groupBy : null,
      sort: groupBy ? groupBy : null,
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

  useEffect(() => {
    if (!loading && !dsLoading && !dtLoading) {
      setRows(data);
      setDiscrepancyStatus(sortByDescription(dsData));
      setDiscrepancyTType(sortByDescription(dtData));
    }
  }, [loading, dsLoading, dtLoading]);

  useEffect(() => {
    setSortModel([]);
  }, [groupBy]);

function MyExportMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const [showMenu1, setShowMenu1] = useState(false);
    const [showMenu2, setShowMenu2] = useState(false);

    const handleButtonClick = (e) => {
        setShowMenu((prev) => !prev);
    };
    const handleMenuClick1 = (e) => {
        setShowMenu1((prev) => !prev);
    };
    const handleMenuClick2 = (e) => {
        setShowMenu2((prev) => !prev);
    };
    const ref: any = useRef();

    useEffect(() => {
        const handler = (event: any) => {
            if (showMenu && ref.current && !ref.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
            document.removeEventListener("keydown", handler);
        };
    }, [showMenu]);

    const handlePrint = (printType: number) => (e) => {
      const filterField =
        apiRef?.current?.state?.filter?.filterModel?.items[0]?.field;
      const filterValue =
        apiRef?.current?.state?.filter?.filterModel?.items[0]?.value;
      let printHeaders = {
        printType: printType,
        start: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
        end:
          paginationModel.page * paginationModel.pageSize +
          paginationModel.pageSize,
        sort: "",
        dir: "",
        headers: "",
        dataIndexes: "",
        widths: "",
      };
      let allColumns = apiRef?.current?.state?.columns?.lookup || {};
      let filteredColumns = Object.entries(allColumns)
        .filter(([field]) => field !== "__check__")
        .reduce((acc, [KeyboardEvent, colDef]) => {
          acc[key] = colDef;
          return acc;
        }, {} as typeof allColumns);

      let allIndexes = apiRef?.crrent?.state?.columns?.orderedFields || [];
      let filteredIndexes = allIndexes.filter((field) => field !== "__check__");
      
      let allHeaders = [];
      filteredIndexes.map((item) =>
        allHeaders.push(filteredColumns[item].headerName)
      );
      let allWidths = [];
      filteredIndexes.map((item) =>
        allWidths.push(Math.ceil(filteredColumns[item].computedWidth))
      );
      console.log("Trying to print PDF ", e.currentTarget);
      const parentElement = 
        e.currentTarget.parentNode.parentNode.parentNode.parentNode;
      const currentPage = 
        apiRef?.current?.state?.pagination.paginationModel["page"];
      const pageSize = 
        apiRef?.current?.state?.pagination.paginationModel["pageSize"];
      const sortField = apiRef?.current?.state?.sorting?.sortModel[0]?.field;
      const sortDir =
        apiRef?.current?.state?.sorting?.sortModel[0]?.sort?.toUpperCase();
      let newStart = currentPage * pageSize;
      let limit = pageSize;
      let newEnd = newStart + limit;
      if (parentElement.textContent.includes("Print Current Page")) {
        printHeaders = {
          ...printHeaders,
          [filterField]: filterValue,
          sort: sortField ?? "",
          dir: sortDir ?? "ASC",
          headers: allHeaders.toString(),
          dataIndexes: filteredIndexes.toString(),
          widths: allWidths.toString(),
        };
      } else {
        printHeaders = {
          ...printHeaders,
          [filterField]: filterValue,
          sort: sortField ?? "",
          dir: sortDir ?? "ASC",
          headers: allHeaders.toString(),
          dataIndexes: filteredIndexes.toString(),
          widths: allWidths.toString(),
          start: 0,
          end: null,
          limit: 90000,
        };
      }

      const queryParams = new URLSearchParams();
      queryParams.set("limit", printHeaders.limit.toString() ?? "");
      queryParams.set("start", printHeaders.start.toString() ?? "");
      queryParams.set("sort", printHeaders.sort ?? "");
      queryParams.set("dir", printHeaders.dir ?? "");

      queryParams.set("headers", printHeaders.headers ?? "");
      queryParams.set("dataIndexes", printHeaders.dataIndexes ?? "");
      queryParams.set("widths", printHeaders.widths ?? "");

      queryParams.set(
          "dateIdentifiedStart",
          userSearchParam.dateIdentifiedStart ?? ""
      );
      queryParams.set(
          "dateIdentifiedEnd",
          userSearchParam.dateIdentifiedSEnd ?? ""
      );
      queryParams.set(
          "dateResolveStart",
          userSearchParam.dateResolveStart ?? ""
      );
      queryParams.set(
          "dateResolveEnd",
          userSearchParam.dateResolveEnd ?? ""
      );

      queryParams.set("description", userSearchParam.description ?? "");
      queryParams.set("comments", userSearchParam.comments ?? "");
      queryParams.set("discrepancyId", userSearchParam.discrepancyId ?? "");
      queryParams.set("shippingNumber", userSearchParam.shippingNumber ?? "");
      queryParams.set("trackingNumber", userSearchParam.trackingNumber ?? "");

      if (userSearchParam.discrepancy != null) {
        queryParams.set("discrepancyStatus",userSearchParam.discrepancyStatus.toString());
      }
      if (
        userSearchParam.discrepancyType && userSearchParam.discrepancyType.length > 0
      ) {
        queryParams.set("discrepancyType", userSearchParam.discrepancyType);
      }

      const generatedDownloadLink = `/h/discrepancy/queue.rpt?${queryParams.toString()}`;

      setShowMenu(false);
      setShowMenu1(false);
      setShowMenu2(false);

      const printLink = generatedDownloadLink.replaceAll("#", "%23");
      window.open(printLink);
    }
    
    return (
        <>
            <li ref={ref}>
                <Button className="button-light " onClick={handleButtonClick}>
                    <span>
                        <PrintOutlined sx={{ display: "flex", marginRight: 1rem" }} />
                    </span>
                    Print
                </Button>
                <Paper sx={{ zIndex: "1" }} className="sub-menu-dialog" elevation={3}>
                    <ul
                        className="app-bar__dropdown sub-menu-show"
                        style={!showMenu ? { display: "none" } :{}}
                    >
                        <li
                            className=""
                            onMouseEnter={() => setShowMenu1(true)}
                            onMouseLeave={() => setShowMenu1(false)}
                        >
                            <Button
                                className="nav-header__menu-button"
                                onClick={handleMenuClick1}
                            >
                                Print Current Page
                                <span>
                                    <ArrowRight sx={{ display: "flex" }} />
                                </span>
                            </Button>
                            <Paper
                                sx={{ top: "0%" }}
                                className="sub-menu-dialog drop-down-sub-menu "
                            >
                                <ul
                                    className="app-bar__dropdown sub-menu-show"
                                    style={!showMenu1 ? { display: "none" } : {}}
                                >
                                    <li>
                                        <Button
                                            onClick={handlePrint(1)}
                                            className="nav-header__menu-button"
                                        >
                                            <a className="app-bar__linkcoloer" href="#">
                                                PDF
                                            </a>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button
                                            onClick={handlePrint(2)}
                                            className="nav-header__menu-button"
                                        >
                                            <a className="app-bar__linkcoloer" href="#">
                                                CSV
                                            </a>
                                        </Button>                                            
                                    </li>
                                </ul>
                            </Paper>
                        </li>
                        <li
                            className=""
                            onMouseEnter={() => setShowMenu2(true)}
                            onMouseLeave={() => setShowMenu2(false)}
                        >
                            <Button
                                className="nav-header__menu-button"
                                onClick={handleMenuClick2}
                            >
                                Print All Page
                                <span>
                                    <ArrowRight sx={{ display: "flex" }} />
                                </span>
                            </Button>
                            <Paper
                                sx={{ top: "50%" }}
                                className="sub-menu-dialog drop-down-sub-menu "
                            >
                                <ul
                                    className="app-bar__dropdown sub-menu-show"
                                    style={!showMenu2 ? { display: "none" } : {}}
                                >
                                    <li>
                                        <Button
                                            onClick={handlePrint(1)}
                                            className="nav-header__menu-button"
                                        >
                                            <a className="app-bar__linkcoloer" href="#">
                                                PDF
                                            </a>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button
                                            onClick={handlePrint(2)}
                                            className="nav-header__menu-button"
                                        >
                                            <a className="app-bar__linkcoloer" href="#">
                                                CSV
                                            </a>
                                        </Button>                                            
                                    </li>
                                </ul>
                            </Paper>
                        </li>
                    </ul>
                </Paper>
            </li>
        </>
    );

}





function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { apiRef } = props;
  const [quickAction, setQuickAction] = useState("");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState<"markReady" | "addComment" | null>(null);

  const handleQuickActionChange = async (event: any) => {
    const selectedAction = event.target.value;
    setQuickAction("");
    const selectedRows = apiRef.current.getSelectedRows();
    const selectedRowData = Array.from(selectedRows.values());

    if (selectedRowData.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    if (selectedAction === "Print Discrepancy Details") {
      const ids = selectedRowData.map((row) => row.id).join(",");
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/discrepancy/print/details.rpt?discrepancyIds=${ids}`;
      window.open(url);
    }

    if (selectedAction === "Mark Ready") {
      const nonLiveRows = selectedRowData.filter((row) => row.type !== "LIVE");
      if (nonLiveRows.length > 0) {
        alert("Unable to Mark Ready, Only Type LIVE can be marked.");
        return;
      }
      setActionType("markReady");
      setCommentDialogOpen(true);
    }

    if (selectedAction === "Add New Comment") {
      setActionType("addComment");
      setCommentDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setComment("");
    setCommentDialogOpen(false);
  };

  const handleDialogSubmit = async () => {
    const selectedRows = apiRef.current.getSelectedRows();
    const discrepancyIds = Array.from(selectedRows.keys());

    const url =
      actionType === "markReady"
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/discrepancy/markReady`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/discrepancy/addNewComment`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discrepancyId: discrepancyIds,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Reload grid (use your preferred method)
      apiRef.current.updateRows([]);

      alert("Action completed successfully.");
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      handleDialogClose();
    }
  };

  return (
    <GridToolbarContainer>
      <Typography variant="subtitle1" sx={{ mr: 2 }}>
        Quick Actions:
      </Typography>
      <Select
        size="small"
        value={quickAction}
        onChange={handleQuickActionChange}
        displayEmpty
        sx={{ width: 220, mr: 2 }}
      >
        <MenuItem value="">Select Action</MenuItem>
        <MenuItem value="Print Discrepancy Details">Print Discrepancy Details</MenuItem>
        <MenuItem value="Mark Ready">Mark Ready</MenuItem>
        <MenuItem value="Add New Comment">Add New Comment</MenuItem>
      </Select>

      {/* Optional: Existing Advanced Search or Export Tools here */}

      <Dialog open={commentDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDialogSubmit}
            disabled={!comment.trim()}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </GridToolbarContainer>
  );
}

const cols = [
  {
    field: "id",
    headerName: "DiscrepancyId",
    flex: 1,
    headerClassName: "col-header",
    type: "string",
    renderCell: (params) =>
      params.row,isGroup || !URLSearchParams.value ? "" : URLSearchParams.value,
  }
];

return !loading ? (
    <Box className="simpleGrid">
      <MySnackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={8000}
        message={message}
        severity={severity}
        />
        <WarningAlert
          open={alertOpen}
          onClose={() => {
            setAlertOpen(false);
          }}
          title={alertTitle}
          message={alertMessage}
          />
          <Box className="simpleGrid__headerBox">
            <h1>Discrepancies</h1>
          </Box>
          <DiscrepancyManagementGrid
            apiRef={apiRef}
            rowsData={groupedRow}
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
            sortingMode={groupBy ? "server" : "client"}
            isRowSelectable={(params) => !params.row.isGroup}
            getRowClassName={(params) => (params.row.isGroup ? "group-row" : "")}
            onRowDoubleCLick={async (row) => {
              console.log("Double Click! row data is ");
              await setOpenForm(true);
            }}
            />
    </Box>
) :(
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
);
};
