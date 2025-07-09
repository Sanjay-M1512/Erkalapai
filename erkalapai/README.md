# 🌾 Welcome to Erkalapai 👋

**Erkalapai** is an AI-powered agricultural assistant app built with **React Native (Expo)** and **Flask**, designed to provide intelligent crop, pesticide, and fertilizer recommendations to farmers. The app also supports multilingual guidance, offline functionality, real-time farm logs, and price tracking of agricultural products.

🔗 **Live Web Version:** [https://erkalapai.vercel.app](https://erkalapai.vercel.app)

---

## 🚀 Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

You can run the app using:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) — a sandbox for quick app testing

You can begin development by editing files in the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

---

## 🧠 Project Highlights

- 🌱 **Crop Recommendation** using Random Forest
- 🐛 **Pesticide Suggestion** via MobileNetV2 + image classification
- 💧 **Fertilizer Guidance** with feature fusion (image + soil data)
- 📊 **Price Visualization** for crops, vegetables, and fruits
- 🧑‍🌾 **Farmer Logs** tracking monthly usage
- 🗣️ **Multilingual Support** for regional users
- 📴 **Offline Functionality** with SMS & RDS alerts
- 🆘 **Emergency Reporting** with image and text-based help requests

---

## ⚙️ Tech Stack

- **Frontend:** React Native (Expo), Tailwind CSS
- **Backend:** Flask + Flask-SQLAlchemy + MongoDB Atlas
- **ML Models:** Random Forest, MobileNetV2, Custom CNNs
- **Database:** MongoDB Atlas
- **Alerts:** Twilio SMS API, RDS Broadcast
- **Deployment:** Vercel (Web), Expo (Mobile)

---

## 🧼 Reset the Project

To clean the starter code and begin fresh:

```bash
npm run reset-project
```

This will move the starter to **app-example** and give you a clean **app** folder.

---

## 📚 Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [Erkalapai Web App](https://erkalapai.vercel.app)

---

## 💬 Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
