import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useThemeMode } from '../contexts/ThemeContext';

export const ScanningLoader = ({ stage = 'scanning', message }) => {
  const { theme } = useThemeMode();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getStageInfo = () => {
    if (message) {
      return {
        icon: '🔍',
        text: message,
        subtext: '',
      };
    }

    switch (stage) {
      case 'scanning':
        return {
          icon: '📷',
          text: 'Processing QR Code...',
          subtext: 'Please wait',
        };
      case 'analyzing':
        return {
          icon: '🔍',
          text: 'Analyzing URL...',
          subtext: 'Checking security',
        };
      case 'queued':
        return {
          icon: '⏳',
          text: 'Analysis Queued...',
          subtext: 'This may take a moment',
        };
      default:
        return {
          icon: '⚡',
          text: 'Processing...',
          subtext: '',
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.overlay }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Animated.Text style={[styles.icon, { transform: [{ scale: pulseAnim }] }]}>
          {stageInfo.icon}
        </Animated.Text>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.text, { color: theme.colors.text }]}>
          {stageInfo.text}
        </Text>
        {stageInfo.subtext && (
          <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
            {stageInfo.subtext}
          </Text>
        )}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    fontSize: 48,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ScanningLoader;
