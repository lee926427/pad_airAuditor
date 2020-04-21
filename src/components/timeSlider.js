import React,
{ 
    useState,
    useCallback 
} from "react";
import { 
    View,
    StyleSheet,
    Dimensions
 } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Tick from "../components/ticks";
import { auditorMap,app } from "../redux/actions/actionCreators";
import { useDispatch } from "react-redux";
const Window = Dimensions.get("window")


export default function({single=true,data=[0,1],step=1}){
    const dispatch = useDispatch()
    const [state,setState] = useState({
        series: data,
        first: data[0],
        second: data[data.length - 1],
    })
    const renderTicks = () => {
        return state.series.map( (d,index) => 
            <Tick
                value = {d}
                first = {state.first}
                second = {state.second}
            /> 
        );
    }
    const onChange = async values => {
        if(single){
            setState({
                ...state,
                second:values[0]
            })
        }else{
            setState({
                multiSliderValue: values,
                first : values[0],
                second : values[1],
            })
        }
    }
    const onChangeFinish = async (values) =>{
        await dispatch(auditorMap.dragedTimeSlider(values[0]))
    }
    return(
        <View style={styles.container}>
            <View style={styles.column}>
                {renderTicks()}
            </View>
            <MultiSlider
                containerStyle={{width:"100%"}}
                trackStyle={{backgroundColor:'#bdc3c7',height: 10,borderRadius: 10}}
                selectedStyle={{backgroundColor:"#A154F2"}}
                markerStyle={{width:26,height:26,bottom:-4}}
                pressedMarkerStyle={{width:36,height:36}}
                sliderLength={Window.width-80}
                values={ single ? [state.second] : [ state.first, state.second] }
                min={state.first}
                max={state.second}
                step={step}
                allowOverlap={false}
                snapped={true}
                on
                onValuesChange={onChange}
                onValuesChangeFinish={onChangeFinish}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    column:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        bottom:-20,
        width: Window.width-64,
        marginBottom: 10,
    },
    active:{
        textAlign: 'center',
        fontSize:20,
        color:'#5e5e5e',
    },
    inactive:{
        textAlign: 'center',
        fontWeight:'normal',
        color:'#bdc3c7',
    },
    line:{
        textAlign: 'center',
    }
})