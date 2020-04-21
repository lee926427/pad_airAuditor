import React,{
    useEffect,
    useState
} from "react";
import { 
    View, 
    StyleSheet, 
    Dimensions,
    Text,
    Switch,
} from "react-native";
import
{ 
    Marker,
    Circle,
} from "react-native-maps";
import { 
    useSelector,
    useDispatch, 
} from "react-redux";
import { 
    FontAwesomeIcon 
} from '@fortawesome/react-native-fontawesome'
import { 
    faIndustry, 
    faCircle,
    faCamera,
    faPhotoVideo
} from '@fortawesome/free-solid-svg-icons'
import { 
    useNavigation
} from "@react-navigation/native";



//----------------------組件-----------------------
import { 
    app, auditorMap 
} from "../redux/actions/actionCreators";
import GoogleMap from "../components/googleMap";
import Factory from "../components/factoryList";
import Sensor from "../components/sensorList";
import SpdAndDirChart from "../components/spdAndDirChart";
import FilterButton from "../components/filterButton";
import { CircleIcon } from "../components/marker";
import TimeSlider from "../components/timeSlider";
//---------tools--------
import { OffsetX, Opacity } from "../tools/animated";

import { TouchableOpacity } from "react-native-gesture-handler";
const Window = Dimensions.get("window")

export default function({navigation}){
    return(
        <View style={styles.map}>
            <Map/>
            <FilterButton/>
            <SensorList/>
            <FactoryList/>
            <ChartSection/>{/*待修改 組件會拖垮效能*/}
        </View>
    );
}

function Map(){
    const sensors = useSelector( state => state.app.sensors );
    const isExpansionSen = useSelector(state => state.app.isExpansionSen );
    const factorys = useSelector( state => state.app.factorys );
    const isExpansionFac = useSelector( state => state.app.isExpansionFac );
    const handleMarkerTitle = (text) => {
        const re = /(股份)?有限公司-?/g;// /公司|公司-/g;
        const result = text.replace(re,"-");
        return result
    }
    return(
        <View style={styles.map}>
        <GoogleMap>
            {
                sensors ?
                sensors.map( sensor =>{
                    //console.log("sensor:",sensor)
                    return <SensorMarker
                        uuid={sensor.properties.uid}
                        latlng={{
                                latitude: sensor.geometry.coordinates[1],
                                longitude: sensor.geometry.coordinates[0]
                            }}
                        name={isExpansionSen ? sensor.properties.name : ""}
                        pm={sensor.properties.PM25}
                        isExpansion={isExpansionSen}/>
                }):
                null
            }
            {
                factorys ?
                factorys.map( factory =>{
                    //console.log("factory:",factory.properties)
                    return <FactoryMarker
                        uuid={factory.properties.uid}
                        latlng={{
                                latitude: factory.geometry.coordinates[1],
                                longitude: factory.geometry.coordinates[0]
                            }}
                        name={isExpansionFac ? "\r\r"+handleMarkerTitle(factory.properties.name) : ""}
                        isExpansion={isExpansionFac}/>
                }):
                null
            }
            <DragPin/>
        </GoogleMap>
        </View>
    )
}
//-----------------搜尋圖釘--------------------
function DragPin(){
    const pinPos = useSelector( state => state.map.searchPin);
    const range = useSelector( state => state.filter.selectedRange);
    const isTrack = useSelector( state => state.map.isTrack );
    const dispatch = useDispatch();
    return(
        <React.Fragment>
            <Marker 
                draggable={ isTrack ? false : true }
                coordinate={ pinPos }
                onDragEnd={ (e) => dispatch(auditorMap.setPuttingPin(e.nativeEvent.coordinate)) }/>
            <Circle
                center={pinPos}
                radius={ 1000 * range }
                fillColor={"#ffffff1A"}
                strokeColor={"#ffffff59"}
                strokeWidth={4}/>
        </React.Fragment>
    )

}

//-----------------感測器標記--------------------
function SensorMarker({latlng,name,pm,isExpansion,uuid}){
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleMakerPress = () =>{
        dispatch(app.hitMarker(uuid));
        navigation.navigate("裝置訊息")
    }

    const handleColorLv = value =>{
        switch(true){
            case ( value > 0 && value < 51 ):
                return 1;
            case ( value >= 51 && value < 100 ):
                return 2;
            case ( value >= 101 && value < 150 ):
                return 3;
            case ( value >= 151 && value < 200 ):
                return 4;
            case ( value >= 201 && value < 300 ):
                return 5;
            case ( value >= 301):
                return 6;
            default:
                return 0;
        }
    }

    return(
        <Marker
            key={uuid}
            coordinate={latlng}
            style={styles.mk}
            onPress={handleMakerPress}>
            {/*
            <FontAwesomeIcon 
                icon={faCircle} 
                size={20}
                color={"#ddd"}/>
            */}
            <CircleIcon value={handleColorLv(pm)}/>
            <Opacity
                isTrigger={isExpansion}
                terminal={[ 0, 1]}
                duration={640}
            >
                <Text 
                    style={styles.mkTitle}>
                    {name}
                </Text>
            </Opacity>
        </Marker>
    );
}

