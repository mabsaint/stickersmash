// App.js
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function App() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Loading state for API call
  const [isLoading, setIsLoading] = useState(false);
  
  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
      isValid = false;
    }
    
    // Phone validation (optional, but validate format if provided)
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      tempErrors.phone = 'Enter a valid 10-digit phone number';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(tempErrors);
    return isValid;
  };

  // Submit form data
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Replace with your actual API endpoint
        const API_URL = 'https://your-microservice-api-endpoint.com/submit';
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any auth headers if needed
            // 'Authorization': 'Bearer YOUR_TOKEN',
          },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Success handling
          setIsSubmitted(true);
          
          // Reset form after 3 seconds
          setTimeout(() => {
            setFormData({
              name: '',
              email: '',
              phone: '',
              message: ''
            });
            setIsSubmitted(false);
          }, 3000);
        } else {
          // Error handling for non-200 responses
          Alert.alert(
            'Submission Failed', 
            result.message || 'There was an error submitting your form. Please try again.'
          );
        }
      } catch (error) {
        // Network or other errors
        Alert.alert(
          'Connection Error',
          'Could not connect to the server. Please check your internet connection and try again.'
        );
        console.error('Form submission error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Display a success message when form is submitted
  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>Your form has been submitted successfully.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          
          <Text style={styles.title}>Contact Form</Text>
          <Text style={styles.subtitle}>Please fill out the form below</Text>
          
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
          
          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.textArea, errors.message && styles.inputError]}
              placeholder="Enter your message"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.message}
              onChangeText={(text) => handleChange('message', text)}
            />
            {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Submit Form</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});