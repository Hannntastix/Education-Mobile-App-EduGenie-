import { View, Text, FlatList, Pressable, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuestionAnswer() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const qaList = course?.qa;
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [searchVisible, setSearchVisible] = useState(false);
    const [completedQuestions, setCompletedQuestions] = useState(new Set());
    const router = useRouter();

    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onQuestionSelected = (index) => {
        if (selectedQuestion === index) {
            setSelectedQuestion(null);
        } else {
            setSelectedQuestion(index);
            setCompletedQuestions(prev => new Set([...prev, index]));
        }
    };

    const getProgressPercentage = () => {
        return (completedQuestions.size / qaList?.length) * 100;
    };

    const renderQuestionCard = ({ item, index }) => {
        const isSelected = selectedQuestion === index;
        const isCompleted = completedQuestions.has(index);

        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <Pressable
                    onPress={() => onQuestionSelected(index)}
                    style={[
                        styles.card,
                        isSelected && styles.cardSelected,
                        isCompleted && styles.cardCompleted,
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.questionNumber}>
                            <Text style={styles.questionNumberText}>Q{index + 1}</Text>
                        </View>

                        <View style={styles.questionContent}>
                            <Text style={[
                                styles.questionText,
                                isSelected && styles.questionTextSelected
                            ]}>
                                {item?.question}
                            </Text>
                        </View>

                        <View style={styles.cardActions}>
                            {isCompleted && (
                                <View style={styles.completedBadge}>
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                </View>
                            )}
                            <Ionicons
                                name={isSelected ? "chevron-up" : "chevron-down"}
                                size={24}
                                color={isSelected ? Colors.PRIMARY : "#666"}
                            />
                        </View>
                    </View>

                    {isSelected && (
                        <Animated.View
                            style={styles.answerContainer}
                            entering={{
                                opacity: { from: 0, to: 1, duration: 300 },
                                translateY: { from: -20, to: 0, duration: 300 }
                            }}
                        >
                            <View style={styles.answerDivider} />
                            <View style={styles.answerContent}>
                                <View style={styles.answerIcon}>
                                    <Ionicons name="bulb" size={24} color={Colors.SECONDARY} />
                                </View>
                                <Text style={styles.answerLabel}>Answer</Text>
                                <Text style={styles.answerText}>{item?.answer}</Text>
                            </View>
                        </Animated.View>
                    )}
                </Pressable>
            </Animated.View>
        );
    };

    const renderHeader = () => (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    opacity: headerAnim,
                    transform: [{ scale: headerAnim }],
                }
            ]}
        >
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>

                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Q&A Session</Text>
                        <Text style={styles.headerSubtitle}>{course?.courseTitle}</Text>

                        {/* Progress Indicator */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[
                                    styles.progressFill,
                                    { width: `${getProgressPercentage()}%` }
                                ]} />
                            </View>
                            <Text style={styles.progressText}>
                                {completedQuestions.size}/{qaList?.length} completed
                            </Text>
                        </View>
                    </View>

                    {/* <Pressable style={styles.menuButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </Pressable> */}
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="help-circle" size={24} color={Colors.SECONDARY} />
                        <Text style={styles.statNumber}>{qaList?.length}</Text>
                        <Text style={styles.statLabel}>Questions</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-done" size={24} color={Colors.GREEN} />
                        <Text style={styles.statNumber}>{completedQuestions.size}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="time" size={24} color={Colors.RED} />
                        <Text style={styles.statNumber}>{qaList?.length - completedQuestions.size}</Text>
                        <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Questions Available</Text>
            <Text style={styles.emptySubtitle}>Check back later for updates!</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Pattern */}
            <View style={styles.backgroundPattern}>
                {/* <View style={styles.patternCircle1} /> */}
                <View style={styles.patternCircle2} />
                <View style={styles.patternCircle3} />
            </View>

            {renderHeader()}

            <View style={styles.contentContainer}>
                {qaList && qaList.length > 0 ? (
                    <FlatList
                        data={qaList}
                        renderItem={renderQuestionCard}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                ) : (
                    renderEmptyState()
                )}
            </View>

            {/* Floating Action Button */}
            {/* <Pressable style={styles.fab}>
                <Ionicons name="bookmark" size={24} color="white" />
            </Pressable> */}
        </View>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    backgroundPattern: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    patternCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
    },
    patternCircle2: {
        position: 'absolute',
        top: height * 0.4,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
    },
    patternCircle3: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
    },
    headerContainer: {
        marginBottom: 20,
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: "outfit-bold",
        fontSize: 28,
        color: 'white',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontFamily: "outfit",
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 5,
    },
    progressContainer: {
        marginTop: 15,
        alignItems: 'center',
        width: '100%',
    },
    progressBar: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    progressText: {
        fontFamily: "outfit",
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
    },
    // menuButton: {
    //     width: 44,
    //     height: 44,
    //     borderRadius: 22,
    //     backgroundColor: 'rgba(255,255,255,0.2)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 80,
    },
    statNumber: {
        fontFamily: "outfit-bold",
        fontSize: 20,
        color: 'white',
        marginTop: 5,
    },
    statLabel: {
        fontFamily: "outfit",
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 100,
    },
    separator: {
        height: 10,
    },
    cardContainer: {
        marginVertical: 5,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        borderLeftWidth: 4,
        borderLeftColor: '#e0e0e0',
    },
    cardSelected: {
        borderLeftColor: Colors.PRIMARY,
        elevation: 6,
        shadowOpacity: 0.15,
    },
    cardCompleted: {
        borderLeftColor: '#4CAF50',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    questionNumberText: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: Colors.PRIMARY,
    },
    questionContent: {
        flex: 1,
    },
    questionText: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: '#2c3e50',
        lineHeight: 24,
    },
    questionTextSelected: {
        color: Colors.PRIMARY,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedBadge: {
        marginRight: 10,
    },
    answerContainer: {
        marginTop: 15,
    },
    answerDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    answerContent: {
        paddingLeft: 55,
    },
    answerIcon: {
        marginBottom: 10,
    },
    answerLabel: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: '#FFA726',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    answerText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#34495e',
        lineHeight: 24,
        textAlign: 'justify',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: '#aaa',
        marginTop: 20,
    },
    emptySubtitle: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#ccc',
        marginTop: 10,
    },
    // fab: {
    //     position: 'absolute',
    //     bottom: 30,
    //     right: 30,
    //     width: 56,
    //     height: 56,
    //     borderRadius: 28,
    //     backgroundColor: Colors.PRIMARY,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     elevation: 6,
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 3,
    //     },
    //     shadowOpacity: 0.27,
    //     shadowRadius: 4.65,
    // },
});