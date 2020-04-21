import React, { 
    useState, 
    useEffect,
} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Animated,
    Platform,
    Keyboard,
} from "react-native";
import Hr from "react-native-hr-plus";
import AsyncStorage from "@react-native-community/async-storage";
import CheckBox from "@react-native-community/checkbox";
import { useDispatch,useSelector } from "react-redux";
import { app, loginFlow } from "../redux/actions/actionCreators";
import { getVersion } from "react-native-device-info";

import ForgetMsgBox from "../components/Dialog_forgetPwd";
import ConnectMsg from "../components/connectMsg";
//import FacebookBtn from "../components/loginWithFacebook";
import Orientation from 'react-native-orientation';
import DeviceInfo from "../components/getDeviceInfo";
import LogoSVG from "../images/icons/native/Logo";
const Window = Dimensions.get("window")
const saveInfo = "SAVE_INFI"
const saveStatus = "SAVE_STATUS";
const locationAccount = "SIGNIN_ACCOUNT";
const locationPassword = "SIGNIN_PASSWORD";

export default function({navigation}) {
    const [signInfo,setSignInfo] = useState({
        acct: "",
        passwd: "",
        checkBox: false
    })
    const [isError,setIsError] = useState(false)
    const [showDialog,setShowDialog] = useState(false)
    const fireBaseToken = useSelector(state => state.app.fireBaseToken)
    const errContent = useSelector( state => state.app.errContent)
    const dispatch = useDispatch()
    let imageSize = new Animated.Value(200)
    useEffect(()=>{
        _checkStorage();
        Orientation.lockToPortrait();
        return ()=>{
            Orientation.unlockAllOrientations();
        }
    },[])
    useEffect(()=>{
        let keyboardDidShowSub
        let keyboardDidHideSub
        if(Platform.OS === "android"){
            keyboardDidShowSub = Keyboard.addListener("keyboardDidShow",keyboardDidShow);
            keyboardDidHideSub = Keyboard.addListener("keyboardDidHide",keyboardDidHide);
        }
        return ()=>{
            keyboardDidShowSub.remove();
            keyboardDidHideSub.remove();
        }
    },[])

    const AppTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.appName}>空氣品質稽查地圖</Text>
            <Animated.View style={{width: imageSize, height: imageSize}}>
                <LogoSVG width={"100%"} height={"100%"}/>
            </Animated.View>
        </View>
    )

    const MessageBox = () =>{
        return  (
            <ConnectMsg 
                boxTitle={"連線錯誤"}>
                    <Text style={{textAlign:"center",fontSize:18}}>{errContent}</Text>
            </ConnectMsg>
        )
    }
   

    const SignInBtn = () => (
        <TouchableOpacity 
            style={[
            styles.submitBtn,
            isError ?
            {
                backgroundColor: "#aaa"
            }:
            {
                backgroundColor: "#2A5AA3"
            }
            ]}
            disabled={ isError ? true : false }
            onPress={handleSignIn} >
                <Text style={styles.text}> 登入 </Text>
        </TouchableOpacity>
    )

    const SignInErrMsg = () => (
        <Text style={{color:"red"}}>
            {isError}
        </Text>
    )

    const PowerBy = () => (
        <View style={styles.right}>
            <Text style={styles.rightText}>Power by FHNet</Text>
        </View>
    )
    const version = getVersion()

    return (
      <View style={styles.container}> 
        <AppTitle/>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="請輸入帳號"
                value={signInfo.acct}
                onChangeText={ text => checkAccount(text) }/>
            <TextInput
                style={styles.input}
                placeholder="請輸入密碼"
                value={signInfo.passwd}
                onChangeText={ text => checkPassword(text) }/>
            <View style={{
                flexDirection:"row",
                justifyContent: "space-around",
                flex:0.3,
                width: "100%",
                minHeight: 40
                }}>
                <TouchableOpacity
                    onPress={()=>setShowDialog(true)}
                    style={{
                        marginTop:"auto",
                        marginBottom: "auto",
                        backgroundColor: "#aaa",
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 6
                    }}>
                    <Text style={{fontSize:16}}>忘記密碼</Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row",margin: 12}}>
                <Text style={{marginTop:"auto",marginBottom: "auto"}}>儲存帳號密碼</Text>
                <CheckBox
                    style={{marginTop:"auto",marginBottom: "auto"}}
                    value={signInfo.checkBox}
                    onValueChange={ state => setSignInfo({ ...signInfo,checkBox:state}) }/>
                </View>
            </View>
            <ForgetMsgBox 
                isShow={showDialog}
                onClose={setShowDialog}/>
            <SignInErrMsg/>
            <SignInBtn/>
        </View>
        {/*
        <View style={styles.otherLogin}>
            <Hr color={"#000"} width={1}>
                <Text>其他登入方式</Text>
            </Hr>
            <View style={{paddingVertical:10,justifyContent:"center",alignItems:"center"}}>
                <FacebookBtn.LoginBtn/>
            </View>
        </View>
        */}
        <PowerBy/>
        <View style={styles.version}>
        <Text>版本:{version}</Text>
        </View>
        <MessageBox/>
    </View>
    );
    function stringToBool(bool){
        return bool === "true"
    }
    function checkAccount(text){
      const isMatch = /^(?=.*[A-Za-z]).{3,13}$/g.test(text)
      console.log("acct",text)
        if(!isMatch){
          setIsError("帳號長度至少需要3-13字");
        }else{
          setIsError(null);
        }
        setSignInfo({
          ...signInfo,
          acct: text
        });
    }
    function checkPassword(text){
        const isMatch = /^(?=.*[A-Za-z]).{6,20}$/g.test(text)
        if(!isMatch){
          setIsError("密碼長度至少需要6-20字");
        }else{
          setIsError(null);
        }
        console.log("passwd",text)
        setSignInfo({
          ...signInfo,
          passwd: text
        });
    }
    async function _checkStorage(){
        await AsyncStorage.multiGet([saveStatus,locationAccount,locationPassword])
        .then(
          data =>{
            setSignInfo({
                checkBox: stringToBool(data[0][1]),
                acct: data[1][1],
                passwd: data[2][1]
            })
            
           /*
            setSignInfo({
                checkBox: stringToBool(data[0].chech),
                acct: data[1][1],
                passwd: data[2][1]
            })
            */
          }
        )
    }
    function handleSignIn(){
        if(signInfo.checkBox){
          AsyncStorage.multiSet([
            [saveStatus,  String(signInfo.checkBox)],
            [locationAccount,signInfo.acct],
            [locationPassword,signInfo.passwd]
          ])
          /*
          AsyncStorage.setItem(saveInfo,{
            checkBox: String(signInfo.checkBox),
            acct: signInfo.acct,
            passwd: signInfo.passwd
          })
          */
        }else{
          AsyncStorage.multiSet([
            [saveStatus,  String(signInfo.checkBox)],
            [locationAccount, ""],
            [locationPassword, ""]
          ])
          /*
          AsyncStorage.setItem(saveInfo,{
            checkBox: String(signInfo.checkBox),
            acct: "",
            passwd: ""
          })
          */
        }
        _getAuth();
    }
    function _getAuth(){
        const api = {
            getAuth: "http://openapi.fhnet.com.tw/appapi/getAuth",
            updateDeviceInfo:"http://openapi.fhnet.com.tw/appapi/updateDeviceinfo"
        }
        //console.log(signInfo)
        DeviceInfo().then(
          async info=>{
              console.log("signInfo",signInfo)
            await fetch( 
                api.getAuth,{
                headers:{
                    Accept: "application/json",
                    "content-type": "application/json"
                },
                method: "POST",
                body:JSON.stringify({
                    useracct: signInfo.acct,
                    password: signInfo.passwd,
                    UID: info.device.UID,
                    fireBaseToken
              }),
            }).then( 
              res=>{
                console.log("network status",res.status)
                if(res.status === 200){
                    return res.json()
                }
            }).then( 
              async (payload) => {
                if(payload.token){
                    setIsError(false)
                    dispatch(loginFlow.logining({
                        user: signInfo.acct,
                        token: payload.token
                        })
                    );
                    dispatch(app.initApp())
                    await navigation.navigate("app");
                }else{
                    setIsError(true)
                    dispatch(loginFlow.loginFaild("請檢查連線或帳號密碼是否輸入正確"))
                }
            })
            .catch(
                err=>{
                    console.log("login err:",err)
                }
            );
            await fetch(
              api.updateDeviceInfo,{
                headers:{
                    Acccept: "application/json",
                    "content-type": "application/json"
                },
                method:"POST",
                body:JSON.stringify(info),
            });
        }).catch(
          err=>{
            console.log("err",err)
        });
    }

    function keyboardDidShow(event){
        Animated.parallel([
            Animated.timing(
                imageSize,{
                    duration: 400,
                    toValue: 200
                }
            )
        ]).start();
    }

    function keyboardDidHide(event){
        Animated.parallel([
            Animated.timing(
                imageSize,{
                    duration: 400,
                    toValue: 256
                })
        ]).start();
    }
}

const styles = StyleSheet.create({
    container: {
        height: Window.height,
        width: Window.width,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EAEBEB"
    },
    titleContainer: {
        flex:4,
        paddingTop:100,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer:{
        flex:4,
        justifyContent: "center",
        alignItems: "center",
        width: 400,
    },
    input:{
        width: "100%",
        height: 40,
        backgroundColor: "#eee",
        shadowOpacity: 0.2,
        shadowColor: "#000",
        shadowRadius: 1.2,
        shadowOffset: {
        width: 0,
        height: 2,
        },
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        marginVertical: 8
    },
    submitBtn:{
        width: 200,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 26,
        justifyContent: "center",
    },
    text:{
        color: "#fff",
        fontSize: 24,
        fontWeight: "300",
        textAlign: "center"
    },
    right:{
        flex:0.5,
        textAlign: "center",
        width: Window.width,
    },
    rightText:{
        color: "#000",
        backgroundColor: "#fff",
        textAlign: "center",

    },
    version:{
        flex: 0.5
    },  
    otherLogin:{
        flex:4
    },
    appName:{
        fontSize: 36,
        fontWeight: "700",
    }
});
