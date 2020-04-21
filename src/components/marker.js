import React,{ useEffect } from "react";
import { StyleSheet,Animated, Easing,View } from "react-native"

export function CircleIcon({width=20,height=20,value=0,duration=600,children=null}){
    const color = new Animated.Value(0)
    const backgroundColor = color.interpolate({
        inputRange:[0,1,2,3,4,5,6],
        outputRange:["rgb(14,24,47)","rgb(0,142,91)","rgb(255,217,45)","rgb(255,142,45)","rgb(197,0,45)","rgb(91,0,142)","rgb(115,0,32)"]
    })
    useEffect(()=>{
        Animated.timing(color,{
            toValue: value,
            duration,
            easing: Easing.linear,
        }).start();
    },[value])
    return(
        <View
            style={[
                {
                width,
                height
                },
                styles.border,
                styles.container
                ]}
        >
            <Animated.View
                style={[
                    {
                        width: width-2,
                        height: height-2,
                        backgroundColor
                    },
                    styles.border
                ]}
            >
                { children ? children : null }
            </Animated.View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        minHeight:20,
        minWidth: 20,
        backgroundColor:"#aaa",
        justifyContent:"center",
        alignItems: "center"
    },
    border:{
        borderRadius: 40,
    }
})