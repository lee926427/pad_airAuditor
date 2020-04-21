import { 
    APP,
    LOGIN_FLOW,
    AUDITOR_MAP
} from "../actions/actionType";

const initState = {
    user:null,
    isLoad:false,
    isActive: false,
    isSignout: true,
    token: null,
    errContent: null,
    isConfErr:false,

    isExpansionSen:false,
    sensors: null,
    isExpansionFac: false,
    factorys: null,
    windChart: null,


    heatMap:null,
    selectedTime: null,
    selectedID: null,
    fireBaseToken:null,
}

export default function(state=initState,action){
    switch(action.type){
        case LOGIN_FLOW.LOGINING:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoad: true,
            }
        case LOGIN_FLOW.GET_FIREBASE_TOKEN:
            return{
                ...state,
                fireBaseToken: action.token
            }
        case LOGIN_FLOW.SUCCESS_LOGIN:
            return {
                ...state,
                isActive: true
            };
        case LOGIN_FLOW.LOGOUT:
            return {
                ...state,
                isLoad: false,
                isActive: false,
                isSignout: true,
                token: null,
                sensors: null,
                factorys: null,
                windChart: null,
                heatMap:null,
                selectedTime: null,
                selectedID: null,
                
            };
        case LOGIN_FLOW.LOGIN_FAILD:
            return {
                ...state,
                errContent: action.payload,
                isConfErr: true
            }
        case LOGIN_FLOW.CONFIRM_FAILD:
            return {
                ...state,
                isConfErr: false
            }
        case LOGIN_FLOW.LOGIN_ERROR:
            return {
                ...state,
                err: action.payload
            }
        
        case APP.INIT_APP:
            return {
                ...state,
                selectedTime: action.time,
            }
        case APP.SET_MAP_DATA:
            return {
                ...state,
                sensors: action.payload.sensors.features,
                factorys: action.payload.factorys.features,
            }
        case APP.SET_WIND_CHART:
            return {
                ...state,
                windChart: action.payload,
                selectedTime: action.payload.data[action.payload.data.length-1].time
            }
        case APP.EXPAND_FACTORYS:
            return {
                ...state,
                isExpansionFac: !state.isExpansionFac
            }
        case APP.EXPAND_SENSORS:
            return{
                ...state,
                isExpansionSen: !state.isExpansionSen
            }
        case APP.START_APP:
            return {
                ...state,
                isSignout: false,
                isLoad: false,
            }
        case APP.SET_HEATMAP:
            return {
                ...state,
                heatMap: action.payload
            }
        

        case APP.HIT_MARKER:
            return {
                ...state,
                selectedID: action.id
            }

        case AUDITOR_MAP.DRAGED_TIME_SLIDER:
            return {
                ...state,
                selectedTime: action.time
            }
        default:
            return state
    }
}
