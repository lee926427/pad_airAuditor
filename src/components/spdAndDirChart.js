import React,{ useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Animated,
    Easing
} from "react-native";
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSortDown,faSortUp } from "@fortawesome/free-solid-svg-icons";
import { 
    useSelector,
    useDispatch
} from "react-redux";
import { 
    app
} from "../redux/actions/actionCreators";
const bgColor = "#343a40"

export default function(){
    const [isShowChart , setIsShowChart] = useState(false)
    const makeData = (data1,data2) =>{
        return data2.map( (d,index) => ([data1[index],d]) )
    }
    const windData = useSelector( state => state.app.windChart )
    //console.log("windData:",windData)
    const sensorName = windData ?  windData.properties.name : "";
    const pm = windData ? windData.data.map( d => parseInt(d.PM25)) : [0]
    const time = windData ? windData.data.map( d => d.time) : [0];
    const spd = windData ? windData.data.map( (d,index) => d.spd) : [0];
    const dir = windData ? windData.data.map( (d,index) => d.dir) : [0];
    const dispatch = useDispatch();

    const [showChartAni, setShowChartAni] = useState(new Animated.Value(-180));

    const handleUpdate = (method) => {
        dispatch(method)
        if(!isShowChart){
            Animated.timing(
                showChartAni,
                {
                    toValue: 0,
                    duration: 600,
                }
            ).start()
        }else{
            Animated.timing(
                showChartAni,
                {
                    toValue: -180,
                    duration: 600,
                }
            ).start()
        }
        

        setIsShowChart(!isShowChart)
    }
    return(
        <Animated.View 
            style={[styles.chartSection,{position:"relative",bottom:showChartAni}]}>
            <TouchableOpacity 
                onPress={
                    isShowChart ?
                    ()=>handleUpdate(app.cancelUpdateWind()):
                    ()=>handleUpdate(app.updateWindy())
                    } 
                style={{
                    flex: 0.2,
                    paddingTop:6,
                    flexDirection:"row",
                    justifyContent: "center"}}>
                <Text 
                    style={{
                        color:"#fff",
                        fontSize:20}}>
                    陳情點風速與風向
                </Text>
                <FontAwesomeIcon
                        icon={ isShowChart ? faSortDown : faSortUp}
                        size={18}
                        color={"#fff"}
                        style={{marginTop:"auto",marginBottom:"auto"}}/>
            </TouchableOpacity>
            <Chart 
                subTitle={sensorName}
                pm={pm}
                wind={makeData(spd,dir)} 
                time={time}/>
        </Animated.View>
    );
}

function Chart({subTitle, pm, wind, time}){
    const keyColors = ["#FD749B", "#A154F2BF"]
    const config = {
        chartOptions: {
            title:{
                text: '',
                style: {
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontSize: '14px'
                }
            },
            series: [
                {
                    name:"",
                    type:"area",
                    data:null,
                    showInLegend: false,
                    keys:["y"],
                    color: keyColors[0],
                    fillColor: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [ 0, keyColors[0] ],
                            [ 1, keyColors[1] ]
                        ]
                    },
                },{
                    name: "風速",
                    type:"windbarb",
                    data:null,
                    color: keyColors[1],
                    showInLegend: false,
                    tooltip:{
                        valueSuffix: "m/s"
                    }
                },
                
            ],
            chart: {
                backgroundColor: bgColor,
                style: {
                    fontFamily: '\'Unica One\', sans-serif',
                },
                plotBorderColor: '#606063',
                events: {
                    load: function () {
                        
                    }
                }
            },
            xAxis: {
                type: "datetime",
                offset: 40,
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    //pointStart: 0,
                    //pointInterval: 1000*60*3,
                    dataLabels: {
                        color: '#F0F0F3',
                        style: {
                            fontSize: '13px'
                        }
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                },
                title: {
                    style: {
                        color: '#C0C0C0'
                    }
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },
            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },
            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },
            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },
            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },
            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            }
        },
        
    }
    const [state,setState] = useState(config)
    
    useEffect(()=>{
        setState({
            ...state,
            chartOptions:{
                ...state.chartOptions,
                title:{
                    ...state.chartOptions.title,
                    text: subTitle
                },
                series:[{
                    ...state.chartOptions.series[0],
                    name: subTitle,
                    data: pm
                },{
                    ...state.chartOptions.series[1],
                    data: wind
                }],
                plotOptions:{
                    ...state.chartOptions.plotOptions,
                    series:{
                        ...state.chartOptions.plotOptions.series,
                        pointStart: time[0],
                        pointInterval: 1000*60*3,
                    }
                }
            }
        })
    },[wind])
    
    return(
        <HighchartsReactNative
            styles={styles.chartContainer}
            options={state.chartOptions}
            modules={["windbarb"]}/>
    );
}

const styles = StyleSheet.create({
  chartSection:{
      position: "relative",
      bottom: 0,
      paddingBottom: 16,
      backgroundColor: bgColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 220,
      justifyContent: "center",
      width: "100%"
  },
  title:{
      fontSize: 24,
      fontWeight: "600",
      color: "#858A90",
      textAlign: "center"
  },
  chartContainer:{
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20
  }
})