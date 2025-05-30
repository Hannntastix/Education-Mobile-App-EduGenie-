import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constant/Colors';

const PasswordValidationModal = ({ visible, onDismiss, message = "Incorrect email or password.", title = "Login Failed" }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.okButton} onPress={onDismiss}>
                        <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f44336',
        marginBottom: 10
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333'
    },
    okButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10
    },
    okText: {
        color: Colors.WHITE,
        fontWeight: 'bold'
    }
});

export default PasswordValidationModal;
