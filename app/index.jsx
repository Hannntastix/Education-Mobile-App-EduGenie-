import { Image, Text, View, TouchableOpacity } from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from './../config/firebaseConfig'
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function WelcomeScreen() {

  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(user);
      const result = await getDoc(doc(db, 'users', user?.email));
      setUserDetail(result.data())
      router.replace('/(tabs)/home')
    }
  })

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 20,
      }}
    >
      {/* Gambar Welcoming */}
      <Image
        source={require("./../assets/images/Welcoming.png")}
        style={{
          width: "100%",
          height: 300,
          resizeMode: "contain",
          marginBottom: 20,
        }}
      />

      {/* Judul */}
      <Text
        style={{
          fontSize: 25,
          color: Colors.PRIMARY,
          textAlign: "center",
          fontFamily: "outfit-bold"
        }}
      >
        Welcome to EduGenie!
      </Text>

      {/* Deskripsi */}
      <Text
        style={{
          fontSize: 16,
          color: Colors.GRAY,
          textAlign: "center",
          marginTop: 10,
          fontFamily: "outfit-regular"
        }}
      >
        Discover the best education experience with EduGenie. Start your education journey effortlessly with AI now!!
      </Text>

      {/* Tombol Get Started */}
      <TouchableOpacity
        style={{
          backgroundColor: Colors.PRIMARY,
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 25,
          marginTop: 30,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
        }}
        onPress={() => router.push('/auth/signUp')}
      >
        <Text style={{ color: Colors.WHITE, fontSize: 18, fontFamily: "outfit-medium" }}>
          Get Started
        </Text>
      </TouchableOpacity>

      {/* Tombol Already Have an Account? */}
      <TouchableOpacity
        style={{
          marginTop: 15,
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 25,
          borderWidth: 2,
          borderColor: Colors.PRIMARY,
          backgroundColor: Colors.WHITE,
        }}
        onPress={() => router.push('/auth/signIn')}
      >
        <Text style={{ color: Colors.PRIMARY, fontSize: 18, fontFamily: "outfit-medium" }}>
          Already have an account?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
