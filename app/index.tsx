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
  SearchStats,
  LoadMoreButton 
} from '../src/components';
import { t } from '../src/i18n';
import { useLocale } from '../src/i18n/LocaleContext';
import { Country } from '../src/types';
import { countriesApi } from '../src/services';
import { useDebounce, paginateArray, createIncrementalData } from '../src/utils';
import { SEARCH_DEBOUNCE_MS, INITIAL_LOAD_COUNT, LOAD_MORE_COUNT } from '../src/constants';

export default function CountriesListScreen() {
  const router = useRouter();
  useLocale(); // re-render when locale changes
  
  // State for countries data
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
        
        // Load initial page
        const initialPage = paginateArray(sortedCountries, 1, INITIAL_LOAD_COUNT);
        setDisplayedCountries(initialPage.data);
        setCurrentPage(1);
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

  // Load more countries for pagination
  const loadMoreCountries = async () => {
    if (loadingMore || searchQuery.trim()) {
      return; // Don't load more if already loading or searching
    }

    try {
      setLoadingMore(true);
      
      const nextPage = currentPage + 1;
      const nextPageData = paginateArray(
        filteredCountries, 
        nextPage, 
        LOAD_MORE_COUNT
      );
      
      if (nextPageData.data.length > 0) {
        setDisplayedCountries(prev => 
          createIncrementalData(prev, nextPageData.data, (c) => c.cca3)
        );
        setCurrentPage(nextPage);
      }
      
    } catch (err) {
      console.error('Error loading more countries:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Effect to load countries on mount
  useEffect(() => {
    loadAllCountries();
  }, []);

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

  // Countries to display (either paginated or filtered)
  const countriesToDisplay = useMemo(() => {
    if (searchQuery.trim()) {
      // When searching, show all filtered results
      return filteredCountries;
    }
    // When not searching, show paginated results
    return displayedCountries;
  }, [searchQuery, filteredCountries, displayedCountries]);

  // Check if there are more countries to load
  const hasMoreToLoad = useMemo(() => {
    if (searchQuery.trim()) {
      return false; // No pagination during search
    }
    return displayedCountries.length < allCountries.length;
  }, [displayedCountries.length, allCountries.length, searchQuery]);

  const handleCountryPress = (country: Country) => {
    router.push(`/country/${country.cca3}`);
  };

  const handleRetry = () => {
    loadAllCountries();
  };

  const onRefresh = () => {
    // Clear search and reset pagination when refreshing
    setSearchQuery('');
    setCurrentPage(1);
    setDisplayedCountries([]);
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

  const renderLoadMoreButton = () => {
    if (searchQuery.trim() || !hasMoreToLoad) {
      return null;
    }

    return (
      <LoadMoreButton
        onPress={loadMoreCountries}
        loading={loadingMore}
        hasMore={hasMoreToLoad}
        totalLoaded={displayedCountries.length}
        totalAvailable={allCountries.length}
      />
    );
  };

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>{t('list.emptyNoResults')}</Text>
          <Text style={styles.emptyMessage}>{t('list.emptyTrySearch')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t('list.emptyNoCountries')}</Text>
        <Text style={styles.emptyMessage}>{t('list.refreshTitle')}</Text>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message={t('list.loadingAll')} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title={t('list.failedToLoad')}
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
        <Text style={styles.title}>{t('list.title')}</Text>
        <Text style={styles.subtitle}>
          {searchQuery.trim()
            ? t('list.subtitleSearchResults')
            : t('list.subtitleShowing')
                .replace('%d', String(displayedCountries.length))
                .replace('%d', String(allCountries.length))}
        </Text>
      </View>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleSearchClear}
      />

      {/* Search Stats */}
      <SearchStats
        searchQuery={searchQuery}
        totalResults={countriesToDisplay.length}
        isSearching={searching}
      />

      {/* Countries List */}
      <FlatList
        data={countriesToDisplay}
        renderItem={renderCountryCard}
        keyExtractor={(item, index) => item.cca3 || `country-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderLoadMoreButton}
        initialNumToRender={INITIAL_LOAD_COUNT}
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
      title={t('list.refreshTitle')}
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