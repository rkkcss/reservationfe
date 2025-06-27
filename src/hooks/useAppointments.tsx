// hooks/useAppointments.ts
import { useCallback, useState } from 'react';
import { Appointment } from '../helpers/types/Appointment';
import { AxiosRequestConfig } from 'axios';
import { API } from '../utils/API';

type useCustomQueryParams = {
    url: string,
    params?: AxiosRequestConfig,
}

export const useCustomQuery = ({ url }: useCustomQueryParams) => {
    const [data, setData] = useState<Appointment[]>([]);

    const fetchData = useCallback(async (params: AxiosRequestConfig) => {
        const response = await API.get(url, params);
        setData(response.data);
    }, []);

    return { data, setData, fetchData };
};
