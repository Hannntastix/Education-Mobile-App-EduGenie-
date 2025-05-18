import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { imageAssets } from '../../constant/Option';
import Colors from '../../constant/Colors';
import * as Progress from 'react-native-progress';
import CourseProgressBar from '../Shared/CourseProgressBar';

export default function CourseProgress({ courseList }) {

    const GetCompletedChapters = (course) => {
        const completed = course?.completedChapter?.length || 0;
        const total = course?.chapters?.length || 0;
        const percentage = total > 0 ? completed / total : 0;
        const percentageText = `${Math.round(percentage * 100)}%`;
        return { percentage, percentageText };
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Course Progress 📈</Text>

            <FlatList
                data={courseList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    const { percentage, percentageText } = GetCompletedChapters(item);
                    return (
                        <CourseProgressBar item={item} />
                    )
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: "outfit-bold",
        fontSize: 24,
        marginBottom: 15,
        marginLeft: 5,
        color: Colors.BLACK || '#000',
    },
    listContainer: {
        paddingRight: 15,
        paddingLeft: 5,
        paddingBottom: 5,
    },
    progressContainer: {
        marginTop: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontFamily: 'outfit',
        fontSize: 13,
        color: '#555',
    },
    progressPercentage: {
        fontFamily: 'outfit-medium',
        fontSize: 13,
        color: Colors.PRIMARY,
    },
    progressBar: {
        marginTop: 2,
    },
});