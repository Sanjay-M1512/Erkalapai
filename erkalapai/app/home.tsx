import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState({
    temperature: 'Loading...',
    humidity: 'Loading...',
    rainfall: 'Loading...',
    location: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState('');
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const mobileNumber = await AsyncStorage.getItem('mobileNumber');
      if (mobileNumber) {
        try {
          const response = await fetch(`https://flask-agri.onrender.com/user/${mobileNumber}`);
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            alert('Failed to fetch user data.');
          }
        } catch (error) {
          alert('Error fetching user data.');
        }
      }
      setLoading(false);
    };

    const fetchWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        const apiKey = '8ef982c66d8d8d470880c2aac4b5acdd';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (!response.ok || !data.main) {
          console.log("Weather API Response:", data);
          alert("Failed to retrieve valid weather data.");
          setWeather({ temperature: 'N/A', humidity: 'N/A', rainfall: 'N/A', location: 'N/A' });
        } else {
          const temperature = `${data.main.temp}°C`;
          const humidity = `${data.main.humidity}%`;
          const rainfall = data.rain?.['1h'] ? `${data.rain['1h']} mm` : '0 mm';
          const locationName = data.name;
          setWeather({ temperature, humidity, rainfall, location: locationName });
        }

      } catch (error) {
        console.log('Weather fetch error:', error);
        alert('Error fetching weather data.');
      }
    };

    const fetchTipOfTheDay = () => {
      // Hardcoded for now, you can later fetch from an API or local DB
      setTip("Make sure to water your crops early in the morning to avoid evaporation losses.");
    };

    const fetchLocalNews = async () => {
      // You can replace this with actual API to fetch local news
      setNews([
        { title: "New Organic Farming Scheme Launched", description: "The government has launched a new initiative to encourage organic farming in rural areas." },
        { title: "Market Prices Fluctuate for Tomatoes", description: "Tomato prices have seen a rise in the local markets due to increased demand." },
        { title: "Pest Attack Alert in Nearby Areas", description: "Farmers in the neighboring district are urged to inspect their crops for potential pest attacks." },
      ]);
    };

    fetchUserData();
    fetchWeather();
    fetchTipOfTheDay();
    fetchLocalNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#39ff14" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.username}</Text>
          <Text style={styles.info}>📱 Mobile: {user.mobile_number}</Text>
          <Text style={styles.subtitle}>🌦 Weather Information</Text>
          <Text style={styles.info}>📍 Location: {weather.location}</Text>
          <Text style={styles.info}>🌡 Temperature: {weather.temperature}</Text>
          <Text style={styles.info}>💧 Humidity: {weather.humidity}</Text>
          <Text style={styles.info}>🌧 Rainfall: {weather.rainfall}</Text>

          <Text style={styles.subtitle}>🌱 Tip of the Day</Text>
          <Text style={styles.info}>{tip}</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/CropRecommendation')}>
            <Text style={styles.buttonText}>🌾 Get Crop Recommendation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/PestRecomendation')}>
            <Text style={styles.buttonText}>🐛 Get Pesticide Recommendation</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>📢 Local Agricultural News</Text>
          {news.length > 0 ? (
            news.map((item, index) => (
              <View key={index} style={styles.newsItem}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDescription}>{item.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.info}>No local news available.</Text>
          )}
        </>
      ) : (
        <Text style={styles.errorText}>User data not available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001f00', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#39ff14', marginBottom: 10 },
  subtitle: { fontSize: 22, fontWeight: 'bold', color: '#39ff14', marginTop: 20 },
  info: { fontSize: 16, color: 'white', marginVertical: 5 },
  button: { 
    backgroundColor: '#39ff14', 
    padding: 12, 
    width: '80%', 
    alignItems: 'center', 
    borderRadius: 5, 
    marginTop: 15, 
    alignSelf: 'center'  // Centered the buttons horizontally
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#001f00' },
  errorText: { fontSize: 16, color: 'red', marginTop: 20 },
  newsItem: { marginTop: 10 },
  newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#39ff14' },
  newsDescription: { fontSize: 14, color: 'white', marginTop: 5 },
});
