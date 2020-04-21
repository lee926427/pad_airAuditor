import { 
    FILTER, 
    LIST,
    LOGIN_FLOW,
    APP,
    AUDITOR_MAP,
 } from "./actionType";


export const filter = {
    setAddress: payload => ({type:FILTER.SET_ADDRESS, payload}),
    setRange: range => ({type:FILTER.SET_RANGE, range}),
    setIndex: index => ({type:FILTER.SET_INDEX, index}),
    pickItem: uid => ({type: FILTER.PICK_ITEM, uid}),
    search: () => ({type: FILTER.SEARCH_FILTER}),
} 
export const list = {
    moveTo: coordinate => ({type:LIST.MOVE_TO, coordinate})
}
export const loginFlow = {
    login: () => ({type:LOGIN_FLOW.LOGIN}),
    logining: payload => ({type:LOGIN_FLOW.LOGINING,payload}),
    getFireToken: token => ({type:LOGIN_FLOW.GET_FIREBASE_TOKEN,token}),
    successLogin: payload => ({type:LOGIN_FLOW.SUCCESS_LOGIN,payload}),
    loginFaild: payload => ({type:LOGIN_FLOW.LOGIN_FAILD, payload}),
    confirmMsg: () =>({type:LOGIN_FLOW.CONFIRM_FAILD}),
    loginError: payload => ({type:LOGIN_FLOW.LOGIN_ERROR,payload}),
    logout: ()=> ({type:LOGIN_FLOW.LOGOUT})
}

export const app = {
    initApp: () => ({type:APP.INIT_APP}),
    userMove: coordinate => ({type:APP.USER_MOVE, coordinate}),
    loading: () => ({type:APP.LOADING}),
    setMapData: payload => ({type:APP.SET_MAP_DATA,payload}),
    expandSensors: payload => ({type:APP.EXPAND_SENSORS, payload}),
    expandFactorys: payload => ({type:APP.EXPAND_FACTORYS, payload}),
    updateWindy: () => ({type: APP.UPDATE_WINDY}),  
    setWindChart: payload => ({type:APP.SET_WIND_CHART, payload}),
    cancelUpdateWind: () => ({type: APP.CANCEL_UPDATE_WINDY}),
    startApp: () => ({type:APP.START_APP}),
    hitMarker: id => ({type:APP.HIT_MARKER, id}),
    setHeatMap: payload => ({type:APP.SET_HEATMAP, payload}),
    updateError: err => ({type:APP.UPDATE_ERROR, err}),
    fetchFaild: reason => ({type:APP.FETCH_FAILD, reason}),
    updateData: () => ({type:APP.UPDATE_DATA}),
    uploadData: payload => ({type:APP.UPLOAD_DATA, payload}),
    uploadFinish: () => ({type: APP.UPLOAD_FINISH})
}
export const auditorMap = {
    dragedTimeSlider: time => ({type: AUDITOR_MAP.DRAGED_TIME_SLIDER, time}),
    setMapCenter: coordinate => ({type:AUDITOR_MAP.SET_MAP_CENTER, coordinate}),
    setPuttingPin: coordinate => ({type:AUDITOR_MAP.SET_PUTTING_PIN, coordinate}),
    setTrace: bool => ({type:AUDITOR_MAP.SET_TRACK, bool})
}
