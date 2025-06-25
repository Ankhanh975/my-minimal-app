import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';

const MAX_POINTS = 25;
const Y_MIN = 0;
const Y_MAX = 2;

export default class SensorGraph extends Component {
  constructor(props) {
    super(props);
    this.history = Array(MAX_POINTS).fill(0);
    this.lastValue = undefined;
  }

  render() {
    const { data } = this.props;

    // Only push new value if it changed, and clip to [Y_MIN, Y_MAX]
    if (typeof data === 'number' && data !== this.lastValue) {
      const clipped = Math.max(Y_MIN, Math.min(Y_MAX, data));
      this.history.push(clipped);
      if (this.history.length > MAX_POINTS) {
        this.history.shift();
      }
      this.lastValue = data;
    }

    return (
      <View style={styles.outer}>
        <View style={styles.chartRow}>
          <YAxis
            data={this.history}
            contentInset={{ top: 16, bottom: 16 }}
            svg={{ fontSize: 12, fill: '#888' }}
            numberOfTicks={5}
            style={styles.yAxis}
            min={Y_MIN}
            max={Y_MAX}
          />
          <View style={styles.chartContainer}>
            <BarChart
              style={styles.chart}
              data={this.history}
              svg={{ fill: '#aa00ff', rx: 6, ry: 6 }}
              spacingInner={0.2}
              contentInset={{ top: 16, bottom: 16, left: 8, right: 8 }}
              showGrid={true}
              yMin={Y_MIN}
              gridMin={0}
              gridMax={Y_MAX}
              yMax={Y_MAX}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 16,
    alignItems: 'stretch',
    width: 200,  
    height: 100,  
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    width: 32,
    marginRight: 2,
    height: 100,
  },
  chartContainer: {
    backgroundColor: '#f8f4ff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#8800cc',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  chart: {
    height: 100,
    borderRadius: 12,
  },
});

