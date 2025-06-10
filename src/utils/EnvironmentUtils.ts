import axios from "axios";

let cachedEnv: any = null;

export const loadEnvironment = async () => {
    if (cachedEnv) return cachedEnv;

    try {
        const response = await axios.get("/next/environment.json", {
            headers: { "Cache-Control": "no-cache" },
        });
        if (response.status === 200) {
            cachedEnv = response.data;
            return cachedEnv;
        }
    } catch (error) {
        console.error("Error loading environement.json", error);
    }
    return {
        api: {
            server: "",
            useCredentials: true,
        },
    };
};