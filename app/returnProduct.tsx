// app/returnProduct.tsx
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ReturnProductScreen() {
  const { product } = useLocalSearchParams();
  const router = useRouter();

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No product data available.</Text>
      </View>
    );
  }

  const parsedProduct = JSON.parse(product);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Details</Text>

      {parsedProduct.image && (
        <Image source={{ uri: parsedProduct.image }} style={styles.image} />
      )}

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{parsedProduct.name}</Text>

      <Text style={styles.label}>SKU:</Text>
      <Text style={styles.value}>{parsedProduct.sku}</Text>

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{parsedProduct.category}</Text>

      <Text style={styles.label}>Return Eligible:</Text>
      <Text style={styles.value}>{parsedProduct.returnEligible ? 'Yes' : 'No'}</Text>

      <Button
        title="Proceed to Return Reason"
        onPress={() => router.push({ pathname: '/reason', params: { barcode: parsedProduct.sku } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
