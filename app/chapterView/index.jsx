import { View, Text, Dimensions, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChapterView() {
    const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const [currentPage, setCurrentPage] = useState(0);
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const GetProgress = (currentPage) => {
        const percentage = (currentPage / (chapters?.content?.length - 1));
        return percentage;
    }

    const onChapterCompleted = async () => {
        setLoader(true);
        try {
            await updateDoc(doc(db, 'courses', docId), {
                completedChapter: arrayUnion(chapterIndex)
            });
            setLoader(false);
            router.replace('/courseView/' + docId);
        } catch (error) {
            console.error("Error updating document: ", error);
            setLoader(false);
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else {
            router.push('/(tabs)/home');
        }
    };

    const goToNextPage = () => {
        if (currentPage < chapters?.content?.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const isLastPage = currentPage === chapters?.content?.length - 1;
    const currentContent = chapters?.content[currentPage];

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />

            {/* Header with Back Button and Progress */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <Progress.Bar
                        progress={GetProgress(currentPage)}
                        width={Dimensions.get('screen').width * 0.7}
                        color={Colors.PRIMARY}
                        unfilledColor="#E0E0E0"
                        borderWidth={0}
                        height={8}
                        borderRadius={4}
                    />
                    <Text style={styles.progressText}>
                        {currentPage + 1}/{chapters?.content?.length}
                    </Text>
                </View>
            </View>

            {/* Chapter Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.chapterTitle}>
                    {chapters?.chapterName || "Chapter"}
                </Text>
                <Text style={styles.chapterSubtitle}>
                    {currentContent?.topic}
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Explanation Text */}
                {currentContent?.explain && (
                    <View style={styles.explanationContainer}>
                        <Text style={styles.explanationText}>
                            {currentContent.explain}
                        </Text>
                    </View>
                )}

                {/* Code Example */}
                {currentContent?.code && (
                    <View style={styles.codeContainer}>
                        <LinearGradient
                            colors={['#2d2d2d', '#1e1e1e']}
                            style={styles.codeBackground}
                        >
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <Text style={styles.codeText}>
                                    {currentContent.code}
                                </Text>
                            </ScrollView>
                        </LinearGradient>
                    </View>
                )}

                {/* Example */}
                {currentContent?.example && (
                    <View style={styles.exampleContainer}>
                        <Text style={styles.exampleTitle}>Example</Text>
                        <View style={styles.exampleBox}>
                            <Text style={styles.exampleText}>
                                {currentContent.example}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Spacer for bottom buttons */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
                <View style={styles.navigationContent}>
                    {/* Previous Button */}
                    <TouchableOpacity
                        style={[styles.navButton, styles.prevButton]}
                        onPress={goToPreviousPage}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
                        <Text style={styles.prevButtonText}>
                            {currentPage === 0 ? "Back" : "Previous"}
                        </Text>
                    </TouchableOpacity>

                    {/* Page Indicator Dots */}
                    <View style={styles.paginationDots}>
                        {chapters?.content?.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    currentPage === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>

                    {/* Next/Finish Button */}
                    {isLastPage ? (
                        // <Button
                        //     text="Complete"
                        //     onPress={onChapterCompleted}
                        //     loading={loader}
                        //     style={styles.finishButton}
                        //     iconRight="checkmark-circle"
                        // />
                        <TouchableOpacity
                            style={[styles.navButton, styles.nextButton]}
                            onPress={onChapterCompleted}
                            loading={loader}
                            iconRight="checkmark-circle"
                            activeOpacity={0.7}
                        >
                            <Text style={styles.nextButtonText}>Complete</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navButton, styles.nextButton]}
                            onPress={goToNextPage}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons name="chevron-forward" size={24} color={Colors.WHITE} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    progressContainer: {
        flex: 1,
        marginLeft: 15,
        alignItems: 'center',
    },
    progressText: {
        marginTop: 4,
        fontSize: 12,
        color: '#777',
        fontFamily: 'outfit-medium',
    },
    titleContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    chapterTitle: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontFamily: 'outfit-medium',
        marginBottom: 8,
    },
    chapterSubtitle: {
        fontSize: 24,
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    explanationContainer: {
        marginBottom: 24,
    },
    explanationText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
        fontFamily: 'outfit-regular',
    },
    codeContainer: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    codeBackground: {
        padding: 16,
    },
    codeText: {
        fontFamily: 'Courier',
        fontSize: 14,
        color: '#f8f8f8',
        lineHeight: 20,
    },
    exampleContainer: {
        marginBottom: 24,
    },
    exampleTitle: {
        fontSize: 18,
        color: Colors.BLACK,
        fontFamily: 'outfit-semibold',
        marginBottom: 12,
    },
    exampleBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.PRIMARY,
    },
    exampleText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#444',
        fontFamily: 'outfit-regular',
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.WHITE,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    navigationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    prevButton: {
        backgroundColor: 'transparent',
    },
    prevButtonText: {
        color: Colors.PRIMARY,
        marginLeft: 4,
        fontFamily: 'outfit-medium',
    },
    nextButton: {
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 16,
    },
    nextButtonText: {
        color: Colors.WHITE,
        marginRight: 4,
        fontFamily: 'outfit-medium',
    },
    finishButton: {
        height: 44,
        width: '30%'
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 2,
    },
    activeDot: {
        backgroundColor: Colors.PRIMARY,
        width: 16,
    },
});