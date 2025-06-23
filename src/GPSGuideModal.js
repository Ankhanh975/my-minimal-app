import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function GPSGuideModal({ visible, onClose }) {
    let guideLines = `
    // 📍 GPS ACCURACY GUIDE
    
    // 🎯 LOCATION ACCURACY
    // • Excellent: ±1-3 meters (open sky, clear view)
    // • Good: ±3-5 meters (urban areas, some obstructions)
    // • Fair: ±5-10 meters (dense urban, heavy tree cover)
    // • Poor: ±10+ meters (indoor, underground, tunnels)
    
    // 📊 ALTITUDE ACCURACY
    // • GPS altitude is less accurate than horizontal position
    // • Typical accuracy: ±10-20 meters (vs ±3-5m horizontal)
    // • Barometric sensors improve altitude accuracy
    // • Elevation data may vary by ±15-30 meters
    
    // 🚗 SPEED ACCURACY
    // • Excellent: ±0.5-1 km/h (constant movement)
    // • Good: ±1-2 km/h (variable speed)
    // • Poor: ±2-5 km/h (slow movement, stops/starts)
    // • Speed below 2 km/h may show as 0
    
    // 📡 SATELLITE SIGNAL STRENGTH (dB-Hz)
    // • Excellent: 40+ dB-Hz (strong, clear signal)
    // • Good: 30-40 dB-Hz (reliable positioning)
    // • Fair: 20-30 dB-Hz (usable, may be less accurate)
    // • Poor: <20 dB-Hz (weak, unreliable)
    
    // 📈 OPTIMAL SATELLITE CONDITIONS
    // • Minimum satellites: 4 for basic positioning
    // • Good positioning: 6-8 satellites
    // • Excellent positioning: 8+ satellites
    // • Multi-constellation: Better accuracy and reliability
    
    // 🌍 FACTORS AFFECTING ACCURACY
    // • Atmospheric conditions (ionosphere, troposphere)
    // • Satellite geometry (HDOP, VDOP, PDOP)
    // • Multipath interference (buildings, trees)
    // • Device hardware quality
    // • Environmental obstructions
    
    // ⚡ REAL-TIME ACCURACY INDICATORS
    // • "Used" satellites: Actually contributing to position fix
    // • "Strong" signals: >30 dB-Hz, high-quality data
    // • First Fix Time: Time to acquire initial position
    // • GNSS Status: System operational state
    
    // 🔧 IMPROVING ACCURACY
    // • Clear view of sky (minimize obstructions)
    // • Wait for more satellites to acquire
    // • Stay stationary for initial fix
    // • Use high-accuracy mode
    // • Enable all available constellations
    
    // 📱 DEVICE-SPECIFIC CONSIDERATIONS
    // • Modern phones support multiple constellations
    // • Hardware quality varies between devices
    // • Some devices have barometric sensors
    // • Antenna quality affects signal reception
    // • Software algorithms improve accuracy
    
    // ⚠️ LIMITATIONS
    // • Indoor positioning is unreliable
    // • Urban canyons reduce accuracy
    // • Weather can affect signal quality
    // • Battery optimization may reduce update frequency
    // • Some features require clear sky view
    // `.trim().split('\n');
    
  return (
     <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>📍 GPS Accuracy Guide</Text>
                
            {guideLines.map((line, idx) => (
                <Text key={idx} style={styles.modalText}>{line}</Text>
            ))
            }
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b6ca8',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#1b6ca8',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 18,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});