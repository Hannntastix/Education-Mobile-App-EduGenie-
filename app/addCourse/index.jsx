import { View, Text, TextInput, StyleSheet, Platform } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'

export default function AddCourse() {
  const [loading, setLoading] = useState(false)

  const onGenerateTopic = () => {
    // Get Topic Idea For Course
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What do you want to learn today?</Text>

      <Text style={styles.label}>What course you want to create?</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Ex. Learn Python, Digital Marketing, 10th Grade Science...'
        placeholderTextColor={Colors.GRAY}
      />

      <Button
        text={'Generate Topic'}
        type='outline'
        onPress={onGenerateTopic}
        loading={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: Colors.DARK,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'outfit',
    fontSize: 14,
    color: Colors.DARK,
    backgroundColor: Colors.LIGHT_GRAY,
  },
})
