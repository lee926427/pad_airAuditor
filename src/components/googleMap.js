import React from "react";
import { 
    StyleSheet,
    DeviceEventEmitter
} from "react-native";
import { connect } from "react-redux";
import MapView, 
{ 
    PROVIDER_GOOGLE,
} from "react-native-maps";
import { 
    PERMISSIONS,
} from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import { app, auditorMap } from "../redux/actions/actionCreators";
import CheckPermission from "../components/checkPermission"
//---------------GoogleMap Style-------------------
import mapStyle from "../mapStyle.json";


class GoogleMap extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            accuracy: 0, 
            altitude: 0, 
            heading: 0, 
            mapLatitude: 0,
            mapLongitude: 0,
            speed: 0,
            minZoom: 11,
            lastPosition: null,
        }
    }


    componentDidMount(){
        //this.map.setMapBoundaries(this.props.northEast,this.props.southWest)
        this._getInitPosition();
        this._catchFacListEvent();
        this._subscribeSearchAddress();
    }
    componentWillUnmount(){
        this._removeListener();
    }
    render(){
        const { googleMapSetting} = this.props
        const { mapLatitude, mapLongitude} = this.state
        
        return(
            <MapView
                style={styles.map}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE}
                initialRegion={
                    {
                        latitude: mapLatitude,
                        longitude: mapLongitude,
                        ...googleMapSetting
                    }
                }
                
                minZoomLevel={this.state.minZoom}
                ref={ ref => { 
                    this.map = ref;
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
                >
                    {
                        React.Children.map( this.props.children,child=>child)
                    }
                    <CheckPermission
                        device={PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION}
                        tipContent={"請開啟位置授權"}
                        granted={this._watchGps.bind(this)}
                        denied={this._handleDenied.bind(this)}/>
            </MapView>
        )
    }

    _subscribeSearchAddress(){
        DeviceEventEmitter.addListener("SEARCH_ADDRESS",
            async coordinate =>{
                const camera = await this.map.getCamera();
                camera.center.latitude = coordinate.lat;
                camera.center.longitude = coordinate.lng;
                camera.zoom = 18;
                this.map.animateCamera(camera,{duration: 800 });
            }
        )
    }
    _catchFacListEvent(){
        DeviceEventEmitter.addListener("MAP_CAMERA",
        async coordinate =>{
            const camera = await this.map.getCamera();
            camera.center.latitude = coordinate.latitude;
            camera.center.longitude = coordinate.longitude;
            camera.zoom = 18;
            this.map.animateCamera(camera,{duration: 800 });
        })
    }
    _removeListener(){
        DeviceEventEmitter.removeListener("MAP_CAMERA");
    }
    _getInitPosition(){
        console.log("定位")
        Geolocation.getCurrentPosition(
            async (position) => {
                const camera = await this.map.getCamera();
                camera.center.latitude = position.coords.latitude;
                camera.center.longitude = position.coords.longitude;
                camera.zoom = 13;
                this.map.setCamera(camera);
                this.props.initPinPos(position.coords)
            },
            (err) => {
                console.log("取得初始ＧＰＳ錯誤: ",err)
            }
        )
    }

    _watchGps (){
        Geolocation.watchPosition( 
            //-----------------監聽GPS資訊--------------------
            async (position)=>{
                
                const camera = await this.map.getCamera();
                camera.center.latitude = position.coords.latitude;
                camera.center.longitude = position.coords.longitude;
                camera.zoom = 16;
                this.map.animateCamera(camera,{duration: 2000 })

                if(this.props.isTrack){
                    this.props.userTrack(position.coords)
                }
            },
            error=>{
                console.log("error: ",error)
            },
            {
                enableHighAccuracy: false,
                distanceFilter: 50,// update distance between two points default 100
                interval: 1000*10,
                fastestInterval: 1000*5,
            }
        )
    }

    _handleDenied(){
        console.log("denied_1")
    }
}






const mapStateToProps = state =>{
    return{
        location: state.map.location,
        googleMapSetting: state.map.mapSetting,
        isTrack: state.map.isTrack,
        northEast: state.map.panArea.northEast,
        southWest: state.map.panArea.southWest
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        userTrack: coordinate => dispatch(app.userMove(coordinate)),
        initPinPos: coordinate => dispatch(auditorMap.setPuttingPin(coordinate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleMap)

const styles = StyleSheet.create({
    map:{
        flex: 1
    },
})