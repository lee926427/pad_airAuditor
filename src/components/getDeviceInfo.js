import {Platform} from "react-native";
import DeviceInfo, { getBootloader } from "react-native-device-info";

function getInfo(){
    let info
    switch(Platform.OS){
        case "android":
            return new Promise( async (resolve,reject)=>{
                try{
                    info = {
                        device:{
                            "設備廠牌": DeviceInfo.getBrand(),
                            "系統名稱": DeviceInfo.getSystemName(),
                            "系統版本": DeviceInfo.getSystemVersion(),
                            "UID":DeviceInfo.getUniqueId(),
                            "是否為平板": DeviceInfo.isTablet(),
                            "設備": DeviceInfo.getDeviceType() ,
                        },
                        application:{
                            "應用程式名稱": DeviceInfo.getApplicationName(),
                            "應用程式版本:": DeviceInfo.getBuildNumber(),
                            "應用程式版本": DeviceInfo.getReadableVersion(),
                            "應用程式版本": DeviceInfo.getVersion(),
                            
                        },
                    }
                    await DeviceInfo.getAndroidId()
                    .then(androidID => info.device = {...info.device, "Android ID":androidID} );
                    await DeviceInfo.getApiLevel()
                    .then(apiLv => info.device = {...info.device,"API版本":apiLv} );
                    await DeviceInfo.getAvailableLocationProviders()
                    .then(provider => info.device = {...info.device, "裝置目前設定":provider} );
                    await DeviceInfo.getBatteryLevel()
                    .then(battaryLv => info.device = {...info.device, "電量":battaryLv} );
                    await DeviceInfo.getPowerState()
                    .then(powerState => info.device = {...info.device, "電池狀態":powerState})
                    await DeviceInfo.getBootloader()
                    .then(bootloader=> info.device = {...info.device, "系統版本":bootloader} );
                    await DeviceInfo.isCameraPresent()
                    .then(haveCamera=> info.device = {...info.device, "攝影機":haveCamera} );
                    await DeviceInfo.getCarrier()
                    .then( carrier => info.device = {...info.device, "電信商":carrier} );
                    await DeviceInfo.getDevice()
                    .then( deviceDesigner => info.device = {...info.device, "設備設計商":deviceDesigner} );
                    await DeviceInfo.getDisplay()
                    .then(display => info.device = {...info.device, "螢幕版本":display} );
                    await DeviceInfo.getDeviceName()
                    .then(deviceName => info.device = {...info.device, "裝置名稱":deviceName} );
                    await DeviceInfo.getDeviceToken()
                    .then(token => info.device = {...info.device, token} );
                    await DeviceInfo.getFingerprint()
                    .then(finger => info.device = {...info.device, "觸控設備":finger})
                    await DeviceInfo.getFontScale()
                    .then(fontScale => info.device = {...info.device, "字體大小":fontScale} );
                    await DeviceInfo.getFreeDiskStorage()
                    .then(freeDiskStorage => info.device = {...info.device, "可用儲存容量":freeDiskStorage} );
                    await DeviceInfo.getHardware()
                    .then(hardward => info.device = {...info.device, "主機板型號":hardward} );
                    await DeviceInfo.getIncremental()
                    .then( incremental => info.device = {...info.device, "內部硬體版本號:":incremental});
                    await DeviceInfo.getInstallerPackageName()
                    .then( packageName => info.device = {...info.device, "系統管理套件名稱":packageName} );
                    await DeviceInfo.getManufacturer()
                    .then(manufacturer => info.device = {...info.device, "設備製造商":manufacturer} );
                    await DeviceInfo.getMaxMemory()
                    .then(maxMemory => info.device = {...info.device,"記憶體容量":maxMemory} );
                    await DeviceInfo.getUsedMemory()
                    .then(usedMemory => info.device = {...info.device, "已使用記憶體":usedMemory} );
                    await DeviceInfo.getPhoneNumber()
                    .then(phoneNumber => info.device = { ...info.device, "設備電話門號":phoneNumber} );
                    await DeviceInfo.getProduct()
                    .then(product => info.device = {...info.device,"設備名稱":product} );
                    await DeviceInfo.getSerialNumber()
                    .then(serialNum => info.device = {...info.device, "設備序列號":serialNum} );
                    await DeviceInfo.getBuildId()
                    .then(buildID => info.device = {...info.device, "操作系統版本":buildID} );
                    await DeviceInfo.getTotalDiskCapacity()
                    .then(totalDisk => info.device = {...info.device,"全部儲存容量":totalDisk} );
                    await DeviceInfo.isAirplaneMode()
                    .then( mode => info.device = {...info.device, "飛航模式":mode} );
                    await DeviceInfo.isBatteryCharging()
                    .then(isCharging => info.device = {...info.device, "是否充電中":isCharging} );
                    await DeviceInfo.isLocationEnabled()
                    .then(enabled => info.device = {...info.device, "定位開啟狀態":enabled} );
                    await DeviceInfo.getAvailableLocationProviders()
                    .then(locationProvider=> info.device = {...info.device,"網路設備狀態":locationProvider}) 
                    await DeviceInfo.getFirstInstallTime()
                    .then(firstTimeInstall => info.application = {...info.application, "安裝時間":firstTimeInstall})
                    await DeviceInfo.getInstallReferrer()
                    .then( installRef => info.application = {...info.application, "應用程式下載來源":installRef} );
                    
                    await DeviceInfo.getInstanceId()
                    .then(instanceID => info.application = {...info.application, "應用程式實體ID":instanceID} );
                    await DeviceInfo.getLastUpdateTime()
                    .then(lastTime => info.application ={...info.application, "最後更新時間":lastTime} );
                    
                   /*
                    await DeviceInfo.getHost()
                    .then(host => info.device = {...info.device, "網域名稱":host} );
                    await DeviceInfo.getMacAddress()
                    .then( macAdress => info.device = {...info.device, "MAC 地址":macAdress} );
                    */
                    resolve(info)
                }catch(err){
                    reject(err)
                }
            })
        }
     
} 
export default getInfo
export {getInfo};
            