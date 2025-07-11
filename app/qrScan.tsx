import { CameraView } from "expo-camera";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ActivityIndicator,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import axios from "axios";

export default function qrScan() {
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanned || loading) return;

        setScanned(true);
        setLoading(true);
        setScannedData(data);
        console.log("Scanned barcode:", data);
console.log(typeof data); // server


        try {
            const res = await axios.post("https://sr-product-server.onrender.com/scan", {
                barcode: data,
            });

            if (res.data && res.data.success) {
                // Navigate to product details page and pass data
                console.log("Product data:", res.data);
                router.push({
                    pathname: "/returnProduct",
                    params: {
                        product: JSON.stringify(res.data.product),
                    },
                });
            } else {
                Alert.alert("Product Not Found", "The scanned item does not exist.");
                setScanned(false);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            Alert.alert("Error", "Something went wrong while fetching product data.");
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === "android" && <StatusBar hidden />}

            <CameraView
                style={styles.camStyle}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: [
                        "aztec",
                        "ean13",
                        "ean8",
                        "qr",
                        "pdf417",
                        "upc_e",
                        "datamatrix",
                        "code39",
                        "code93",
                        "itf14",
                        "codabar",
                        "code128",
                        "upc_a",
                    ],
                }}
                onBarcodeScanned={scanned || loading ? undefined : handleBarcodeScanned}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Fetching product details...</Text>
                </View>
            )}

            <Pressable style={styles.backButton} onPress={() => router.replace("./")}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },
    camStyle: {
        width: 300,
        height: 300,
        borderRadius: 10,
        overflow: "hidden",
    },
    backButton: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#007AFF",
        borderRadius: 5,
    },
    backText: {
        color: "#fff",
        fontSize: 16,
    },
    loadingOverlay: {
        position: "absolute",
        top: "40%",
        left: 0,
        right: 0,
        alignItems: "center",
    },
    loadingText: {
        color: "#fff",
        marginTop: 10,
        fontSize: 16,
        fontWeight: "600",
    },
});
