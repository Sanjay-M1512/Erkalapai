import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function CropRecommendation() {
  const [inputs, setInputs] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setInputs({ ...inputs, [name]: value.trim() }); // Trim spaces
  };

  const fetchRecommendation = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    Keyboard.dismiss(); // Hide keyboard when submitting

    try {
      console.log("🚀 Sending data to API:", inputs);

      const response = await fetch('https://flask-agri-ml.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Received API Response:", data);

      // ✅ Fix: Use the correct key from API response
      if (data.recommended_crop) {
        setResult(data.recommended_crop);  // ✅ Corrected key
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (err) {
      console.error("❌ Error fetching recommendation:", err);
      setError("❌ Could not fetch recommendation. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌾 Crop Recommendation</Text>

      {Object.keys(inputs).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={`Enter ${key}`}
          placeholderTextColor="white"
          onChangeText={(value) => handleChange(key, value)}
          keyboardType="numeric"
          value={inputs[key]}
        />
      ))}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={fetchRecommendation} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#001f00" /> : <Text style={styles.buttonText}>Get Recommendation</Text>}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <Text style={styles.result}>
          Recommended Crop: <Text style={styles.crop}>{result}</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f00', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#39ff14', marginBottom: 20 },
  input: { width: '90%', padding: 10, borderWidth: 1, borderColor: '#39ff14', marginBottom: 10, color: 'white' },
  button: { backgroundColor: '#39ff14', padding: 12, borderRadius: 5, width: '90%', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#145214' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#001f00' },
  result: { marginTop: 20, fontSize: 18, color: 'white' },
  crop: { fontSize: 18, color: '#39ff14', fontWeight: 'bold' },
  error: { marginTop: 10, color: 'red', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
