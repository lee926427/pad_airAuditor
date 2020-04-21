import React from "react";
import { View,Text } from "react-native";
import { 
    check,
    RESULTS, 
    request
} from "react-native-permissions";

export default function({
    device,
    tipContent,
    granted = () => {},
    denied = () =>{},
}){

    return(
        <React.Fragment>
            {
                _checkPermissions() ? null : <View><Text>{tipContent}</Text></View>
            }
        </React.Fragment>
    );
    async function _checkPermissions(){
        if(Platform.OS === "android"){
            const currentPermission = await check(device)
            if( currentPermission === RESULTS.BLOCKED){
                return false
            }
            if( currentPermission !== RESULTS.GRANTED ){
                const result = await request(device)
                if(result !== RESULTS.GRANTED){
                    denied()
                    return false
                }
            }
            granted()
            return true
        }else if(Platform.OS === "ios"){
            
        }
    }
}