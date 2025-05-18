import { View, Text } from 'react-native'
import React from 'react'
import { query, collection, where } from 'firebase/firestore'
import { db } from './../../config/firebaseConfig'

export default function CourseListByCategory({ category }) {
    const GetCourseListByCategory = () => {
        const q = query(collection(db, 'courses'),
            where('category'))
    }
    return (
        <View>
            <Text>CourseListByCategory</Text>
        </View>
    )
}