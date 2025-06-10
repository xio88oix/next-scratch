import { useEffect. useState } from "react";
import { loadEnvironment } from "./EnvironmentUtils";

export const getApiUrl = async (path: string): Promise<string> => {
    const env = await loadEnvironment();
    const base = env.api?.server || "";
    return `${base}${path}`;
};

export const useApiUrl = (path: string) => {
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        getApiUrl(path).then(setUrl);
    },[path]);
    return url;
}
