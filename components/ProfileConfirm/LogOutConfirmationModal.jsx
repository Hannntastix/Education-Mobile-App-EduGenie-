import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constant/Colors';

const LogoutConfirmationModal = ({ visible, onCancel, onConfirm }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Alert!</Text>
                    <Text style={styles.message}>Are you sure you want to log out?</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f44336',
        borderRadius: 10
    },
    cancelText: {
        color: Colors.WHITE,
    },
    confirmText: {
        color: '#fff'
    }
});

export default LogoutConfirmationModal;
