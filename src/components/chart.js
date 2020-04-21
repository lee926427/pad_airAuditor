import React from "react";
import {View} from "react-native";
import { Surface,Shape,Text } from "@react-native-community/art";

export default function ChartContainer(props){
    const {width,height}=props
    return(
        <View>
            <Surface
                width={width}
                height={height}
            >
                {
                    React.Children.map(props.children,(child,index) => child)
                }
            </Surface>
        </View>
    );
}
export function LineChart(props){
    const { width,color,data } = props
    const 
    return(
        <Shape 
            scale={1.0}
            visible={true}
            opacity={1.0}
            strokeWidth={width}
            fill={color}
            />
    );
}