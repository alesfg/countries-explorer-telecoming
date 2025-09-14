import React, { useState, useEffect, useMemo } from 'react';
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
import { 
  CountryCard, 
  LoadingSpinner, 
  ErrorMessage, 
  SearchInput,
  SearchStats 
} from '../src/components';
import { Country } from '../src/types';
import { countriesApi } from '../src/services';
import { useDebounce } from '../src/utils';
import { SEARCH_DEBOUNCE_MS } from '../src/constants';

export default function CountriesListScreen() {
  const router = useRouter();
  
  // State for countries data
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Load all countries on component mount
  const loadAllCountries = async (showRefresh = false) => {
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
        setAllCountries(sortedCountries);
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

  // Search countries by name using API
  const searchCountries = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    try {
      setSearching(true);
      const response = await countriesApi.getCountryByName(query);
      
      if (response.success && response.data) {
        // Sort search results alphabetically
        const sortedResults = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        return sortedResults;
      } else {
        console.warn('Search API error:', response.error);
        return [];
      }
    } catch (err) {
      console.error('Error searching countries:', err);
      return [];
    } finally {
      setSearching(false);
    }
  };

  // Effect to load countries on mount
  useEffect(() => {
    loadAllCountries();
  }, []);

  // Effect to handle search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim()) {
        await searchCountries(debouncedSearchQuery);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCountries;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return allCountries.filter(country => 
      country.name.common.toLowerCase().includes(query) ||
      country.name.official.toLowerCase().includes(query) ||
      country.region.toLowerCase().includes(query) ||
      (country.capital && country.capital.some(cap => 
        cap.toLowerCase().includes(query)
      ))
    );
  }, [allCountries, searchQuery]);

  const handleCountryPress = (country: Country) => {
    router.push(`/country/${country.cca3}`);
  };

  const handleRetry = () => {
    loadAllCountries();
  };

  const onRefresh = () => {
    // Clear search when refreshing
    setSearchQuery('');
    loadAllCountries(true);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const renderCountryCard = ({ item }: { item: Country }) => (
    <CountryCard
      country={item}
      onPress={() => handleCountryPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No countries found</Text>
          <Text style={styles.emptyMessage}>
            Try a different search term or check the spelling
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No countries available</Text>
        <Text style={styles.emptyMessage}>
          Pull down to refresh the list
        </Text>
      </View>
    );
  };

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
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Countries Explorer</Text>
        <Text style={styles.subtitle}>
          Discover countries around the world
        </Text>
      </View>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by country, capital, or region..."
        onClear={handleSearchClear}
      />

      {/* Search Stats */}
      <SearchStats
        searchQuery={searchQuery}
        totalResults={filteredCountries.length}
        isSearching={searching}
      />

      {/* Countries List */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryCard}
        keyExtractor={(item) => item.cca3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={15}
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
        keyboardShouldPersistTaps="handled"
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
    paddingVertical: 16,
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
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
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