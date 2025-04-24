import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const Intro = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Interactive MIDI Musical Keyboard</Text>
          <View style={styles.underline} />

          <Text style={styles.description}>
            This application allows users to play musical notes interactively using an on-screen MIDI keyboard interface. Users  can  explore  the  sounds of 128 instruments, helping them find the ones they like or want to learn more about. Perfect for music learners, hobbyists, and creators. Feel the Experience of playing music right at your fingertips! Start your musical journey now.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Piano')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Intro;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#8A98B2',           
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#111',           // very dark gray
    borderRadius: 20,
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',                     // white text
    marginBottom: 10,
    textAlign: 'center',
  },
  underline: {
    width: 120,
    height: 2,
    backgroundColor: '#fff',           // white underline
    marginBottom: 25,
  },
  description: {
    color: '#fff',                     // light gray
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',              // text will be justified (aligns both left and right)
    marginBottom: 40,
    marginHorizontal: 10,              // Adds side padding to avoid stretching to edges
},

  button: {
    backgroundColor: '#fff',           // white button
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',                     // black text
  },
});
