import { API } from "../../utils/API";

export const fetchCsrfToken = async () => {
    try {
        await API.get("/api/csrf-token"); // Ez beállítja a sütit
        console.log("CSRF token megszerzése sikeres.");
    } catch (error) {
        console.error("Hiba a CSRF token megszerzése során:", error);
    }
}