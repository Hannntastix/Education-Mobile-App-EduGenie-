import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CourseListGrid({ courseList, option }) {
    const router = useRouter();

    const onPress = (course) => {
        if (option?.name=='Quiz') {
            router.push({
                pathname: '/quiz',
                params: {
                    courseParams: JSON.stringify(course)
                }
            })
        }

    }
    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <FlatList
                data={courseList}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8} style={styles.card}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color="#ccc"
                            style={styles.statusIcon}
                        />
                        <Image source={option?.icon} style={styles.image} />
                        <Text style={styles.title}>{item.courseTitle}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        position: 'relative',
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 12,
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        textAlign: 'center',
        color: Colors.BLACK,
    },
    statusIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
