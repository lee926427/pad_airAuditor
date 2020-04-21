import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { app, heatmap } from "../redux/actions/actionCreators";
import HighchartsReactNative from '@highcharts/highcharts-react-native';

const Window = Dimensions.get("window")
const voclevel =[
	'#00e800',
	'#ffff00',
	'#ff7e00',
	'#ff0000',
	'#8f3f97',
	'#7e0023',
]
const theme = {
	backgroundColor: "#bbb"
}


export default function({navigation}){
	const heatmapData = useSelector( state => state.app.heatMap)
	const selectedID = useSelector( state => state.app.selectedID)
	const weekSerise = () => {
		const localTime = new Date()
		const weekDays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",")
		
		let newSerise = [];
		for (let i = localTime.getDay(); i>localTime.getDay()-weekDays.length; i--){
			newSerise.push( 
				i>=0 ? 
				Math.abs( i ) : 
				Math.abs( localTime.getDay()-weekDays.length - i ) + localTime.getDay()
			)
		}
		console.log(newSerise)
		return newSerise.map(day=>weekDays[day]).reverse()
	}
	const modules = ["heatmap"]
	const config= {
        chartOptions:{
			chart: {
		        marginTop: 50,
		        marginBottom: 40,
		        plotBorderWidth: 1,
				backgroundColor: theme.backgroundColor,
				events:{
					load: function(){
						
					}
				}
		    },
            title:{
                text:selectedID
            },
            xAxis:{
                categories: weekSerise(),
		        title: 'Week'
            },
            yAxis: {
		        categories: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
		        title: 'Hours',
		        reversed: true
            },
            accessibility: {
		        point: {
		            descriptionFormatter: function (point) {
		                var ix = point.index + 1,
		                    xName = getPointCategoryName(point, 'x'),
		                    yName = getPointCategoryName(point, 'y'),
		                    val = point.value;
		                return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
		            }
		        }
		    },
		    colorAxis: {
		        min: 0,
		        max: 100,
		        minColor: voclevel[2],
		        maxColor: voclevel[5]
		    },
		    legend: {
				title: {
					text: "單位: PM2.5"
				},
		        align: 'right',
		        layout: 'vertical',
		        margin: 0,
		        verticalAlign: 'top',
		        y: 25,
		        symbolHeight: 280
		    },
		    tooltip: {
		        formatter: function () {
		            return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
		                this.point.value + '</b> items at <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
		        }
            },
            series: [{
				name: 'pm25 data',
				type: 'heatmap',
				borderWidth: 1,
				data: heatmapData,
		        dataLabels: {
		            enabled: true,
		            color: '#000000'
		        }
			}],
            responsive: {
		        rules: [{
		            condition: {
		                maxWidth: 200
		            },
		            chartOptions: {
		                yAxis: {
		                    labels: {
		                        formatter: function () {
		                            return this.value.charAt(0);
		                        }
		                    }
		                }
		            }
		        }]
		    },
		    plotOptions: {
		        series: {
		            cursor: 'pointer',
		            point: {
		                events: {
		                    click: function () {
		                        $('#heat-wind-speed').text(this.value);
		                    }
		                }
		            }
		        }
		    }
        }
	}
    return(
		<View style={styles.container}>
			<HighchartsReactNative
				styles={ styles.heatmap }
				options={ config.chartOptions }
				modules={ modules }
				loader={ true }/>
		</View>
    );
}
const styles = StyleSheet.create({
	container:{
		position: "absolute",
		backgroundColor: theme.backgroundColor
	},
    heatmap:{
		width: Window.width,
		height: Window.height-80,
    },
    getDataBtn:{
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6
    }

})