import { View, Text, Image, StyleSheet, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { imageAssets, PracticeOption } from '../../../constant/Option';
import Colors from '../../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { db } from "./../../../config/firebaseConfig"
import { collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { UserDetailContext } from '../../../context/UserDetailContext';
import CourseListGrid from '../../../components/PracticeScreen/CourseListGrid';

export default function PracticeTypeHomeScreen() {
    const { type } = useLocalSearchParams();
    const router = useRouter();
    const option = PracticeOption.find(item => item.name === type);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const [loading, setLoading] = useState(false);
    const [courseList, setCourseList] = useState([]);
    useEffect(() => {
        userDetail && GetCourseList();
    }, [userDetail])

    const GetCourseList = async () => {
        setLoading(true);
        setCourseList([]);
        try {
            const q = query(collection(db, "courses"),
                where('createdBy', '==', userDetail?.email),
                orderBy('createdOn', 'desc'));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(doc.data());
                setCourseList(prev => [...prev, doc.data()])
            })
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={option.image} style={{ height: 200, width: '100%' }} />

            <SafeAreaView style={styles.headerContainer}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.push('/(tabs)/home')}
                    android_ripple={{ color: 'rgba(255,255,255,0.2)', radius: 20 }}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={styles.headerTitle}>{type}</Text>
            </SafeAreaView>

            {loading && <ActivityIndicator style={{
                marginTop: 150,
            }} size={'large'} color={Colors.PRIMARY} />}

            <CourseListGrid courseList={courseList} option={option} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 15,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 28,
        color: Colors.WHITE,
        marginLeft: 10,
        flex: 1,
    },
});
