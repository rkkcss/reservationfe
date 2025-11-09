import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/API";
import { AxiosResponse } from "axios";

type AxiosResponseHeaders = {
    [key: string]: AxiosHeaderValue;
};
type AxiosHeaderValue = string | number | boolean | null;


export function usePagination<T>(endpoint: string, itemsPerPage = 10, defaultSort: string = "") {
    const location = useLocation();
    const navigate = useNavigate();

    const initialPage = new URLSearchParams(location.search).get("page") || "0";
    const initialSort = new URLSearchParams(location.search).get("sort") || defaultSort;
    const [data, setData] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(parseInt(initialPage, 10) || 0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(`${endpoint}?page=${initialPage}`);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [itemsPerPageCount, setItemsPerPageCount] = useState<number>(itemsPerPage);

    const [sort, setSort] = useState<string>(initialSort);

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

    const handleResponse = (
        response: AxiosResponse<T[]>,
        pageUrl: string | null
    ) => {
        // headers típusbiztosan kezelve
        const headers = response.headers as
            | AxiosResponseHeaders
            | Record<string, AxiosHeaderValue | undefined>;

        const totalCountHeader = headers["x-total-count"];
        const itemsPerPageHeader = headers["x-page-size"];

        const totalCount =
            typeof totalCountHeader === "string"
                ? parseInt(totalCountHeader, 10)
                : typeof totalCountHeader === "number"
                    ? totalCountHeader
                    : null;

        const itemsPerPageCount =
            typeof itemsPerPageHeader === "string"
                ? parseInt(itemsPerPageHeader, 10)
                : typeof itemsPerPageHeader === "number"
                    ? itemsPerPageHeader
                    : null;

        if (totalCount !== null) {
            setTotalItems(totalCount);
        }
        if (itemsPerPageCount !== null) {
            setItemsPerPageCount(itemsPerPageCount);
        }

        setData(response.data);
        setCurrentPage(getPageFromUrl(pageUrl || ""));
    };

    const fetchPage = useCallback(
        async (page: number, sortParam: string = sort) => {
            setLoading(true);
            setError(null);

            try {
                const url = `${endpoint}?page=${page}${sort && `&sort=${encodeURIComponent(sortParam)}`}&size=${itemsPerPage}`;
                console.log(url)
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

                navigate({ search: `?page=${page}${sort && `&sort=${sort}`}` }, { replace: true });
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        [endpoint, navigate, sort]
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
        fetchPage(parseInt(initialPage, 10) || 0, sort);
    }, [sort]);

    const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 0;

    return {
        data,
        setData,
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
        sort,
        setSort, // Sort állapot és setter
        itemsPerPage,
        itemsPerPageCount
    };
}
