import { Platform, Text, View, StyleSheet, ScrollView, Pressable, ActivityIndicator, TouchableOpacity} from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import React from 'react';
import GPSGuideModal from './GPSGuideModal'; // Import the guide modal if needed

export default class GPS extends React.Component {
    timeoutId = null;

    constructor() {
        super();
        this.state = {
            location: null,
            errorMsg: null,
            loading: false,
            address: null,
            timestampStale: false, // Track if timestamp is stale
            showGuide: false, // <-- add this
        };
    }

    setStaleTimeout() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.setState({ timestampStale: true });
        }, 5000);
    }

    async getCurrentLocation() {
        this.setState({ loading: true });
        if (Platform.OS === 'android' && !Device.isDevice) {
            this.setState({
                errorMsg: 'Oops, this will not work on Snack in an Android Emulator. Try it on your device!',
                loading: false,
            });
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        let address = null;
        try {
            const addresses = await Location.reverseGeocodeAsync(location.coords);
            if (addresses && addresses.length > 0) {
                const a = addresses[0];
                const parts = [a.name, a.street, a.city, a.region, a.country].filter(
                    part => part && part.trim() !== ''
                );
                address = parts.join(', ');
            }
        } catch (e) {
            address = 'Address not found';
        }
        this.setState({
            location,
            errorMsg: null,
            loading: false,
            address,
            timestampStale: false, // Reset staleness on update
        });
        this.setStaleTimeout();
    }

    componentWillUnmount() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    }

    async componentDidMount() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            this.setState({ errorMsg: 'Permission to access location was denied' });
            return;
        }

        // Get last known position first
        let lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
            this.setState({ location: lastKnown, errorMsg: null });
        }

        // Then get current position
        this.getCurrentLocation();

        // Continue updating every 5 seconds
        setInterval(() => {
            if (this.state.loading) {
                return; // Don't fetch if already loading   
            }
            this.getCurrentLocation();
        }, 5000);
    }

    // Helper: color for location accuracy
    getAccuracyColor(accuracy) {
        if (accuracy <= 3) return '#2ecc40'; // Green - Excellent
        if (accuracy <= 10) return '#ffcc00'; // Yellow - Good/Fair
        return '#ff4136'; // Red - Poor
    }

    // Helper: color for altitude accuracy
    getAltitudeAccuracyColor(altAcc) {
        if (altAcc <= 10) return '#2ecc40'; // Green - Excellent
        if (altAcc <= 20) return '#ffcc00'; // Yellow - Good
        return '#ff4136'; // Red - Poor
    }

    // Helper: color for speed accuracy
    getSpeedColor(speed) {
        if (speed < 0) return '#888'; // Not available
        if (speed < 2) return '#ff4136'; // Red - Poor
        if (speed < 5) return '#ffcc00'; // Yellow - Good
        return '#2ecc40'; // Green - Excellent
    }

    render() {
        const { location, errorMsg, loading, address, timestampStale } = this.state;
        let formattedTimestamp = location
            ? new Date(location.timestamp).toLocaleTimeString()
            : '';

        // Helper to format numbers safely
        const fmt = (num, digits = 6) =>
            typeof num === 'number' && isFinite(num) ? num.toFixed(digits) : 'N/A';

        // Get color values
        const accuracyColor = location ? this.getAccuracyColor(location.coords.accuracy) : '#333';
        const altAccColor = location ? this.getAltitudeAccuracyColor(location.coords.altitudeAccuracy) : '#333';
        const speedKmh = location ? location.coords.speed * 3.6 : -1;
        const speedColor = location ? this.getSpeedColor(speedKmh) : '#333';

        // Use red if stale, normal color otherwise
        const timestampColor = timestampStale ? '#ff4136' : '#1b6ca8';

        return (
            // <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.container}>  
                
                <Text style={styles.title}>📍 GPS Location Info</Text>
                {errorMsg && (
                    <Text style={styles.error}>{errorMsg}</Text>
                )}
                {loading && (
                    <ActivityIndicator size="large" color="#2a5298" style={{ marginVertical: 12 }} />
                )}
                {location ? (
                    <Pressable
                        style={styles.card}
                        onLongPress={() => this.getCurrentLocation()}
                    >
                        <Text style={styles.sectionHeader}>General</Text>
                        <Text style={styles.label}>
                            Timestamp: <Text style={[styles.value, { color: timestampColor }]}>{formattedTimestamp}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Address: <Text style={styles.value}>{address || '...'}</Text>
                        </Text>
                        <Text style={styles.sectionHeader}>Coordinates</Text>
                        <Text style={styles.label}>
                            Latitude: <Text style={styles.value}>{fmt(location.coords.latitude, 6)}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Longitude: <Text style={styles.value}>{fmt(location.coords.longitude, 6)}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Accuracy: <Text style={[styles.value, { color: accuracyColor }]}>{fmt(location.coords.accuracy, 2)} m</Text>
                        </Text>
                        <Text style={styles.label}>
                            Altitude: <Text style={styles.value}>{fmt(location.coords.altitude, 2)} m</Text>
                        </Text>
                        <Text style={styles.label}>
                            Altitude Accuracy: <Text style={[styles.value, { color: altAccColor }]}>{fmt(location.coords.altitudeAccuracy, 2)} m</Text>
                        </Text>
                        <Text style={styles.label}>
                            Heading: <Text style={styles.value}>{fmt(location.coords.heading, 2)}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Speed: <Text style={[styles.value, { color: speedColor }]}>{fmt(speedKmh, 2)} km/h</Text>
                        </Text>
                    </Pressable>
                ) : !errorMsg && !loading ? (
                    <Text style={styles.waiting}>Waiting for location...</Text>
                ) : null}

                    
                <TouchableOpacity
                     style={styles.guideButton}
                     onPress={() => this.setState({ showGuide: true })}
                >
                     <Text style={styles.guideButtonText}>Show GPS Guide</Text>
                </TouchableOpacity>

                <GPSGuideModal
                    visible={this.state.showGuide}
                    onClose={() => this.setState({ showGuide: false })}
                ></GPSGuideModal>

           </View> 
        //</ScrollView>
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
    guideButton: {
        backgroundColor: '#1b6ca8',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 18,
        marginBottom: 8,
        alignSelf: 'center',
        elevation: 2,
    },
    guideButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});