// use react-native-gifted-charts and make a new class in this file. 
// The class is a react component that every 100ms change props, 
// props has a float of call props.data. Make a line graph of 
// the nearest 25 datapoints
import { LineChart } from 'react-native-gifted-charts';
import { View, Text } from 'react-native';
import React from 'react';  

function MinimalGraph(props) {
  return (
    <View style={{ height: 120, marginVertical: 8 }}>
      <LineChart
        data={[props.data]}
      />
    </View>
  );
}

// A component that displays a line graph of the latest 25 datapoints, 
// updating every 100ms from props.data
class SensorGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      dataPoints: Array(25).fill(0),
    };
  }

  componentDidUpdate(prevProps) {
    // If the data prop changes, add it to the array
    if (prevProps.data !== this.props.data) {
      this.setState((prevState) => {
        const newData = [...prevState.dataPoints, this.props.data];
        if (newData.length > 25) newData.shift();
        return { dataPoints: newData };
      });
    }
  }

  render() {
    // Prepare data for LineChart
    const chartData = this.state.dataPoints.map((y, i) => ({ value: y, label: '' }));
    return (
      <View style={{ height: 120, marginVertical: 8 }}>
        <LineChart
          data={chartData}
          thickness={2}
          color="#1b6ca8"
          hideDataPoints={false}
          hideRules={true}
          yAxisColor="#ccc"
          xAxisColor="#ccc"
          noOfSections={3}
          isAnimated
        />
      </View>
    );
  }
}
export {SensorGraph, MinimalGraph}