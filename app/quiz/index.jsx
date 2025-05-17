import { View, Text, Pressable, StyleSheet, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Quiz() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [result, setResult] = useState([]);

    const quiz = course?.quiz;

    const router = useRouter();

    const GetProgress = (currentQuestion) => {
        const percentage = (currentQuestion / quiz?.length);
        return percentage;
    }

    const OnOptionSelect = (selectedChoice) => {
        setResult(prev => ({
            ...prev,
            [currentQuestion]: {
                userChoice: selectedChoice,
                isCorrect: quiz[currentQuestion]?.correctAns == selectedChoice,
                question: quiz[currentQuestion]?.question,
                correctAns: quiz[currentQuestion]?.correctAns
            }
        }));
        console.log(result);
    }

    const handleNext = () => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(null);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/wave.png')} style={styles.waveBackground} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerText}>Quiz</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressWrapper}>
                <Progress.Bar
                    progress={GetProgress(currentQuestion)}
                    width={null}
                    color={Colors.PRIMARY}
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    height={10}
                    borderRadius={6}
                />
                <Text style={styles.progressText}>{quiz[currentQuestion]?.question}</Text>
            </View>

            {/* Question Field */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{quiz[currentQuestion]?.question}</Text>

                {quiz[currentQuestion]?.options.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setSelectedOption(index);
                            OnOptionSelect(item)
                        }}
                        style={[
                            styles.optionButton,
                            selectedOption === index && styles.selectedOption,
                        ]}
                    >
                        <Text style={styles.optionText}>{item}</Text>
                        {selectedOption === index && (
                            <Ionicons name="checkmark-circle" size={20} color={Colors.PRIMARY} />
                        )}
                    </Pressable>
                ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
                <Pressable
                    onPress={handlePrev}
                    style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
                    disabled={currentQuestion === 0}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </Pressable>

                {(selectedOption?.toString() && quiz?.length - 1 > currentQuestion) && <Pressable
                    onPress={handleNext}
                    style={[
                        styles.navButton,
                        currentQuestion === quiz?.question?.length - 1 && styles.disabledButton,
                    ]}
                    disabled={currentQuestion === quiz?.question?.length - 1}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                </Pressable>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    waveBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 500,
        resizeMode: 'cover',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerText: {
        fontFamily: 'outfit-bold',
        fontSize: 22,
        color: Colors.WHITE,
    },
    progressWrapper: {
        marginVertical: 20,
    },
    progressText: {
        marginTop: 8,
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.DARK,
    },
    questionContainer: {
        marginVertical: 10,
    },
    questionText: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F4F4F4',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: Colors.PRIMARY + '20',
        borderColor: Colors.PRIMARY,
        borderWidth: 1,
    },
    optionText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#444',
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    navButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    navButtonText: {
        fontFamily: 'outfit-medium',
        fontSize: 15,
        color: '#fff',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});
