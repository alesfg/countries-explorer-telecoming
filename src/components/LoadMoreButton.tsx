import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { t } from '../i18n';
import { useLocale } from '../i18n/LocaleContext';

interface LoadMoreButtonProps {
  onPress: () => void;
  loading?: boolean;
  hasMore?: boolean;
  totalLoaded: number;
  totalAvailable: number;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onPress,
  loading = false,
  hasMore = true,
  totalLoaded,
  totalAvailable,
}) => {
  useLocale();
  if (!hasMore) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endText}>{`🌍 ${t('noResults')}: ${totalAvailable}`}</Text>
        <Text style={styles.endSubtext}>{t('loadMore')}</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        loading && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={t('loadMore') + `. ${totalLoaded} of ${totalAvailable}`}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : (
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{t('loadMore')}</Text>
          <Text style={styles.progressText}>
            {totalLoaded} of {totalAvailable} loaded
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressText: {
    color: '#bfdbfe',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  endContainer: {
    alignItems: 'center',
    padding: 32,
    marginVertical: 20,
  },
  endText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 8,
  },
  endSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});