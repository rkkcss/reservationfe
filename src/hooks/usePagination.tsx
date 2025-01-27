import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/API";

export function usePagination<T>(endpoint: string, itemsPerPage = 10) {
    const location = useLocation();
    const navigate = useNavigate();

    const initialPage = new URLSearchParams(location.search).get("page") || "0";
    const [data, setData] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(parseInt(initialPage, 10) || 0);
    const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
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
        const totalCount = response.headers["x-total-count"];
        if (totalCount) {
            setTotalItems(parseInt(totalCount, 10));
        }
        setData(response.data);
        setCurrentPage(getPageFromUrl(pageUrl || ""));
    };

    const fetchPage = useCallback(
        async (page: number) => {
            setLoading(true);
            setError(null);

            try {
                const url = `${endpoint}?page=${page}`;
                const response = await API.get(url);

                const linkHeader = response.headers.link;
                if (linkHeader) {
                    const links = parseLinkHeader(linkHeader);
                    setPrevPageUrl(links.prev || null);
                    setNextPageUrl(links.next || null);
                } else {
                    setPrevPageUrl(null);
                    setNextPageUrl(null);
                }

                handleResponse(response, url);

                navigate({ search: `?page=${page}` });
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        [endpoint, navigate]
    );

    const fetchNextPage = useCallback(() => {
        if (nextPageUrl) {
            fetchPage(currentPage + 1);
        }
    }, [nextPageUrl, currentPage, fetchPage]);

    const fetchPrevPage = useCallback(() => {
        if (prevPageUrl) {
            fetchPage(currentPage - 1);
        }
    }, [prevPageUrl, currentPage, fetchPage]);

    useEffect(() => {
        fetchPage(parseInt(initialPage, 10) || 0);
    }, []);

    const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 0;

    return {
        data,
        currentPage,
        totalItems,
        totalPages, // Összes oldal száma
        fetchNextPage,
        fetchPrevPage,
        fetchPage, // Oldalszámra ugrás funkció
        loading,
        error,
        hasNextPage: !!nextPageUrl,
        hasPrevPage: !!prevPageUrl,
    };
}
