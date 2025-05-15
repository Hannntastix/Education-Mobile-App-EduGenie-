import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { PracticeOption } from '../../constant/Option';
import Colors from '../../constant/Colors';

export default function PracticeSection() {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Practice Yourself Here ✨</Text>

            <FlatList
                data={PracticeOption}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.itemContainer}
                        activeOpacity={0.8}
                    >
                        <View style={styles.imageWrapper}>
                            <Image
                                source={item?.image}
                                style={styles.itemImage}
                            />
                            <View style={styles.overlay} />
                            <Text style={styles.itemName}>{item.name}</Text>
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
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontFamily: "outfit-bold",
        fontSize: 24,
        marginBottom: 15,
        marginLeft: 5,
        color: Colors.BLACK || '#000',
    },
    listContainer: {
        paddingBottom: 10,
    },
    itemContainer: {
        flex: 1,
        margin: 6,
        aspectRatio: 1,
        maxHeight: 160,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    itemImage: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(248, 248, 248, 0.25)',
        borderRadius: 16,
    },
    itemName: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
        fontFamily: "outfit-medium",
        fontSize: 14,
        color: Colors.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    }
});