import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PianoKey = ({ note, isBlack }) => {
  return (
    <View
      style={[styles.key, isBlack && styles.blackKey]}
    >
      {!isBlack && <Text style={styles.label}>{note}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  key: {
    width: 35,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 2,
    position: 'relative',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 20,
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default PianoKey;
