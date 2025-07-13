import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

interface CaptureStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export default function CaptureScreen() {
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [captureSteps, setCaptureSteps] = useState<CaptureStep[]>([
    {
      id: '1',
      title: 'Overall Product',
      description: 'Capture the entire product',
      icon: 'camera',
      completed: false,
    },
    {
      id: '2',
      title: 'Product Details',
      description: 'Focus on key details and features',
      icon: 'scan',
      completed: false,
    },
    {
      id: '3',
      title: 'Issue Area',
      description: 'Show the specific problem area',
      icon: 'warning',
      completed: false,
    },
  ]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCapture = () => {
    if (isCapturing) return;

    setIsCapturing(true);
    
    // Simulate camera capture
    setTimeout(() => {
      const updatedSteps = [...captureSteps];
      updatedSteps[currentStep].completed = true;
      setCaptureSteps(updatedSteps);
      
      if (currentStep < captureSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // All steps completed, proceed to analysis
        router.push({
          pathname: '/result',
          params: {
            ...params,
            captureComplete: 'true',
          },
        });
      }
      
      setIsCapturing(false);
    }, 2000);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Step',
      'Are you sure you want to skip this step? It may affect the analysis accuracy.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            if (currentStep < captureSteps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              router.push({
                pathname: '/result',
                params: {
                  ...params,
                  captureComplete: 'partial',
                },
              });
            }
          },
        },
      ]
    );
  };

  const fadeInUp = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const currentStepData = captureSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Capture Product</Text>
        <Pressable style={styles.helpButton}>
          <Ionicons name="help-circle" size={24} color={COLORS.text} />
        </Pressable>
      </Animated.View>

      {/* Progress Indicator */}
      <Animated.View
        style={[
          styles.progressContainer,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 4</Text>
      </Animated.View>

      {/* Camera Preview */}
      <Animated.View
        style={[
          styles.cameraContainer,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        <View style={styles.cameraPreview}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
            style={styles.cameraOverlay}
          >
            <View style={styles.viewfinder}>
              <View style={styles.viewfinderCorner} />
              <View style={[styles.viewfinderCorner, styles.topRight]} />
              <View style={[styles.viewfinderCorner, styles.bottomLeft]} />
              <View style={[styles.viewfinderCorner, styles.bottomRight]} />
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Step Instructions */}
      <Animated.View
        style={[
          styles.instructionsContainer,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        <View style={styles.stepHeader}>
          <View style={styles.stepIcon}>
            <Ionicons
              name={currentStepData.icon as any}
              size={24}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>
          </View>
          <Text style={styles.stepCounter}>
            {currentStep + 1}/{captureSteps.length}
          </Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for best results:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark" size={16} color={COLORS.success} />
            <Text style={styles.tipText}>Ensure good lighting</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark" size={16} color={COLORS.success} />
            <Text style={styles.tipText}>Keep device steady</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark" size={16} color={COLORS.success} />
            <Text style={styles.tipText}>Fill the frame completely</Text>
          </View>
        </View>
      </Animated.View>

      {/* Steps Progress */}
      <Animated.View
        style={[
          styles.stepsProgress,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        {captureSteps.map((step, index) => (
          <View key={step.id} style={styles.stepIndicator}>
            <View
              style={[
                styles.stepDot,
                index === currentStep && styles.stepDotActive,
                step.completed && styles.stepDotCompleted,
              ]}
            >
              {step.completed ? (
                <Ionicons name="checkmark" size={12} color={COLORS.text} />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              index === currentStep && styles.stepLabelActive,
              step.completed && styles.stepLabelCompleted,
            ]}>
              {step.title}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actionButtons,
          {
            opacity: animatedValue,
            transform: [{ translateY: fadeInUp }],
          },
        ]}
      >
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </Pressable>

        <Pressable
          style={[styles.captureButton, isCapturing && styles.captureButtonActive]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          <LinearGradient
            colors={
              isCapturing
                ? [COLORS.warning, COLORS.warning]
                : [COLORS.primary, '#0099CC']
            }
            style={styles.captureGradient}
          >
            {isCapturing ? (
              <View style={styles.captureLoading}>
                <Ionicons name="camera" size={24} color={COLORS.text} />
                <Text style={styles.captureButtonText}>Capturing...</Text>
              </View>
            ) : (
              <View style={styles.captureContent}>
                <Ionicons name="camera" size={24} color={COLORS.text} />
                <Text style={styles.captureButtonText}>Capture</Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  helpButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  viewfinderCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    transform: [{ rotate: '90deg' }],
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    transform: [{ rotate: '270deg' }],
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    transform: [{ rotate: '180deg' }],
  },
  instructionsContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepIcon: {
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
  },
  stepCounter: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  stepsProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.success,
  },
  stepNumber: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: COLORS.success,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skipButtonText: {
    fontSize: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  captureButton: {
    flex: 2,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
  },
  captureButtonActive: {
    opacity: 0.8,
  },
  captureGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  captureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
});