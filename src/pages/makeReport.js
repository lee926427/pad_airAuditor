import React,{
    useState,
} from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import { 
    useDispatch,
    useSelector
} from "react-redux";
import { 
    app 
} from "../redux/actions/actionCreators";
import ImagePicker from 'react-native-image-crop-picker';
import Comment from "../components/comment";
export default function(){
    const dispatch = useDispatch();
    

    const [photos,setPhotos] = useState(null)
    const [comment,setComment] = useState("")

    const user = useSelector( state => state.app.user)

    const handleUpload = async() => {
        let formData = new Object();
        formData.user = user;
        formData.comment = comment;
        formData.photos = photos;
        await dispatch(app.uploadData(formData))
        setPhotos(null)
        setComment("")
    }
    const handleChoose = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 200,
            multiple: true,
            includeBase64: true,
        }).then( async(images) => {
            const datas = await images.map(image =>({
                uri:image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
                data: image.data
            }))
            await setPhotos(datas)
        })
    }
    const handlePreview = () => {
        const newlist = (interval) => {
            let base = []
            for(let i = 0; i< Math.ceil(photos.length/interval); i++){
              const group = photos.filter( (image,index)=> (index>=i*interval) && (index<(i+1)*interval) )
              base.push(group)
            }
            return base
        }

        return newlist(4).map( 
            (group,index) =>{ 
                return(
                    <View style={{flexDirection:"row",width: "100%",justifyContent:"space-between"}}>
                        {
                            group.map( photo =>{
                                return( 
                                    <Image
                                        key={photo.path}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            resizeMode: "contain",
                                            marginHorizontal: 2,
                                            marginVertical: 6, 
                                        }}
                                        source={{uri: `data:${photo.mime};base64,${photo.data}`}}/>
                                )
                            })
                        }
                    </View>
                ) 
            }
        )
    }
    return(
        <View style={styles.container}>
            <ScrollView style={styles.ablum}>
                {
                    photos ? handlePreview() : null
                }
            </ScrollView>
            <Comment
                content={comment} 
                onContentChange={text=>setComment(text)}/>
            <View 
                style={styles.bottomSection}>
                <TouchableOpacity
                    style={[styles.btn,styles.leftBtn]}
                    onPress={handleChoose}>
                    <Text 
                        style={styles.text}>
                        新增
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn,styles.rightBtn]}
                    onPress={handleUpload}>
                    <Text 
                        style={styles.text}>
                        送出
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    ablum:{
        height: "85%",
        width: "100%",
        paddingHorizontal: 6,
        backgroundColor: "#aaa",
        flex: 8,
    },
    bottomSection:{
        flex: 0.1,
        flexDirection: "row"
    },
    btn:{
        backgroundColor: "#aaa",
        width: "50%",
        height: "100%",
        justifyContent:"center",
        alignItems: "center",
        borderTopColor: "#000",
        borderTopWidth: 1,
    },
    leftBtn:{
        borderRightWidth: 1,
        borderRightColor: "#aaa"
    },
    rightBtn:{
        borderLeftWidth: 1,
        borderLeftColor: "#aaa"
    },
    text:{
        textAlign: "center"
    }
})