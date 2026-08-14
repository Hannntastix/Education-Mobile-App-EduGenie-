import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Alert,
  Dimensions
} from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import {
  GenerateCourseAIModel,
  GenerateTopicsAIModel
} from '../../config/AiModel';
import Prompt from '../../constant/Prompt';
import {
  collection,
  doc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setselectedTopics] = useState([]);

  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // GENERATE TOPICS

  const onGenerateTopic = async () => {
    if (!userInput.trim()) {
      Alert.alert(
        'Error',
        'Please enter what you want to learn'
      );
      return;
    }

    setLoading(true);

    try {
      const PROMPT = userInput + Prompt.IDEA;

      const startTime = performance.now();

      const aiResp =
        await GenerateTopicsAIModel.sendMessage(PROMPT);

      const rawText = aiResp.response.text();

      const endTime = performance.now();

      const responseTime = endTime - startTime;

      const topicIdea = JSON.parse(rawText);

      console.log("DATA LLM GEMINI PADA LOG UNTUK DIANALISIS:");
      console.log("Response Time:", (responseTime / 1000).toFixed(2), "seconds");
      console.log("Input Tokens:", aiResp.usage.inputTokens);
      console.log("Output Tokens:", aiResp.usage.outputTokens);
      console.log("Total Tokens:", aiResp.usage.totalTokens);
      console.log("=======================================");

      setTopics(topicIdea?.course_titles || []);
      setselectedTopics([]);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error(
        'ERROR GENERATING TOPICS:',
        error
      );

      Alert.alert(
        'Error',
        error?.message ||
        'Failed to generate topics. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // SELECT TOPIC

  const onTopicSelect = (topic) => {
    const isAlreadyExist =
      selectedTopics.find(
        (item) => item === topic
      );

    if (!isAlreadyExist) {
      setselectedTopics((prev) => [
        ...prev,
        topic
      ]);
    } else {
      const topics =
        selectedTopics.filter(
          (item) => item !== topic
        );

      setselectedTopics(topics);
    }
  };

  const isTopicSelected = (topic) => {
    const selection =
      selectedTopics.find(
        (item) => item === topic
      );

    return selection ? true : false;
  };

  // GENERATE COURSE

  const onGenerateCourse = async () => {
    if (selectedTopics.length === 0) {
      Alert.alert(
        'Error',
        'Please select at least one topic'
      );
      return;
    }

    setLoading(true);

    try {
      // Convert array menjadi string 
      const PROMPT = selectedTopics.join(', ') + Prompt.COURSE;

      // 1. REQUEST KE GEMINI

      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);

      const rawText = aiResp.response.text();

      // console.log(rawText);

      // 2. PARSE JSON

      const resp = JSON.parse(rawText);

      // 3. AMBIL ARRAY COURSES

      const courses = resp?.courses;

      if (!Array.isArray(courses)) {
        throw new Error(
          'Gemini response does not contain a valid courses array.'
        );
      }

      if (courses.length === 0) {
        throw new Error(
          'Gemini returned an empty courses array.'
        );
      }

      console.log(
        'Number of generated courses:',
        courses.length
      );

      // 4. SIMPAN SEMUA COURSE KE FIRESTORE

      const savePromises =
        courses.map(async (course, index) => {

          // Membuat reference dengan ID otomatis Firestore
          const courseRef =
            doc(collection(db, 'courses'));

          // Pastikan data course valid
          if (!course?.courseTitle) {
            throw new Error(
              `Course ${index + 1} does not have courseTitle.`
            );
          }

          // Simpan course
          await setDoc(
            courseRef,
            {
              ...course,

              createdOn: new Date(),

              createdBy:
                userDetail?.email || null,

              docId: courseRef.id
            }
          );

          console.log(
            `COURSE ${index + 1} SAVED SUCCESSFULLY`
          );

          return courseRef.id;
        });

      // Tunggu semua course selesai disimpan
      const savedCourses =
        await Promise.all(savePromises);

      console.log(
        'Saved Course IDs:',
        savedCourses
      );

      // 5. PINDAH KE HOME

      router.push('/(tabs)/home');

    } catch (error) {

      console.error(error);

      Alert.alert(
        'Error',
        error?.message ||
        'Failed to generate course. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f8f9ff', '#ffffff']}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim
                }
              ]
            }
          ]}
        >

          {/* Header */}

          <View style={styles.header}>

            <Pressable
              onPress={() => router.push('/')}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.PRIMARY}
              />
            </Pressable>

            <View style={styles.headerText}>

              <Text style={styles.title}>
                Create New Course
              </Text>

              <Text style={styles.subtitle}>
                What do you want to learn today?
              </Text>

            </View>

          </View>

          {/* Input Section */}

          <View style={styles.inputSection}>

            <View style={styles.labelContainer}>

              <Ionicons
                name="bulb-outline"
                size={20}
                color={Colors.PRIMARY}
              />

              <Text style={styles.label}>
                What course do you want to create?
              </Text>

            </View>

            <View style={styles.inputContainer}>

              <TextInput
                style={styles.textInput}
                placeholder="Ex. Learn Python, Digital Marketing, 10th Grade Science..."
                placeholderTextColor={Colors.GRAY}
                value={userInput}
                onChangeText={(value) =>
                  setUserInput(value)
                }
                multiline={true}
                numberOfLines={3}
              />

            </View>

            <Button
              text={
                loading
                  ? 'Generating Topics...'
                  : 'Generate Topics'
              }
              type="primary"
              onPress={onGenerateTopic}
              loading={loading}
              style={styles.generateButton}
            />

          </View>

          {/* Topics Section */}

          {topics.length > 0 && (

            <Animated.View
              style={[
                styles.topicsSection,
                {
                  opacity: fadeAnim
                }
              ]}
            >

              <View style={styles.labelContainer}>

                <Ionicons
                  name="list-outline"
                  size={20}
                  color={Colors.PRIMARY}
                />

                <Text style={styles.label}>
                  Select topics you want to include
                </Text>

              </View>

              <Text style={styles.helperText}>
                Choose the topics that interest you most.
                You can select multiple topics.
              </Text>

              <View style={styles.topicContainer}>

                {topics.map((item, index) => (

                  <Pressable
                    key={index}
                    onPress={() =>
                      onTopicSelect(item)
                    }
                    style={[
                      styles.topicChip,
                      isTopicSelected(item) &&
                      styles.topicChipSelected
                    ]}
                    android_ripple={{
                      color:
                        'rgba(103, 126, 234, 0.1)'
                    }}
                  >

                    <Text
                      style={[
                        styles.topicText,
                        isTopicSelected(item) &&
                        styles.topicTextSelected
                      ]}
                    >
                      {item}
                    </Text>

                    {isTopicSelected(item) && (

                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="white"
                        style={styles.checkIcon}
                      />

                    )}

                  </Pressable>

                ))}

              </View>

              {/* Selected Topics Summary */}

              {selectedTopics.length > 0 && (

                <View style={styles.summaryContainer}>

                  <Text style={styles.summaryText}>

                    {selectedTopics.length}{' '}
                    topic
                    {selectedTopics.length > 1
                      ? 's'
                      : ''}{' '}
                    selected

                  </Text>

                </View>

              )}

            </Animated.View>

          )}

          {/* Generate Course Button */}

          {selectedTopics.length > 0 && (

            <Animated.View
              style={[
                styles.finalButtonContainer,
                {
                  opacity: fadeAnim
                }
              ]}
            >

              <Button
                text={
                  loading
                    ? 'Creating Your Course...'
                    : 'Create Course'
                }
                onPress={onGenerateCourse}
                loading={loading}
                style={styles.finalButton}
                icon="rocket-outline"
              />

            </Animated.View>

          )}

        </Animated.View>

      </ScrollView>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(103, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: Colors.GRAY,
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    minHeight: 80,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.DARK,
    backgroundColor: '#f8f9ff',
    textAlignVertical: 'top',
  },
  generateButton: {
    borderRadius: 15,
    paddingVertical: 15,
  },
  topicsSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginBottom: 15,
    lineHeight: 20,
  },
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  topicChipSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  topicText: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit-medium',
    fontSize: 14,
    flex: 1,
  },
  topicTextSelected: {
    color: 'white',
  },
  checkIcon: {
    marginLeft: 6,
  },
  summaryContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
  },
  finalButtonContainer: {
    marginTop: 10,
  },
  finalButton: {
    borderRadius: 15,
    paddingVertical: 18,
    backgroundColor: '#4CAF50',
  },
});