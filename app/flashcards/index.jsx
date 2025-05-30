import { View, Text, Image, Pressable, StyleSheet, FlatList, Dimensions, Animated, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import FlipCard from 'react-native-flip-card';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function FlashCards() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const flashcard = course?.flashcards;
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const width = Dimensions.get('screen').width;
    const flatListRef = useRef(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // useEffect(() => {
    //     setIsFlipped(false);

    //     Animated.sequence([
    //         Animated.timing(scaleAnim, {
    //             toValue: 0.95,
    //             duration: 300,
    //             useNativeDriver: true,
    //         }),
    //         Animated.timing(scaleAnim, {
    //             toValue: 1,
    //             duration: 300,
    //             useNativeDriver: true,
    //         }),
    //     ]).start();
    // }, [currentPage]);

    const onscroll = (event) => {
        const index = Math.round(event?.nativeEvent?.contentOffset.x / width)
        setCurrentPage(index);
    };

    const GetProgress = (currentPage) => {
        const percentage = (currentPage + 1) / flashcard?.length;
        return percentage;
    }

    const renderProgressDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {flashcard?.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentPage ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative shapes */}
            <View style={styles.decorativeShape1} />
            <View style={styles.decorativeShape2} />

            <View style={styles.contentContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <Text style={styles.courseTitle}>{course?.name || 'Flashcards'}</Text>
                        <Text style={styles.progressText}>
                            {currentPage + 1} of {flashcard?.length}
                        </Text>
                    </View>

                    {/* <Pressable style={styles.menuButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </Pressable> */}
                </View>

                {/* Progress Bar with Animation */}
                <View style={styles.progressWrapper}>
                    <Progress.Bar
                        progress={GetProgress(currentPage)}
                        width={null}
                        color="#ffffff"
                        unfilledColor="rgba(255,255,255,0.3)"
                        borderWidth={0}
                        height={8}
                        borderRadius={4}
                        animated={true}
                        animationType="spring"
                    />
                    <Text style={styles.progressPercentage}>
                        {Math.round(GetProgress(currentPage) * 100)}%
                    </Text>
                </View>

                {/* Progress Dots */}
                {renderProgressDots()}

                {/* Flash Cards */}
                <Animated.View style={[styles.cardsContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <FlatList
                        ref={flatListRef}
                        data={flashcard}
                        horizontal={true}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onscroll}
                        decelerationRate="fast"
                        snapToInterval={width}
                        snapToAlignment="center"
                        renderItem={({ item, index }) => (
                            <View style={[styles.cardWrapper, { width }]}>
                                <FlipCard
                                    style={styles.flipCard}
                                    flipHorizontal={true}
                                    flipVertical={false}
                                    flip={isFlipped}
                                    clickable={true}
                                    // onFlipEnd={(isFlipped) => setIsFlipped(isFlipped)}
                                >
                                    {/* Front Side */}
                                    <View style={styles.frontCard}>
                                        <View style={styles.cardIcon}>
                                            <AntDesign name="codesquareo" size={24} color={Colors.PRIMARY} />
                                        </View>
                                        <Text style={styles.questionLabel}>Question</Text>
                                        <Text style={styles.frontText}>{item?.front}</Text>
                                    </View>

                                    {/* Back Side */}
                                    <View style={styles.backCard}>
                                        <View style={styles.cardIcon}>
                                            <Ionicons name="checkmark-circle" size={40} color="white" />
                                        </View>
                                        <Text style={styles.answerLabel}>Answer</Text>
                                        <Text style={styles.backText}>{item?.back}</Text>
                                    </View>
                                </FlipCard>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    decorativeShape1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorativeShape2: {
        position: 'absolute',
        bottom: 100,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    courseTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    progressText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressWrapper: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressPercentage: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: 'white',
        marginLeft: 15,
        minWidth: 50,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: 'white',
    },
    inactiveDot: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    flipCard: {
        width: Dimensions.get('screen').width - 60,
        height: 400,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
    },
    frontCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backCard: {
        flex: 1,
        backgroundColor: '#4A5568',
        borderRadius: 25,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        marginBottom: 20,
    },
    questionLabel: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: Colors.PRIMARY,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    answerLabel: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    frontText: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: '#2D3748',
        textAlign: 'center',
        lineHeight: 32,
    },
    backText: {
        fontFamily: 'outfit',
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        lineHeight: 30,
    },
    tapHint: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    hintText: {
        fontFamily: 'outfit',
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    hintTextBack: {
        fontFamily: 'outfit',
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 5,
    },
    navigationControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    navButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    cardCounter: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    counterText: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: 'white',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 120,
        justifyContent: 'center',
    },
    primaryActionButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    actionButtonText: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        color: 'white',
        marginLeft: 8,
    },
});