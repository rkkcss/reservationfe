import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/API";

export function usePagination<T>(endpoint: string) {
    const location = useLocation();
    const navigate = useNavigate();

    const initialPage = new URLSearchParams(location.search).get("page") || "0";
    const [data, setData] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(parseInt(initialPage, 10) || 0); // Aktuális oldal
    const [totalItems, setTotalItems] = useState<number | undefined>(undefined); // Összes elem száma
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(`${endpoint}?page=${initialPage}`);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const parseLinkHeader = (linkHeader: string) => {
        return linkHeader.split(",").reduce((acc, part) => {
            const match = part.match(/<(.*)>; rel="(.*)"/);
            if (match && match[1] && match[2]) {
                acc[match[2]] = match[1];
            }
            return acc;
        }, {} as Record<string, string>);
    };

    const getPageFromUrl = (url: string) => {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        return parseInt(urlParams.get("page") || "0", 10);
    };

    const handleResponse = (response: { data: T[]; headers: Record<string, string> }, pageUrl: string | null) => {
        // Headerből olvassuk ki az összes elem számát
        const totalCount = response.headers["x-total-count"];
        if (totalCount) {
            setTotalItems(parseInt(totalCount, 10));
        }
        setData(response.data);
        setCurrentPage(getPageFromUrl(pageUrl || ""));
    };

    const fetchNextPage = useCallback(async () => {
        if (!nextPageUrl) return;

        setLoading(true);
        setError(null);

        try {
            const response = await API.get(nextPageUrl);

            const linkHeader = response.headers.link;
            if (linkHeader) {
                const links = parseLinkHeader(linkHeader);
                setPrevPageUrl(links.prev);
                setNextPageUrl(links.next || null);
            } else {
                setNextPageUrl(null);
            }

            handleResponse(response, nextPageUrl);

            navigate({ search: `?page=${getPageFromUrl(nextPageUrl)}` });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [nextPageUrl, navigate]);

    const fetchPrevPage = useCallback(async () => {
        if (!prevPageUrl) return;

        setLoading(true);
        setError(null);

        try {
            const response = await API.get(prevPageUrl);

            const linkHeader = response.headers.link;
            if (linkHeader) {
                const links = parseLinkHeader(linkHeader);
                setPrevPageUrl(links.prev || null);
                setNextPageUrl(links.next || nextPageUrl);
            } else {
                setPrevPageUrl(null);
            }

            handleResponse(response, prevPageUrl);

            navigate({ search: `?page=${getPageFromUrl(prevPageUrl)}` });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [prevPageUrl, navigate, nextPageUrl]);

    useEffect(() => {
        const fetchInitialPage = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await API.get(`${endpoint}?page=${initialPage}`);

                const linkHeader = response.headers.link;
                if (linkHeader) {
                    const links = parseLinkHeader(linkHeader);
                    setPrevPageUrl(links.prev || null);
                    setNextPageUrl(links.next || null);
                }

                handleResponse(response, `${endpoint}?page=${initialPage}`);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialPage();
    }, []);

    return {
        data,
        currentPage, // Aktuális oldal
        totalItems, // Összes elem száma
        fetchNextPage,
        fetchPrevPage,
        loading,
        error,
        hasNextPage: !!nextPageUrl,
        hasPrevPage: !!prevPageUrl,
    };
}
