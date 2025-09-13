// app/country/[id].tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Country Detail</Text>
      <Text style={styles.subtitle}>Country ID: {id}</Text>
      <Text style={styles.info}>Navigation working correctly!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#3b82f6',
  },
  info: {
    fontSize: 16,
    color: '#64748b',
  },
});