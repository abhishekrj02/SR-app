import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../utils/constants';

const { width } = Dimensions.get('window');

interface ReturnReason {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'defect' | 'sizing' | 'quality' | 'other';
}

const returnReasons: ReturnReason[] = [
  {
    id: '1',
    title: 'Defective Product',
    description: 'Product has manufacturing defects or damage',
    icon: 'warning',
    category: 'defect',
  },
  {
    id: '2',
    title: 'Wrong Size',
    description: 'Product size does not fit as expected',
    icon: 'resize',
    category: 'sizing',
  },
  {
    id: '3',
    title: 'Poor Quality',
    description: 'Product quality below expectations',
    icon: 'thumbs-down',
    category: 'quality',
  },
  {
    id: '4',
    title: 'Wrong Item',
    description: 'Received different item than ordered',
    icon: 'swap-horizontal',
    category: 'other',
  },
  {
    id: '5',
    title: 'Not as Described',
    description: 'Product differs from description',
    icon: 'document-text',
    category: 'other',
  },
  {
    id: '6',
    title: 'Changed Mind',
    description: 'No longer need this item',
    icon: 'heart-dislike',
    category: 'other',
  },
];

export default function ReasonScreen() {
  const params = useLocalSearchParams();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleContinue = () => {
    if (selectedReason) {
      router.push({
        pathname: '/capture',
        params: {
          ...params,
          reasonId: selectedReason,
        },
      });
    }
  };

  const fadeInUp = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text style={styles.headerTitle}>Return Reason</Text>
          <View style={styles.placeholder} />
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
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 4</Text>
        </Animated.View>

        {/* Instructions */}
        <Animated.View
          style={[
            styles.instructionsCard,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <View style={styles.instructionsContent}>
            <Ionicons name="help-circle" size={24} color={COLORS.primary} />
            <Text style={styles.instructionsTitle}>Why are you returning this item?</Text>
            <Text style={styles.instructionsText}>
              Select the reason that best describes your return. This helps us improve our service.
            </Text>
          </View>
        </Animated.View>

        {/* Reason Cards */}
        <Animated.View
          style={[
            styles.reasonsList,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          {returnReasons.map((reason, index) => (
            <Animated.View
              key={reason.id}
              style={[
                {
                  opacity: animatedValue,
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 + index * 20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable
                style={[
                  styles.reasonCard,
                  selectedReason === reason.id && styles.selectedReasonCard,
                ]}
                onPress={() => handleReasonSelect(reason.id)}
              >
                <View style={styles.reasonContent}>
                  <View style={styles.reasonIcon}>
                    <Ionicons
                      name={reason.icon as any}
                      size={24}
                      color={
                        selectedReason === reason.id
                          ? COLORS.primary
                          : COLORS.textSecondary
                      }
                    />
                  </View>
                  <View style={styles.reasonText}>
                    <Text
                      style={[
                        styles.reasonTitle,
                        selectedReason === reason.id && styles.selectedReasonTitle,
                      ]}
                    >
                      {reason.title}
                    </Text>
                    <Text style={styles.reasonDescription}>
                      {reason.description}
                    </Text>
                  </View>
                  <View style={styles.reasonCheck}>
                    {selectedReason === reason.id ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.primary}
                      />
                    ) : (
                      <View style={styles.uncheckedCircle} />
                    )}
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Continue Button */}
        <Animated.View
          style={[
            styles.continueContainer,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <Pressable
            style={[
              styles.continueButton,
              !selectedReason && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedReason}
          >
            <LinearGradient
              colors={
                selectedReason
                  ? [COLORS.primary, '#0099CC']
                  : [COLORS.textSecondary, COLORS.textSecondary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
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
  placeholder: {
    width: 40,
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
  instructionsCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 30,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionsContent: {
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  reasonsList: {
    paddingHorizontal: SIZES.padding,
  },
  reasonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedReasonCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonIcon: {
    marginRight: 16,
  },
  reasonText: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  selectedReasonTitle: {
    color: COLORS.primary,
  },
  reasonDescription: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  reasonCheck: {
    marginLeft: 16,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  continueContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 40,
  },
  continueButton: {
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
});