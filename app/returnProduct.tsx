// app/(tabs)/returnProduct.tsx
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from "react-native";
import React from "react";

export default function ReturnProduct() {
    const params = useLocalSearchParams();
    const product = params.product ? JSON.parse(params.product as string) : null;
    console.log("Product data:", product);
    if (!product) {
        return (
            <View style={styles.centered}>
                <Text>Invalid product data.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{product.name}</Text>
            <Image
                source={{ uri: product.image || "https://via.placeholder.com/200" }}
                style={styles.productImage}
            />
            <Text style={styles.text}>SKU: {product.sku}</Text>
            <Text style={styles.text}>Category: {product.category}</Text>
            <Text style={styles.text}>Eligible for Return: {product.eligible ? "Yes" : "No"}</Text>
            <Text style={styles.text}>Condition at Purchase: {product.condition}</Text>

            <Pressable
                style={styles.button}
                onPress={() =>
                    router.push({
                        pathname: "/",
                        params: {
                            sku: product.sku,
                        },
                    })
                }
            >
                <Text style={styles.buttonText}>Proceed with Return</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
