import { API_BASE_URL } from "../config";

export async function fetchHolidays() {
    const res = await fetch(`${API_BASE_URL}/holidays/`);
    if (!res.ok) throw new Error("Failed to fetch holidays");
    return res.json();
}

export async function createHoliday(data) {
    const res = await fetch(`${API_BASE_URL}/holidays/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create holiday");
    return res.json();
}

export async function deleteHoliday(id) {
    const res = await fetch(`${API_BASE_URL}/holidays/${id}/`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete holiday");
    return true;
}
