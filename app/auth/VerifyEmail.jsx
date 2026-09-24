import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';

import {
    sendEmailVerification,
    reload
} from 'firebase/auth';

import { auth } from '../../config/firebaseConfig';

export default function VerifyEmail({ route, navigation }) {

    const [loading, setLoading] = useState(false);

    const checkVerification = async () => {
        try {
            setLoading(true);

            await reload(auth.currentUser);

            if (auth.currentUser.emailVerified) {
                navigation.replace('home');
            } else {
                Alert.alert(
                    'Email Not Verified',
                    'Please verify your email first.'
                );
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const resendVerificationEmail = async () => {
        try {
            await sendEmailVerification(auth.currentUser);

            Alert.alert(
                'Verification Email Sent',
                'Please check your inbox.'
            );

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.iconCircle}>
                <Text style={styles.iconText}>✉️</Text>
            </View>

            <Text style={styles.title}>
                Verify Your Email
            </Text>

            <Text style={styles.description}>
                We have sent a verification link to your email.
                Please check your inbox and verify your email address.
            </Text>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={checkVerification}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        I Have Verified My Email
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={resendVerificationEmail}
                style={styles.resendButton}
            >
                <Text style={styles.resendText}>
                    Resend Verification Email
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#EAF1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#2F6FED',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2F6FED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#A7C0F2',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        marginTop: 20,
        paddingVertical: 8,
    },
    resendText: {
        color: '#2F6FED',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});