import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    Animated
} from 'react-native';

const { width, height } = Dimensions.get('window');
const API = "https://thread-sense-api.onrender.com";

// --- WELCOME SCREEN COMPONENT ---
const WelcomeScreen = ({ onStart }) => {
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(20))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <View style={styles.welcomeContainer}>
            <ImageBackground
                source={require('./assets/splash.png')}
                style={styles.welcomeBg}
                blurRadius={2}
            >
                <View style={styles.welcomeOverlay}>
                    <Animated.View style={[styles.welcomeContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.logoRing}>
                            <View style={styles.logoInner} />
                        </View>

                        <Text style={styles.welcomeBrand}>THREAD<Text style={styles.cyanText}>SENSE</Text></Text>
                        <Text style={styles.welcomeSlogan}>Neural Intelligence Extraction Platform</Text>

                        <View style={styles.welcomeSpacer} />

                        <TouchableOpacity style={styles.instagramButton} onPress={onStart}>
                            <Text style={styles.instagramButtonText}>GET STARTED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginLink}>
                            <Text style={styles.loginLinkText}>Already an operative? <Text style={styles.cyanText}>Log In</Text></Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.welcomeFooter}>
                        <Text style={styles.fromCompany}>FROM</Text>
                        <Text style={styles.companyName}>ANTIGRAVITY SYSTEMS</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyze = async () => {
        if (!url) return;
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch(`${API}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Extraction failed");

            setResult(data);
            setUrl("");
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    if (showWelcome) {
        return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setShowWelcome(true)}>
                        <Text style={styles.titleSmall}>THREAD<Text style={styles.cyanText}>SENSE</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.statusBadge}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.statusText}>ENCRYPTED CHANNEL STABLE</Text>
                    </View>
                </View>

                {/* Input Section */}
                <View style={styles.inputCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Inject URL frequency..."
                        placeholderTextColor="#555"
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                        keyboardType="url"
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={analyze}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>EXTRACT INTEL</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                <ScrollView
                    style={styles.mainScroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {error ? (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>CRITICAL ERROR: {error}</Text>
                        </View>
                    ) : null}

                    {result ? (
                        <View style={styles.resultScope}>
                            {/* Summary Card */}
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>NEURAL SUMMARY</Text>
                                <Text style={styles.summaryText}>{result.summary}</Text>
                            </View>

                            {/* Metrics Row */}
                            <View style={styles.metricsRow}>
                                <View style={[styles.card, { flex: 1 }]}>
                                    <Text style={styles.cardLabel}>SENTIMENT</Text>
                                    <Text style={[styles.metricValue, { color: result.score > 50 ? '#00f3ff' : '#ff3d64' }]}>
                                        {result.score}%
                                    </Text>
                                </View>
                                <View style={[styles.card, { flex: 1 }]}>
                                    <Text style={styles.cardLabel}>CATEGORY</Text>
                                    <Text style={styles.metricValue}>{result.category}</Text>
                                </View>
                            </View>

                            {/* Keywords Card */}
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>KEY INDICATORS</Text>
                                <View style={styles.keywordCloud}>
                                    {(result.words || []).map((word, i) => (
                                        <View key={i} style={styles.tag}>
                                            <Text style={styles.tagText}>{word}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            {!loading && (
                                <>
                                    <Text style={styles.emptyText}>Awaiting Neural Link...</Text>
                                    <Text style={styles.emptySubtext}>Paste a Reddit, Youtube, or Twitter URL to begin data reconstruction.</Text>
                                </>
                            )}
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>MOBILE INTERFACE // ALPHA v2.5</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // Welcome Styles
    welcomeContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    welcomeBg: {
        flex: 1,
        width: width,
        height: height,
    },
    welcomeOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    welcomeContent: {
        alignItems: 'center',
        width: '100%',
    },
    logoRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#00f3ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#00f3ff',
        shadowRadius: 15,
        shadowOpacity: 0.5,
    },
    logoInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00f3ff',
    },
    welcomeBrand: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -2,
    },
    welcomeSlogan: {
        color: '#888',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    welcomeSpacer: {
        height: 80,
    },
    instagramButton: {
        backgroundColor: '#00f3ff',
        width: '100%',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00f3ff',
        shadowRadius: 10,
        shadowOpacity: 0.3,
    },
    instagramButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    loginLink: {
        marginTop: 25,
    },
    loginLinkText: {
        color: '#666',
        fontSize: 13,
    },
    welcomeFooter: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    fromCompany: {
        color: '#444',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    companyName: {
        color: '#888',
        fontSize: 12,
        fontWeight: '900',
        marginTop: 5,
        letterSpacing: 1,
    },
    // App Styles
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    titleSmall: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    cyanText: {
        color: '#00f3ff',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(0,243,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,243,255,0.2)',
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00f3ff',
        marginRight: 6,
    },
    statusText: {
        color: '#00f3ff',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    inputCard: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 6,
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 20,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        padding: 20,
        height: 60,
    },
    button: {
        backgroundColor: '#00f3ff',
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    mainScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#080808',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#111',
        marginBottom: 16,
    },
    cardLabel: {
        color: '#444',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 16,
    },
    summaryText: {
        color: '#bbb',
        fontSize: 15,
        lineHeight: 24,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metricValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    keywordCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#111',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#222',
    },
    tagText: {
        color: '#666',
        fontSize: 11,
        fontWeight: '600',
    },
    errorBanner: {
        backgroundColor: 'rgba(255,61,100,0.1)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,61,100,0.3)',
        marginBottom: 20,
    },
    errorText: {
        color: '#ff3d64',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyState: {
        paddingTop: 80,
        alignItems: 'center',
    },
    emptyText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    emptySubtext: {
        color: '#1a1a1a',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#222',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 3,
    }
});
