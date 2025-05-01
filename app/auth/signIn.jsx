import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { getUserDetail, UserDetailContext } from '../../context/UserDetailContext'
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const {userDetail, setUserDetail} = useContext(UserDetailContext)
    const [loading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const handleSignIn = () => {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(async (resp) => {
            const user = resp.user
            console.log(user)
            await fetchAndSetUserDetail()
            setIsLoading(false)
            router.replace('/(tabs)/home')
        }).catch(e => {
            console.log(e)
            setIsLoading(false)
            // ToastAndroid.show('Incorrect Email and Password', ToastAndroid.BOTTOM)
        })
    };

    const fetchAndSetUserDetail = async () => {
        const result = await getDoc(doc(db, "users", email));
        console.log("Fetched user detail:", result.data());
        setUserDetail(result.data());
    }

    const navigateToSignUp = () => {
        navigation.navigate('auth/signUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.innerContainer}>
                    {/* App Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('./../../assets/images/Sign.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#9FA5AA"
                                value={email}
                                onChangeText={(value) => setEmail(value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#9FA5AA"
                                value={password}
                                onChangeText={(value) => setPassword(value)}
                                secureTextEntry={secureTextEntry}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            >
                                <Text>{secureTextEntry ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {!loading ? 
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    : <ActivityIndicator size="small" color="#FFF" />
                    }
                    </TouchableOpacity>

                    {/* Sign Up Navigation */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={navigateToSignUp}>
                            <Text style={styles.signUpLinkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        overflow:'scroll',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingBottom: 25
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 170,
        height: 170,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        height: 55,
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        color: '#333',
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#6200EE',
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#6200EE',
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#6200EE',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    signInButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        
    },
    signUpText: {
        fontSize: 14,
        color: '#666',
    },
    signUpLinkText: {
        fontSize: 14,
        color: '#6200EE',
        fontWeight: '600',
    },
});