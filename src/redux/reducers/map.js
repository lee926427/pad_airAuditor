import { AnimatedRegion } from "react-native-maps";
import { AUDITOR_MAP,APP } from "../actions/actionType";
const initState = {
    location:{
        latitude: 24.993214,
        longitude: 121.2995107,
    },
    mapSetting:{
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
        coordinate: new AnimatedRegion({
            latitude: 0,
            longitude: 0
           })
    },
    panArea:{
        southWest:{
            latitude: 25,
            longitude: 121.5
        },
        northEast:{
            latitude: 25.341,
            longitude: 121.604
        }
    },
    searchPin:{
        latitude: 24.993214,
        longitude: 121.2995107,
    },
    selectedPoint:{
        latitude: 0,
        longitude: 0,
    },
    isTrack: true
}
export default function(state=initState,action){
    switch(action.type){
        case APP.INIT_MAP:
            return {
                ...state,
                panArea: action.area
                /*
                location:{
                    latitude: action.coordinate.latitude,
                    longitude: action.coordinate.longitude
                },
                searchPin:{
                    latitude: action.coordinate.latitude,
                    longitude: action.coordinate.longitude
                },
                */
            }
        case AUDITOR_MAP.SET_PUTTING_PIN:
            return {
                ...state,
                searchPin: action.coordinate
            }
        case AUDITOR_MAP.SET_MAP_CENTER:
            return{
                ...state,
                location: action.coordinate
            }
        case AUDITOR_MAP.SET_TRACK:
            return {
                ...state,
                isTrack: action.bool
            }
        case APP.USER_MOVE:
            return {
                ...state,
                searchPin: action.coordinate
            }
        default:
            return state;
    }
}