import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/API";

type AxiosHeaderValue = string | number | boolean | null;
type AxiosResponseHeaders = Record<string, AxiosHeaderValue | undefined>;

export type RequestParams = Record<string, string | number | boolean | null | undefined>;

export function usePagination<T>(
    endpoint: string,
    itemsPerPage = 10,
    defaultSort: string = "",
    additionalParams: RequestParams = {}
) {
    const location = useLocation();
    const navigate = useNavigate();
    const isFirstRun = useRef(true); // Segít a dupla mount hívás elkerülésében

    // URL alapú kezdőértékek
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get("page") || "0", 10);
    const initialSort = queryParams.get("sort") || defaultSort;

    // State-ek
    const [data, setData] = useState<T | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sort, setSort] = useState<string>(initialSort);
    const [requestParams, setRequestParams] = useState<RequestParams>(additionalParams);

    const parseLinkHeader = (linkHeader: string) => {
        return linkHeader.split(",").reduce((acc, part) => {
            const match = part.match(/<(.*)>; rel="(.*)"/);
            if (match?.[1] && match?.[2]) {
                acc[match[2]] = match[1];
            }
            return acc;
        }, {} as Record<string, string>);
    };

    const buildQueryString = useCallback((page: number, sortParam: string, params: RequestParams) => {
        const query = new URLSearchParams();
        query.set("page", page.toString());
        query.set("size", itemsPerPage.toString());

        if (sortParam) query.set("sort", sortParam);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                query.set(key, String(value));
            }
        });

        return query.toString();
    }, [itemsPerPage]);

    const fetchPage = useCallback(
        async (page: number, currentSort: string, currentParams: RequestParams) => {
            setLoading(true);
            setError(null);

            try {
                const queryString = buildQueryString(page, currentSort, currentParams);
                const url = `${endpoint}?${queryString}`;
                const response = await API.get<T>(url);

                const linkHeader = response.headers.link;
                const links = linkHeader ? parseLinkHeader(linkHeader) : {};

                setPrevPageUrl(links.prev || null);
                setNextPageUrl(links.next || null);

                // Header-ek feldolgozása
                const headers = response.headers as AxiosResponseHeaders;
                const totalCount = parseInt(String(headers["x-total-count"] || 0), 10);

                setTotalItems(totalCount);
                setData(response.data);
                setCurrentPage(page);

                // URL szinkronizáció
                navigate({ search: `?${queryString}` }, { replace: true });
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        [endpoint, navigate, buildQueryString]
    );

    // EGYETLEN effekt a változások figyelésére
    useEffect(() => {
        // Ha nem az első futás, vagy ha a mount-kor kell az adat
        if (isFirstRun.current) {
            fetchPage(initialPage, sort, requestParams);
            isFirstRun.current = false;
        } else {
            // Paraméter változáskor mindig ugorjunk az első oldalra
            fetchPage(0, sort, requestParams);
        }
    }, [sort, requestParams, endpoint]); // Csak ezek változásakor fut le

    const fetchNextPage = () => nextPageUrl && fetchPage(currentPage + 1, sort, requestParams);
    const fetchPrevPage = () => prevPageUrl && fetchPage(currentPage - 1, sort, requestParams);

    return {
        data,
        setData,
        currentPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        fetchNextPage,
        fetchPrevPage,
        fetchPage: (p: number) => fetchPage(p, sort, requestParams),
        loading,
        error,
        hasNextPage: !!nextPageUrl,
        hasPrevPage: !!prevPageUrl,
        sort,
        setSort,
        requestParams,
        setRequestParams,
    };
}