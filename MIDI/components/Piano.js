import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Animated,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Slider } from '@miblanchard/react-native-slider';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import instruments from '../instruments';

const screenWidth = Dimensions.get('window').width;
const keyWidth = Math.min(40, screenWidth / 12);

const Piano = () => {
  const [instrument, setInstrument] = useState(instruments[0]);
  const [volume, setVolume] = useState(0.5);
  const [showKeys, setShowKeys] = useState(true);
  const [octaveShift, setOctaveShift] = useState(0);
  const [activeKeys, setActiveKeys] = useState([]);
  const [recording, setRecording] = useState(false);
  const [events, setEvents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const startTime = useRef(0);
  const recordingRef = useRef(null);

  const whiteKeys = ['A','S','D','F','G','H','J','K','L'];
  const blackKeys = {0:'W',1:'E',3:'T',4:'Y',5:'U',7:'O',8:'P'};
  const swaraLabels = ['Sa','Ri','Ga','Ma','Pa','Da','Ni',"Sa'", "Ri'"];

  const keyToNote = {
    A: require('../assets/sounds/1.mp3'),
    S: require('../assets/sounds/2.mp3'),
    D: require('../assets/sounds/3.mp3'),
    F: require('../assets/sounds/4.mp3'),
    G: require('../assets/sounds/5.mp3'),
    H: require('../assets/sounds/6.mp3'),
    J: require('../assets/sounds/7.mp3'),
    K: require('../assets/sounds/8.mp3'),
    L: require('../assets/sounds/9.mp3'),
  };

  const soundsRef = useRef({});
  const scaleRefs = useRef(whiteKeys.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    (async () => {
      for (let key in keyToNote) {
        const { sound } = await Audio.Sound.createAsync(keyToNote[key]);
        soundsRef.current[key] = sound;
      }
    })();
    return () => Object.values(soundsRef.current).forEach(s => s.unloadAsync());
  }, []);

  const animateKey = (i, toValue) =>
    Animated.spring(scaleRefs[i], { toValue, useNativeDriver: true }).start();

  const playNote = async (key) => {
    const sound = soundsRef.current[key];
    if (!sound) return;
    await sound.stopAsync();
    await sound.setPositionAsync(0);

    const idx = instruments.indexOf(instrument);
    const basePitch = Math.pow(2, (idx - 64) / 48);
    const pitchJitter = 1 + (Math.random() - 0.5) * 0.1;
    const octaveFactor = Math.pow(2, octaveShift);
    const finalPitch = basePitch * pitchJitter * octaveFactor;
    const finalVol = Math.max(0, Math.min(1, volume * (0.8 + (idx % 10) / 25)));

    try { await sound.setRateAsync(finalPitch, true); }
    catch (e) { console.warn('Pitch not supported', e); }
    await sound.setVolumeAsync(finalVol);
    await sound.playAsync();

    setTimeout(() => {
      (async () => {
        const { sound: echo } = await Audio.Sound.createAsync(keyToNote[key]);
        await echo.setRateAsync(finalPitch * 0.95, true);
        await echo.setVolumeAsync(Math.max(0, Math.min(1, finalVol * 0.3)));
        await echo.playAsync();
        setTimeout(() => echo.unloadAsync(), 1000);
      })();
    }, 120);
  };

  const handlePressIn = (key, i) => {
    if (!activeKeys.includes(key)) {
      setActiveKeys(a => [...a, key]);
      playNote(key);
      if (recording) setEvents(e => [...e, { key, time: Date.now() - startTime.current }]);
    }
    animateKey(i, 0.9);
  };

  const handlePressOut = (key, i) => {
    setActiveKeys(a => a.filter(k => k !== key));
    animateKey(i, 1);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Microphone access is needed.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      startTime.current = Date.now();
      setEvents([]);
      setRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri);
    } catch (err) {
      console.error('Stop recording error', err);
    }
  };

  const playBack = () => events.forEach(({ key, time }) => setTimeout(() => playNote(key), time));

  const shareRecording = async () => {
    if (!recordingUri) {
      Alert.alert('No recording found', 'Please record something first.');
      return;
    }

    try {
      await Sharing.shareAsync(recordingUri);
    } catch (error) {
      console.error('Sharing failed', error);
      Alert.alert('Error', 'Failed to share recording.');
    }
  };

  return (
    <ImageBackground source={require('../assets/music.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.head}>MIDI Musical Keyboard</Text>

        <View style={styles.pianoContainer}>
          <Text style={styles.title}>MIDI PIANO</Text>
          <ScrollView horizontal contentContainerStyle={styles.keys}>
            {whiteKeys.map((key, i) => (
              <Pressable key={i}
                onPressIn={() => handlePressIn(key, i)}
                onPressOut={() => handlePressOut(key, i)} >
                <Animated.View style={[
                  styles.whiteKey,
                  activeKeys.includes(key) && styles.highlightKey,
                  { width: keyWidth, transform: [{ scale: scaleRefs[i] }] },
                ]}>
                  {showKeys && <Text style={styles.whiteKeyLabel}>{swaraLabels[i]}</Text>}
                  {blackKeys[i] && (
                    <Animated.View style={[
                      styles.blackKey,
                      activeKeys.includes(blackKeys[i]) && styles.highlightKey,
                    ]}>
                      {showKeys && <Text style={styles.blackKeyLabel}>{blackKeys[i]}</Text>}
                    </Animated.View>
                  )}
                </Animated.View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙ Instrument Selection</Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, recording && styles.recordingButton]}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.controlButtonText}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, events.length === 0 && styles.disabledButton]}
            onPress={playBack}
            disabled={events.length === 0}
          >
            <Text style={styles.controlButtonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !recordingUri && styles.disabledButton]}
            onPress={shareRecording}
            disabled={!recordingUri}
          >
            <Text style={styles.controlButtonText}>Share Recording</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showSettings} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>

              <Text style={styles.volumeLabel}>Instrument:</Text>
              <Picker selectedValue={instrument}
                style={styles.picker}
                onValueChange={setInstrument}
                dropdownIconColor="#000">
                {instruments.map((inst, i) => (
                  <Picker.Item key={i} label={inst} value={inst} color="#000" />
                ))}
              </Picker>

              <Text style={styles.volumeLabel}>Volume</Text>
              <Slider value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                minimumValue={0} maximumValue={1} step={0.01}
                style={styles.slider}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#fff" />

              <Text style={styles.volumeLabel}>Octave Shift: {octaveShift}</Text>
              <Slider value={[octaveShift]}
                onValueChange={([v]) => setOctaveShift(Math.round(v))}
                minimumValue={-2} maximumValue={2} step={1}
                style={styles.slider}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#fff" />

              <View style={styles.switchContainer}>
                <Text style={styles.volumeLabel}>Show Keys</Text>
                <Switch value={showKeys}
                  onValueChange={setShowKeys}
                  trackColor={{ false: '#666', true: '#999' }}
                  thumbColor={showKeys ? '#fff' : '#ccc'} />
              </View>

              <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Piano;
