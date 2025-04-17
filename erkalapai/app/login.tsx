import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!mobileNumber.trim() || !password.trim()) {
      alert('Mobile Number and Password are required!');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit Mobile Number!');
      return;
    }

    const payload = { mobile_number: mobileNumber, password };

    try {
      const response = await fetch('https://flask-agri.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('mobileNumber', mobileNumber);
        alert('Login Successful!');
        router.push('/home'); // Redirect to home screen
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Mobile Number" 
        placeholderTextColor="#ffffff" 
        keyboardType="numeric"
        maxLength={10}
        onChangeText={setMobileNumber} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#ffffff" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Create an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f00' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#39ff14', marginBottom: 20 },
  input: { width: '80%', padding: 12, margin: 10, borderWidth: 1, borderColor: '#39ff14', backgroundColor: '#002600', color: 'white', borderRadius: 5 },
  button: { backgroundColor: '#39ff14', padding: 12, width: '60%', alignItems: 'center', borderRadius: 5, marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#001f00' },
  linkText: { color: '#39ff14', marginTop: 10, fontSize: 14, textDecorationLine: 'underline' }
});
