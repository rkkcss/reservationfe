export function useTenantSlug() {
    const hostname = window.location.hostname; // "pizzeria-bella.localhost"
    const parts = hostname.split('.');

    if (parts.length >= 2 && parts[0] !== 'localhost') {
        return parts[0]; // "pizzeria-bella"
    }
    return null; // sima localhost, nincs tenant
}