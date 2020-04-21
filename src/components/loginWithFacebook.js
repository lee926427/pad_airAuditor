import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { 
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginManager
} from "react-native-fbsdk";
export function LoginBtn({setLoginState}){
    //const [userInfo,setUserInfo] = useState();
    const getInfoFromToken = token =>{
        const PROFILE_REQUEST_PARAMS = {
            fields:{
                string:'id,name,email',
            },
        };
        const profileRequest = new GraphRequest(
            '/me',
            {
                accessToken:token,
                parameters: PROFILE_REQUEST_PARAMS
            },
            (error,user)=>{
                if(error){
                    console.log("fb login error:",error)
                }else{
                    setLoginState(user)
                    console.log("fb user info:",user)
                }
            }
        );
        new GraphRequestManager().addRequest(profileRequest).start();
    }
    const loginWithFacebook = () =>{
        LoginManager.logInWithPermissions(["public_profile"])
        .then(
            result=>{
                if(result.isCancelled){
                    console.log("login canceled.")
                }else{
                    console.log("login success with permission:",result.grantedPermissions.toString())
                    AccessToken.getCurrentAccessToken()
                    .then(
                        data => {
                            const accessToken = data.accessToken.toString();
                            getInfoFromToken(accessToken)
                        }
                    )
                };
            },
            err=>{
                console.log("Login fail with error:",err)
            }
        )
    }
   
    return(
        <TouchableOpacity 
            style={style.container}
            onPress={loginWithFacebook}>
            <Text style={style.text}>Login from Facebook</Text>
        </TouchableOpacity>
    )
}
export function LogoutBtn({setLoginState}){
    const logoutWithFacebook = () => {
        LoginManager.logOut();
        setLoginState(null)
    }
    return(
        <TouchableOpacity 
            style={style.container}
            onPress={logoutWithFacebook}>
            <Text style={style.text}>Logout With Facebook</Text>
        </TouchableOpacity>
    )
}
const style = StyleSheet.create({
    container:{
        paddingHorizontal:30,
        paddingVertical:4,
        borderRadius: 8,
        width: 240,
        
        backgroundColor: "#1B5BA0"
    },
    text:{
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        
    }
})
export default {LoginBtn,LogoutBtn}