import { View, Text, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import Colors from './../../constant/Colors'
import NoCourse from '../../components/Home/NoCourse'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
import { UserDetailContext } from '../../context/UserDetailContext'
import CourseList from '../../components/Home/CourseList'

export default function Home() {

    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    const [courseList, setCourseList] = useState([]);

    const GetCourseList = async () => {
        const q = query(collection(db, 'courses'), where("createdBy", '==', userDetail?.email));
        const querySnapshot = await getDocs(q);

        useEffect(() => {
            userDetail && GetCourseList();
        }, [userDetail]);

        querySnapshot.forEach((doc) => {
            console.log('--', doc.data);
            setCourseList(prev => [...prev, doc.data()])
        })
    }

    return (
        <View style={{
            paddingHorizontal: 25,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            flex: 1,
            backgroundColor: Colors.WHITE,
        }}>
            <Header />
            <View style={{
                justifyContent: "center",
                flex: 1,
            }}>
                {courseList?.length == 0 ?
                    <NoCourse /> :
                    <CourseList />
                }

            </View>
        </View>
    )
}