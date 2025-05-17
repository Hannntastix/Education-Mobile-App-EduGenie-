import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function Chapters({ course }) {
    const router = useRouter();

    const isChapterCompleted = (index) => {
        const isCompleted = (course?.completedChapter || []).find(item => item == index);
        return isCompleted ? true : false;
    }

    return (
        <View style={{
            padding: 20,

        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
            }}>Chapters</Text>

            <FlatList
                data={course?.chapters}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/chapterView',
                                params: {
                                    chapterParams: JSON.stringify(item),
                                    docId: course?.docId,
                                    chapterIndex: index
                                }
                            })
                        }}
                        style={{
                            padding: 15,
                            borderWidth: 0.5,
                            borderRadius: 15,
                            marginTop: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                        }}>
                            <Text>{index + 1}</Text>
                            <Text>{item?.chapterName}</Text>
                        </View>
                        {isChapterCompleted(index) ?
                            <Entypo name="check" size={24} color={Colors.GREEN} />
                            : <Entypo name="controller-play" size={24} color={Colors.PRIMARY} />
                        }
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}