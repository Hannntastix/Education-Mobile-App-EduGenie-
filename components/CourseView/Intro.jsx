import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import Colors from '../../constant/Colors'

export default function Intro({ course }) {
    return (
        <View>
            <Image source={imageAssets[course?.banner_image]}
                style={{
                    width: "100%",
                    height: 280,
                    backgroundColor: Colors.SECONDARY,
                }}
            />

            <View style={{
                padding: 20,
            }}>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 25,
                }}>{course?.courseTitle}</Text>
                <View>
                    <View style={styles.chapterBadge}>
                        <Text style={styles.chapterText}>
                            {course?.chapters?.length} Chapters
                        </Text>
                    </View>
                </View>
                <Text>Description: </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chapterBadge: {
        backgroundColor: Colors.PRIMARY + '15',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 6,
        marginBottom: 6,
    },
    chapterText: {
        fontFamily: "outfit-medium",
        fontSize: 14,
        color: Colors.PRIMARY,
        fontWeight: '500',
    }
});