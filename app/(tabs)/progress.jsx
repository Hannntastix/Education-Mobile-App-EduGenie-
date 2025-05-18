import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, StatusBar, Animated, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { UserDetailContext } from '../../context/UserDetailContext';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
import CourseProgressBar from '../../components/Shared/CourseProgressBar';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Progress() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userDetail?.email) {
      GetCourseList();
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
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'courses'), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);

      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        docId: doc.id, // Add docId for navigation
        ...doc.data(),
        progress: doc.data().progress || Math.floor(Math.random() * 100), // Mock progress if not available
      }));

      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (item) => {
    try {
      router.push({
        pathname: `/courseView/${item?.docId}`,
        params: {
          courseParams: JSON.stringify(item)
        }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      router.push('/courseView');
    }
  };

  // Header Progress
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Animated.View
            style={[
              styles.headerTextContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.greetingText}>
              Hello, {userDetail?.displayName || 'Student'}! 👋
            </Text>
            <Text style={styles.headerTitle}>Here is Your Learning Progress 📈</Text>
          </Animated.View>
        </View>

        {/* Wave decoration */}
        {/* <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View> */}
      </LinearGradient>
    </View>
  );

  // Container Card Course
  const renderCourseCard = ({ item, index }) => {
    const completed = item?.completedChapter?.length || 0;
    const total = item?.chapters?.length || 0;
    const percentage = total > 0 ? completed / total : 0;
    const percentageText = `${Math.round(percentage * 100)}`;
    const isCompleted = Math.round(percentage * 100) === 100;


    return (
      <Animated.View
        style={[
          styles.courseCardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50 * (index + 1), 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.courseCard}
          onPress={() => handleCoursePress(item)}
        >
          <LinearGradient
            colors={isCompleted ? ['#4CAF50', '#45a049'] : ['#ffffff', '#f8f9fa']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.courseInfo}>
                <Text style={[
                  styles.courseTitle,
                  { color: isCompleted ? '#fff' : Colors.PRIMARY }
                ]}>
                  {item.courseTitle || item.name || 'Untitled Course'}
                </Text>
                <Text style={[
                  styles.courseCategory,
                  { color: isCompleted ? 'rgba(255,255,255,0.9)' : '#666' }
                ]}>
                  {item.category || 'General'}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                {isCompleted ? (
                  <View style={styles.completedBadge}>
                    {/* <Ionicons name="checkmark-circle" size={24} color="#fff" /> */}
                    <Text style={styles.progressText}>{percentageText}%</Text>
                  </View>
                ) : (
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>{percentageText}%</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.progressSection}>
              <CourseProgressBar
                item={item}
                width="100%"
                height={8}
                backgroundColor={isCompleted ? 'rgba(255,255,255,0.3)' : '#e0e0e0'}
                progressColor={isCompleted ? '#fff' : Colors.PRIMARY}
              />

              <View style={styles.progressDetails}>
                <Text style={[
                  styles.progressDetailText,
                  { color: isCompleted ? 'rgba(255,255,255,0.9)' : '#888' }
                ]}>
                  {isCompleted ? 'Completed!' : `${percentageText}% Complete`}
                </Text>
                {/* <TouchableOpacity
                  style={[
                    styles.continueButton,
                    { backgroundColor: isCompleted ? 'rgba(255,255,255,0.2)' : Colors.PRIMARY }
                  ]}
                  
                >
                  {isCompleted ? (
                      <Text style={styles.continueButtonText}>
                        Done!
                      </Text>
                  ) : (
                    <>
                      <Text style={styles.continueButtonText}>
                        Continue
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={isCompleted ? '#fff' : '#fff'}
                      />
                    </>
                  )}
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Decorative elements */}
            <View style={[
              styles.decorativeCircle,
              { backgroundColor: isCompleted ? 'rgba(255,255,255,0.1)' : 'rgba(102,126,234,0.1)' }
            ]} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="school-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Courses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start your learning journey by creating your first course!
      </Text>
      <TouchableOpacity style={styles.createCourseButton}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.createCourseButtonText}>Create Course</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
      </View>

      {renderHeader()}

      <View style={styles.contentContainer}>
        {courseList.length > 0 ? (
          <FlatList
            data={courseList}
            renderItem={renderCourseCard}
            keyExtractor={(item, index) => item.id || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={GetCourseList}
                colors={[Colors.PRIMARY]}
                tintColor={Colors.PRIMARY}
              />
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : !loading ? (
          renderEmptyState()
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  patternCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(118, 75, 162, 0.1)',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTextContainer: {
    marginBottom: 30,
  },
  greetingText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 32,
    color: '#fff',
    lineHeight: 38,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  overallProgressContainer: {
    marginTop: 10,
  },
  overallProgressLabel: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  overallProgressText: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  waveContainer: {
    height: 20,
    overflow: 'hidden',
  },
  wave: {
    height: 40,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  separator: {
    height: 15,
  },
  courseCardContainer: {
    marginVertical: 5,
  },
  courseCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  courseInfo: {
    flex: 1,
    marginRight: 15,
  },
  courseTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 5,
    lineHeight: 24,
  },
  courseCategory: {
    fontFamily: 'outfit',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    alignItems: 'center',
  },
  completedBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
    color: '#fff',
  },
  progressSection: {
    marginTop: 10,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  progressDetailText: {
    fontFamily: 'outfit',
    fontSize: 14,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
    color: '#fff',
    marginRight: 5,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  createCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createCourseButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});