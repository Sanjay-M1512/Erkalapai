import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/appicon.png')} style={[styles.logo, { transform: [{ scale: 1.8 }] }]} />
      <Text style={styles.title}>Welcome to Erkalapai 🚜</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f00' },
  logo: { width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#39ff14', marginBottom: 20 },
  button: { backgroundColor: '#39ff14', padding: 12, width: '60%', alignItems: 'center', borderRadius: 5, marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#001f00' },
});
