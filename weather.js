
let envChart = null;

async function getCityCoordinates() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

  try {
    const res = await fetch(geoUrl);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      alert("City not found.");
      return;
    }

    const { latitude, longitude } = data.results[0];
    fetchEnvironmentalData(latitude, longitude);
  } catch (error) {
    console.error("Geocoding Error:", error);
    alert("Failed to fetch location.");
  }
}

async function fetchEnvironmentalData(lat, lon) {
  const apiUrl = `enter your api key`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const hours = data.hourly.time.slice(0, 24).map(t => t.split("T")[1]);
    const soilTemp = data.hourly.soil_temperature_0cm.slice(0, 24);
    const soilMoist = data.hourly.soil_moisture_0_to_1cm.slice(0, 24);
    const windSpeed = data.hourly.wind_speed_10m.slice(0, 24);
    const uvIndex = data.hourly.uv_index.slice(0, 24);

    drawEnvChart(hours, soilTemp, soilMoist, windSpeed, uvIndex);
  } catch (error) {
    console.error("API Error:", error);
    alert("Failed to load environmental data.");
  }
}

function drawEnvChart(labels, temp, moist, wind, uv) {
  const ctx = document.getElementById("envChart").getContext("2d");

  if (envChart) envChart.destroy();

  envChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Soil Temp (°C)',
          data: temp,
          borderColor: '#ff6384',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Soil Moisture (m³/m³)',
          data: moist,
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54,162,235,0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Wind Speed (km/h)',
          data: wind,
          borderColor: '#4bc0c0',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'UV Index',
          data: uv,
          borderColor: '#9966ff',
          backgroundColor: 'rgba(153,102,255,0.2)',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '24-Hour Environmental Monitoring'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (HH:MM)'
          }
        }
      }
    }
  });
}




