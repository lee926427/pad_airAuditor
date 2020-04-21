import { all, call, take, takeEvery, takeLatest, put, select, delay,race } from "redux-saga/effects";
import { 
    LOGIN_FLOW, 
    APP, 
    AUDITOR_MAP, 
    FILTER
} from "../redux/actions/actionType";
import {
    app, 
} from "../redux/actions/actionCreators";
import { 
    getUser,
    getMap,
    getFilter,
    getApp
} from "./selector";
const API = {
    getData:"http://openapi.fhnet.com.tw/appapi/tgetNodes",
    getWindy:"http://openapi.fhnet.com.tw/appapi/tgetWindy",
    getHeatData: "http://openapi.fhnet.com.tw/appapi/tgetHeatmap",
    uploadReport: "http://openapi.fhnet.com.tw/appapi/putImages",
}
const updateInterval = 1000*60*5 //更新資料時間間隔
const delayTime = 1000 * 60 //更新資料超過一分鐘將中斷更新 PS:可能連線品質不佳

export default function* rootSaga(){
    yield all([
        watchLoginFlow(),
        initFlow(),
        watchTrigger(),
        watchWindyUpdate(),
        watchMarkerClicked(),
        watchReport(),
    ])
}

//----------------sign In/Out flow-----------------------
function* watchLoginFlow (){
    yield take(LOGIN_FLOW.LOGINING)
    yield take(LOGIN_FLOW.SUCCESS_LOGIN)
    yield call(autoUpdate)
    yield take(LOGIN_FLOW.LOGOUT)
}

function* initFlow(){
    yield take(APP.INIT_APP)
    //yield call(updateFlow);
}
function* autoUpdate(){
    while(true){
        yield call(updateFlow)
        yield delay(updateInterval)
    }
}



function* watchTrigger(){
    yield takeEvery([
            AUDITOR_MAP.DRAGED_TIME_SLIDER,
            AUDITOR_MAP.SET_PUTTING_PIN,
            FILTER.SEARCH_FILTER,
        ],
        updateFlow);
}
function* updateFlow(){
    const token = yield select(getUser.token);
    const pinLocation = yield select(getMap.searchPin);
    const range = yield select(getFilter.range);
    const index = yield select(getFilter.index);
    const time = yield select(getApp.selectedTime);

    const conditions = {
        pinLocation:{
            ...pinLocation,
            range: range*1000,
        },
        index,
        time
    }
    yield call(requestMapData,token,conditions)
}



function* requestMapData(token,conditions){
    const payload = yield call(
       ()=>fetch(API.getData,{
            headers:{
                'Accept': 'application/json',
                "content-type": "application/json",
            },
            method: "POST",
            body:JSON.stringify({
                token,
                conditions
            })
        })
        .then(res => {
            return res.json()
        })
        .catch( err =>{
            console.log("err:",err.message)
        })
    )
    yield put(app.setMapData(payload))
}
function* watchWindyUpdate(){
    console.log("update windy data")
    while(true){
        yield take(APP.UPDATE_WINDY)
        yield race({
            windy: call(requestWindyData),
            cancelUpdate: take(APP.CANCEL_UPDATE_WINDY)
        });
    }
    
    
}
function* requestWindyData(){
    const token = yield select(getUser.token);
    const pinLocation = yield select(getMap.searchPin);
    const range = yield select(getFilter.range);
    const index = yield select(getFilter.index);
    const time = yield select(getApp.selectedTime);
    const conditions = {
        pinLocation:{
            ...pinLocation,
            range: range*1000,
        },
        index,
        time
    }
    while(true){
        const payload =yield call(
            ()=>fetch(API.getWindy,{
                headers:{
                    'Accept': 'application/json',
                    "content-type": "application/json",
                },
                method: "POST",
                body:JSON.stringify({
                    token,
                    conditions
                })
            })
            .then(res => {
                return res.json()
            })
            .catch( err =>{
                console.log("err:",err.message)
            })
        )
        //console.log("request payload:",payload)
        yield put(app.setWindChart(payload))
        yield delay(delayTime)
    }
}




function* watchMarkerClicked(){
    yield takeLatest(APP.HIT_MARKER,getMarkerData)
}
function* getMarkerData(action){
    const token = yield select(getUser.token);
    const { getHeat, timeout } = yield race({
        getHeat: call(
            () => fetch(API.getHeatData,{
                method: "POST",
                headers:{
                    Accept : "application/json",
                    "content-type": "application/json"
                },
                body:JSON.stringify({
                    token,
                    EUI: action.id
                })
            }).then(res => res.json())
        ),
        timeout: delay(delayTime)
    });
    console.log("heat Data:",getHeat)
    if(getHeat){
        yield put(app.setHeatMap(getHeat))
    }
    else{
        yield put(app.fetchFaild("訓號不佳"))
    } 
}



function* watchReport(){
    yield takeEvery(APP.UPLOAD_DATA,uploadData)
}
function* uploadData(action){
    console.log("upload Data:",action.payload)
    const {upload,timeout} =yield race({
        upload: call(
            ()=>{
                fetch(API.uploadReport,{
                    method: "POST",
                    headers:{
                        Accept : "application/json",
                        "content-type": "application/json"
                    },
                    body:JSON.stringify(action.payload)
                })
            }
        ),
        timeout: delay(delayTime)
    })
    yield console.log("uplaod payload:",upload)
    if(upload){
        yield put(app.uploadFinish())
        yield console.log("Uplaod Finish!")
    }else{
        yield put(app.fetchFaild("訓號不佳"))
    }
}