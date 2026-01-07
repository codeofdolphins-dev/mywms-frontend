import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import authService from '../Backend/Auth.backend';
import { storeLogin } from '../store/AuthSlice';
import FullScreenLoader from '../components/loader/FullScreenLoader';
import fetchData from '../Backend/fetchData';
import { storeLocation } from '../store/LocationSlice';

const AuthBootstrap = ({ children }) => {

    const isLogin = useSelector(state => state.auth.status);
    const token = secureLocalStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, isSuccess, data, isLoading } = authService.TQCurrentUser(!!token);
    const { isSuccess: locationIsSuccess, data: locationData } = fetchData.TQStateList();

    useEffect(() => {
        if (isSuccess && locationIsSuccess) {
            dispatch(storeLogin(data.data));
            dispatch(storeLocation(locationData));
        }
    }, [isSuccess, data, locationData, locationIsSuccess]);

    if (!token) return <Navigate to="/auth/login" replace />;

    if (isLoading) return <FullScreenLoader />;

    if (isError) {
        secureLocalStorage.clear();
        return <Navigate to="/auth/login" replace />;
    }

    return children
}

export default AuthBootstrap;