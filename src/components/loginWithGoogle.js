import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { 
    GoogleSigninButton,
    GoogleSignin,
    statusCodes
} from "@react-native-community/google-signin";

function Login({loginInfo}){
    return(
        <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={}
            disabled={}/>
    )
}
function Logout({loginInfo,children}){
    return(
        <React.Fragment>
            {
                children
            }
        </React.Fragment>
    )
}

export default {Login}