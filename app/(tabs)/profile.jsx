import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { UserDetailContext } from '../../context/UserDetailContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import { useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { signOut } from 'firebase/auth';
import LogoutConfirmationModal from '../../components/ProfileConfirm/LogOutConfirmationModal';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {

  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRouter();

  useEffect(() => {
    if (userDetail?.email) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'courses'), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);

      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }

  };

  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        setModalVisible(false);
        route.push('/');
      })
      .catch((error) => {
        console.log("Logout error:", error);
      });
  };


  const [userData] = useState({
    name: 'Rehan',
    email: 'rehan121203@gmail.com',
    phone: '+1 (555) 123-4567',
    location: 'Jakarta, Indonesia',
    joinDate: 'Member since Mei 2025',
    bio: 'Passionate developer who loves creating beautiful mobile apps. Always learning and exploring new technologies.',
    profileImage: '',
    verified: true,
    stats: {
      projects: 24,
      followers: 1.2,
      following: 890,
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleMenuPress = (action) => {
    Alert.alert('Action', `You pressed: ${action}`);
  };

  const MenuCard = ({ icon, title, subtitle, onPress, color = '#667EEA' }) => (
    <TouchableOpacity
      style={[styles.menuCard, darkMode && styles.menuCardDark]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: color + '20' }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuTitle, darkMode && styles.textDark]}>{title}</Text>
        <Text style={[styles.menuSubtitle, darkMode && styles.subtitleDark]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={darkMode ? '#888' : '#999'} />
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, unit }) => (
    <View style={[styles.statCard, darkMode && styles.statCardDark]}>
      <Text style={[styles.statValue, darkMode && styles.textDark]}>
        {value}{unit}
      </Text>
      <Text style={[styles.statLabel, darkMode && styles.subtitleDark]}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* Header with gradient */}
      <LinearGradient
        colors={darkMode ? ['#2D3748', '#1A202C'] : ['#667EEA', '#764BA2']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => route.back()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
            <Feather name={darkMode ? 'sun' : 'moon'} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <View style={{
          backgroundColor: darkMode ? "#1c1c1e" : 'white',
          marginHorizontal: 20,
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          alignItems: 'center',
        }}>
          <View style={styles.profileImageContainer}>
            <Image source={require('./../../assets/images/Welcoming.png')} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={() => handleMenuPress('Change Photo')}
            >
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
            {userData.verified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={20} color="#4285F4" />
              </View>
            )}
          </View>

          <Text style={[styles.userName, darkMode && styles.textDark]}>Hi, {userDetail?.name}</Text>
          <Text style={[styles.joinDate, darkMode && styles.subtitleDark]}>{userDetail?.uid}</Text>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            <StatCard label="Courses Enrolled" value={courseList?.length} unit="" />
          </View>
        </View>

        {/* Quick Actions */}
        {/* <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: '#4285F4' }]}
              onPress={() => handleMenuPress('Edit Profile')}
            >
              <Feather name="edit-2" size={20} color="white" />
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: '#34A853' }]}
              onPress={() => handleMenuPress('Share Profile')}
            >
              <Feather name="share-2" size={20} color="white" />
              <Text style={styles.quickActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: '#FF6B6B' }]}
              onPress={() => handleMenuPress('QR Code')}
            >
              <AntDesign name="qrcode" size={20} color="white" />
              <Text style={styles.quickActionText}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Account Settings */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>Account Settings</Text>
          <MenuCard
            icon="plus"
            title="Add New Course"
            subtitle="Enroll New Courses"
            onPress={() => route.push('/addCourse')}
            color="#4285F4"
          />
          <MenuCard
            icon="book"
            title="My Courses"
            subtitle="Continue Your Learning Progress"
            onPress={() => route.push('/home')}
            color="#34A853"
          />
          <MenuCard
            icon="bar-chart"
            title="My Progress"
            subtitle="See and Evaluate Your Learning Progress"
            onPress={() => route.push('/progress')}
            color="#FF6B6B"
          />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={[styles.logoutButton, darkMode && styles.logoutButtonDark]}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <LogoutConfirmationModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onConfirm={onSignOut}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4285F4',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 20,
  },
  joinDate: {
    fontSize: 12,
    color: '#BDC3C7',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    padding: 15,
    margin: 5,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statCardDark: {
    backgroundColor: '#2C2C2C',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuCardDark: {
    backgroundColor: '#2C2C2C',
  },
  menuIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    marginBottom: 10,
  },
  logoutButtonDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtitleDark: {
    color: '#CCCCCC',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default ProfileScreen;