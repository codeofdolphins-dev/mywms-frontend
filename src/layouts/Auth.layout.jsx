import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import API from '../Backend';
import authService from '../Backend/Auth.backend';
import { useDispatch, useSelector } from 'react-redux';
import { storeLogin } from '../store/AuthSlice';
import FullScreenLoader from '../components/loader/FullScreenLoader';

const AuthLayout = () => {
    const isLogin = useSelector(state => state.auth.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isLoading, isSuccess } = authService.TQCurrentUser(isLogin);

    useEffect(() => {

        if(isSuccess){
            dispatch(storeLogin(data.data));
            navigate("/");
        }

    }, [isSuccess, data])

    if(isLoading) return <FullScreenLoader />
  return <Outlet />
}

export default AuthLayout