// hooks/useAppointments.ts
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { API } from '../utils/API';

type useCustomQueryParams = {
    url: string,
    params?: AxiosRequestConfig,
}

export const useCustomQuery = <T,>({ url }: useCustomQueryParams) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T | null>(null);

    const fetchData = useCallback(async (params?: AxiosRequestConfig) => {
        const response = await API.get<T>(url, params);
        setData(response.data);
        setLoading(false);
    }, [url]);

    return { data, setData, fetchData, loading };
};
