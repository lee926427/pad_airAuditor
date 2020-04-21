import React from "react";
import { Animated,Easing } from "react-native";



export function OffsetX({isTrigger=false,terminal=[0,100],duration=600,delay=0,children}){
    const transX = new Animated.Value(0);
    const translateX = transX.interpolate({
      inputRange: [ 0, 1],
      outputRange: terminal
    })
    React.useEffect(()=>{
      Animated.parallel([
        Animated.timing(transX,{
          toValue:isTrigger ? 1 : 0,
          duration,
          easing: Easing.linear,
          //useNativeDriver: true
        }),
        Animated.delay(delay)
      ]).start();
    },[isTrigger])
  
    return (
      <Animated.View style={{transform:[{translateX}]}}>
      {
        children
      }
      </Animated.View>
    )
}
export function OffsetY({isTrigger=false,terminal=[0,100],duration=600,delay=0,children}){
    const transY = new Animated.Value(0);
    const translateY = transY.interpolate({
      inputRange: [ 0, 1],
      outputRange: terminal
    })
    React.useEffect(()=>{
      Animated.parallel([
        Animated.timing(transY,{
          toValue: isTrigger ? 1 : 0,
          duration,
          easing: Easing.linear,
          //useNativeDriver: true
        }),
        Animated.delay(delay)
      ]).start();
    },[isTrigger])
  
    return (
      <Animated.View style={ {transform:[{translateY}] }}>
      {
        children
      }
      </Animated.View>
    )
}
export function Opacity({isTrigger=false,terminal=[0,100],duration=600,delay=0,children}){
    const o = new Animated.Value(0);
    const opacity = o.interpolate({
      inputRange: [ 0, 1],
      outputRange: terminal
    })
    React.useEffect(()=>{
      Animated.parallel([
        Animated.timing(o,{
          toValue: isTrigger ? 1 : 0,
          duration,
          easing: Easing.linear,
          //useNativeDriver: true
        }),
        Animated.delay(delay)
      ]).start();
    },[isTrigger])
  
    return (
      <Animated.View style={{opacity}}>
      {
        children
      }
      </Animated.View>
    )
}
export default { OffsetX, OffsetY, Opacity}