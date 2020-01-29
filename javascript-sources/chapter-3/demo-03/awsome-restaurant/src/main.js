import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import * as m from "firebase/messaging";

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyAsy_ngbpeBEUVBAT4E7m-2orKaonoRtCQ",
  authDomain: "awsome-restaurant-fadbc.firebaseapp.com",
  databaseURL: "https://awsome-restaurant-fadbc.firebaseio.com",
  projectId: "awsome-restaurant-fadbc",
  storageBucket: "",
  messagingSenderId: "719631067901",
  appId: "1:719631067901:web:9d02d81af3da5577"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let messaging = firebase.messaging();

Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
    messaging
      .getToken()
      .then(currentToken => {
        if (currentToken) {
          console.log(currentToken);
          window.token = currentToken;
        } else {
          console.log("No Instance ID token available. Request permission to get one.");
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
      });
  } else {
    console.log("Unable to get permission to notify.");
  }
});

messaging.onMessage(payload => {
  console.log(JSON.stringify(payload));
  alert("Message received: " + payload.data.default);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
