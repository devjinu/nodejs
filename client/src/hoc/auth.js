import React,{useEffect} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';
// import {response} from 'express';

export default function (SpecificComponent, option, adminRoute = null){
    // null -> 누구나 접속 가능한 페이지
    // true -> 로그인한 유저만 접속 가능한 페이지
    // false -> 로그인한 유저는 접속 불가능한 페이지

    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(()=>{
            dispatch(auth()).then(Response =>{
                console.log(Response)
                // 비로그인
                if(!Response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                // 로그인
                }else{
                    if(adminRoute && !Response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false)
                            props.history.push('/')
                    }
                }
            })
        }, [])
        return(
            <SpecificComponent/>
        )
    }
    return AuthenticationCheck
}