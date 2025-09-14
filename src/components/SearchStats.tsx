import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

  return (
    <View style={styles.container}>
      {isSearching ? (
        <Text style={styles.text}>Searching...</Text>
      ) : (
        <Text style={styles.text}>
          {totalResults === 0 ? (
            `No results found for "${searchQuery}"`
          ) : totalResults === 1 ? (
            `1 result found for "${searchQuery}"`
          ) : (
            `${totalResults} results found for "${searchQuery}"`
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