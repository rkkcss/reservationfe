import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { getAccountInfo } from '../redux/userSlice';

const OAuthSuccess = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAccountInfo())
            .unwrap()
            .then(() => {
                navigate('/choose-business');
            })
            .catch(() => {
                navigate('/?error=auth');
            });
    }, []);

    return <div>Bejelentkezés folyamatban...</div>;
};

export default OAuthSuccess;