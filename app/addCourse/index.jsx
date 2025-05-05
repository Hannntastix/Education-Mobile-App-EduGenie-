import { View, Text, TextInput, StyleSheet, Platform, Pressable, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { GenerateCourseAIModel, GenerateTopicsAIModel } from '../../config/AiModel'
import Prompt from '../../constant/Prompt'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebaseConfig'
import { UserDetailContext } from '../../context/UserDetailContext'
import { useRouter } from 'expo-router'

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setselectedTopics] = useState([]);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const router = useRouter();

  const onGenerateTopic = async () => {
    setLoading(true)
    const PROMPT = userInput + Prompt.IDEA;
    const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT)
    const topicIdea = JSON.parse(aiResp.response.text());
    console.log(topicIdea);
    setTopics(topicIdea?.course_titles);
    setLoading(false);
  }

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopics.find((item) => item == topic)
    if (!isAlreadyExist) {
      setselectedTopics(prev => [...prev, topic])
    }
    else {
      const topics = selectedTopics.filter(item => item !== topic);
      setselectedTopics(topics);
    }
  }

  const isTopicSelected = (topic) => {
    const selection = selectedTopics.find(item => item == topic);
    return selection ? true : false
  }

  const onGenerateCourse = async () => {
    setLoading(true);

    const PROMPT = selectedTopics + Prompt.COURSE;
    try {
      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
      const resp = JSON.parse(aiResp.response.text());
      const courses = resp.courses;

      courses?.forEach(async (course) => {
        await setDoc(doc(db, 'courses', Date.now().toString()), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email,
        })
      })
      router.push('/(tabs)/home');
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
    }


  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What do you want to learn today?</Text>

      <Text style={styles.label}>What course you want to create?</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Ex. Learn Python, Digital Marketing, 10th Grade Science...'
        placeholderTextColor={Colors.GRAY}
        onChangeText={(value) => setUserInput(value)}
      />

      <Button
        text={'Generate Topic'}
        type='outline'
        onPress={onGenerateTopic}
        loading={loading}
      />

      {topics.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Select All Topics which you want to add</Text>

          <View style={styles.topicContainer}>
            {topics.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => onTopicSelect(item)}
                style={[
                  styles.topicChip,
                  isTopicSelected(item) && styles.topicChipSelected
                ]}
              >
                <Text style={[
                  styles.topicText,
                  isTopicSelected(item) && styles.topicTextSelected
                ]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {selectedTopics?.length > 0 && <Button text="Generate Course"
        onPress={() => onGenerateCourse()}
        loading={loading}
      />}
    </ScrollView>
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
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    marginBottom: 8,
    backgroundColor: Colors.WHITE,
  },

  topicChipSelected: {
    backgroundColor: Colors.PRIMARY,
  },

  topicText: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit',
    fontSize: 14,
  },

  topicTextSelected: {
    color: Colors.WHITE,
  },
})
