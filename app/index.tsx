import { View, Text, StyleSheet } from 'react-native';

export default function CountriesListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Countries List</Text>
      <Text style={styles.subtitle}>Navigation setup complete!</Text>
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
    fontSize: 16,
    color: '#64748b',
  },
});