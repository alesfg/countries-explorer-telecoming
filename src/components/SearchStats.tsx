import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../i18n';
import { useLocale } from '../i18n/LocaleContext';

interface SearchStatsProps {
  searchQuery: string;
  totalResults: number;
  isSearching: boolean;
}

export const SearchStats: React.FC<SearchStatsProps> = ({
  searchQuery,
  totalResults,
  isSearching,
}) => {
  if (!searchQuery && !isSearching) {
    return null;
  }

  useLocale(); // trigger rerender on locale change

  return (
    <View style={styles.container}>
      {isSearching ? (
        <Text style={styles.text}>{t('loading')}</Text>
      ) : (
        <Text style={styles.text}>
          {totalResults === 0 ? (
            `${t('noResults')} "${searchQuery}"`
          ) : totalResults === 1 ? (
            `1 ${t('noResults')} "${searchQuery}"`
          ) : (
            `${totalResults} ${t('noResults')} "${searchQuery}"`
          )}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  text: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});