import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CountryCard, LoadingSpinner, ErrorMessage } from '../src/components';
import { Country } from '../src/types';
import { countriesApi } from '../src/services';

export default function CountriesListScreen() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await countriesApi.getAllCountries();
      
      if (response.success && response.data) {
        // Sort countries alphabetically by name
        const sortedCountries = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } else {
        setError(response.error || 'Failed to load countries');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error loading countries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleCountryPress = (country: Country) => {
    router.push(`/country/${country.cca3}`);
  };

  const handleRetry = () => {
    loadCountries();
  };

  const onRefresh = () => {
    loadCountries(true);
  };

  const renderCountryCard = ({ item }: { item: Country }) => (
    <CountryCard
      country={item}
      onPress={() => handleCountryPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No countries found</Text>
      <Text style={styles.emptyMessage}>
        Try refreshing the list or check your connection
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading countries from around the world..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load countries"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Countries Explorer</Text>
        <Text style={styles.subtitle}>
          Discover {countries.length} countries around the world
        </Text>
      </View>

      <FlatList
        data={countries}
        renderItem={renderCountryCard}
        keyExtractor={(item) => item.cca3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 116, // Approximate height of CountryCard
          offset: 116 * index,
          index,
        })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
            title="Pull to refresh"
            titleColor="#64748b"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    opacity: 0.9,
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});