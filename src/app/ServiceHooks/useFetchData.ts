import { useEffect, useState } from "react";
import { loadEnvironment } from "@/utils/EnvironmentUtils";

interface FetchResponse<T> {
    count: number | null;
    data: T[];
    loading: boolean;
}

export function useFetchData<t>(endpoint: string, params?:any): FetchResponse<t> {
    const [data, setData] = useState<any[]|any>([]);
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const env = await loadEnvironment();
                const baseUrl = env.api?.server || "";
                const url = `${baseUrl}${endpoint}`;

                const response = await fetch(url,{ cache: "no-cache"});
                const resJson = await response.json();
                setData(resJson.data);
                setCount(resJson.count);

            } catch (e) {
                console.log("Error fetching data from ${endpoint}:",e);
            } finally {
                setLoading(false);
            }
        };
    }, [endpoint,params]);
    return {data, count, loading};
}