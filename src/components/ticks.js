import React,{ useEffect } from "react";
import { 
    StyleSheet,
    View,
    Text
} from "react-native";

export default function({first, second, value}){
    const checkActive = () => {
        if( value >= first && value <= second ){
            return true
        }else{
            return false
        }
    }
    const date = new Date(value)
    const hour = date.getHours() > 9 ? date.getHours() : "0"+date.getHours()
    const minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes()
    
    return(
        <View>
            <Text style={ styles.hour }>{ minute > 57 || minute < 3 ? hour : ""}</Text>
            <Text style={ [checkActive() ? styles.active : styles.inactive] }>{`${minute}`}</Text>
            <Text style={ styles.line }>|</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    active:{
        textAlign: 'center',
        fontSize:16,
        color:'#bdc3c7',
    },
    inactive:{
        flex:1,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight:'normal',
        fontSize:16,
        color:'#5e5e5e',
    },
    line:{
        fontSize:10,
        textAlign: 'center',
        color: "#fff"
    },
    hour:{
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "600",
        color: "#fff"
    },
});