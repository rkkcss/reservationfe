import { useRef, useState, useEffect } from 'react';
import { TourProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { increaseOnboardingVersion } from '../../helpers/queries/account-queries';
import { increaseOnBoardingV } from '../../redux/userSlice';

export const useChooseBusinessTour = () => {
    const { user } = useAppSelector((state) => state.userStore);
    const [openTour, setOpenTour] = useState(false);
    const dispatch = useAppDispatch();

    const listRef = useRef(null);
    const logoutRef = useRef(null);

    useEffect(() => {
        if (user && user.onboardingVersion < 1) {
            setOpenTour(true);
        }
    }, [user]);

    const handleClose = () => {
        increaseOnboardingVersion();
        dispatch(increaseOnBoardingV());
        setOpenTour(false);
    };

    const steps: TourProps['steps'] = [
        {
            title: 'Választás',
            description: 'Kattints az üzlet nevére a belépéshez.',
            target: () => listRef.current,
            nextButtonProps: {
                children: "Tovább",
            },
            prevButtonProps: {
                children: "Vissza",
            },
        },
        {
            title: 'Kijelentkezés',
            description: 'Itt tudsz kilépni a fiókodból.',
            target: () => logoutRef.current,
            nextButtonProps: {
                children: "Kilépés",
            },
            prevButtonProps: {
                children: "Vissza",
            },
        },
    ];

    return {
        openTour,
        steps,
        handleClose,
        refs: { listRef, logoutRef }
    };
};