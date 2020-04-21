import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
 } from "react-native";
import { 
    createStackNavigator 
} from "@react-navigation/stack";
import { 
    NavigationContainer,
} from "@react-navigation/native";
import MapAuditor from "./mapAuditor";
import DeviceInfo from "./heatmap";
import MakeReport from "./makeReport";
import Camera from "./camera";
import { 
    FontAwesomeIcon 
} from '@fortawesome/react-native-fontawesome'
import { 
    faSignOutAlt, 
} from '@fortawesome/free-solid-svg-icons'
import { 
    useSelector 
} from "react-redux";
const AppStack = createStackNavigator()

export default function({navigation}){
    return(
        <NavigationContainer>
            <AppStack.Navigator 
                initialRouteName="稽查地圖"
                mode={"card"}
                screenOptions={{
                    //headerShown: false,
                    headerRight: props => <SignOutBtn 
                    logout={
                        ()=>navigation.dangerouslyGetParent().navigate("login")
                    }/>,
                    headerStyle:{
                        backgroundColor: "#141C26",
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 26
                    },
                }}>
                <AppStack.Screen 
                    name="稽查地圖" 
                    component={MapAuditor}/>
                <AppStack.Screen 
                    name="裝置訊息" 
                    component={DeviceInfo}/>
                <AppStack.Screen
                    name={"上傳相片"}
                    component={MakeReport}
                    />
                <AppStack.Screen
                    name={"相機"}
                    component={Camera}/>
            </AppStack.Navigator>
        </NavigationContainer>
    );
}
function SignOutBtn({logout}){
    const userName = useSelector( state => state.app.user)
    return(
        <View style={{flexDirection: "row"}}>
            <Text style={{color: "#fff" , marginHorizontal: 14}}> 使用者 <Text>{userName}</Text></Text>
            <TouchableOpacity
                onPress={logout}
                style={styles.logout}>
                <FontAwesomeIcon 
                    icon={faSignOutAlt}
                    color={"#fff"}
                    size={24}
                    />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    logout:{
        flexDirection: "row",
        marginRight: 16
    },
        userText:{
            fontSize: 16,
            fontWeight: "600",
            marginTop: "auto",
            marginBottom: "auto",
            color: "#fff",
            marginHorizontal: 14
        },
})