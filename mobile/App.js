import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';

const API = "https://thread-sense-api.onrender.com";

export default function App() {
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>THREAD<Text style={styles.cyanText}>SENSE</Text></Text>
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
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -2,
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
