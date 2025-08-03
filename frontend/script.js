document.getElementById("getWeatherBtn").addEventListener("click", async function () {
  const city = document.getElementById("cityInput").value;

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/weather?city=${city}`);
    const data = await response.json();

    if (data.error) {
      document.getElementById("weatherResult").innerHTML = `<p>${data.error}</p>`;
    } else {
      document.getElementById("weatherResult").innerHTML = `
        <h2>Weather in ${data.city}</h2>
        <p><strong>Temperature:</strong> ${data.temperature}°C</p>
        <p><strong>Description:</strong> ${data.description}</p>
      `;
    }
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>Error fetching weather data</p>`;
    console.error(error);
  }
});
