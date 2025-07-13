import { CameraView } from "expo-camera";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
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
    Dimensions,
    Vibration,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function qrScan() {
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [flashOn, setFlashOn] = useState(false);
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        // Start scanning line animation
        const animateScanning = () => {
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (!scanned) animateScanning();
            });
        };
        animateScanning();
    }, [scanned]);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanned || loading) return;

        // Haptic feedback
        Vibration.vibrate(100);
        
        setScanned(true);
        setLoading(true);
        setScannedData(data);
        console.log("Scanned barcode:", data);
        console.log(typeof data);

        try {
            const res = await axios.post("https://sr-product-server-ul9j.onrender.com/scan", {
                barcode: data,
            });

            if (res.data && res.data.success) {
                console.log("Product data:", res.data);
                router.push({
                    pathname: "/returnProduct",
                    params: {
                        product: JSON.stringify(res.data.product),
                    },
                });
            } else {
                Alert.alert(
                    "Product Not Found", 
                    "The scanned item does not exist in our database.",
                    [
                        {
                            text: "Try Again",
                            onPress: () => setScanned(false),
                        },
                    ]
                );
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            Alert.alert(
                "Connection Error", 
                "Unable to connect to server. Please check your internet connection.",
                [
                    {
                        text: "Retry",
                        onPress: () => setScanned(false),
                    },
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    const resetScanner = () => {
        setScanned(false);
        setScannedData(null);
    };

    const scanningLineTranslateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 150],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.replace("./")}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Scan Product</Text>
                <Pressable style={styles.flashButton} onPress={toggleFlash}>
                    <Ionicons 
                        name={flashOn ? "flash" : "flash-off"} 
                        size={24} 
                        color="#fff" 
                    />
                </Pressable>
            </View>

            {/* Camera Container */}
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    flash={flashOn ? "on" : "off"}
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
                
                {/* Scanner Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.scannerFrame}>
                        {/* Corner indicators */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                        
                        {/* Scanning line */}
                        {!scanned && !loading && (
                            <Animated.View
                                style={[
                                    styles.scanningLine,
                                    {
                                        transform: [{ translateY: scanningLineTranslateY }],
                                    },
                                ]}
                            />
                        )}
                    </View>
                </View>

                {/* Loading Overlay */}
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#00D4FF" />
                            <Text style={styles.loadingText}>Fetching product details...</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionTitle}>
                    {scanned ? "Product Scanned!" : "Position barcode within the frame"}
                </Text>
                <Text style={styles.instructionSubtitle}>
                    {scanned 
                        ? "Processing your request..." 
                        : "Hold your device steady for better results"
                    }
                </Text>
                
                {scannedData && (
                    <View style={styles.scannedDataContainer}>
                        <Text style={styles.scannedDataLabel}>Scanned Code:</Text>
                        <Text style={styles.scannedDataText}>{scannedData}</Text>
                    </View>
                )}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                {scanned && !loading && (
                    <Pressable style={styles.actionButton} onPress={resetScanner}>
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Scan Again</Text>
                    </Pressable>
                )}
                
                <Pressable 
                    style={[styles.actionButton, styles.homeButton]} 
                    onPress={() => router.replace("./")}
                >
                    <Ionicons name="home" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Home</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 40 : 20,
        paddingBottom: 20,
        backgroundColor: "#000",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    flashButton: {
        padding: 8,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    camera: {
        width: width,
        height: height * 0.6,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    scannerFrame: {
        width: 300,
        height: 300,
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: "#00D4FF",
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 20,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomLeftRadius: 20,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 20,
    },
    scanningLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: "#00D4FF",
        shadowColor: "#00D4FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: 30,
        borderRadius: 15,
        backdropFilter: "blur(10px)",
    },
    loadingText: {
        color: "#fff",
        marginTop: 15,
        fontSize: 16,
        fontWeight: "500",
    },
    instructionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: "center",
    },
    instructionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    instructionSubtitle: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    scannedDataContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
    },
    scannedDataLabel: {
        color: "#00D4FF",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 5,
    },
    scannedDataText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "monospace",
    },
    bottomActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 15,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00D4FF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
    },
    homeButton: {
        backgroundColor: "#333",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});