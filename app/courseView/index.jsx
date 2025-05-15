import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'react-native';
import { imageAssets } from '../../constant/Option';
import Intro from '../../components/CourseView/Intro';

export default function CourseView() {

    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);

    return (
        <View>
            <Intro course={course} />
        </View>
    )
}