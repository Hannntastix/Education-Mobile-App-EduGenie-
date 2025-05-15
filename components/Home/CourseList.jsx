import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { imageAssets } from '../../constant/Option';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function CourseList({ courseList }) {

  const route = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Courses 📖</Text>
      <FlatList
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => route.push({
            pathname: '/courseView',
            params: {
              courseParams: JSON.stringify(item)
            }
          })} style={styles.courseContainer}>
            <Image
              source={imageAssets[item.banner_image]}
              style={styles.courseImage}
            />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle} numberOfLines={2} ellipsizeMode="tail">
                {item.courseTitle}
              </Text>
              <View style={styles.chapterBadge}>
                <Text style={styles.chapterText}>
                  {item?.chapters?.length} Chapters
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    marginBottom: 15,
    marginLeft: 5,
    color: Colors.BLACK || '#000',
  },
  listContainer: {
    paddingRight: 15,
    paddingLeft: 5,
  },
  courseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 240,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  chapterBadge: {
    backgroundColor: Colors.PRIMARY + '15',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  chapterText: {
    fontFamily: "outfit-regular",
    fontSize: 12,
    color: Colors.PRIMARY,
    fontWeight: '500',
  }
});