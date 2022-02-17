// Variables
const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const weatherIcons = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");
const infoText = inputPart.querySelector(".info-text");
const inputField = inputPart.querySelector("input");
const locationButton = inputPart.querySelector("button");
const apiKey = "6fb42bdeee5a6fe88f72bda6da6b0400";
let api;

const init = () => {
  // Event Listeners
  inputField.addEventListener("keyup", getCity);
  arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
  });
  locationButton.addEventListener("click", getLocation);
  changeColor();
};

// Getting the input value.
const getCity = (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requstApi(inputField.value);
  }
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your device doesn't support location services.");
  }
};

// This api will use device coordinates if user accept the location permission.
const onSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  fetchData();
};

const onError = (error) => {
  infoText.innerText = error.message;
  infoText.classList.add("error");
};

// This api will use user's input.
const requstApi = (city) => {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchData();
};

const fetchData = () => {
  infoText.innerText = "Getting weather information...";
  infoText.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      weatherDetails(data);
    })
    .catch(() => {
      infoText.innerText = "Something went wrong";
      infoText.classList.replace("pending", "error");
    });
};

const weatherDetails = (data) => {
  // If value of the input is not a city registered in the api;
  if (data.cod == "404") {
    infoText.classList.replace("pending", "error");
    infoText.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = data.name;
    const country = data.sys.country;
    const { main, icon } = data.weather[0];
    const { feels_like, humidity, temp } = data.main;
    changeIcons(icon);

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = main;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    infoText.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
    console.log(data);
  }
};

// Replacing the default icons with custom icons. (https://www.amcharts.com/free-animated-svg-weather-icons/)
const changeIcons = (icon) => {
  if (icon == "01d") {
    weatherIcons.src = "icons/day.svg";
  } else if (icon == "01n") {
    weatherIcons.src = "icons/night.svg";
  } else if (icon == "02d") {
    weatherIcons.src = "icons/cloudy-day-1.svg";
  } else if (icon == "02n") {
    weatherIcons.src = "icons/cloudy-night-1.svg";
  } else if (icon == "03d") {
    weatherIcons.src = "icons/cloudy-day-1.svg";
  } else if (icon == "03n") {
    weatherIcons.src = "icons/cloudy-night-1.svg";
  } else if (icon == "04d" || icon == "04n") {
    weatherIcons.src = "icons/cloudy.svg";
  } else if (icon == "09d" || icon == "09n") {
    weatherIcons.src = "icons/rainy-6.svg";
  } else if (icon == "10d") {
    weatherIcons.src = "icons/rainy-2.svg";
  } else if (icon == "10n") {
    weatherIcons.src = "icons/rainy-4.svg";
  } else if (icon == "11d" || icon == "11n") {
    weatherIcons.src = "icons/thunder.svg";
  } else if (icon == "13d" || icon == "13n") {
    weatherIcons.src = "icons/snowy-6.svg";
  } else if (icon == "50d" || icon == "50n") {
    weatherIcons.src = "icons/mist.svg";
  }
};

const setColor = () => {
  const nightColor = document.querySelector(":root");
  nightColor.style.setProperty("--primary-color", "#3c4043");
  nightColor.style.setProperty("--secondary-color", "#202124 ");
};

const changeColor = () => {
  let time = new Date();
  time = time.getHours();
  if (time >= 19 || time <= 7) {
    setColor();
  }
};

window.addEventListener("load", init);
