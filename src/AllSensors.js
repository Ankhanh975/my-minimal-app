import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Magnetometer, Barometer, DeviceMotion } from 'expo-sensors';
import { VectorVisualize, OrientationVisualize, MagnitudeVisualize } from './ThreeJS';

export default class AllSensors extends React.Component {
  constructor() {
    super();
    this.state = {
      mag: { x: 0, y: 0, z: 0 },
      bar: { pressure: 0 },
      deviceMotion: {
        acceleration: { x: 0, y: 0, z: 0 },
        accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
        rotation: { alpha: 0, beta: 0, gamma: 0 },
        rotationRate: { alpha: 0, beta: 0, gamma: 0 },
        orientation: 0,
      },
      rotationOffset: { alpha: 0, beta: 0, gamma: 0 },
    };
    this.subs = {};
  }

  componentDidMount() {
    Magnetometer.setUpdateInterval(100);
    Barometer.setUpdateInterval(100);
    DeviceMotion.setUpdateInterval(100);

    this.subs.mag = Magnetometer.addListener((data) =>
      this.setState({ mag: data })
    );
    this.subs.bar = Barometer.addListener((data) =>
      this.setState({ bar: data })
    );
    this.subs.deviceMotion = DeviceMotion.addListener((data) =>
      this.setState({ deviceMotion: data })
    );
  }

  componentWillUnmount() {
    Object.values(this.subs).forEach((sub) => sub && sub.remove());
  }

  handleResetRotation = () => {
    const { rotation } = this.state.deviceMotion;
    this.setState({
      rotationOffset: {
        alpha: rotation?.alpha || 0,
        beta: rotation?.beta || 0,
        gamma: rotation?.gamma || 0,
      },
    });
  };

  render() {
    const { mag, bar, deviceMotion, rotationOffset } = this.state;
    const { x: ax = 0, y: ay = 0, z: az = 0 } = deviceMotion.acceleration || {};
    const { x: agx = 0, y: agy = 0, z: agz = 0 } = deviceMotion.accelerationIncludingGravity || {};
    const { alpha = 0, beta = 0, gamma = 0 } = deviceMotion.rotation || {};
    const { alpha: rAlpha = 0, beta: rBeta = 0, gamma: rGamma = 0 } = deviceMotion.rotationRate || {};
    const orientation = deviceMotion.orientation ?? 0;

    // Rotation relative to offset
    const relAlpha = alpha - (rotationOffset.alpha || 0);
    const relBeta = beta - (rotationOffset.beta || 0);
    const relGamma = gamma - (rotationOffset.gamma || 0);

    // Magnitudes
    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);
    const accelGravityMag = Math.sqrt(agx * agx + agy * agy + agz * agz);
    const rotationRateMag = Math.sqrt((rAlpha * 57.2958) ** 2 + (rBeta * 57.2958) ** 2 + (rGamma * 57.2958) ** 2);

    // Magnetometer logic
    const magX = mag.x ?? 0;
    const magY = mag.y ?? 0;
    const magZ = mag.z ?? 0;
    const magMagnitude = Math.sqrt(magX * magX + magY * magY + magZ * magZ);

    // Barometer logic
    const barPressure = bar.pressure ?? null;
    const barAtm = barPressure ? (barPressure / 1013.25).toFixed(4) : 'N/A';

    return (
      <View style={styles.container}>
        <Text style={styles.title}>📍 Sensor Data</Text>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Acceleration (m/s²): </Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>x: <Text style={styles.value}>{ax.toFixed(2)}</Text></Text>
              <Text style={styles.label}>y: <Text style={styles.value}>{ay.toFixed(2)}</Text></Text>
              <Text style={styles.label}>z: <Text style={styles.value}>{az.toFixed(2)}</Text></Text>
              <Text style={styles.label}>
                Magnitude: <Text style={styles.value}>{accelMag.toFixed(2)}</Text>
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <VectorVisualize x={ax} y={ay} z={az} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Acceleration + Gravity (m/s²): </Text>
          <Text style={styles.label}>x: <Text style={styles.value}>{agx.toFixed(2)}</Text></Text>
          <Text style={styles.label}>y: <Text style={styles.value}>{agy.toFixed(2)}</Text></Text>
          <Text style={styles.label}>z: <Text style={styles.value}>{agz.toFixed(2)}</Text></Text>
          <Text style={styles.label}>
            Magnitude: <Text style={styles.value}>{accelGravityMag.toFixed(2)}</Text>
          </Text>

          <Text style={styles.sectionHeader}>Rotation (degrees, relative): </Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftColumn}>
              <TouchableOpacity style={styles.button} onPress={this.handleResetRotation}>
                <Text style={styles.buttonText}>Reset Rotation</Text>
              </TouchableOpacity>
              <Text style={styles.label}>α: <Text style={styles.value}>{(relAlpha * 57.2958).toFixed(2)}°</Text></Text>
              <Text style={styles.label}>β: <Text style={styles.value}>{(relBeta * 57.2958).toFixed(2)}°</Text></Text>
              <Text style={styles.label}>γ: <Text style={styles.value}>{(relGamma * 57.2958).toFixed(2)}°</Text></Text>
            </View>
            <View style={styles.rightColumn}>
              <OrientationVisualize x={relAlpha} y={relBeta} z={relGamma} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Rotation Rate (degrees/s): </Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>α: <Text style={styles.value}>{(rAlpha * 57.2958).toFixed(2)}</Text></Text>
              <Text style={styles.label}>β: <Text style={styles.value}>{(rBeta * 57.2958).toFixed(2)}</Text></Text>
              <Text style={styles.label}>γ: <Text style={styles.value}>{(rGamma * 57.2958).toFixed(2)}</Text></Text>
              <Text style={styles.label}>
                Magnitude: <Text style={styles.value}>{rotationRateMag.toFixed(2)}</Text>
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <VectorVisualize x={rAlpha * 57.2958} y={rBeta * 57.2958} z={rGamma * 57.2958} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Orientation: <Text style={styles.value}>{orientation.toFixed(2)}</Text></Text>

          <Text style={styles.sectionHeader}>Magnenometer (μT)</Text>
          <View style={styles.rowContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>
                x: <Text style={styles.value}>{magX.toFixed(2)}</Text>
              </Text>
              <Text style={styles.label}>
                y: <Text style={styles.value}>{magY.toFixed(2)}</Text>
              </Text>
              <Text style={styles.label}>
                z: <Text style={styles.value}>{magZ.toFixed(2)}</Text>
              </Text>
              <Text style={styles.label}>
                Magnitude: <Text style={styles.value}>{magMagnitude.toFixed(2)}</Text>
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <VectorVisualize x={magX} y={magY} z={magZ} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Barometer</Text>
          <Text style={styles.label}>
            Pressure: 
            <Text style={styles.value}>
              {" " + barAtm} atm
            </Text>
          </Text>
        </View>
        <Text style={styles.guide}>
          Note: The values are updated every 100ms. Ensure your device supports
          these sensors.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 100, // Add this line for top padding
    backgroundColor: '#f2f6fc',
    // backgroundColor: '#000000',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a5298',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: 380,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a5298',
    marginTop: 10,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
  value: {
    color: '#1b6ca8',
    fontWeight: '600',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  waiting: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
  guide: {
    fontSize: 14,
    color: '#444',
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f8f8ff',
    borderRadius: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#1b6ca8',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 8,
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftColumn: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
});