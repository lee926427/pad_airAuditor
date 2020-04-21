import React,{
    PureComponent
} from "react";
import { 
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image
} from "react-native";
import { 
    RNCamera,
    Constants
} from "react-native-camera";
import { 
    FontAwesomeIcon 
} from "@fortawesome/react-native-fontawesome";
import { 
    faCamera,
    faPhotoVideo
} from "@fortawesome/free-solid-svg-icons";

import RNFS from "react-native-fs";
import moment from "moment";

export default class extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            currentPicture: null
        }
    }
    render(){
        const { navigation } = this.props
        const {
            currentPicture
        } = this.state
        return(

                <View style={styles.container}>
                    <RNCamera
                        style={ styles.preview }
                        ref={ ref =>{
                            this.camera = ref
                        }}
                        autoFocus={RNCamera.Constants.AutoFocus.on}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        androidCameraPermissionOptions={{
                            title:"相機授權",
                            message: "是否允許應用程式使用相機權限",
                            buttonPositive: "允許",
                            buttonNegative: "拒絕",
                        }}
                        onGoogleVisionBarcodesDetected={({ barcodes }) =>{
                            console.log(barcodes)
                        }}
                        />
                    <View 
                        style={styles.functionSection}>
                        <TouchableOpacity 
                            style={styles.takepicture}
                            onPress={this._takePictureAsync.bind(this)}>
                            <FontAwesomeIcon 
                                icon={faCamera}
                                size={36}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.pictureBtn}
                            onPress={()=> navigation.navigate("上傳相片")}>
                            <FontAwesomeIcon
                                icon={faPhotoVideo}
                                size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
        );
    }
    _handleSavePath = () => {
        return Platform.select({
            ios: `${RNFS.DocumentDirectoryPath}/airAuditor`,
            android: `${RNFS.ExternalStorageDirectoryPath}/DCIM/airAuditor`
        })
    }
    _savePicturePath = () => {
        return `${this._handleSavePath()}/Pictures`
    }
    _saveImage = async(filePath) => {
        try{
            const currentTime = new Date();
            const newImageName = `${ Math.round(currentTime.getTime()/1000) }.jpg`;
            const newFilePath = `${this._savePicturePath()}/${newImageName}`;
            await this._moveAttachment(filePath, newFilePath);
        }catch(error){
            console.log(error)
        }
    }
    _takePictureAsync = async() => {
        if(this.camera){
            const options = {
                quality: 0.5,
                base64: true,
                writeExif: true,
            };
            
            const data = await this.camera.takePictureAsync(options);
            await this._saveImage(data.uri)
        }
    }
    _moveAttachment = async (filePath,newFilePath) => {
        console.log('resource: ',filePath)
        console.log('target: ', newFilePath)
        RNFS.stat(filePath)
        return new Promise((resolve,reject)=>{
            RNFS.mkdir(this._savePicturePath())
            .then(()=>{
                RNFS.moveFile(filePath,newFilePath)
                .then( success =>{
                    resolve(true);
                })
                .then(()=>{
                    if(Platform.OS === "ios"){

                    }else if(Platform.OS === "android"){
                        RNFS.scanFile(newFilePath);
                    }
                })
                .catch(error =>{
                    console.log("moveFile Error: ",error);
                    reject(error);
                });
            })
            .catch(err => {
                reject(err)
            })
        });
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "black"
    },
    preview:{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    functionSection:{
        flex: 0,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#000"
    },
    takepicture:{
        flex: 0,
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        margin: 20,
    },
    pictureBtn:{
        backgroundColor: "#fff",
        position: "absolute",
        right: 0,
        bottom: 30,
        padding: 10,
        margin: 10,
        borderRadius: 6,
    },
    picture:{
        width: 30,
        height: 30,
    }
})