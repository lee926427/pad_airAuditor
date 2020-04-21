import React,{useEffect} from "react";
import messaging from "@react-native-firebase/messaging";

import { useDispatch } from "react-redux";
import { loginFlow } from "../redux/actions/actionCreators";

export default function(){
    const dispatch = useDispatch()
    useEffect(()=>{
        requestUserPermission()
        .then(async res=>{
            await messaging().setBackgroundMessageHandler(
                (remoteMessage ) => {
                    console.log('Message handled in the background!', remoteMessage);
                }
            )
            await messaging().getToken()
            .then(
                token => {
                    dispatch(loginFlow.getFireToken(token))
                }
            )
        })
    },[])
    
    function requestUserPermission(){
        return new Promise(async(resolve,reject)=>{
            const settings = await messaging().requestPermission();
            if(settings){
                resolve(settings)
            }else{
                reject("Reject")
            }
        })
       
    }
    return <React.Fragment/>
}