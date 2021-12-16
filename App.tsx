import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationAsync().then(token => setExpoPushToken(token));

    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  },[])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>プッシュトークン：「{expoPushToken}」</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  console.log(response);
  alert(response);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const registerForPushNotificationAsync = async() => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus != 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('プッシュ通知のためのトークンの取得に失敗しました');
      throw 'プッシュ通知トークンの取得に失敗しました';
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    alert("取得成功！")
    console.log(token);
  } else {
    alert('Must use physical device')
    throw '物理デバイスを使用してください'
  }

  if(Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token;
}
