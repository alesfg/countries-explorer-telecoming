import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { LoadingSpinner } from '../../src/components';
import { Country } from '../../src/types';
import { mockCountries } from '../../src/data/mockCountries';

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountry = async () => {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buscar país por código cca3
      const foundCountry = mockCountries.find(c => c.cca3 === id);
      setCountry(foundCountry || null);
      setLoading(false);
    };

    if (id) {
      loadCountry();
    }
  }, [id]);

  const formatPopulation = (population: number): string => {
    return population.toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading country details..." />;
  }

  if (!country) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Country not found</Text>
          <Text style={styles.errorMessage}>
            The country with code "{id}" could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.flagContainer}>
          <Image
            source={{ uri: country.flags.png }}
            style={styles.flag}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.countryName}>
            {country.name.common}
          </Text>
          
          <Text style={styles.officialName}>
            {country.name.official}
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Capital</Text>
              <Text style={styles.infoValue}>
                {country.capital?.[0] || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Population</Text>
              <Text style={styles.infoValue}>
                {formatPopulation(country.population)}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Region</Text>
              <Text style={styles.infoValue}>
                {country.region}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Country Code</Text>
              <Text style={styles.infoValue}>
                {country.cca3}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  flagContainer: {
    height: 200,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    width: '80%',
    height: 120,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    padding: 20,
  },
  countryName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  officialName: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  infoGrid: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});