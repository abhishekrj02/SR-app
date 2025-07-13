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
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../utils/constants';
import { ReturnProcess } from '../types';
import apiClient from '../utils/api';

const { width, height } = Dimensions.get('window');

interface RecentReturn {
  id: string;
  productName: string;
  status: string;
  date: string;
  refundAmount?: number;
}

export default function HomeScreen() {
  const [recentReturns, setRecentReturns] = useState<RecentReturn[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    loadRecentReturns();
  }, []);

  const loadRecentReturns = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReturns: RecentReturn[] = [
        {
          id: '1',
          productName: 'Nike Air Max 270',
          status: 'approved',
          date: '2 days ago',
          refundAmount: 129.99,
        },
        {
          id: '2',
          productName: 'iPhone 15 Case',
          status: 'analyzing',
          date: '1 week ago',
        },
        {
          id: '3',
          productName: 'Wireless Headphones',
          status: 'review',
          date: '2 weeks ago',
        },
      ];
      setRecentReturns(mockReturns);
    } catch (error) {
      console.error('Error loading recent returns:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecentReturns();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return COLORS.success;
      case 'analyzing':
        return COLORS.warning;
      case 'review':
        return COLORS.primary;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle';
      case 'analyzing':
        return 'time';
      case 'review':
        return 'eye';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const fadeInUp = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.subtitle}>Ready to return something?</Text>
            </View>
            <Pressable style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color={COLORS.primary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Main Action Card */}
        <Animated.View
          style={[
            styles.actionCard,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, '#0099CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Start Return Process</Text>
                <Text style={styles.actionSubtitle}>
                  Scan product barcode to begin
                </Text>
              </View>
              <Pressable
                style={styles.scanButton}
                onPress={() => router.push('/scan')}
              >
                <Ionicons name="qr-code" size={30} color={COLORS.primary} />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActions,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="search" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionItemText}>Find Order</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionItemText}>Help Center</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionItemText}>Live Chat</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionItemText}>Policies</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Recent Returns */}
        <Animated.View
          style={[
            styles.recentReturns,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Returns</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          {recentReturns.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="archive" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No recent returns</Text>
              <Text style={styles.emptyStateSubtext}>
                Your return history will appear here
              </Text>
            </View>
          ) : (
            recentReturns.map((item, index) => (
              <Pressable
                key={item.id}
                style={styles.returnCard}
                onPress={() => router.push(`/status?returnId=${item.id}`)}
              >
                <View style={styles.returnCardContent}>
                  <View style={styles.returnInfo}>
                    <Text style={styles.returnProductName}>{item.productName}</Text>
                    <Text style={styles.returnDate}>{item.date}</Text>
                  </View>
                  <View style={styles.returnStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Ionicons
                        name={getStatusIcon(item.status)}
                        size={16}
                        color={COLORS.text}
                      />
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    {item.refundAmount && (
                      <Text style={styles.refundAmount}>
                        ${item.refundAmount.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: animatedValue,
              transform: [{ translateY: fadeInUp }],
            },
          ]}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Returns</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>$247</Text>
              <Text style={styles.statLabel}>Total Refunds</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>92%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  actionCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  gradientCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    minHeight: 120,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  actionSubtitle: {
    fontSize: FONTS.regular,
    color: COLORS.text,
    opacity: 0.8,
  },
  scanButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 50,
    marginLeft: 20,
  },
  quickActions: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: FONTS.regular,
    color: COLORS.primary,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionItem: {
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 50,
    marginBottom: 8,
  },
  actionItemText: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  recentReturns: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
  },
  emptyStateText: {
    fontSize: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 8,
    opacity: 0.7,
  },
  returnCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  returnCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnInfo: {
    flex: 1,
  },
  returnProductName: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  returnDate: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  returnStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: FONTS.small,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  refundAmount: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.success,
  },
  statsContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: FONTS.xlarge,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});