import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import authService from '../Backend/Auth.backend';
import { storeLogin } from '../store/AuthSlice';
import FullScreenLoader from '../components/loader/FullScreenLoader';

const AuthBootstrap = ({ children }) => {

    const isLogin = useSelector(state => state.auth.status);
    const token = secureLocalStorage.getItem("token");
    const dispatch = useDispatch();

    const { isError, isSuccess, data, isLoading } = authService.TQCurrentUser(!!token);

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeLogin(data.data));
        }
    }, [isSuccess, data]);

    if (!token) return <Navigate to="/auth/login" replace />;

    if (isLoading) return <FullScreenLoader />;

    if (isError) {
        secureLocalStorage.clear();
        return <Navigate to="/auth/login" replace />;
    }

    return children
}

export default AuthBootstrap;