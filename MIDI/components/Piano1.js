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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Slider } from '@miblanchard/react-native-slider';
import { Audio } from 'expo-av';
import instruments from '../instruments';

const Piano = () => {
  const [instrument, setInstrument] = useState(instruments[0]);
  const [volume, setVolume] = useState(0.5);
  const [showKeys, setShowKeys] = useState(true);
  const [octaveShift, setOctaveShift] = useState(0);
  const [flashingKey, setFlashingKey] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const [recording, setRecording] = useState(false);
  const [events, setEvents] = useState([]);
  const startTime = useRef(0);

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
    return () => {
      Object.values(soundsRef.current).forEach(s => s.unloadAsync());
    };
  }, []);

  const animateKey = (i, toValue) => {
    Animated.spring(scaleRefs[i], {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const playNote = async (key) => {
    const sound = soundsRef.current[key];
    if (!sound) return;

    await sound.stopAsync();
    await sound.setPositionAsync(0);

    const idx = instruments.indexOf(instrument);
    const basePitch = Math.pow(2, (idx - 64)/48);
    const pitchJitter = 1 + (Math.random()-0.5)*0.1;
    const octaveFactor = Math.pow(2, octaveShift);
    const finalPitch = basePitch*pitchJitter*octaveFactor;
    const finalVol = volume*(0.8 + (idx%10)/25);

    try { await sound.setRateAsync(finalPitch, true); }
    catch(e){ console.warn('Pitch not supported',e); }
    await sound.setVolumeAsync(finalVol);
    await sound.playAsync();

    setFlashingKey(key);
    setTimeout(()=>setFlashingKey(null),200);

    setTimeout(async () => {
      const { sound: echo } = await Audio.Sound.createAsync(keyToNote[key]);
      await echo.setRateAsync(finalPitch*0.95, true);
      await echo.setVolumeAsync(finalVol*0.3);
      await echo.playAsync();
      setTimeout(()=>echo.unloadAsync(),1000);
    },120);
  };

  const handlePressIn = (key,i) => {
    if (!activeKeys.includes(key)) {
      setActiveKeys(a=>[...a,key]);
      playNote(key);
      if (recording) setEvents(e=>[...e,{key,time:Date.now()-startTime.current}]);
    }
    animateKey(i,0.9);
  };

  const handlePressOut = (key,i) => {
    setActiveKeys(a=>a.filter(k=>k!==key));
    animateKey(i,1);
  };

  const startRecording = () => {
    setEvents([]);
    startTime.current = Date.now();
    setRecording(true);
  };
  const stopRecording = () => setRecording(false);
  const playBack = () => events.forEach(({key,time})=>setTimeout(()=>playNote(key),time));

  return (
    <ImageBackground source={require('../assets/music.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.head}>MIDI Musical Keyboard</Text>
        <Text style={styles.label}>Select MIDI Instrument:</Text>
        <Picker selectedValue={instrument}
                style={styles.picker}
                onValueChange={setInstrument}
                dropdownIconColor="#000">
          {instruments.map((inst,i)=>(<Picker.Item key={i} label={inst} value={inst} color="#000"/>))}
        </Picker>

        <View style={styles.octaveContainer}>
          <Text style={styles.volumeLabel}>Octave Shift: {octaveShift}</Text>
          <Slider value={[octaveShift]}
                  onValueChange={([v])=>setOctaveShift(Math.round(v))}
                  minimumValue={-2} maximumValue={2} step={1}
                  style={styles.slider}
                  minimumTrackTintColor="#fff"
                  maximumTrackTintColor="#ccc"
                  thumbTintColor="#fff"/>
        </View>

        <View style={styles.pianoContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>PIANO</Text>
            <View style={styles.volumeContainer}>
              <Text style={styles.volumeLabel}>Volume</Text>
              <Slider value={[volume]}
                      onValueChange={([v])=>setVolume(v)}
                      minimumValue={0} maximumValue={1} step={0.01}
                      style={styles.slider}
                      minimumTrackTintColor="#fff"
                      maximumTrackTintColor="#ccc"
                      thumbTintColor="#fff"/>
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.volumeLabel}>Show Keys</Text>
              <Switch value={showKeys}
                      onValueChange={setShowKeys}
                      trackColor={{false:'#666',true:'#999'}}
                      thumbColor={showKeys? '#fff':'#ccc'}/>
            </View>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.keys}>
            {whiteKeys.map((key,i)=>(<Pressable key={i}
                         onPressIn={()=>handlePressIn(key,i)}
                         onPressOut={()=>handlePressOut(key,i)}>
                <Animated.View style={[styles.whiteKey,
                                        activeKeys.includes(key)&&styles.highlightKey,
                                        {transform:[{scale:scaleRefs[i]}]}]}>
                  {showKeys && <Text style={styles.whiteKeyLabel}>{swaraLabels[i]}</Text>}
                  {blackKeys[i] && (
                    <Animated.View style={[styles.blackKey,
                                            activeKeys.includes(blackKeys[i])&&styles.highlightKey]}>
                      {showKeys&&<Text style={styles.blackKeyLabel}>{blackKeys[i]}</Text>}
                    </Animated.View>
                  )}
                </Animated.View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Updated Controls Section */}
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
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Piano;

const styles = StyleSheet.create({
  background:{flex:1,width:'100%',height:'100%'},
  container:{flex:1,backgroundColor:'transparent',paddingTop:70,paddingHorizontal:20},
  head:{fontSize:30,color:'#fff',fontWeight:'bold',textAlign:'center',marginBottom:25},
  label:{fontSize:20,fontWeight:'bold',marginBottom:30,color:'#fff'},
  picker:{height:50,width:'100%',marginBottom:20,zIndex:10,backgroundColor:'rgba(255,255,255,0.3)',color:'#000',borderRadius:6},
  octaveContainer:{alignItems:'center',marginBottom:15},
  pianoContainer:{backgroundColor:'#111',borderRadius:20,padding:20,alignItems:'center'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%',marginBottom:20},
  title:{color:'#ccc',fontSize:20,fontWeight:'bold'},
  volumeContainer:{alignItems:'center'},
  volumeLabel:{color:'#fff',marginBottom:5},
  slider:{width:160,height:40},
  switchContainer:{alignItems:'center'},
  keys:{flexDirection:'row',position:'relative',height:180},
  whiteKey:{backgroundColor:'#fff',borderColor:'#ccc',borderWidth:1,width:35,height:'100%',justifyContent:'flex-end',alignItems:'center',marginRight:2},
  whiteKeyLabel:{color:'#aaa',fontSize:14,marginBottom:10},
  blackKey:{position:'absolute',top:0,left:20,width:20,height:100,backgroundColor:'#000',zIndex:1,justifyContent:'flex-end',alignItems:'center'},
  blackKeyLabel:{color:'#fff',fontSize:12,marginBottom:10},
  highlightKey:{backgroundColor:'#80d8ff'},
  controls:{flexDirection:'row',justifyContent:'center',marginTop:30},
  controlButton: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingButton: {
    backgroundColor: '#b71c1c',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
});
