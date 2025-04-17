import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function PestRecommendation() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<any>(null);
  const [result, setResult] = useState<{ disease: string; pesticide_recommendation: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImagePick = async (useCamera: boolean) => {
    const permissionResponse = await (useCamera
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());

    if (permissionResponse.status !== 'granted') {
      Alert.alert("Permission Required", "We need access to your camera or gallery.");
      return;
    }

    const pickerResult = await (useCamera
      ? ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 })
      : ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 }));

    if (pickerResult.canceled) return;

    if (pickerResult.assets.length > 0) {
      const selectedImage = pickerResult.assets[0];
      setImage(selectedImage.uri);
      
      // Convert URI to a file object
      const fileData = {
        uri: selectedImage.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      };
      setFile(fileData);
      
      setResult(null);
    }
  };

  const fetchPestRecommendation = async () => {
    if (!file) {
      Alert.alert("Error", "Please select an image first!");
      return;
    }
    
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any); 
  
    try {
      const response = await fetch('https://flask-agri-ml-2.onrender.com/pest', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }, // Do not set 'Content-Type': 'multipart/form-data' here
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to fetch recommendation");
      }
  
      setResult(data);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", error.message || "Failed to fetch recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐛 Pest Recommendation</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleImagePick(false)}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleImagePick(true)}>
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={fetchPestRecommendation} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Processing..." : "Get Recommendation"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#39ff14" style={{ marginTop: 20 }} />}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>Disease Identified: <Text style={styles.whiteText}>{result.disease || "Unknown"}</Text></Text>
          <Text style={styles.result}>Recommended Pesticide: <Text style={styles.whiteText}>{result.pesticide_recommendation || "Not Available"}</Text></Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f00', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 },
  button: { backgroundColor: '#39ff14', padding: 12, borderRadius: 5, width: '90%', alignItems: 'center', marginVertical: 10 },
  disabledButton: { backgroundColor: '#2d7a08' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#001f00' },
  image: { width: 200, height: 200, marginTop: 20, borderRadius: 10 },
  resultContainer: { marginTop: 20, alignItems: 'center' },
  result: { fontSize: 18, color: '#39ff14', marginTop: 5 },
  whiteText: { color: '#ffffff', fontWeight: 'bold' },
});
