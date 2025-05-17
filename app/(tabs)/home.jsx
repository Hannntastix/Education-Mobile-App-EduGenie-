import { View, Text, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import Colors from './../../constant/Colors'
import NoCourse from '../../components/Home/NoCourse'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
import { UserDetailContext } from '../../context/UserDetailContext'
import CourseList from '../../components/Home/CourseList'
import PracticeSection from '../../components/Home/PracticeSection'
import CourseProgress from '../../components/Home/CourseProgress'
import { FlatList } from 'react-native'

export default function Home() {

    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    const [courseList, setCourseList] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (userDetail?.email) {
            GetCourseList();
        }
    }, [userDetail]);



    console.log("CourseList props:", courseList);


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
            setLoading(false); // <- ini lebih aman di finally
        }

    };

    return (
        <FlatList
            data={[]}
            onRefresh={() => GetCourseList()}
            refreshing={loading}
            ListHeaderComponent={
                <View style={{
                    paddingHorizontal: 25,
                    paddingTop: Platform.OS === 'ios' ? 50 : 30,
                    flex: 1,
                    backgroundColor: Colors.WHITE,
                }}>
                    <Header />
                    {courseList?.length == 0 ?
                        <NoCourse /> :
                        <View>
                            <CourseProgress courseList={courseList} />
                            <PracticeSection />
                            <CourseList courseList={courseList} />
                        </View>
                    }
                    {/* <CourseList /> */}
                </View>
            } />
    )
}