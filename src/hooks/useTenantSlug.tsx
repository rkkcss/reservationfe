export function useTenantSlug() {
    if (typeof window === "undefined") return null;

    const hostname = window.location.hostname;

    if (hostname.endsWith(".localhost")) {
        const tenant = hostname.replace(".localhost", "");
        return tenant || null;
    }

    const baseDomain = "valami.hu";

    if (hostname.endsWith(`.${baseDomain}`)) {
        const tenant = hostname
            .replace(`.${baseDomain}`, "")
            .replace(/^www\./, "");
        return tenant || null;
    }

    return null;
}

export function getMainDomain(): string {
    const configuredDomain = import.meta.env.VITE_MAIN_DOMAIN as
        | string
        | undefined;

    if (configuredDomain) {
        return configuredDomain;
    }

    if (typeof window === "undefined") {
        return "localhost";
    }

    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return window.location.host;
    }

    console.warn(
        "[StepBusinessInfo] A VITE_MAIN_DOMAIN env változó nincs beállítva - " +
            "a fő domain a böngésző host nevéből lesz (pontatlanul) kitalálva. " +
            "Állítsd be a .env fájlban, pl.: VITE_MAIN_DOMAIN=pelda.hu",
    );
    const parts = hostname.replace(/^www\./, "").split(".");
    return parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
}
