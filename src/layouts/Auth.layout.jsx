import React, { useEffect } from 'react'
import { Outlet, useNavigate, Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import API from '../Backend';
import authService from '../Backend/Auth.backend';
import { useDispatch, useSelector } from 'react-redux';
import { storeLogin } from '../store/AuthSlice';
import FullScreenLoader from '../components/loader/FullScreenLoader';

const AuthLayout = () => {
    const isLogin = useSelector(state => state.auth.status);
    const token = secureLocalStorage.getItem("token");
    // const navigate = useNavigate();
    
    // const dispatch = useDispatch();

    // const { data, isLoading, isSuccess } = authService.TQCurrentUser(isLogin);

    // useEffect(() => {

    //     if(isSuccess){
    //         dispatch(storeLogin(data.data));
    //         navigate("/");
    //     }

    // }, [isSuccess, data])

    // if (isLoading) return <FullScreenLoader />
    
    if (isLogin || token) return <Navigate to="/" replace />;
    
    return <Outlet />
}

export default AuthLayout