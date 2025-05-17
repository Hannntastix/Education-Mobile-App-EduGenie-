import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '../../constant/Colors';
import Button from './../../components/Shared/Button'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function QuizSummary() {
    const { quizResultParam } = useLocalSearchParams();
    const quizResult = JSON.parse(quizResultParam);
    const [correctAns, setCorrectAns] = useState(0);
    const [totalQues, setTotalQues] = useState(0);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [showAllQuestions, setShowAllQuestions] = useState(false);

    const router = useRouter();

    useEffect(() => {
        quizResult && calculateResult();
    }, [quizResult]);

    const calculateResult = () => {
        if (quizResult !== undefined) {
            const correctAnswer = Object.entries(quizResult)
                ?.filter(([key, value]) => value?.isCorrect === true);

            const totalQuestion = Object.keys(quizResult).length;

            setCorrectAns(correctAnswer.length);
            setTotalQues(totalQuestion);
        }
    }

    const getPercentage = () => {
        return ((correctAns / totalQues) * 100).toFixed(0);
    };

    const getGrade = () => {
        const percentage = getPercentage();
        if (percentage >= 90) return { grade: 'A+', text: 'Excellent!' };
        if (percentage >= 80) return { grade: 'A', text: 'Great Job!' };
        if (percentage >= 70) return { grade: 'B', text: 'Good Work!' };
        if (percentage >= 60) return { grade: 'C', text: 'Not Bad!' };
        if (percentage >= 50) return { grade: 'D', text: 'Keep Trying!' };
        return { grade: 'F', text: 'Need More Practice!' };
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const renderQuestionItem = ({ item, index }) => {
        const [key, quizItem] = item;
        const isExpanded = expandedQuestion === index;

        return (
            <TouchableOpacity
                style={[
                    styles.questionCard,
                    { borderLeftColor: quizItem.isCorrect ? Colors.DARK_GREEN : Colors.RED }
                ]}
                onPress={() => toggleQuestion(index)}
                activeOpacity={0.8}
            >
                <View style={styles.questionHeader}>
                    <View style={styles.questionNumberContainer}>
                        <Text style={styles.questionNumber}>{index + 1}</Text>
                    </View>

                    <View style={styles.questionTitleContainer}>
                        <Text style={styles.questionTitle} numberOfLines={isExpanded ? undefined : 2}>
                            {quizItem.question}
                        </Text>
                    </View>

                    <View style={[
                        styles.resultIndicator,
                        { backgroundColor: quizItem.isCorrect ? Colors.DARK_GREEN : Colors.RED }
                    ]}>
                        <Ionicons
                            name={quizItem.isCorrect ? "checkmark" : "close"}
                            size={14}
                            color="white"
                        />
                    </View>
                </View>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.answerSection}>
                            <Text style={styles.answerLabel}>Your Answer:</Text>
                            <View style={[
                                styles.answerBox,
                                { backgroundColor: quizItem.isCorrect ? '#e6f7e9' : '#ffeaea' }
                            ]}>
                                <Text style={[
                                    styles.answerText,
                                    { color: quizItem.isCorrect ? Colors.DARK_GREEN : Colors.RED }
                                ]}>
                                    {quizItem.userChoice || 'No answer provided'}
                                </Text>
                            </View>
                        </View>

                        {!quizItem.isCorrect && quizItem.correctAnswer && (
                            <View style={styles.answerSection}>
                                <Text style={styles.answerLabel}>Correct Answer:</Text>
                                <View style={[styles.answerBox, { backgroundColor: '#e6f7e9' }]}>
                                    <Text style={[styles.answerText, { color: Colors.DARK_GREEN }]}>
                                        {quizItem.correctAnswer}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {quizItem.explanation && (
                            <View style={styles.explanationContainer}>
                                <Text style={styles.explanationTitle}>Explanation:</Text>
                                <Text style={styles.explanationText}>{quizItem.explanation}</Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.expandIconContainer}>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={Colors.GRAY}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    // Calculate performance metrics
    const percentage = getPercentage();
    const gradeInfo = getGrade();
    const incorrectAns = totalQues - correctAns;

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('./../../assets/images/wave.png')}
                style={styles.backgroundImage}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerTitle}>Quiz Summary</Text>

                    <View style={styles.resultCard}>
                        {/* Trophy and Score Section */}
                        <Image
                            source={require('./../../assets/images/Trophy.png')}
                            style={styles.trophyImage}
                        />

                        <View style={styles.scoreCircle}>
                            <Text style={styles.percentageText}>{percentage}%</Text>
                            <Text style={styles.gradeText}>{gradeInfo.grade}</Text>
                        </View>

                        <Text style={styles.congratsText}>
                            {percentage > 60
                                ? `Congratulations! 🎉`
                                : `Keep Going! 💪`}
                        </Text>

                        <Text style={styles.resultMessage}>{gradeInfo.text}</Text>

                        {/* Stats Section */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#EBF3FF' }]}>
                                    <MaterialCommunityIcons name="file-document-outline" size={22} color={Colors.PRIMARY} />
                                </View>
                                <Text style={styles.statValue}>{totalQues}</Text>
                                <Text style={styles.statLabel}>Questions</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#E6F7E9' }]}>
                                    <Ionicons name="checkmark-circle-outline" size={22} color={Colors.DARK_GREEN} />
                                </View>
                                <Text style={[styles.statValue, { color: Colors.DARK_GREEN }]}>{correctAns}</Text>
                                <Text style={styles.statLabel}>Correct</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#FFEAEA' }]}>
                                    <Ionicons name="close-circle-outline" size={22} color={Colors.RED} />
                                </View>
                                <Text style={[styles.statValue, { color: Colors.RED }]}>{incorrectAns}</Text>
                                <Text style={styles.statLabel}>Incorrect</Text>
                            </View>
                        </View>

                        {/* Accuracy Bar */}
                        <View style={styles.accuracyContainer}>
                            <Text style={styles.accuracyTitle}>Accuracy</Text>
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: `${percentage}%`, backgroundColor: getProgressColor(percentage) }
                                    ]}
                                />
                            </View>
                            <Text style={styles.accuracyText}>{percentage}% Correct Answers</Text>
                        </View>
                    </View>

                    {/* Question Summary Section */}
                    <View style={styles.summarySectionContainer}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryTitle}>Question Summary</Text>
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={() => setShowAllQuestions(!showAllQuestions)}
                            >
                                <Text style={styles.toggleButtonText}>
                                    {showAllQuestions ? 'Show Less' : 'Show All'}
                                </Text>
                                <Ionicons
                                    name={showAllQuestions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={Colors.PRIMARY}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Questions List */}
                        <FlatList
                            data={
                                showAllQuestions
                                    ? Object.entries(quizResult)
                                    : Object.entries(quizResult).slice(0, 3)
                            }
                            renderItem={renderQuestionItem}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false}
                            style={styles.questionsList}
                            contentContainerStyle={styles.questionsListContent}
                        />

                        {!showAllQuestions && Object.keys(quizResult).length > 3 && (
                            <TouchableOpacity
                                style={styles.showMoreButton}
                                onPress={() => setShowAllQuestions(true)}
                            >
                                <Text style={styles.showMoreButtonText}>
                                    Show {Object.keys(quizResult).length - 3} more questions
                                </Text>
                                <Ionicons name="chevron-down" size={16} color={Colors.PRIMARY} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Bottom Buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.PRIMARY,
                                padding: 12,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => router.replace('/(tabs)/home')}
                        >
                            <Ionicons name="arrow-back" size={18} color="white" />
                            <Text style={{
                                color: 'white',
                                fontSize: 16,
                                marginLeft: 6,
                                fontFamily: 'outfit-medium'
                            }}>
                                Back to Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => router.replace('/practice/Quiz')}
                        >
                            <Ionicons name="arrow-back" size={18} color="white" />
                            <Text style={styles.shareButtonText}>Back to Quiz Collection</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// Helper function to get progress bar color based on percentage
