import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Country } from '../types';
import { t } from '../i18n';
import { useLocale } from '../i18n/LocaleContext';

const { width } = Dimensions.get('window');

interface CountryCardProps {
  country: Country;
  onPress: () => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ 
  country, 
  onPress 
}) => {
  useLocale();
  const formatPopulation = (population: number): string => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
  accessibilityLabel={`${t('viewDetails')} ${country.name.common}`}
    >
      <View style={styles.flagContainer}>
        <Image
          source={{ uri: country.flags.png }}
          style={styles.flag}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.countryName} numberOfLines={1}>
          {country.name.common}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('country.capital')}:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {country.capital?.[0] || t('detail.noCapital')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('country.population')}:</Text>
          <Text style={styles.value}>
            {formatPopulation(country.population)}
          </Text>
        </View>
        
        <View style={styles.regionContainer}>
          <Text style={styles.region}>{country.region}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  flagContainer: {
    width: 80,
    height: 52,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 16,
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    width: 80,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  regionContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  region: {
    fontSize: 12,
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
});
``