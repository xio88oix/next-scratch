import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { WarningAlert } from "../CustomComponents";

type QuickAction = {
    label: string;
    needsDialog?: boolean;
    dialogTitle?: string;
    onClick: (
        selectedRows: any[],
        comment?: string,
        dialogValue?: any
    ) => void | Promise<void>;
    dialogFieldLabel?: string;
    dialogFieldMultiline?: boolean;
};

export function QuickActionSelect({
    apiRef,
    actions,
    showWarningAlert,
    }: {
    apiRef: any;
    actions: QuickAction[];
    showWarningAlert: any;
}) {
    const [quickAction, setQuickAction] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogValue, setDialogValue] = useState<string>("");
    const [currentAction, setCurrentAction] = useState<QuickAction | null>(null);
    function pendingStatusRowSelected(selectedRows) {
        console.log("The selected rows are: ", selectedRows);
        let result = false;
        selectedRows.map((r) => {
            if (r.status === "Pending") {
                result = true;
            }
        });
        return result;  
    }
    const handleChange = async (event: any) => {
        const selectedLabel = event.target.value;
        setQuickAction("");
        const selectedRows = Array.from(apiRef.current.getSelectedRows().values());
        if (selectedRows.length === 0) {
            showWarningAlert("Please select at least one row to perform this action.");
            return;
        } else if (selectedRows.length > 0) {

        }
        const action = actions.find((a) => a.label === selectedLabel);
        if (!action) return;
        if (action.needsDialog) {
            setCurrentAction(action);
            setDialogOpen(true);
        } else {
            await action.onClick(selectedRows);
        }
    };
      
    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogValue("");
        setCurrentAction(null);
    };

    const handleDialogSubmit = async () => {
        if (!currentAction) return;
        const selectedRows = Array.from(apiRef.current.getSelectedRows().values());
        await currentAction.onClick(selectedRows, dialogValue);
        handleDialogClose();
    };

    return (
        <>
        <Select 
            size="small"
            value={quickAction}
            onChange={handleChange}
            displayEmpty
            sx={{ width: 220, mr: 2, fontWeight: "600" }}
        >
            <MenuItem
                id="quick-action-label"
                value=""
                className="button-light"
                sx={{ fontWeight: "600" }}
                >
                    <<p className="body1-bold">QUICK ACTIONS</p>
            </MenuItem>
            {actions.map((a) => (
                <MenuItem key={a.label} value={a.label}>
                    {a.label}
                </MenuItem>
            ))}
        </Select>
        {currentAction?.needsDialog && (
            <Dialog fullWidthopen={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ padding: "1rem", fontWeight: "800 !important"}}>
                    {currentAction.dialogTitle || "Enter Value"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline={currentAction.dialogFieldMultiline || false}
                        rows={4}
                        label={currentAction.dialogFieldLabel || "Value"}
                        variant="outlined"
                        value={dialogValue}
                        onChange={(e) => setDialogValue(e.target.value)}
                        placeholder={"Please input details"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{ margin: "1rem 2rem" }}
                        className="button-light"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button 
                        sx={{ margin: "1rem 2rem" }}
                        className="button-dark"
                        onClick={handleDialogSubmit}
                        disabled={dialogValue.trim()}
                        variant="contained"
                        >
                        OK
                    </Button>
                    </DialogActions>
                    </Dialog>
                    )}
                    </>
                    );
                    }