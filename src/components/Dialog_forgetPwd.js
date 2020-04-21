import React,{ 
    useEffect,
    useState,
} from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
    Animated,
} from "react-native";
import Dialog,{ DialogTitle,DialogContent,DialogFooter,DialogButton, SlideAnimation } from "react-native-popup-dialog";

const API = {
    getResetToken: "http://openapi.fhnet.com.tw/appapi/getResetToken",
    resetPasswd: "http://openapi.fhnet.com.tw/appapi/resetPasswd",
    updatePassword: "http://openapi.fhnet.com.tw/appapi/updatPasswd"
}


export default function({isShow,onClose}){
    const [display,setDisplay] = useState(false)
    const [showComplete,setShowComplete] = useState(false)
    useEffect(()=>{
        setDisplay(isShow)
        return()=>{
            setShowComplete(false)
            setDisplay(false)
        }
    },[isShow])
    const handleClose = () => {
        setDisplay(false);
        onClose(false);
    }
    return(
        <View>
            <Dialog
                visible={display}
                onTouchOutside={handleClose}
                dialogAnimation={new SlideAnimation({slideFrom: "bottom"})}
                dialogTitle={
                    <DialogTitle title={"忘記密碼"}/>
                }
                dialogStyle={{width: "50%"}}
                >
                <DialogContent style={{paddingVertical:0}}>
                    {
                        showComplete ?
                        <CompletedＦlow onFinish={handleClose}/>:
                        <ApplicationFlow
                        onCancel={handleClose}
                        onCompleted={()=>setShowComplete(true)}
                        />
                    }
                </DialogContent>
            </Dialog>
        </View>
    )
    
}
function ApplicationFlow({onCompleted,onCancel}){
    const[email,setEmail] = useState("peteryeh@fhnet.com.tw");
    const[validCode,setValidCode] = useState("");
    const[newPwd,setNewPwd] = useState("");
    const[confirmPwd,setConfirmPwd] = useState("");
    useEffect(()=>{
        return()=>{
            setEmail("");
            setValidCode("");
            setNewPwd("");
            setConfirmPwd("");
        }
    },[])
    return(
        <React.Fragment>
            <View style={{marginVertical:14}}>
                <Text>請輸入E-mail</Text>
                <View style={{flexDirection: "row"}}>
                    <TextInput
                            value={email}
                            placeholder={""}
                            onChangeText={text => setEmail(text)}
                            style={[styles.input,styles.email]}
                    />
                    <TouchableOpacity
                            onPress={_getResetToken}
                            style={{
                                paddingHorizontal: 4,
                                paddingVertical: 8,
                                backgroundColor: "#2A5AA3",
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                                width: "20%",
                            }}
                            >
                        <Text style={{color:"#fff",textAlign: "center"}}>寄出</Text>
                    </TouchableOpacity>
                </View>
                <Text>請輸入驗證碼</Text>
                
                <TextInput
                    value={validCode}
                    onChangeText={text => setValidCode(text)}
                    style={[styles.input,styles.validCode]}
                    />
            </View>

            <View style={{marginVertical:14}}>
                <Text>新密碼:</Text>
                <TextInput
                    value={newPwd}
                    onChangeText={text=>setNewPwd(text)}
                    style={[styles.input,styles.passwd]}
                />
                <Text>再次輸入新密碼:</Text>
                <TextInput
                    value={confirmPwd}
                    onChangeText={text => setConfirmPwd(text)}
                    style={[styles.input,styles.passwd]}
                />
                {
                    newPwd !== confirmPwd ? <Text style={{color:"red"}}>輸入的密碼不相同</Text> : <Text/>
                }
            </View>
            <DialogFooter>
                <DialogButton 
                    text={"取消"}
                    onPress={onCancel}
                />
                <DialogButton 
                    text={"更改密碼"}
                    onPress={ () => _updatePasswd() }
                    disabled={ 
                        (newPwd.length === 0) || 
                        (confirmPwd.length === 0) || 
                        (newPwd !== confirmPwd) 
                    } 
                />
            </DialogFooter>
        </React.Fragment>
    )
    async function _getResetToken(){
        console.log("寄件信箱為: ",JSON.stringify({email}))
        await fetch(API.getResetToken,{
            method:"POST",
            headers:{
                Accept: "application/json",
                "content-type": "application/json"
            },
            body:JSON.stringify({email})
        })
        .then(res=>{
            const payload = res.json();
            if( res.status === 200 && payload.status === "OK"){
                
            }
        })
        .catch(err=>{

        })
    }
    async function _updatePasswd(){
        console.log("更改密碼送出內容",JSON.stringify({
            newpasswd: newPwd,
            email,
            resetToken: validCode
        }))
        await fetch(API.resetPasswd,{
            method: "POST",
            headers:{
                Accept: "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                newpasswd: newPwd,
                email,
                resetToken: validCode
            })
        })
        .then(async res=>{
            const payload = await res.json();
            if( res.status === 200 && payload.result === "ok"){
                console.log("成功更新密碼",payload.result)
                onCompleted()
            }
        })
        .catch(err=>{

        })
    }
}
function CompletedＦlow({onFinish}){
    return(
        <React.Fragment>
            <View style={{paddingVertical:20}}>
                <Text style={{textAlign: "center"}}>完成密碼更改</Text>
            </View>
            <DialogFooter>
                <DialogButton
                    text={"完成"}
                    onPress={onFinish}
                />
            </DialogFooter>
        </React.Fragment>
    )
}
const styles = StyleSheet.create({
    input:{
        borderRadius:6,
        borderColor: "#000",
        borderWidth: 0.2,
    },
    email:{
        width: "80%",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    validCode:{
        width: "100%",
    },
    passwd:{
        width: "100%"
    }

})