import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Slider } from '@miblanchard/react-native-slider';
import instruments from '../instruments';

const Piano = () => {
  const [instrument, setInstrument] = useState(instruments[0]);
  const [volume, setVolume] = useState(0.5);
  const [showKeys, setShowKeys] = useState(true);

  const whiteKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const blackKeys = { 0: 'W', 1: 'E', 3: 'T', 4: 'Y', 5: 'U', 7: 'O', 8: 'P' };

  return (
    <ImageBackground
      source={require('../assets/music.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.head}>MIDI Musical Keyboard</Text>
        <Text style={styles.label}>Select MIDI Instrument:</Text>

        <Picker
          mode="dropdown"
          selectedValue={instrument}
          style={styles.picker}
          onValueChange={setInstrument}
          dropdownIconColor="#000"
        >
          {instruments.map((inst, i) => (
            <Picker.Item key={i} label={inst} value={inst} color="#000" />
          ))}
        </Picker>

        <View style={styles.pianoContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>PIANO</Text>
            <View style={styles.volumeContainer}>
              <Text style={styles.volumeLabel}>Volume</Text>
              <Slider
                value={[volume]}
                onValueChange={([val]) => setVolume(val)}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                style={styles.slider}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#fff"
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.volumeLabel}>Show Keys</Text>
              <Switch
                value={showKeys}
                onValueChange={setShowKeys}
                trackColor={{ false: '#666', true: '#999' }}
                thumbColor={showKeys ? '#fff' : '#ccc'}
              />
            </View>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.keys}>
            {whiteKeys.map((key, i) => (
              <View key={i} style={styles.whiteKey}>
                {showKeys && <Text style={styles.whiteKeyLabel}>{key}</Text>}
                {blackKeys[i] && (
                  <View style={styles.blackKey}>
                    {showKeys && (
                      <Text style={styles.blackKeyLabel}>
                        {blackKeys[i]}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Piano;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  head: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)', // light white background for picker
    color: '#000', // Black text color for visibility
  },
  pianoContainer: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  title: { color: '#ccc', fontSize: 20, fontWeight: 'bold' },
  volumeContainer: { alignItems: 'center' },
  volumeLabel: { color: '#fff', marginBottom: 5 },
  slider: { width: 120, height: 40 },
  switchContainer: { alignItems: 'center' },
  keys: { flexDirection: 'row', position: 'relative', height: 180 },
  whiteKey: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    width: 35,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 2,
  },
  whiteKeyLabel: { color: '#aaa', fontSize: 14, marginBottom: 10 },
  blackKey: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 20,
    height: 100,
    backgroundColor: '#000',
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  blackKeyLabel: { color: '#fff', fontSize: 12, marginBottom: 4 },
});
