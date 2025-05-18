import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native';
import { imageAssets } from '../../constant/Option';

export default function CourseProgressBar({ item, width = 280 }) {
    const completed = item?.completedChapter?.length || 0;
    const total = item?.chapters?.length || 0;
    const percentage = total > 0 ? completed / total : 0;
    const percentageText = `${Math.round(percentage * 100)}%`;


    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={{
                margin: 5,
                padding: 16,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                width: width,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
            }}
        >
            <View style={styles.cardHeader}>
                <Image
                    source={imageAssets[item?.banner_image]}
                    style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                    <Text
                        numberOfLines={2}
                        style={styles.courseTitle}
                    >
                        {item?.courseTitle}
                    </Text>
                    <Text style={styles.chapterCount}>
                        {item?.chapters?.length} Chapters
                    </Text>
                </View>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    {item?.completedChapter?.length > 0 ? <Text style={styles.progressText}>
                        {item?.completedChapter?.length} of {item?.chapters?.length} chapters completed
                    </Text> : <Text style={styles.progressText}>
                        0 of {item?.chapters?.length} chapters completed
                    </Text>}
                    <Text style={styles.progressPercentage}>{percentageText}</Text>
                </View>
                <Progress.Bar
                    progress={percentage}
                    width={null}
                    color={Colors.PRIMARY}
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    height={8}
                    borderRadius={4}
                    style={styles.progressBar}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: "row",
        gap: 12,
    },
    courseImage: {
        width: 65,
        height: 65,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY + '20',
    },
    courseInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    courseTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: '#333',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    chapterCount: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: '#666',
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
})