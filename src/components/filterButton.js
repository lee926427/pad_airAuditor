import React,{
    useState
} from "react";
import { 
    TouchableOpacity,
    View,
    Text,
    TextInput,
    StyleSheet,
    Animated,
    DeviceEventEmitter
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import Geocoder from 'react-native-geocoding';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from "react-redux";
import { filter,auditorMap } from "../redux/actions/actionCreators";

export default function(){
    const [state,setState] = useState(false)
    return(
        <Animated.View style={styles.container}>
            <TouchableOpacity 
                style={styles.button}
                onPress={()=>setState(!state)}
                >
                <FontAwesomeIcon 
                    icon={faFilter} 
                    size={18}
                    />
                <Text style={styles.buttonText}>篩選</Text>
            </TouchableOpacity>
            {
                state ? <DropWindow/> : null
            }
        </Animated.View>
    );
}
function DropWindow(){
    const [address, setAddress]=useState("")
    const indexOptions = useSelector(state => state.filter.indexOptions)
    const defaultIndex = useSelector(state => state.filter.selectedIndex)
    const rangeOptions = useSelector(state => state.filter.rangeOptions)
    const defaultRange = useSelector(state => state.filter.selectedRange)
    const dispatch = useDispatch()
    const isMatch = /.{6,}/g.test(address)
    return(
        <View style={styles.dropWindow}>
            <TextInput 
                placeholder="請輸入地址"
                value={address}
                onChangeText={text=>setAddress(text)}
                style={styles.search}
                />
            {
                isMatch ? null : <Text>請至少輸入6個字以上</Text>
            }
            <View style={styles.dropDownLayout}>
                <SetIndex 
                    value={defaultIndex} 
                    options={indexOptions}
                    dispatch={e=>dispatch(filter.setIndex(e))}/>
                <SetRange
                    value={defaultRange}
                    options={rangeOptions}
                    dispatch={(e) => dispatch(filter.setRange(e))}/>
            </View>
            <SearchBtn payload={address}/>
        </View>
    )
}

function SetIndex({value,options,dispatch}){
    return (
        <View style={styles.dropdownBtn}>
            <Dropdown
                    label="指數"
                    data = {options}
                    value={value}
                    labelFontSize={20}
                    selectedItemColor={"#000"}
                    onChangeText={dispatch}
                    itemTextStyle={{
                        color:"#ccc"
                    }}
                />
        </View>
        );
}
function SetRange({value,options,dispatch}){
    return (
        <View style={styles.dropdownBtn}>
            <Dropdown
                    label="範圍"
                    data = {options}
                    value={value}
                    labelFontSize={20}
                    selectedItemColor={"#000"}
                    onChangeText={dispatch}
                    itemTextStyle={{
                        color:"#ccc"
                    }}
                />
        </View>
        )
}
function SearchBtn({payload}){
    const dispatch = useDispatch()
    const handleRequest = async() =>{
        let coordinate;
        Geocoder.init("AIzaSyClQlnWjkQtjujQSPEGDy3QGrXF75Fj2N8")
        await Geocoder.from(payload)
        .then(
            res=>{
                coordinate = res.results[0].geometry.location;
                DeviceEventEmitter.emit("SEARCH_ADDRESS",coordinate);
            }
        )
        .catch(error => console.warn(error));
        dispatch(auditorMap.setPuttingPin({latitude:coordinate.lat,longitude:coordinate.lng}))
        dispatch(filter.search());
    }
    return(
        <TouchableOpacity 
            style={styles.searchBtn}
            onPress={handleRequest}>
            <FontAwesomeIcon 
                icon={faSearch} 
                size={20}
                color={"#fff"}/>
            <Text style={styles.searchBtnText}>搜尋</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        position: "absolute",
        left: "27%",
        width: "46%",
    },
        button:{
            height: 36,
            width: "100%",
            backgroundColor: "#DBDDDE",
            flexDirection: "row",
            padding: 10,
        },
        buttonText:{
            fontSize: 14,
        },
    
    dropWindow:{
        width: "100%",
        backgroundColor: "#DBDDDE",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        padding: 14,
    },
        search:{
            width: "100%",
            height: 46,
            marginVertical: 6,
            backgroundColor: "#fff",
            borderRadius: 6,
        },
        dropDownLayout:{
            flexDirection: "row"
        },
        dropdownBtn:{
            flex: 0.5,
            flexDirection:"column",
            marginHorizontal: 12
        },

    searchBtn:{
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#285CB7",
        borderRadius: 6,
        paddingVertical: 6,
        marginVertical: 16,
        justifyContent: "center"
    },
        searchBtnText:{
            color: "#fff",
            fontSize: 20,
            fontWeight: "600",
            marginHorizontal: 16
        },
    text:{
        flex: 0.3
    }

})