//-----------------監管工廠標記--------------------
function FactoryMarker({latlng,name,isExpansion,uuid}){
    return(
        <Marker
            key={uuid}
            coordinate={latlng}
            style={styles.mk}
        >
            <FontAwesomeIcon
                icon={faIndustry} 
                size={24} 
                color={"#fff"}
            />
            <Opacity
                isTrigger={isExpansion}
                terminal={[ 0, 1]}
                duration={640}
            >
                <Text 
                    style={styles.mkTitle}>
                    {name}
                </Text>
            </Opacity>
        </Marker>
    );
}


//-----------------感測器列表--------------------
function SensorList(){
    const sensorData = useSelector( state => state.app.sensors)
    return(
        <View style={styles.sensorList}>
            { sensorData ? <Sensor title={"測站點"} data={sensorData}/> : null}
        </View>
    )
}


//-----------------監管工廠列表--------------------
function FactoryList(){
    const factoryData = useSelector( state => state.app.factorys)
    return(
        <View style={styles.factoryList}>
            { factoryData ? <Factory title={"列管工廠"} data={factoryData}/> : null}
        </View>
    )
}


//-----------------風力與風向圖表--------------------
function ChartSection(){
    const windData = useSelector( state => state.app.windChart )
    const time = windData ? windData.data.map( d => d.time) : [0]
    const timeSeries = d => d.map( e => {
        const date = new Date(e)
        return date.getTime()
    })
    return(
        <View style={styles.chartSection}>
            {/*
                windData ?
                <TimeSlider
                    data={timeSeries(time)}
                    step={1000*60*3}
                /> :
                null
            */}

            <SpdAndDirChart/>

            <View style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor:"#343a40",
                paddingHorizontal: 10,
                }}>

                <RedirectionBtn 
                    size={28} 
                    color={"#fff"} 
                    icon={faCamera}
                    content={"相機"}
                    navigationDirect={"相機"}/>

                <RedirectionBtn 
                    size={28} 
                    color={"#fff"} 
                    icon={faPhotoVideo}
                    content={"上傳相片"}
                    navigationDirect={"上傳相片"}/>

                <SwitchTrack/>

            </View>

        </View>
    )
    function RedirectionBtn(props){
        const navigation = useNavigation();
        return(
            <TouchableOpacity
                style={styles.appendBtn}
                onPress={()=>navigation.navigate(props.navigationDirect)}>
                <FontAwesomeIcon
                    {...props}/>
                <Text style={styles.btnText}>{props.content}</Text>
            </TouchableOpacity>
        )
    }
    //-----------------switch------------------
    function SwitchTrack(){
        const dispatch = useDispatch()
        const isTrack = useSelector( state => state.map.isTrack)
        return(
            <View
                style={styles.switchContainer}>
                <Text
                    style={styles.switchState}>
                        追蹤定位: {isTrack ? "開" : "關"}
                </Text>
                <Switch
                    style={styles.switchStyle}
                    value={isTrack}
                    onValueChange={()=>dispatch(auditorMap.setTrace(!isTrack))}/>
            </View>
        )
    }
}


const ui = {
    listSection:{
        height: Window.height - 60 - 360,
        width: "30%"
    },
    chartSection:{
        height: 360,
        width: "100%",
    }
}
const styles = StyleSheet.create({
    map:{
        flex: 1,
        paddingTop: 18,
        backgroundColor: "#141C26"
    },

        mk:{
            justifyContent: "center",
            alignItems: "center"
        },
            mkTitle:{
                fontSize: 12,
                fontWeight: "400",
                color: "#fff"
            },
        sensorList:{
            position: "absolute",
            height: ui.listSection.height,
            width: "100%",
            maxWidth: "27%",
        },
        factoryList:{
            position: "absolute",
            right: 0,
            height: ui.listSection.height,
            width: "100%",
            maxWidth: "27%"
        },
        chartSection:{
            position: "absolute",
            bottom: 0,
            width: ui.chartSection.width,
            justifyContent: "center",
            alignItems: "center",
        },
        appendBtn:{
            flex: 1,
            width: "30%",
            minWidth: 160,
            justifyContent:"space-around",
            padding: 10,
            marginHorizontal: 12,
            marginVertical: 6,
            borderRadius: 8,
            backgroundColor: "#aaa",
            flexDirection: "row",
        },
        btnText:{
            fontSize: 16,
            fontWeight: "600",
            marginHorizontal: 16,
            color: "#fff",
            marginTop: "auto",
            marginBottom: "auto",
        },
        switchContainer:{
            flexDirection: "row",
            marginHorizontal: 14,

        },
        switchState:{
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
            marginTop: "auto",
            marginBottom: "auto",
            marginHorizontal: 8,
            color: "#fff"
        },
        switchStyle:{
            transform:[
                { scaleX: 1.6 },
                { scaleY: 1.6 }
            ],
            marginHorizontal: 8,
        }
})
