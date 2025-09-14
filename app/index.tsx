import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CountryCard, LoadingSpinner } from '../src/components';
import { Country } from '../src/types';
import { mockCountries } from '../src/data/mockCountries';

export default function CountriesListScreen() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos (como si viniera de una API)
    const loadCountries = async () => {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCountries(mockCountries);
      setLoading(false);
    };

    loadCountries();
  }, []);

  const handleCountryPress = (country: Country) => {
    router.push(`/country/${country.cca3}`);
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
        Try adjusting your search criteria
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading countries..." />;
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
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
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