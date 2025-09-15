import { useEffect, useState } from "react";
import { loadEnvironment } from "@utils/EnvironmentUtils";
import { useFetchData } from "./useFetchData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useFetchDiscrepancyData = (params) => {
    const queryParams = new URLSearchParams();
    queryParams.set("limit", params.limit);
    queryParams.set("page", params.page);
    queryParams.set("start", params.start);
    queryParams.set("sort", params.sort ?? "");
    queryParams.set("dir", params.dir ?? "");
    queryParams.set("dateIdentifiedStart", params.dateidentifiedStart ?? "");
    queryParams.set("dateIdentifiedEnd", params.dateidentifiedEnd ?? "");
    queryParams.set("dateResolveStart", params.dateResolveStart ?? "");
    queryParams.set("dateResolveEnd", params.dateResolveEnd ?? "");

    queryParams.set("description", params.description ?? "");
    queryParams.set("comments", params.comments ?? "");
    queryParams.set("discrepancyId", params.discrepancyId ?? "");
    queryParams.set("shippingNumber", params.shippingNumber ?? "");
    queryParams.set("trackingNumber", params.trackingNumber ?? "");

    if (params.discrepancyStatus != null) {
        queryParams.set("discrepancyStatus", params.discrepancyStatus ?? "");
    }
    if (params.discrepancyType != null) {
        queryParams.set("discrepancyType", params.discrepancyType ?? "");
    }
    const url = `/discrepancy/queue.${params.type}?${queryParams.toString()}`;
    return useFetchData(url, params);
}

export const useFetchDiscrepancyType = () =>
    useFetchData("/lookups.json?type=discrepancyType&activeOnly=true");

export const useFetchDiscrepancyStatus = () =>
    useFetchData("/lookups.json?type=discrepancyStatus&activeOnly=true");

export const useFetchPackageacknowledgement = (params) => {
    const queryParams = new URLSearchParams();
    queryParams.set("limit", params.limit);
    queryParams.set("page", params.page);
    queryParams.set("start", params.start);
    queryParams.set("sort", params.sort ?? "");
    queryParams.set("dir", params.dir ?? "");

    const url = `/packageacknowledgement/queue.${params.type}?${queryParams.toString()}`;
    return useFetchData(url, params);
}
