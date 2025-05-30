import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import PasswordValidationModal from '../../components/PasswordValidation/PasswordValidationModal';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Silakan masukkan alamat email Anda');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Format email tidak valid');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Cek apakah email ada di Firestore
            const userDocRef = doc(db, "users", email); // asumsikan email jadi ID dokumen
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                setIsLoading(false);
                setModalVisible(true);
                return;
            }

            // 2. Jika ada, kirim email reset password
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Email tidak terdaftar dalam sistem kami';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format email tidak valid';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Terlalu banyak percobaan. Coba lagi nanti';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.back();
    };

    if (emailSent) {
        return (
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.container}
            >
                <View style={styles.successContainer}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="mail-outline" size={80} color="#4CAF50" />
                    </View>

                    <Text style={styles.successTitle}>Email Has Been Sent!</Text>
                    <Text style={styles.successMessage}>
                        We've sent the reset password link to your email.
                        Please check your inbox or spam folder
                    </Text>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.backButtonText}>Back to Login Page</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#fff', '#fff']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        {/* <TouchableOpacity
                            style={styles.backIconButton}
                            onPress={handleBackToLogin}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="blue" />
                        </TouchableOpacity> */}
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="lock-closed-outline" size={80} color="#3B82F6" />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Don't Worry! Input Your Email and we will send
                            the reset password link to you.
                        </Text>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Input Your Email Here"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.resetButton, isLoading && styles.disabledButton]}
                                onPress={handleResetPassword}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={styles.resetButtonText}>Send</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Additional Info */}
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>
                                Remember Your Password?{' '}
                                <Text style={styles.loginLink} onPress={handleBackToLogin}>
                                    Back to Login Page
                                </Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <PasswordValidationModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                message={'Email does not exist'}
                title={'Reset Password Failed'}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    backIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.LIGHT_GRAY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 350,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    resetButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    infoContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    loginLink: {
        color: '#2563EB',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    successIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    successTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 20,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    backButton: {
        backgroundColor: '#2563EB',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
