import React,{
    useState,
    useEffect
} from "react";
import { 
    View,
} from "react-native";
import Dialog,{ 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton, 
    SlideAnimation 
} from "react-native-popup-dialog";
import { 
    useSelector,
    useDispatch
} from "react-redux";
import { loginFlow } from "../redux/actions/actionCreators";
export default function({boxTitle,children}){
    const isConfirm = useSelector( state => state.app.isConfErr)
    const dispatch = useDispatch()
    return(
        <View>
            <Dialog
                dialogTitle={ <DialogTitle title={boxTitle}/> }
                visible={ isConfirm }
                dialogStyle={ {width: "50%"} }
                dialogAnimation={ new SlideAnimation({slideFrom: "bottom"}) }>
                <DialogContent>
                    <View>
                        {
                            React.Children.map( children,(child) => child )
                        }
                    </View>
                </DialogContent>
                <DialogFooter>
                    <DialogButton 
                        text={"確定"}
                        onPress={()=> dispatch(loginFlow.confirmMsg())}/>
                </DialogFooter>
            </Dialog>
        </View>
    )
}