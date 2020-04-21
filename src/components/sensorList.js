import React from "react";
import { 
    FlatList, 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity,
    DeviceEventEmitter
} from "react-native";
import { useSelector,useDispatch } from "react-redux";
import { app } from "../redux/actions/actionCreators";



export default function({title="無標題",data}){
    const isExpansion = useSelector( state => state.app.isExpansionSen);
    const dispatch = useDispatch();
    const shrinkTitle= series =>{
        const re = /\(/g;
        return series.map(
            d =>{ 
                return({
                ...d,
                properties:{
                    ...d.properties,
                    name: d.properties.name.replace(re,"\n(")
                }
            })
            }
        )
    };
    return(
        <View style={styles.list}>
            <TouchableOpacity
                style={styles.header}
                onPress={()=>dispatch(app.expandSensors())}>
                <Text style={styles.title}>{title}</Text>
                {
                   isExpansion ?  null : <Counter count={data.length}/>
                }
            </TouchableOpacity>
            {
                isExpansion ? <List data={shrinkTitle(data)}/> : null
            }
        </View>
    );
}

function List({data}){
    return(
        <FlatList 
            style={styles.flat}
            data={data}
            renderItem={({item})=>
                <Item 
                coordinates={item.geometry.coordinates}
                {...item.properties}/>
            }
            keyExtractor={item => item.properties.uid}
        />
    );
}
function Counter({count}){

    return(
        <View style={styles.countStyle}>
            <Text style={styles.countText}>{count}</Text>
        </View>
    )
}
function Item({uid,name,PM25,VOC,coordinates}){
    function handleClick(coord){
        DeviceEventEmitter.emit("MAP_CAMERA",{latitude:coord[1],longitude:coord[0]})
    }
    return(
        <TouchableOpacity 
            style={styles.item}
            onPress={()=>handleClick(coordinates)}
            >
            <View style={styles.info}>
                <Text style={styles.itemTitle}>{name}</Text>
                <Text style={styles.itemContent}>PM2.5:{PM25}</Text>
                <Text style={styles.itemContent}>VOC:{VOC}</Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    list:{
        backgroundColor: "#DBDDDEB3",
        justifyContent:"center",
        borderBottomLeftRadius: 4,
        //borderBottomRightRadius: 4
    },
        header:{
            flexDirection: "row",
            width: "100%",
            height: 36,
            justifyContent: "center",
            paddingTop: 6,
        },
            title:{
                textAlign:"center",
                fontSize: 16,
                fontWeight: "500",
            },
            countText:{
                textAlign: "center",
                color: "#fff",
            },
            countStyle:{
                backgroundColor: "#437FD3",
                width: 24,
                height: 24,
                borderRadius: 12,
                padding: 2,
                
            },
    flat:{
        marginTop: 5,
        marginVertical: 10,
        height: 420
    },
        item:{
            flexDirection: "row",
            backgroundColor: "#23222b",
            marginVertical: 2,
            marginHorizontal: 6,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical:6
        },
            status:{
                flex: 1,
                height: "100%",
            },
            info:{
                flex: 3,
                marginVertical: 10,
            },
                itemTitle:{
                    fontSize: 18,
                    fontWeight: "600",
                    marginVertical: 2,
                    color: "#71A0CE"
                },
                itemContent:{
                    color: "#A7AEB7"
                }

})