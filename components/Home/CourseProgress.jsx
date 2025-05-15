import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { imageAssets } from '../../constant/Option';
import Colors from '../../constant/Colors';
import * as Progress from 'react-native-progress';

export default function CourseProgress({ courseList }) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Course Progress 📈</Text>

            <FlatList
                data={courseList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.courseCard}
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
                                <Text style={styles.progressText}>3 of 5 chapters completed</Text>
                                <Text style={styles.progressPercentage}>60%</Text>
                            </View>
                            <Progress.Bar
                                progress={0.6}
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
                )}
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
    courseCard: {
        margin: 5,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: 280,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
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
});