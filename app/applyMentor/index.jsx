import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Alert,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ApplyMentorScreen() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        expertise: '',
        experience: '',
        education: '',
        bio: '',
        linkedIn: '',
        portfolio: '',
        availability: 'part-time',
    });

    const [selectedExpertise, setSelectedExpertise] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    const expertiseOptions = [
        'Programming', 'Design', 'Marketing', 'Business',
        'Data Science', 'Mobile Development', 'Web Development',
        'AI/ML', 'Cybersecurity', 'Digital Marketing'
    ];

    const isFormValid = () => {
        return (
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            selectedExpertise.length > 0 &&
            formData.experience.trim() !== '' &&
            formData.education.trim() !== '' &&
            formData.bio.trim() !== '' &&
            formData.availability.trim() !== ''
        );
    };


    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleExpertise = (expertise) => {
        setSelectedExpertise(prev =>
            prev.includes(expertise)
                ? prev.filter(item => item !== expertise)
                : [...prev, expertise]
        );
    };

    const handleSubmit = () => {
        Alert.alert(
            'Application Submitted!',
            'Thank you for applying as a mentor. Our team will contact you within 2-3 working days.',
            [{ text: 'OK' }]
        );
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            {[1, 2, 3].map((step) => (
                <View key={step} style={styles.progressStep}>
                    <View style={[
                        styles.progressCircle,
                        currentStep >= step ? styles.activeCircle : styles.inactiveCircle
                    ]}>
                        <Text style={[
                            styles.progressText,
                            currentStep >= step ? styles.activeText : styles.inactiveText
                        ]}>
                            {step}
                        </Text>
                    </View>
                    {step < 3 && (
                        <View style={[
                            styles.progressLine,
                            currentStep > step ? styles.activeLine : styles.inactiveLine
                        ]} />
                    )}
                </View>
            ))}
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>ITERA Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>NIP *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your nip"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('nip', text)}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+62 812-3456-7890"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>LinkedIn Profile</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedIn}
                    onChangeText={(text) => handleInputChange('linkedIn', text)}
                />
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Expertise & Experience</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Areas of Expertise *</Text>
                <View style={styles.expertiseContainer}>
                    {expertiseOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.expertiseChip,
                                selectedExpertise.includes(option) && styles.selectedChip
                            ]}
                            onPress={() => toggleExpertise(option)}
                        >
                            <Text style={[
                                styles.chipText,
                                selectedExpertise.includes(option) && styles.selectedChipText
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Experience *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your work experience (minimum 2 years)"
                    value={formData.experience}
                    onChangeText={(text) => handleInputChange('experience', text)}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Education *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Bachelor of Computer Science - Institut Teknologi Sumatera (ITERA)"
                    value={formData.education}
                    onChangeText={(text) => handleInputChange('education', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Portfolio/Website</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://portfolio.com"
                    value={formData.portfolio}
                    onChangeText={(text) => handleInputChange('portfolio', text)}
                />
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Additional Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Short Bio *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell us about yourself, your motivation to become a mentor, and how you can contribute to ITERA students..."
                    value={formData.bio}
                    onChangeText={(text) => handleInputChange('bio', text)}
                    multiline
                    numberOfLines={5}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Availability *</Text>
                <View style={styles.availabilityContainer}>
                    {['part-time', 'full-time', 'weekend'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.availabilityOption,
                                formData.availability === option && styles.selectedAvailability
                            ]}
                            onPress={() => handleInputChange('availability', option)}
                        >
                            <Text style={[
                                styles.availabilityText,
                                formData.availability === option && styles.selectedAvailabilityText
                            ]}>
                                {option === 'part-time' ? 'Part Time' :
                                    option === 'full-time' ? 'Full Time' : 'Weekend Only'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.noteContainer}>
                <Ionicons name="information-circle" size={20} color="#2563EB" />
                <Text style={styles.noteText}>
                    After submitting your application, our team will review it and contact you within 2-3 working days.
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#2563EB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mentor Application</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Progress Bar */}
            {renderProgressBar()}

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Welcome Message */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>
                        Join as a Mentor at ITERA Edugenie! 🎓
                    </Text>
                    <Text style={styles.welcomeSubtitle}>
                        Share your knowledge and experience to help thousands of ITERA students reach their goals
                    </Text>
                </View>

                {/* Form Steps */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
                {currentStep > 1 && (
                    <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextBtn,
                        currentStep === 1 && styles.fullWidthBtn,
                        currentStep === 3 && !isFormValid() && styles.disabledBtn
                    ]}
                    onPress={currentStep === 3 ? handleSubmit : nextStep}
                    disabled={currentStep === 3 && !isFormValid()}
                >
                    <Text style={styles.nextBtnText}>
                        {currentStep === 3 ? 'Submit' : 'Next'}
                    </Text>
                    <Ionicons
                        name={currentStep === 3 ? "send" : "chevron-forward"}
                        size={18}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    placeholder: {
        width: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',
    },
    progressStep: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCircle: {
        backgroundColor: '#2563EB',
    },
    inactiveCircle: {
        backgroundColor: '#E2E8F0',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#64748B',
    },
    progressLine: {
        width: 40,
        height: 2,
        marginHorizontal: 8,
    },
    activeLine: {
        backgroundColor: '#2563EB',
    },
    inactiveLine: {
        backgroundColor: '#E2E8F0',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    welcomeContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
    stepContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    expertiseContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    expertiseChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
    },
    selectedChip: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    chipText: {
        fontSize: 14,
        color: '#374151',
    },
    selectedChipText: {
        color: 'white',
    },
    availabilityContainer: {
        gap: 12,
    },
    availabilityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
    },
    selectedAvailability: {
        backgroundColor: '#EBF4FF',
        borderColor: '#2563EB',
    },
    availabilityText: {
        fontSize: 16,
        color: '#374151',
    },
    selectedAvailabilityText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EBF4FF',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        gap: 10,
    },
    noteText: {
        flex: 1,
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        gap: 12,
    },
    backBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2563EB',
        alignItems: 'center',
    },
    backBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },
    nextBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        gap: 8,
    },
    disabledBtn: {
        backgroundColor: '#A5B4FC',
    },
    fullWidthBtn: {
        flex: 2,
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
