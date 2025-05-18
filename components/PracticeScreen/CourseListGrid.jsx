import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constant/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Quiz from '../../app/quiz';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function CourseListGrid({ courseList, option }) {
    const router = useRouter();
    const [expandedItem, setExpandedItem] = useState(null);

    const onPress = (course) => {
        router.push({
            pathname: option.path,
            params: {
                courseParams: JSON.stringify(course)
            }
        });
    };

    const toggleExpand = (courseId) => {
        setExpandedItem(expandedItem === courseId ? null : courseId);
    };

    const getStatusIcon = (course) => {
        const isCompleted = course.quizResult && Object.keys(course.quizResult).length > 0;

        return (
            <View style={[
                styles.statusBadge,
                { backgroundColor: isCompleted ? Colors.DARK_GREEN : '#f0f0f0' }
            ]}>
                <Ionicons
                    name={isCompleted ? "checkmark-circle" : "time-outline"}
                    size={16}
                    color={isCompleted ? "#fff" : "#888"}
                />
                <Text style={{
                    fontSize: 12,
                    color: isCompleted ? "#fff" : "#888",
                    marginLeft: 4,
                    fontFamily: 'outfit-medium'
                }}>
                    {isCompleted ? "Completed" : "Pending"}
                </Text>
            </View>
        );
    };


    const getFormattedDate = (timestamp) => {
        if (!timestamp) return "No date";

        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    const getDescription = (course) => {
        return course.description || `This is a ${option?.name.toLowerCase()} about ${course.courseTitle}. Tap to start learning!`;
    };

    const getQuestionCount = (course) => {
        return course.questions?.length || 0;
    };

    const getDifficulty = (course) => {
        const difficulty = course.difficulty || "Beginner";

        const difficultyColors = {
            "Beginner": "#4CAF50",
            "Intermediate": "#FF9800",
            "Advanced": "#F44336"
        };

        return (
            <View style={[styles.tag, { backgroundColor: difficultyColors[difficulty] || "#4CAF50" }]}>
                <Text style={styles.tagText}>{difficulty}</Text>
            </View>
        );
    };

    const renderNoCoursesMessage = () => {
        if (courseList && courseList.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('./../../assets/images/Task.png')}
                        style={styles.emptyImage}
                        defaultSource={option?.icon}
                    />
                    <Text style={styles.emptyTitle}>No {option?.name} Found</Text>
                    <Text style={styles.emptySubtitle}>
                        You haven't created any {option?.name.toLowerCase()} yet.
                        Start creating your first {option?.name.toLowerCase()}!
                    </Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>My {option?.name} Collection</Text>
            <Text style={styles.sectionSubtitle}>
                {courseList?.length || 0} {option?.name}{courseList?.length !== 1 ? '' : ''} available
            </Text>

            {renderNoCoursesMessage()}

            <FlatList
                data={courseList}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isExpanded = expandedItem === item.id;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                isExpanded && styles.expandedCard
                            ]}
                            activeOpacity={0.9}
                            onPress={() => onPress(item)}
                            onLongPress={() => toggleExpand(item.id)}
                        >
                            <View style={styles.cardHeader}>
                                <Image source={option?.icon} style={styles.image} />
                                {getStatusIcon(item)}
                            </View>

                            <Text style={styles.title} numberOfLines={2}>{item.courseTitle}</Text>

                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="help-circle-outline" size={16} color={Colors.PRIMARY} />
                                    <Text style={styles.infoText}>{item?.question?.length} Questions</Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Ionicons name="calendar-outline" size={16} color={Colors.PRIMARY} />
                                    <Text style={styles.infoText}>{getFormattedDate(item.createdOn)}</Text>
                                </View>
                            </View>

                            {isExpanded && (
                                <View style={styles.expandedContent}>
                                    <Text style={styles.descriptionTitle}>Description</Text>
                                    <Text style={styles.description}>{getDescription(item)}</Text>

                                    <View style={styles.tagsRow}>
                                        {getDifficulty(item)}
                                        <View style={[styles.tag, { backgroundColor: Colors.PRIMARY }]}>
                                            <Text style={styles.tagText}>{option?.name}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.startButton}
                                        onPress={() => onPress(item)}
                                    >
                                        <Text style={styles.startButtonText}>Start {option?.name}</Text>
                                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.expandButton}
                                onPress={() => toggleExpand(item.id)}
                            >
                                <MaterialIcons
                                    name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    sectionTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 22,
        color: Colors.BLACK,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontFamily: 'outfit-regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        position: 'relative',
        borderColor: '#eee',
        borderWidth: 1,
    },
    expandedCard: {
        height: 'auto',
        borderColor: Colors.PRIMARY,
        borderWidth: 1,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    title: {
        fontFamily: 'outfit-semibold',
        fontSize: 16,
        color: Colors.BLACK,
        marginBottom: 8,
        height: 40,
    },
    infoRow: {
        flexDirection: 'column',
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        fontFamily: 'outfit-regular',
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    descriptionTitle: {
        fontFamily: 'outfit-semibold',
        fontSize: 14,
        color: Colors.BLACK,
        marginBottom: 4,
    },
    description: {
        fontFamily: 'outfit-regular',
        fontSize: 12,
        color: '#555',
        marginBottom: 12,
        lineHeight: 18,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontFamily: 'outfit-medium',
        fontSize: 12,
        color: '#fff',
    },
    startButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonText: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: '#fff',
        marginRight: 4,
    },
    expandButton: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#f8f8f8',
        marginVertical: 16,
    },
    emptyImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 16,
        opacity: 0.8,
    },
    emptyTitle: {
        fontFamily: 'outfit-semibold',
        fontSize: 18,
        color: Colors.BLACK,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: 'outfit-regular',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    }
});