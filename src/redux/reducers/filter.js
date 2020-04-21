import { FILTER } from "../actions/actionType";

const initState = {
    searchAddress: "",
    rangeOptions: [{value:0.5},{value:1},{value:3},{value:5}],
    selectedRange: 5,
    indexOptions: [{value:"PM2.5"},{value:"VOC"}],
    selectedIndex: "PM2.5",
}
export default function(state=initState,action){
    switch(action.type){
        case FILTER.SET_ADDRESS:
            return {
                ...state,
                searchAddress: action.payload
            }
        case FILTER.SET_RANGE:
            return Object.assign({},state,{
                selectedRange: action.range,
            })
        case FILTER.SET_INDEX:
            return Object.assign({},state,{
                selectedIndex: action.index,
            })
        case FILTER.PICK_ITEM:
            return Object.assign({},state,{
                pickedSensor: state.sensorFilter.filter( d => d.properties.uid == action.uid)[0]
            })
        case FILTER.SEARCH_FILTER:
            return {
                ...state,
                searchAddress: ""
            }
        default:
            return state;
    }
}