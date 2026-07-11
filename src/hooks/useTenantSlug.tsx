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
