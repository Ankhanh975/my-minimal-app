import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LightSensor } from 'expo-sensors';

function getColorByLx(lx) {
  if (lx === null) return '#000';
  if (lx < 100) return '#1e90ff'; // blue for low light
  if (lx < 1000) return '#32cd32'; // green for medium
  if (lx < 10000) return '#ffd700'; // yellow for bright
  return '#ff4500'; // orange/red for very bright
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    // Add static label styles here if needed
  },
  number: {
    fontWeight: 'bold',
  },
});

export default class LightSensorComponent extends React.Component {
  state = {
    illuminance: null,
  };

  componentDidMount() {
    LightSensor.setUpdateInterval(1000); // Update every second
    this._subscription = LightSensor.addListener(data => {
      this.setState({ illuminance: data.illuminance });
    });
  }

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
  }

  render() {
    const { illuminance } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Ambient Light:{" "}
          {illuminance !== null ? (
            <Text style={[styles.number, { color: getColorByLx(illuminance) }]}>
              {illuminance}
            </Text>
          ) : (
            'Not available'
          )}
          {" lx"}
        </Text>
      </View>
    );
  }
}