const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'transparent', paddingTop: 70, paddingHorizontal: 20 },
  head: { fontSize: 30, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 50, marginTop: 20 },
  pianoContainer: { backgroundColor: '#111', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 30 },
  title: { color: '#ccc', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  keys: { flexDirection: 'row', position: 'relative', height: 180 },
  whiteKey: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', marginRight: 2 },
  whiteKeyLabel: { color: '#aaa', fontSize: 14, marginBottom: 10 },
  blackKey: { position: 'absolute', top: 0, left: 15, width: 20, height: 100, backgroundColor: '#000', zIndex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  blackKeyLabel: { color: '#fff', fontSize: 12, marginBottom: 10 },
  highlightKey: { backgroundColor: '#80d8ff' },
  settingsButton: { alignSelf: 'center', marginVertical: 10, backgroundColor: '#222', padding: 10, borderRadius: 6 },
  settingsText: { color: '#fff', fontWeight: 'bold' },
  controls: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 },
  controlButton: { backgroundColor: '#444', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, margin: 8, alignItems: 'center' },
  controlButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  recordingButton: { backgroundColor: '#b71c1c' },
  disabledButton: { backgroundColor: '#888' },
  picker: { height: 50, width: '100%', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.3)', color: '#000', borderRadius: 6 },
  volumeLabel: { color: '#fff', marginBottom: 5 },
  slider: { width: '100%', height: 40 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalCloseButton: { marginTop: 20, backgroundColor: '#444', padding: 10, borderRadius: 5, alignItems: 'center' },
  modalCloseText: { color: '#fff', fontWeight: 'bold' },
});
