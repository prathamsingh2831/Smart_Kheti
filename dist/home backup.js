const firebaseConfig = {
  apiKey: "AIzaSyDqvgQod9D6SNvv-A_7cGbwxVdVvR8Js_s",
  authDomain: "smart-kheti-48bc0.firebaseapp.com",
  projectId: "smart-kheti-48bc0",
  storageBucket: "smart-kheti-48bc0.appspot.com",
  messagingSenderId: "1003683066209",
  appId: "1:1003683066209:web:39de1d6b01bac1805ed520",
  measurementId: "G-LR5WFZE7ET"
};

// Firebase JavaScript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(firebaseApp);

let defaultCity = "Bhopal";

auth.onAuthStateChanged(async (user) => {
  if (user) {
      const userSnapshot = await get(ref(db, 'users/' + user.uid));
      const userData = userSnapshot.val();

      if (userData) {
          document.getElementById('msg').innerText = `Hi, ${userData.username}`;
          document.getElementById('greet').innerText = `Weather report of ${userData.location}`;

          defaultCity = userData.location;
          weather.fetchWeather(defaultCity);
      }
  } else {
      window.location.href = 'index.html';
  }
});

const signoutButton = document.getElementById('signoutbutton');
signoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    // Redirect to login page after signout
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Error signing out:", error);
  }
});





const weather = {
  "apikey": "fccce4688f0b1a33452d717c5105f91f",
  
  fetchWeather: function(city) {
      fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
      + city 
      + "&units=metric&appid=" 
      + this.apikey)
      .then((Response) => Response.json())
      .then((data) => this.displayWeather(data))
      .catch((error) => {
          console.error("Error fetching weather:", error);
      });
  },

  displayWeather: function(data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
  },

  search: function() {
    console.log("Search function called");
    const searchCity = document.querySelector(".searchbar").value.trim();
    if (searchCity) {
        this.fetchWeather(searchCity);
    } else {
        console.log("No city entered");
        alert("Please enter a city name.");
    }
}
};

document.getElementById("searchButton").addEventListener("click", function() {
  console.log("Search button clicked");
  weather.search();
});

document.querySelector(".searchbar").addEventListener("keyup", function(event) {
  console.log("Key pressed:", event.key);
  if (event.key == "Enter") {
      weather.search();
  }
});



/////////////////////////////////////////////////////



