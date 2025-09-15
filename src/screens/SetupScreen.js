import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import VirusTotalService from '../services/VirusTotalService';

const SetupScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { actions } = useApp();

  const handleGetApiKey = () => {
    Linking.openURL('https://www.virustotal.com/gui/join-us');
  };

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your VirusTotal API key');
      return;
    }

    setIsValidating(true);
    
    try {
      const vtService = new VirusTotalService();
      const isValid = await vtService.validateApiKey(apiKey.trim());
      
      if (isValid) {
        await actions.setApiKey(apiKey.trim());
        Alert.alert(
          'Success!',
          'API key validated successfully. You can now start scanning QR codes.',
          [{ text: 'OK', onPress: () => navigation.replace('Scanner') }]
        );
      } else {
        Alert.alert(
          'Invalid API Key',
          'The API key you entered is not valid. Please check and try again.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Validation Failed',
        'Failed to validate API key. Please check your internet connection and try again.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to SecureQR</Text>
          <Text style={styles.subtitle}>
            Protect yourself from malicious QR codes
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>🛡️ How it works:</Text>
            <Text style={styles.infoText}>
              • Scan QR codes safely{'\n'}
              • Check URLs with VirusTotal{'\n'}
              • Get security warnings{'\n'}
              • Browse with confidence
            </Text>
          </View>

          <View style={styles.setupSection}>
            <Text style={styles.setupTitle}>Setup Required</Text>
            <Text style={styles.setupText}>
              To get started, you need a free VirusTotal API key:
            </Text>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleGetApiKey}
            >
              <Text style={styles.linkButtonText}>
                📝 Get Free API Key
              </Text>
            </TouchableOpacity>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Enter your API Key:</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste your VirusTotal API key here"
                value={apiKey}
                onChangeText={setApiKey}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                (!apiKey.trim() || isValidating) && styles.continueButtonDisabled
              ]}
              onPress={validateAndSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>
                  Validate & Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.privacySection}>
            <Text style={styles.privacyTitle}>🔒 Privacy Notice</Text>
            <Text style={styles.privacyText}>
              Your API key is stored securely on your device only. 
              URLs are sent to VirusTotal for analysis as per their privacy policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  setupSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  setupText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  linkButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 50,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacySection: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  privacyText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default SetupScreen;