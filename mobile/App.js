import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';

// For local testing on your phone, use your computer's IP:
const API = "https://thread-sense-api.onrender.com";

export default function App() {
    const [url, setUrl] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const analyze = async () => {
        if (!url) return;
        setLoading(true);
        setSummary("");
        try {
            const res = await fetch(`${API}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            setSummary(data.summary);
        } catch (e) {
            alert("Connection Lost: Ensure backend is active.");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.title}>THREAD<Text style={{ color: '#00f3ff' }}>SENSE</Text></Text>
                <View style={styles.statusBadge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.statusText}>SYSTEM ACTIVE</Text>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Inject Reddit frequency..."
                    placeholderTextColor="#444"
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={analyze} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>EXTRACT</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultContainer} contentContainerStyle={{ paddingBottom: 40 }}>
                {summary ? (
                    <View>
                        <Text style={styles.label}>TRANSMISSION DATA</Text>
                        <Text style={styles.summaryText}>{summary}</Text>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.placeholder}>Awaiting intelligence report...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>NEURAL INTERFACE // V2.0 PREMIUM</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030303',
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -3,
        fontFamily: 'System', // Outfit preferred if available
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,243,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,243,255,0.1)',
        marginTop: 10,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#00f3ff',
        marginRight: 8,
        shadowColor: '#00f3ff',
        shadowRadius: 4,
        shadowOpacity: 0.8,
    },
    statusText: {
        color: '#00f3ff',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 2,
    },
    inputContainer: {
        gap: 12,
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'System',
    },
    button: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#00f3ff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    buttonText: {
        color: '#000',
        fontWeight: '900',
        letterSpacing: 3,
        fontSize: 12,
    },
    resultContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 25,
    },
    label: {
        color: '#00f3ff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 15,
        opacity: 0.6,
    },
    summaryText: {
        color: '#eee',
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '300',
        fontStyle: 'italic',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    placeholder: {
        color: '#333',
        textAlign: 'center',
        fontSize: 14,
        letterSpacing: 1,
    },
    footer: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    footerText: {
        color: '#222',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 4,
    }
});

