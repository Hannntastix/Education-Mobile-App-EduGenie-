import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';

export default function AddCourseWelcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative Background */}
      <View style={styles.backgroundCircle} />

      <Image
        source={require('./../../assets/images/Task.png')}
        style={styles.illustration}
      />

      <Text style={styles.title}>Ready to Share Your Knowledge?</Text>
      <Text style={styles.subtitle}>
        Create a new course and inspire learners across the world. It's fast, simple, and powerful.
      </Text>

      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/addCourse')}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Add New Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(102,126,234,0.1)',
    zIndex: -1,
  },
  illustration: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    textAlign: 'center',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: '#fff',
  },
});
