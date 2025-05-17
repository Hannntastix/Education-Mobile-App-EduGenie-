import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import Colors from '../../constant/Colors'
import Button from './../Shared/Button'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';

export default function Intro({ course }) {
    const router = useRouter();

    return (
        <View style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image with gradient overlay and back button */}
            <View style={styles.bannerContainer}>
                <Image
                    source={imageAssets[course?.banner_image]}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />

                {/* Gradient overlay for better text visibility */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.4)']}
                    style={styles.gradient}
                />

                {/* Back button with better touch target */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.push('/(tabs)/home')}
                    android_ripple={{ color: 'rgba(255,255,255,0.2)', radius: 20 }}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </View>
                </Pressable>
            </View>

            {/* Content section with improved spacing and hierarchy */}
            <View style={styles.contentContainer}>
                {/* Course title with proper typography */}
                <Text style={styles.courseTitle}>{course?.courseTitle}</Text>

                {/* Chapters badge with animation-ready styling */}
                <View style={styles.badgeRow}>
                    <View style={styles.chapterBadge}>
                        <Ionicons name="book-outline" size={16} color={Colors.PRIMARY} style={styles.badgeIcon} />
                        <Text style={styles.chapterText}>
                            {course?.chapters?.length} Chapters
                        </Text>
                    </View>

                    {/* Additional info badge - you can add more if needed */}
                    <View style={styles.timeBadge}>
                        <Ionicons name="time-outline" size={16} color={Colors.PRIMARY} style={styles.badgeIcon} />
                        <Text style={styles.chapterText}>
                            {course?.duration || '45 Minutes'}
                        </Text>
                    </View>
                </View>

                {/* Description section with proper styling */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{course?.description}</Text>
                </View>

                {/* Instructor info - optional addition */}
                {course?.instructor && (
                    <View style={styles.instructorContainer}>
                        <View style={styles.instructorImageContainer}>
                            <Image
                                source={course?.instructor?.image || require('./../../assets/images/banner1.png')}
                                style={styles.instructorImage}
                            />
                        </View>
                        <View style={styles.instructorInfo}>
                            <Text style={styles.instructorName}>{course?.instructor?.name || 'Expert Instructor'}</Text>
                            <Text style={styles.instructorRole}>{course?.instructor?.role || 'Course Creator'}</Text>
                        </View>
                    </View>
                )}

                {/* What you'll learn section - optional addition */}
                <View style={styles.learnContainer}>
                    <Text style={styles.learnTitle}>What you'll learn</Text>
                    {(course?.learningPoints || ['Master the fundamentals', 'Build practical skills', 'Complete real projects']).map((point, index) => (
                        <View key={index} style={styles.learnItem}>
                            <Ionicons name="checkmark-circle" size={18} color={Colors.PRIMARY} />
                            <Text style={styles.learnText}>{point}</Text>
                        </View>
                    ))}
                </View>

                {/* Start button with enhanced styling */}
                {/* <Button
                    text={'Start Learning Now'}
                    onPress={() => console.log('Starting course')}
                    icon="play-circle"
                    style={styles.startButton}
                /> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bannerContainer: {
        height: 280,
        position: 'relative',
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.SECONDARY,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 280,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 24,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    courseTitle: {
        fontFamily: "outfit-bold",
        fontSize: 26,
        color: '#333',
        marginBottom: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        marginVertical: 12,
    },
    chapterBadge: {
        backgroundColor: Colors.PRIMARY + '15',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBadge: {
        backgroundColor: Colors.PRIMARY + '15',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeIcon: {
        marginRight: 4,
    },
    chapterText: {
        fontFamily: "outfit-medium",
        fontSize: 14,
        color: Colors.PRIMARY,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom: 16,
    },
    descriptionTitle: {
        fontFamily: "outfit-semibold",
        fontSize: 18,
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontFamily: "outfit-regular",
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    instructorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
    },
    instructorImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 12,
    },
    instructorImage: {
        width: '100%',
        height: '100%',
    },
    instructorInfo: {
        flex: 1,
    },
    instructorName: {
        fontFamily: "outfit-semibold",
        fontSize: 16,
        color: '#333',
    },
    instructorRole: {
        fontFamily: "outfit-regular",
        fontSize: 14,
        color: '#666',
    },
    learnContainer: {
        marginBottom: 24,
    },
    learnTitle: {
        fontFamily: "outfit-semibold",
        fontSize: 18,
        color: '#333',
        marginBottom: 12,
    },
    learnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    learnText: {
        fontFamily: "outfit-regular",
        fontSize: 15,
        color: '#444',
        marginLeft: 10,
        flex: 1,
    },
    startButton: {
        marginTop: 8,
        marginBottom: 16,
    }
});