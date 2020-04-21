import React,{ 
    useState,
} from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";

export default function({content="",onContentChange}){
    return(
        <View
            style={styles.container}>
            <Text
                style={styles.titleStyle}>
                    備註
            </Text>
            <TextInput
                value={content}
                onChangeText={onContentChange}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:"#fee",
        paddingHorizontal: 6,
        paddingVertical: 14,
        flex: 0.3
    },
    titleStyle:{
        fontSize: 14,
        fontWeight: "600",
    },
    comentStyle:{
        flex: 1
    }
})