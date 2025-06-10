import {
    CustomTextField,
    MyDatePicker,
    StyledTextField,
} from "@/components/CustomComponents";
import { Autocomplete, Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function AdvancedSearchDiscrepancyManagement(params: {
    discrepancyStatus: any[];
    discrepancyType: any[];
    setUserSearchParam: Dispatch<SetStateAction<any>>;
    startSearch: boolean;
    userSearchParam: any;
}) {
    let defaultDiscrepancyStatus = [];
    if (params.userSearchParam?.discrepancyStatus?.length > 0) {
        params.userSearchParam?.discrepancyStatus.map((r) => {
            const rg = params.discrepancyStatus?.find((item) => item.id ===r);
            defaultDiscrepancyStatus.push(rg);
        });
    }
    let defaultDiscrepancyType [];
    if (params.userSearchParam?.discrepancyTypeength > 0) {
        params.userSearchParam?.discrepancyTypep((r) => {
            const rg = params.discrepancyType.find((item) => item.id ===r);
            defaultDiscrepancyType.push(rg);
        });
    }

    const [advancedSearchParams, setAdvancedSearchParams] = useState({
        discrepancyStatus: defaultDiscrepancyStatus ?? [],
        son: params.userSearchParam?.son ?? null,
        dateIdentifiedStart: params.userSearchParam?.dateIdentifiedStart
            ? dayjs(params.userSearchParam?.dateIdentifiedStart)
            : null,
        dateIdentifiedEnd: params.userSearchParam?.dateIdentifiedEnd
            ? dayjs(params.userSearchParam?.dateIdentifiedEnd)
            : null,
        dateResolveStart: params.userSearchParam?.dateResolveStart
            ? dayjs(params.userSearchParam?.dateResolveStart)
            : null,
        dateResolveEnd: params.userSearchParam?.dateResolveEnd
            ? dayjs(params.userSearchParam?.dateResolveEnd)
            : null,
        
        description: params.userSearchParam?.description ?? null,
        comments: params.userSearchParam?.comments ?? null,
        trackingNumber: params.userSearchParam?.trackingNumber ?? null,

        discrepancyType: defaultDiscrepancyType ?? null,
        discrepancyId: params.userSearchParam?.discrepancyId ?? null,

        group: params.userSearchParam?.group ?? null,

        type: " json",
        page: 1,
        start: 0,
        limit: 25,
        sort: params.userSearchParam?.sort ?? null,
        dir: params.userSearchParam?.dir ?? "ASC",
    });

    const handleChange = (key) => (e, newVal) => {
        const val = e?.target?.value ?? e;
        switch (key) {
            case "discrepancyStatus": {
                setAdvancedSearchParams({
                    ...advancedSearchParams,
                    [key]: newVal,
                });
                break;
            }
            case "discrepancyType": {
                setAdvancedSearchParams({
                    ...advancedSearchParams,
                    [key]: newVal,
                });
                break;
            }
            default: {
                setAdvancedSearchParams({
                    ...advancedSearchParams,
                    [key]: newVal,
                });
                break;
                }
            }
        };

        useEffect(() => {
            if (params.startSearch) {
                const discrepancyStatusArray = [];
                if (advancedSearchParams.discrepancyStatus.length > 0) {
                    advancedSearchParams.discrepancyStatus.map((r) => {
                        discrepancyStatusArray.push(r.id);
                    });
                }
                const discrepancyTypeArray = [];
                if (advancedSearchParams.discrepancyType.length > 0) {
                    advancedSearchParams.discrepancyType.map((r) => {
                        discrepancyTypeArray.push(r.id);
                    });
                }

                params.setUserSearchParam({
                    ...advancedSearchParams,
                    dateIdentifiedStart: advancedSearchParams.dateIdentifiedStart
                        ? dayjs(advancedSearchParams.dateIdentifiedStart).format(
                            "YYYY-MM-DDT00:00:00"
                        )
                    : null,
                    dateIdentifiedEnd: advancedSearchParams.dateIdentifiedEnd
                        ? dayjs(advancedSearchParams.dateIentifiedEnd).format(
                            "YYYY-MM-DDT00:00:00"
                        )
                    : null,
                    dateResolveStart: advancedSearchParams.dateResolveStart
                        ? dayjs(advancedSearchParams.dateResolveStart).format(
                            "YYYY-MM-DDT00:00:00"
                        )
                    : null,
                    dateResolveEnd: advancedSearchParams.dateResolveEnd
                        ? dayjs(advancedSearchParams.dateResolveEnd).format(
                            "YYYY-MM-DDT00:00:00"
                        )
                    : null,     
                    discrepancyStatus: discrepancyStatusArray,
                    discrepancyType: discrepancyTypeArray,                                                       
                });
            }
        }, [params.startSearch]);

        return (
            <>
                <Box sx={{ padding: "1rem" }}>
                    <div className="form-section">
                        <Grid2 columnGap={1} columnSpacing={2} rowSpacing={1} conatiner>
                            <Stack flexGrow={1}>
                                <Grid2>
                                    <CustomTextField
                                        fullWidth
                                        label={"Shipping Number"}
                                        variant="filled"
                                        slotprops={{ htmlInput: { maxLength: 128 } }}
                                        onChange={handleChange("shippingnumber")}
                                        value={advancedSearchParams.shippingnumber ?? ""}
                                        />
                                </Grid2>
                                <Grid2>
                                    <Autocomplete
                                        multiple
                                        fullWidth
                                        options={params.discrepancyStatus ?? []}
                                        value={advancedSearchParams.discrepancyStatus}
                                        renderInput={(params) => (
                                            <StyledTextField
                                                {...params}
                                                variant="filled"
                                                label={"Status"}
                                                className="section-usereit__field body1 text-onbackground"
                                                helperText="Search for Status"
                                                />
                                        )}
                                        getOptionLabel={(option) => option?.shortDescription || ""}
                                        onChange={handleChange("discrepancyStatus")}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    "& .MuiAutocomplete-listbox": { fontSize: "1.6rem" },
                                                },
                                            },
                                        }}
                                        />
                                </Grid2>
                                <Grid2>
                                    <MyDatePicker
                                        label={"Date Identified From:"}
                                        value={advancedSearchParams.dateIdentifiedStart}
                                        onChange={handleChange("dateIdentifiedStart")}
                                        maxDate={advancedSearchParams.dateIdentifiedEnd}
                                        />
                                </Grid2>
                                <Grid2>
                                    <MyDatePicker
                                        label={"Date Identified To:"}
                                        value={advancedSearchParams.dateIdentifiedEnd}
                                        onChange={handleChange("dateIdentifiedEnd")}
                                        minDate={advancedSearchParams.dateIdentifiedStart}
                                        />
                                </Grid2>
                                <Grid2>
                                    <MyDatePicker
                                        label={"Date Resolved From:"}
                                        value={advancedSearchParams.dateResolveStart}
                                        onChange={handleChange("dateResolveStart")}
                                        maxDate={advancedSearchParams.dateResolveEnd}
                                        />
                                </Grid2>
                                <Grid2>
                                    <MyDatePicker
                                        label={"Date Resolved From:"}
                                        value={advancedSearchParams.dateResolveEnd}
                                        onChange={handleChange("dateResolveEnd")}
                                        minDate={advancedSearchParams.dateResolveStart}
                                        />
                                </Grid2>
                                <Grid2>
                                    <CustomTextField
                                        fullWidth
                                        label={"Description"}
                                        variant="filled"
                                        slotprops={{ htmlInput: { maxLength: 128 }}}
                                        onChange={handleChange("description")}
                                        value={advancedSearchParams.description ?? ""}
                                        />
                                </Grid2>
                                <Grid2>
                                    <Autocomplete
                                        multiple
                                        options={params.discrepancyType ?? []}
                                        value={advancedSearchParams.discrepancyType}
                                        onChange={handleChange("discrepancType")}
                                        renderInput={(params) => (
                                            <StyledTextField
                                                {...params}
                                                variant="filled"
                                                label={"Type"}
                                                className="section-useredit__field body1 text-onbackground"
                                                helperText="Search for Type"
                                                />
                                        )}
                                        getOptionLabel={(option: any) =>
                                            option?.shortDescription || ""
                                        }
                                        slotProps={{
                                            popper: { placement: "bottom-end" },
                                            paper: {
                                                sx: {
                                                    "& .MuiAutocomplete-listbox": { fontSize: "1.6rem" },
                                                },
                                            },
                                        }}
                                        />
                                </Grid2>
                                <Grid2>
                                    <CustomTextField
                                        fullWidth
                                        label={"Comments"}
                                        variant="filled"
                                        slotprops={{ htmlInput: { maxLength: 128 }}}
                                        onChange={handleChange("comments")}
                                        value={advancedSearchParams.comments ?? ""}
                                        />
                                </Grid2>
                                <Grid2>
                                    <CustomTextField
                                        fullWidth
                                        label={"Discrepancy ID"}
                                        variant="filled"
                                        slotprops={{ htmlInput: { maxLength: 128 }}}
                                        onChange={handleChange("discrepancyId")}
                                        value={advancedSearchParams.discrepancyId ?? ""}
                                        />
                                </Grid2>
                                <Grid2>
                                    <CustomTextField
                                        fullWidth
                                        label={"Tracking Number"}
                                        variant="filled"
                                        slotprops={{ htmlInput: { maxLength: 128 }}}
                                        onChange={handleChange("trackingNumber")}
                                        value={advancedSearchParams.trackingNumber ?? ""}
                                        />
                                </Grid2>
                            </Stack>
                        </Grid2>
                    </div>
                </Box>
            </>
        );
}
