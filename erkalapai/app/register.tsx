import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !mobileNumber || !password) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch('https://flask-agri.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          mobile_number: mobileNumber,  // 🔹 Fix: key should match Flask backend
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration Successful!');
        router.push('/login');  // Redirect to login screen
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        placeholderTextColor="#ffffff" 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mobile Number" 
        placeholderTextColor="#ffffff" 
        keyboardType="numeric" 
        onChangeText={setMobileNumber} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#ffffff" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Already a user? Login</Text>
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