const getProgressColor = (percentage) => {
    if (percentage >= 80) return Colors.DARK_GREEN;
    if (percentage >= 60) return '#FFB900'; // Orange-Yellow
    return Colors.RED;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FA',
    },
    backgroundImage: {
        width: '100%',
        height: 300,
        position: 'absolute',
        top: 0,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    headerTitle: {
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        fontSize: 28,
        color: Colors.WHITE,
        marginTop: 10,
        marginBottom: 20,
    },
    resultCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        marginTop: 40,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        alignItems: 'center',
    },
    trophyImage: {
        width: width * 0.5,
        height: width * 0.5,
        resizeMode: 'contain',
        marginTop: -width * 0.25,
        marginBottom: -20,
    },
    scoreCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 3,
        borderColor: '#E6F3FF',
    },
    percentageText: {
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        fontSize: 28,
    },
    gradeText: {
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        fontSize: 16,
    },
    congratsText: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        color: Colors.PRIMARY,
        marginTop: 10,
    },
    resultMessage: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    statItem: {
        alignItems: 'center',
        width: '30%',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    statValue: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: Colors.BLACK,
    },
    statLabel: {
        fontFamily: 'outfit',
        fontSize: 12,
        color: Colors.GRAY,
    },
    accuracyContainer: {
        width: '100%',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    accuracyTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.BLACK,
        marginBottom: 8,
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    accuracyText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
        marginTop: 8,
        textAlign: 'right',
    },
    summarySectionContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        color: Colors.BLACK,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButtonText: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.PRIMARY,
        marginRight: 4,
    },
    filterTabs: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    filterTab: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#F0F0F0',
    },
    filterTabText: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.GRAY,
    },
    activeFilterTab: {
        backgroundColor: Colors.PRIMARY,
    },
    activeFilterTabText: {
        color: Colors.WHITE,
    },
    questionsList: {
        width: '100%',
    },
    questionsListContent: {
        paddingBottom: 10,
    },
    questionCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 16,
        marginBottom: 12,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionNumberContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    questionNumber: {
        fontFamily: 'outfit-bold',
        fontSize: 14,
        color: Colors.BLACK,
    },
    questionTitleContainer: {
        flex: 1,
    },
    questionTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.BLACK,
        paddingRight: 24,
    },
    resultIndicator: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedContent: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    answerSection: {
        marginBottom: 12,
    },
    answerLabel: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 4,
    },
    answerBox: {
        padding: 12,
        borderRadius: 8,
    },
    answerText: {
        fontFamily: 'outfit',
        fontSize: 15,
    },
    explanationContainer: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    explanationTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.BLACK,
        marginBottom: 4,
    },
    explanationText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
        lineHeight: 20,
    },
    expandIconContainer: {
        position: 'absolute',
        right: 16,
        bottom: 5,
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 10,
    },
    showMoreButtonText: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.PRIMARY,
        marginRight: 4,
    },
    buttonsContainer: {
        marginTop: 10,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.GREEN,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 12,
    },
    shareButtonText: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.WHITE,
        marginLeft: 8,
    },
});