import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { getGlobalSearch } from '../../helpers/queries/global-search';
import { Guest } from '../../helpers/types/Guest';
import { Appointment } from '../../helpers/types/Appointment';
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';

export type GlobalSearchType = {
    guests: Guest[];
    appointments: Appointment[];
    totalCount: number;
    employee: BusinessEmployee[];
};

// Biztonságos alapállapot, így elkerüljük az undefined hibákat
const initialValues: GlobalSearchType = {
    guests: [],
    appointments: [],
    employee: [],
    totalCount: 0,
};

const useGlobalSearch = () => {
    const [data, setData] = useState<GlobalSearchType>(initialValues);
    const [qString, setQString] = useState('');
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    useEffect(() => {
        if (qString.length > 2) {
            getGlobalSearch(Number(selectedBusinessEmployee?.business.id), qString)
                .then(res => {
                    setData(res.data);
                })
                .catch(err => {
                    console.error("Global search error:", err);
                });
        } else {
            setData(initialValues);
        }
    }, [qString, selectedBusinessEmployee?.business?.id]);

    return {
        data,
        setData,
        qString,
        setQString
    };
};

export default useGlobalSearch;