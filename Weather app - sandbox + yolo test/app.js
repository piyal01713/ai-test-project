/**
 * Skyline Weather - Core Dashboard Logic
 */

// Fallback Data in case fetch fails (e.g., when opened via file:// protocol)
const FALLBACK_WEATHER_DATA = {
  "cities": [
    {
      "id": "new-york",
      "name": "New York",
      "country": "US",
      "lat": 40.7128,
      "lon": -74.006,
      "timezone": "America/New_York",
      "current": {
        "temp": 24.5,
        "feels_like": 25.1,
        "temp_min": 21.0,
        "temp_max": 27.0,
        "pressure": 1012,
        "humidity": 64,
        "wind_speed": 4.1,
        "wind_deg": 180,
        "weather_state": "Clouds",
        "weather_description": "scattered clouds",
        "icon": "03d",
        "sunrise": 1723197600,
        "sunset": 1723248000,
        "uv_index": 5.8,
        "visibility": 10000,
        "aqi": 2,
        "aqi_description": "Fair"
      },
      "air_quality": {
        "aqi": 2,
        "pm25": 12.5,
        "pm10": 20.1,
        "co": 350.5,
        "no2": 15.2,
        "o3": 65.4,
        "so2": 1.8
      },
      "hourly": [
        { "time": "08:00", "temp": 21.5, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.0 },
        { "time": "09:00", "temp": 22.3, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.2 },
        { "time": "10:00", "temp": 23.1, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 3.5 },
        { "time": "11:00", "temp": 24.0, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 3.8 },
        { "time": "12:00", "temp": 24.5, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 4.1 },
        { "time": "13:00", "temp": 25.2, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 4.3 },
        { "time": "14:00", "temp": 25.8, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.15, "wind_speed": 4.5 },
        { "time": "15:00", "temp": 26.2, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.2, "wind_speed": 4.4 },
        { "time": "16:00", "temp": 25.9, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.65, "wind_speed": 4.2 },
        { "time": "17:00", "temp": 24.8, "weather_state": "Rain", "weather_description": "moderate rain", "icon": "10d", "pop": 0.8, "wind_speed": 4.8 },
        { "time": "18:00", "temp": 23.5, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.6, "wind_speed": 4.0 },
        { "time": "19:00", "temp": 22.9, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04n", "pop": 0.3, "wind_speed": 3.5 },
        { "time": "20:00", "temp": 22.3, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03n", "pop": 0.2, "wind_speed": 3.0 },
        { "time": "21:00", "temp": 21.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.1, "wind_speed": 2.8 },
        { "time": "22:00", "temp": 21.4, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 2.5 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 25.5, "temp_night": 18.0, "temp_min": 17.5, "temp_max": 26.0, "weather_state": "Rain", "weather_description": "moderate rain", "icon": "10d", "pop": 0.85, "uv_index": 4.0, "humidity": 78, "wind_speed": 5.2 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 24.0, "temp_night": 17.0, "temp_min": 16.5, "temp_max": 25.0, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.2, "uv_index": 6.5, "humidity": 60, "wind_speed": 3.9 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 26.8, "temp_night": 19.5, "temp_min": 18.0, "temp_max": 27.5, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.05, "uv_index": 8.0, "humidity": 55, "wind_speed": 3.1 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 28.2, "temp_night": 21.0, "temp_min": 20.0, "temp_max": 29.0, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 8.5, "humidity": 52, "wind_speed": 2.8 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 29.0, "temp_night": 22.0, "temp_min": 21.0, "temp_max": 30.5, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "uv_index": 7.8, "humidity": 58, "wind_speed": 3.4 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 27.5, "temp_night": 20.0, "temp_min": 19.5, "temp_max": 28.5, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.6, "uv_index": 5.0, "humidity": 70, "wind_speed": 4.5 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 25.0, "temp_night": 18.5, "temp_min": 18.0, "temp_max": 26.0, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.25, "uv_index": 6.0, "humidity": 65, "wind_speed": 4.0 }
      ]
    },
    {
      "id": "london",
      "name": "London",
      "country": "GB",
      "lat": 51.5074,
      "lon": -0.1278,
      "timezone": "Europe/London",
      "current": {
        "temp": 17.2,
        "feels_like": 16.8,
        "temp_min": 14.0,
        "temp_max": 19.0,
        "pressure": 1008,
        "humidity": 82,
        "wind_speed": 6.2,
        "wind_deg": 240,
        "weather_state": "Rain",
        "weather_description": "light intensity drizzle",
        "icon": "09d",
        "sunrise": 1723198100,
        "sunset": 1723251500,
        "uv_index": 3.1,
        "visibility": 8000,
        "aqi": 1,
        "aqi_description": "Good"
      },
      "air_quality": {
        "aqi": 1,
        "pm25": 8.2,
        "pm10": 14.5,
        "co": 210.3,
        "no2": 10.1,
        "o3": 45.8,
        "so2": 0.9
      },
      "hourly": [
        { "time": "08:00", "temp": 15.0, "weather_state": "Rain", "weather_description": "light intensity drizzle", "icon": "09d", "pop": 0.8, "wind_speed": 5.5 },
        { "time": "09:00", "temp": 15.5, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.75, "wind_speed": 5.8 },
        { "time": "10:00", "temp": 16.0, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.7, "wind_speed": 6.0 },
        { "time": "11:00", "temp": 16.8, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.4, "wind_speed": 6.2 },
        { "time": "12:00", "temp": 17.2, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.3, "wind_speed": 6.2 },
        { "time": "13:00", "temp": 17.8, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.25, "wind_speed": 6.5 },
        { "time": "14:00", "temp": 18.2, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.2, "wind_speed": 6.4 },
        { "time": "15:00", "temp": 18.5, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.15, "wind_speed": 6.0 },
        { "time": "16:00", "temp": 18.3, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.1, "wind_speed": 5.5 },
        { "time": "17:00", "temp": 17.9, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.05, "wind_speed": 5.2 },
        { "time": "18:00", "temp": 17.1, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 4.8 },
        { "time": "19:00", "temp": 16.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 4.2 },
        { "time": "20:00", "temp": 15.4, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.8 },
        { "time": "21:00", "temp": 14.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.5 },
        { "time": "22:00", "temp": 14.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.2 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 18.0, "temp_night": 13.0, "temp_min": 12.5, "temp_max": 19.0, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.25, "uv_index": 4.5, "humidity": 75, "wind_speed": 5.0 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 19.5, "temp_night": 14.0, "temp_min": 13.0, "temp_max": 20.5, "weather_state": "Clear", "weather_description": "sunny intervals", "icon": "01d", "pop": 0.1, "uv_index": 5.5, "humidity": 68, "wind_speed": 4.2 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 20.8, "temp_night": 15.0, "temp_min": 14.0, "temp_max": 22.0, "weather_state": "Clear", "weather_description": "sunny and warm", "icon": "01d", "pop": 0.0, "uv_index": 6.0, "humidity": 62, "wind_speed": 3.8 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 22.5, "temp_night": 16.2, "temp_min": 15.0, "temp_max": 23.8, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 6.2, "humidity": 58, "wind_speed": 3.5 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 21.0, "temp_night": 15.5, "temp_min": 14.8, "temp_max": 22.5, "weather_state": "Rain", "weather_description": "showers", "icon": "10d", "pop": 0.7, "uv_index": 4.0, "humidity": 72, "wind_speed": 5.8 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 18.5, "temp_night": 13.8, "temp_min": 13.0, "temp_max": 19.5, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.6, "uv_index": 3.8, "humidity": 80, "wind_speed": 5.4 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 19.0, "temp_night": 13.2, "temp_min": 12.8, "temp_max": 20.0, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.15, "uv_index": 5.0, "humidity": 70, "wind_speed": 4.1 }
      ]
    },
    {
      "id": "tokyo",
      "name": "Tokyo",
      "country": "JP",
      "lat": 35.6762,
      "lon": 139.6503,
      "timezone": "Asia/Tokyo",
      "current": {
        "temp": 31.8,
        "feels_like": 36.5,
        "temp_min": 28.0,
        "temp_max": 33.0,
        "pressure": 1009,
        "humidity": 72,
        "wind_speed": 3.6,
        "wind_deg": 190,
        "weather_state": "Clouds",
        "weather_description": "few clouds",
        "icon": "02d",
        "sunrise": 1723156800,
        "sunset": 1723206000,
        "uv_index": 9.5,
        "visibility": 10000,
        "aqi": 3,
        "aqi_description": "Moderate"
      },
      "air_quality": {
        "aqi": 3,
        "pm25": 28.4,
        "pm10": 42.1,
        "co": 420.1,
        "no2": 24.5,
        "o3": 88.2,
        "so2": 3.1
      },
      "hourly": [
        { "time": "08:00", "temp": 28.5, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 2.5 },
        { "time": "09:00", "temp": 29.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 2.8 },
        { "time": "10:00", "temp": 30.5, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 3.1 },
        { "time": "11:00", "temp": 31.2, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 3.4 },
        { "time": "12:00", "temp": 31.8, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "wind_speed": 3.6 },
        { "time": "13:00", "temp": 32.5, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 3.8 },
        { "time": "14:00", "temp": 32.8, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.15, "wind_speed": 4.0 },
        { "time": "15:00", "temp": 32.2, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.2, "wind_speed": 3.9 },
        { "time": "16:00", "temp": 31.5, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.25, "wind_speed": 3.5 },
        { "time": "17:00", "temp": 30.2, "weather_state": "Rain", "weather_description": "sudden heavy shower", "icon": "11d", "pop": 0.6, "wind_speed": 4.2 },
        { "time": "18:00", "temp": 28.9, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.4, "wind_speed": 3.5 },
        { "time": "19:00", "temp": 28.2, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02n", "pop": 0.2, "wind_speed": 3.0 },
        { "time": "20:00", "temp": 27.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.1, "wind_speed": 2.8 },
        { "time": "21:00", "temp": 27.4, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.05, "wind_speed": 2.4 },
        { "time": "22:00", "temp": 27.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 2.0 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 32.0, "temp_night": 26.0, "temp_min": 25.5, "temp_max": 33.0, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "uv_index": 9.8, "humidity": 70, "wind_speed": 3.5 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 33.2, "temp_night": 27.0, "temp_min": 26.0, "temp_max": 34.5, "weather_state": "Clear", "weather_description": "sunny and hot", "icon": "01d", "pop": 0.05, "uv_index": 10.0, "humidity": 65, "wind_speed": 3.2 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 32.5, "temp_night": 26.5, "temp_min": 25.8, "temp_max": 33.8, "weather_state": "Rain", "weather_description": "afternoon thundershower", "icon": "11d", "pop": 0.7, "uv_index": 8.5, "humidity": 78, "wind_speed": 4.8 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 31.0, "temp_night": 25.8, "temp_min": 25.0, "temp_max": 32.0, "weather_state": "Rain", "weather_description": "moderate rain", "icon": "10d", "pop": 0.85, "uv_index": 5.0, "humidity": 82, "wind_speed": 5.2 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 32.2, "temp_night": 26.2, "temp_min": 25.5, "temp_max": 33.0, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.3, "uv_index": 9.0, "humidity": 72, "wind_speed": 3.8 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 33.5, "temp_night": 27.5, "temp_min": 26.8, "temp_max": 35.0, "weather_state": "Clear", "weather_description": "sunny and hot", "icon": "01d", "pop": 0.1, "uv_index": 10.0, "humidity": 60, "wind_speed": 3.0 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 34.0, "temp_night": 28.0, "temp_min": 27.2, "temp_max": 35.5, "weather_state": "Clear", "weather_description": "sunny and hot", "icon": "01d", "pop": 0.05, "uv_index": 10.0, "humidity": 58, "wind_speed": 2.9 }
      ]
    },
    {
      "id": "paris",
      "name": "Paris",
      "country": "FR",
      "lat": 48.8566,
      "lon": 2.3522,
      "timezone": "Europe/Paris",
      "current": {
        "temp": 22.0,
        "feels_like": 21.8,
        "temp_min": 18.0,
        "temp_max": 24.0,
        "pressure": 1015,
        "humidity": 58,
        "wind_speed": 3.6,
        "wind_deg": 280,
        "weather_state": "Clear",
        "weather_description": "clear sky",
        "icon": "01d",
        "sunrise": 1723196900,
        "sunset": 1723250200,
        "uv_index": 6.2,
        "visibility": 10000,
        "aqi": 2,
        "aqi_description": "Fair"
      },
      "air_quality": {
        "aqi": 2,
        "pm25": 14.1,
        "pm10": 22.8,
        "co": 290.8,
        "no2": 18.6,
        "o3": 72.1,
        "so2": 1.2
      },
      "hourly": [
        { "time": "08:00", "temp": 18.5, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 2.8 },
        { "time": "09:00", "temp": 19.4, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.0 },
        { "time": "10:00", "temp": 20.5, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.2 },
        { "time": "11:00", "temp": 21.3, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.5 },
        { "time": "12:00", "temp": 22.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.05, "wind_speed": 3.6 },
        { "time": "13:00", "temp": 22.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.05, "wind_speed": 3.8 },
        { "time": "14:00", "temp": 23.4, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "wind_speed": 4.0 },
        { "time": "15:00", "temp": 23.9, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "wind_speed": 3.9 },
        { "time": "16:00", "temp": 23.7, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "wind_speed": 3.5 },
        { "time": "17:00", "temp": 23.1, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.05, "wind_speed": 3.2 },
        { "time": "18:00", "temp": 22.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01d", "pop": 0.0, "wind_speed": 3.0 },
        { "time": "19:00", "temp": 21.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 2.6 },
        { "time": "20:00", "temp": 19.8, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 2.2 },
        { "time": "21:00", "temp": 18.9, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 2.0 },
        { "time": "22:00", "temp": 18.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 1.8 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 23.0, "temp_night": 16.5, "temp_min": 15.5, "temp_max": 24.0, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 7.0, "humidity": 55, "wind_speed": 3.5 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 24.8, "temp_night": 17.5, "temp_min": 16.0, "temp_max": 26.0, "weather_state": "Clear", "weather_description": "sunny and warm", "icon": "01d", "pop": 0.0, "uv_index": 7.2, "humidity": 52, "wind_speed": 3.2 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 26.5, "temp_night": 19.0, "temp_min": 18.0, "temp_max": 28.0, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "uv_index": 7.5, "humidity": 50, "wind_speed": 3.0 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 28.0, "temp_night": 20.2, "temp_min": 19.0, "temp_max": 29.5, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "uv_index": 7.8, "humidity": 54, "wind_speed": 3.4 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 29.2, "temp_night": 21.0, "temp_min": 20.0, "temp_max": 31.0, "weather_state": "Rain", "weather_description": "thundershowers", "icon": "11d", "pop": 0.65, "uv_index": 6.8, "humidity": 68, "wind_speed": 4.8 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 25.0, "temp_night": 17.8, "temp_min": 17.0, "temp_max": 26.5, "weather_state": "Rain", "weather_description": "light rain showers", "icon": "10d", "pop": 0.4, "uv_index": 5.5, "humidity": 70, "wind_speed": 4.2 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 24.2, "temp_night": 16.5, "temp_min": 15.8, "temp_max": 25.0, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.1, "uv_index": 6.5, "humidity": 60, "wind_speed": 3.8 }
      ]
    },
    {
      "id": "sydney",
      "name": "Sydney",
      "country": "AU",
      "lat": -33.8688,
      "lon": 151.2093,
      "timezone": "Australia/Sydney",
      "current": {
        "temp": 14.5,
        "feels_like": 13.8,
        "temp_min": 11.0,
        "temp_max": 17.0,
        "pressure": 1022,
        "humidity": 68,
        "wind_speed": 5.5,
        "wind_deg": 150,
        "weather_state": "Clouds",
        "weather_description": "broken clouds",
        "icon": "04d",
        "sunrise": 1723149800,
        "sunset": 1723188200,
        "uv_index": 2.5,
        "visibility": 10000,
        "aqi": 1,
        "aqi_description": "Good"
      },
      "air_quality": {
        "aqi": 1,
        "pm25": 6.4,
        "pm10": 11.2,
        "co": 180.4,
        "no2": 8.5,
        "o3": 38.2,
        "so2": 0.5
      },
      "hourly": [
        { "time": "08:00", "temp": 11.8, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 4.5 },
        { "time": "09:00", "temp": 12.5, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.05, "wind_speed": 4.8 },
        { "time": "10:00", "temp": 13.2, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 5.0 },
        { "time": "11:00", "temp": 13.9, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 5.2 },
        { "time": "12:00", "temp": 14.5, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.15, "wind_speed": 5.5 },
        { "time": "13:00", "temp": 14.9, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.2, "wind_speed": 5.8 },
        { "time": "14:00", "temp": 15.2, "weather_state": "Clouds", "weather_description": "overcast clouds", "icon": "04d", "pop": 0.2, "wind_speed": 6.0 },
        { "time": "15:00", "temp": 15.0, "weather_state": "Clouds", "weather_description": "overcast clouds", "icon": "04d", "pop": 0.25, "wind_speed": 5.9 },
        { "time": "16:00", "temp": 14.6, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.2, "wind_speed": 5.4 },
        { "time": "17:00", "temp": 14.0, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04d", "pop": 0.15, "wind_speed": 5.0 },
        { "time": "18:00", "temp": 13.4, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03d", "pop": 0.1, "wind_speed": 4.5 },
        { "time": "19:00", "temp": 12.8, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02n", "pop": 0.05, "wind_speed": 4.1 },
        { "time": "20:00", "temp": 12.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.8 },
        { "time": "21:00", "temp": 11.7, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.4 },
        { "time": "22:00", "temp": 11.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.0 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 16.2, "temp_night": 10.5, "temp_min": 10.0, "temp_max": 17.5, "weather_state": "Clouds", "weather_description": "partly cloudy", "icon": "03d", "pop": 0.1, "uv_index": 3.0, "humidity": 65, "wind_speed": 4.8 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 17.0, "temp_night": 11.0, "temp_min": 10.2, "temp_max": 18.0, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 4.0, "humidity": 60, "wind_speed": 4.0 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 18.5, "temp_night": 12.0, "temp_min": 11.0, "temp_max": 19.5, "weather_state": "Clear", "weather_description": "mostly sunny", "icon": "01d", "pop": 0.0, "uv_index": 4.2, "humidity": 58, "wind_speed": 3.5 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 19.2, "temp_night": 13.0, "temp_min": 12.0, "temp_max": 20.5, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 4.5, "humidity": 55, "wind_speed": 3.8 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 17.8, "temp_night": 11.5, "temp_min": 11.0, "temp_max": 18.8, "weather_state": "Rain", "weather_description": "showers early", "icon": "10d", "pop": 0.7, "uv_index": 3.2, "humidity": 75, "wind_speed": 6.2 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 16.0, "temp_night": 10.0, "temp_min": 9.5, "temp_max": 16.8, "weather_state": "Rain", "weather_description": "windy with showers", "icon": "09d", "pop": 0.8, "uv_index": 2.8, "humidity": 80, "wind_speed": 7.5 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 15.5, "temp_night": 9.2, "temp_min": 8.8, "temp_max": 16.2, "weather_state": "Clouds", "weather_description": "clearing clouds", "icon": "02d", "pop": 0.2, "uv_index": 3.5, "humidity": 68, "wind_speed": 5.0 }
      ]
    },
    {
      "id": "cairo",
      "name": "Cairo",
      "country": "EG",
      "lat": 30.0444,
      "lon": 31.2357,
      "timezone": "Africa/Cairo",
      "current": {
        "temp": 36.8,
        "feels_like": 38.2,
        "temp_min": 31.0,
        "temp_max": 39.0,
        "pressure": 1007,
        "humidity": 35,
        "wind_speed": 5.1,
        "wind_deg": 350,
        "weather_state": "Clear",
        "weather_description": "sunny",
        "icon": "01d",
        "sunrise": 1723182600,
        "sunset": 1723232100,
        "uv_index": 11.0,
        "visibility": 10000,
        "aqi": 4,
        "aqi_description": "Poor"
      },
      "air_quality": {
        "aqi": 4,
        "pm25": 58.6,
        "pm10": 98.4,
        "co": 680.2,
        "no2": 35.1,
        "o3": 112.5,
        "so2": 6.8
      },
      "hourly": [
        { "time": "08:00", "temp": 31.5, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 3.8 },
        { "time": "09:00", "temp": 33.2, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 4.1 },
        { "time": "10:00", "temp": 34.8, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 4.5 },
        { "time": "11:00", "temp": 35.9, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 4.8 },
        { "time": "12:00", "temp": 36.8, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 5.1 },
        { "time": "13:00", "temp": 37.5, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 5.4 },
        { "time": "14:00", "temp": 38.1, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 5.6 },
        { "time": "15:00", "temp": 38.4, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 5.5 },
        { "time": "16:00", "temp": 38.0, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 5.2 },
        { "time": "17:00", "temp": 37.1, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 4.8 },
        { "time": "18:00", "temp": 35.8, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "wind_speed": 4.5 },
        { "time": "19:00", "temp": 34.2, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 4.0 },
        { "time": "20:00", "temp": 33.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.6 },
        { "time": "21:00", "temp": 32.1, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.3 },
        { "time": "22:00", "temp": 31.4, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 3.0 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 37.0, "temp_night": 26.0, "temp_min": 25.0, "temp_max": 38.0, "weather_state": "Clear", "weather_description": "sunny and clear", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 38, "wind_speed": 5.0 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 37.5, "temp_night": 26.5, "temp_min": 25.5, "temp_max": 38.5, "weather_state": "Clear", "weather_description": "sunny and hot", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 35, "wind_speed": 4.8 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 38.2, "temp_night": 27.0, "temp_min": 26.0, "temp_max": 39.2, "weather_state": "Clear", "weather_description": "very hot and sunny", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 33, "wind_speed": 5.2 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 38.8, "temp_night": 27.5, "temp_min": 26.5, "temp_max": 40.0, "weather_state": "Clear", "weather_description": "sunny and extreme heat", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 30, "wind_speed": 5.5 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 38.5, "temp_night": 27.0, "temp_min": 26.2, "temp_max": 39.5, "weather_state": "Clear", "weather_description": "sunny and very hot", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 32, "wind_speed": 5.0 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 37.2, "temp_night": 26.0, "temp_min": 25.0, "temp_max": 38.0, "weather_state": "Clear", "weather_description": "sunny", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 36, "wind_speed": 4.5 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 36.8, "temp_night": 25.5, "temp_min": 24.8, "temp_max": 37.5, "weather_state": "Clear", "weather_description": "sunny and clear", "icon": "01d", "pop": 0.0, "uv_index": 11.0, "humidity": 40, "wind_speed": 4.2 }
      ]
    },
    {
      "id": "reykjavik",
      "name": "Reykjavik",
      "country": "IS",
      "lat": 64.1466,
      "lon": -21.9426,
      "timezone": "Atlantic/Reykjavik",
      "current": {
        "temp": 11.2,
        "feels_like": 9.5,
        "temp_min": 8.0,
        "temp_max": 13.0,
        "pressure": 1004,
        "humidity": 88,
        "wind_speed": 8.5,
        "wind_deg": 90,
        "weather_state": "Rain",
        "weather_description": "rain",
        "icon": "10d",
        "sunrise": 1723181000,
        "sunset": 1723243000,
        "uv_index": 1.2,
        "visibility": 6000,
        "aqi": 1,
        "aqi_description": "Good"
      },
      "air_quality": {
        "aqi": 1,
        "pm25": 3.1,
        "pm10": 5.8,
        "co": 110.2,
        "no2": 4.1,
        "o3": 52.4,
        "so2": 0.4
      },
      "hourly": [
        { "time": "08:00", "temp": 9.5, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.65, "wind_speed": 7.2 },
        { "time": "09:00", "temp": 9.8, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.7, "wind_speed": 7.5 },
        { "time": "10:00", "temp": 10.2, "weather_state": "Rain", "weather_description": "rain", "icon": "10d", "pop": 0.8, "wind_speed": 7.8 },
        { "time": "11:00", "temp": 10.8, "weather_state": "Rain", "weather_description": "moderate rain", "icon": "10d", "pop": 0.85, "wind_speed": 8.2 },
        { "time": "12:00", "temp": 11.2, "weather_state": "Rain", "weather_description": "rain", "icon": "10d", "pop": 0.9, "wind_speed": 8.5 },
        { "time": "13:00", "temp": 11.5, "weather_state": "Rain", "weather_description": "heavy rain", "icon": "09d", "pop": 0.95, "wind_speed": 9.0 },
        { "time": "14:00", "temp": 11.8, "weather_state": "Rain", "weather_description": "heavy rain", "icon": "09d", "pop": 0.95, "wind_speed": 9.2 },
        { "time": "15:00", "temp": 12.0, "weather_state": "Rain", "weather_description": "rain", "icon": "10d", "pop": 0.85, "wind_speed": 8.8 },
        { "time": "16:00", "temp": 11.7, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.75, "wind_speed": 8.0 },
        { "time": "17:00", "temp": 11.2, "weather_state": "Clouds", "weather_description": "overcast clouds", "icon": "04d", "pop": 0.5, "wind_speed": 7.5 },
        { "time": "18:00", "temp": 10.8, "weather_state": "Clouds", "weather_description": "overcast clouds", "icon": "04d", "pop": 0.4, "wind_speed": 6.8 },
        { "time": "19:00", "temp": 10.2, "weather_state": "Clouds", "weather_description": "broken clouds", "icon": "04n", "pop": 0.3, "wind_speed": 6.2 },
        { "time": "20:00", "temp": 9.8, "weather_state": "Clouds", "weather_description": "scattered clouds", "icon": "03n", "pop": 0.2, "wind_speed": 5.8 },
        { "time": "21:00", "temp": 9.4, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02n", "pop": 0.1, "wind_speed": 5.5 },
        { "time": "22:00", "temp": 9.0, "weather_state": "Clear", "weather_description": "clear sky", "icon": "01n", "pop": 0.0, "wind_speed": 5.0 }
      ],
      "daily": [
        { "day": "Monday", "date": "2026-08-10", "temp_day": 12.0, "temp_night": 8.0, "temp_min": 7.5, "temp_max": 13.0, "weather_state": "Rain", "weather_description": "showers", "icon": "10d", "pop": 0.8, "uv_index": 1.5, "humidity": 85, "wind_speed": 7.8 },
        { "day": "Tuesday", "date": "2026-08-11", "temp_day": 12.5, "temp_night": 7.5, "temp_min": 7.0, "temp_max": 13.5, "weather_state": "Clouds", "weather_description": "overcast", "icon": "04d", "pop": 0.4, "uv_index": 2.0, "humidity": 78, "wind_speed": 6.0 },
        { "day": "Wednesday", "date": "2026-08-12", "temp_day": 13.2, "temp_night": 8.5, "temp_min": 8.0, "temp_max": 14.0, "weather_state": "Clear", "weather_description": "sunny intervals", "icon": "01d", "pop": 0.1, "uv_index": 3.0, "humidity": 70, "wind_speed": 4.5 },
        { "day": "Thursday", "date": "2026-08-13", "temp_day": 14.0, "temp_night": 9.0, "temp_min": 8.2, "temp_max": 15.0, "weather_state": "Clear", "weather_description": "mostly sunny", "icon": "01d", "pop": 0.05, "uv_index": 3.2, "humidity": 65, "wind_speed": 3.8 },
        { "day": "Friday", "date": "2026-08-14", "temp_day": 13.0, "temp_night": 8.2, "temp_min": 7.8, "temp_max": 13.8, "weather_state": "Clouds", "weather_description": "few clouds", "icon": "02d", "pop": 0.2, "uv_index": 2.5, "humidity": 72, "wind_speed": 5.2 },
        { "day": "Saturday", "date": "2026-08-15", "temp_day": 11.5, "temp_night": 7.0, "temp_min": 6.5, "temp_max": 12.0, "weather_state": "Rain", "weather_description": "light rain", "icon": "10d", "pop": 0.7, "uv_index": 1.8, "humidity": 82, "wind_speed": 6.8 },
        { "day": "Sunday", "date": "2026-08-16", "temp_day": 10.8, "temp_night": 6.2, "temp_min": 5.8, "temp_max": 11.2, "weather_state": "Rain", "weather_description": "rain", "icon": "09d", "pop": 0.85, "uv_index": 1.2, "humidity": 88, "wind_speed": 8.0 }
      ]
    }
  ]
};

// Global App State
let weatherData = null;
let activeCity = null;
let appTheme = 'dark';
let appUnit = 'C';
let favorites = ['new-york', 'london', 'tokyo'];
let timeInterval = null;
let searchSuggestionsList = [];
let searchSelectedIndex = -1;
let hourlyChartInstance = null;

// DOM Cache
const dom = {
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  searchSuggestions: document.getElementById('search-suggestions'),
  celsiusBtn: document.getElementById('celsius-btn'),
  fahrenheitBtn: document.getElementById('fahrenheit-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  favoritesList: document.getElementById('favorites-list'),
  favoritesCount: document.getElementById('favorites-count'),
  mainContent: document.getElementById('main-content'),
  
  // Hero Elements
  heroCard: document.getElementById('hero-card'),
  heroDate: document.getElementById('hero-date'),
  heroCityName: document.getElementById('hero-city-name'),
  heroTemp: document.getElementById('hero-temp'),
  heroDesc: document.getElementById('hero-desc'),
  heroHighLow: document.getElementById('hero-high-low'),
  heroFeelsLike: document.getElementById('hero-feels-like'),
  heroIcon: document.getElementById('hero-icon'),
  heroFavoriteBtn: document.getElementById('hero-favorite-btn'),
  
  // Metrics Elements
  uvIndexVal: document.getElementById('uv-index-val'),
  uvIndexLevel: document.getElementById('uv-index-level'),
  uvIndexBar: document.getElementById('uv-index-bar'),
  
  windSpeedVal: document.getElementById('wind-speed-val'),
  windDegVal: document.getElementById('wind-deg-val'),
  compassNeedle: document.getElementById('compass-needle'),
  
  aqiVal: document.getElementById('aqi-val'),
  aqiDesc: document.getElementById('aqi-desc'),
  aqiBar: document.getElementById('aqi-bar'),
  pm25Val: document.getElementById('pm25-val'),
  pm10Val: document.getElementById('pm10-val'),
  coVal: document.getElementById('co-val'),
  no2Val: document.getElementById('no2-val'),
  o3Val: document.getElementById('o3-val'),
  so2Val: document.getElementById('so2-val'),
  
  sunriseVal: document.getElementById('sunrise-val'),
  sunsetVal: document.getElementById('sunset-val'),
  solarArcElapsed: document.getElementById('solar-arc-elapsed'),
  solarSunIndicator: document.getElementById('solar-sun-indicator'),
  
  humidityVal: document.getElementById('humidity-val'),
  humidityRing: document.getElementById('humidity-ring'),
  humidityGaugeCenter: document.getElementById('humidity-gauge-center'),
  
  pressureVal: document.getElementById('pressure-val'),
  visibilityVal: document.getElementById('visibility-val'),
  
  dailyForecastList: document.getElementById('daily-forecast-list'),
  
  // Modal Elements
  dailyDetailModal: document.getElementById('daily-detail-modal'),
  modalClose: document.getElementById('modal-close'),
  modalBox: document.getElementById('modal-box'),
  modalDayName: document.getElementById('modal-day-name'),
  modalDayDate: document.getElementById('modal-day-date'),
  modalDayIcon: document.getElementById('modal-day-icon'),
  modalDayDesc: document.getElementById('modal-day-desc'),
  modalTempMax: document.getElementById('modal-temp-max'),
  modalTempMin: document.getElementById('modal-temp-min'),
  modalPop: document.getElementById('modal-pop'),
  modalWind: document.getElementById('modal-wind'),
  modalHumidity: document.getElementById('modal-humidity'),
  modalUv: document.getElementById('modal-uv')
};

// Weather State Icon Dictionary (returns HTML for Lucide icon)
const WEATHER_ICONS = {
  sun: '<i data-lucide="sun" class="w-12 h-12"></i>',
  cloud: '<i data-lucide="cloud" class="w-12 h-12"></i>',
  'cloud-rain': '<i data-lucide="cloud-rain" class="w-12 h-12"></i>',
  'cloud-drizzle': '<i data-lucide="cloud-drizzle" class="w-12 h-12"></i>',
  'cloud-lightning': '<i data-lucide="cloud-lightning" class="w-12 h-12"></i>',
  'snowflake': '<i data-lucide="snowflake" class="w-12 h-12"></i>',
  'cloud-fog': '<i data-lucide="cloud-fog" class="w-12 h-12"></i>'
};

const WEATHER_ICONS_HERO = {
  sun: '<i data-lucide="sun" class="w-24 h-24 stroke-[1.5]"></i>',
  cloud: '<i data-lucide="cloud" class="w-24 h-24 stroke-[1.5]"></i>',
  'cloud-rain': '<i data-lucide="cloud-rain" class="w-24 h-24 stroke-[1.5]"></i>',
  'cloud-drizzle': '<i data-lucide="cloud-drizzle" class="w-24 h-24 stroke-[1.5]"></i>',
  'cloud-lightning': '<i data-lucide="cloud-lightning" class="w-24 h-24 stroke-[1.5]"></i>',
  'snowflake': '<i data-lucide="snowflake" class="w-24 h-24 stroke-[1.5]"></i>',
  'cloud-fog': '<i data-lucide="cloud-fog" class="w-24 h-24 stroke-[1.5]"></i>'
};

// Start the Dashboard
window.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load State from LocalStorage
  loadState();

  // Load Data
  try {
    const response = await fetch('weather_data.json');
    if (!response.ok) throw new Error('Network error loading database');
    weatherData = await response.json();
  } catch (error) {
    console.warn('Could not fetch weather_data.json. Falling back to embedded mock database. Error:', error);
    weatherData = FALLBACK_WEATHER_DATA;
  }

  // Set Active City object
  const cachedActiveCityId = localStorage.getItem('skyline_active_city_id') || 'new-york';
  activeCity = weatherData.cities.find(c => c.id === cachedActiveCityId) || weatherData.cities[0];

  // Set Event Listeners
  setupEventListeners();

  // Apply visual theme state
  applyTheme();
  
  // Render Everything
  renderAll();

  // Start Clock Interval
  startClock();
}

function loadState() {
  if (localStorage.getItem('skyline_theme')) {
    appTheme = localStorage.getItem('skyline_theme');
  } else {
    // Detect system preference
    appTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  if (localStorage.getItem('skyline_unit')) {
    appUnit = localStorage.getItem('skyline_unit');
  }
  
  if (localStorage.getItem('skyline_favorites')) {
    favorites = JSON.parse(localStorage.getItem('skyline_favorites'));
  }
}

function saveState() {
  localStorage.setItem('skyline_theme', appTheme);
  localStorage.setItem('skyline_unit', appUnit);
  localStorage.setItem('skyline_favorites', JSON.stringify(favorites));
  if (activeCity) {
    localStorage.setItem('skyline_active_city_id', activeCity.id);
  }
}

function setupEventListeners() {
  // Theme Toggle
  dom.themeToggle.addEventListener('click', () => {
    appTheme = appTheme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
    // Chart color updates
    renderChart();
  });

  // Unit Toggles
  dom.celsiusBtn.addEventListener('click', () => {
    if (appUnit !== 'C') {
      appUnit = 'C';
      saveState();
      updateUnitButtons();
      renderAll();
    }
  });

  dom.fahrenheitBtn.addEventListener('click', () => {
    if (appUnit !== 'F') {
      appUnit = 'F';
      saveState();
      updateUnitButtons();
      renderAll();
    }
  });

  // Search Input handlers
  dom.searchInput.addEventListener('input', handleSearchInput);
  dom.searchInput.addEventListener('keydown', handleSearchKeydown);
  dom.searchInput.addEventListener('focus', () => {
    if (dom.searchInput.value.trim().length > 0) {
      dom.searchSuggestions.classList.remove('hidden');
    }
  });
  
  // Clear search button
  dom.searchClear.addEventListener('click', () => {
    dom.searchInput.value = '';
    dom.searchSuggestions.innerHTML = '';
    dom.searchSuggestions.classList.add('hidden');
    dom.searchClear.classList.add('hidden');
    dom.searchInput.focus();
  });

  // Click outside search suggestion dropdown close
  document.addEventListener('click', (e) => {
    if (!dom.searchInput.contains(e.target) && !dom.searchSuggestions.contains(e.target)) {
      dom.searchSuggestions.classList.add('hidden');
    }
  });

  // Hero Favorite Pin button
  dom.heroFavoriteBtn.addEventListener('click', toggleFavorite);

  // Close daily forecast modal
  dom.modalClose.addEventListener('click', closeDailyModal);
  dom.dailyDetailModal.addEventListener('click', (e) => {
    if (e.target === dom.dailyDetailModal) closeDailyModal();
  });
}

function applyTheme() {
  if (appTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function updateUnitButtons() {
  if (appUnit === 'C') {
    dom.celsiusBtn.className = "px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300 bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white";
    dom.fahrenheitBtn.className = "px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200";
  } else {
    dom.fahrenheitBtn.className = "px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300 bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white";
    dom.celsiusBtn.className = "px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200";
  }
}

function startClock() {
  if (timeInterval) clearInterval(timeInterval);
  updateClock();
  timeInterval = setInterval(updateClock, 1000);
}

function updateClock() {
  if (!activeCity) return;
  
  // Format local date and time using target timezone
  const options = {
    timeZone: activeCity.timezone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  try {
    const formatted = new Intl.DateTimeFormat('en-US', options).format(new Date());
    dom.heroDate.textContent = formatted;
    
    // Periodically update solar arc progress to track live
    updateSolarArc();
  } catch (e) {
    console.error("Invalid timezone:", activeCity.timezone, e);
    dom.heroDate.textContent = new Date().toLocaleString();
  }
}

// Global renderings
function renderAll() {
  updateUnitButtons();
  renderDashboard();
  renderFavorites();
  renderDailyForecast();
  lucide.createIcons();
}

function changeActiveCity(cityId) {
  const city = weatherData.cities.find(c => c.id === cityId);
  if (!city) return;
  
  activeCity = city;
  saveState();
  
  // Smooth page transition trigger
  dom.mainContent.classList.remove('fade-in');
  void dom.mainContent.offsetWidth; // Trigger reflow
  dom.mainContent.classList.add('fade-in');
  
  // Close any popups
  toggleAqiDetails(false);
  
  renderAll();
  startClock();
}

// ----------------------------------------------------
// UI Render functions
// ----------------------------------------------------

function renderDashboard() {
  if (!activeCity) return;
  const current = activeCity.current;
  
  // 1. Weather Theme Gradient classes update
  const weatherState = current.weather_state.toLowerCase();
  dom.heroCard.className = dom.heroCard.className.replace(/hero-\w+/g, '');
  if (weatherState.includes('clear')) dom.heroCard.classList.add('hero-clear');
  else if (weatherState.includes('thunder') || weatherState.includes('storm')) dom.heroCard.classList.add('hero-storm');
  else if (weatherState.includes('drizzle')) dom.heroCard.classList.add('hero-drizzle');
  else if (weatherState.includes('rain')) dom.heroCard.classList.add('hero-rain');
  else dom.heroCard.classList.add('hero-clouds');

  // 2. Hero Weather Stats
  dom.heroCityName.textContent = `${activeCity.name}, ${activeCity.country}`;
  dom.heroTemp.textContent = formatTemp(current.temp, appUnit);
  dom.heroDesc.textContent = current.weather_description;
  dom.heroFeelsLike.textContent = formatTempPrecision(current.feels_like, appUnit);
  dom.heroHighLow.textContent = `H: ${formatTemp(current.temp_max, appUnit)}° L: ${formatTemp(current.temp_min, appUnit)}°`;
  
  // Hero Weather Icon
  const iconName = getWeatherIconName(current.weather_state);
  dom.heroIcon.innerHTML = WEATHER_ICONS_HERO[iconName] || WEATHER_ICONS_HERO['cloud'];

  // Pin star state
  const isFav = favorites.includes(activeCity.id);
  const favIcon = dom.heroFavoriteBtn.querySelector('i');
  if (isFav) {
    favIcon.className = "w-5 h-5 text-amber-500 fill-amber-500 transition-colors";
    favIcon.setAttribute('data-lucide', 'star');
  } else {
    favIcon.className = "w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors";
    favIcon.setAttribute('data-lucide', 'star');
  }

  // 3. Metrics Cards
  // UV Index
  dom.uvIndexVal.textContent = current.uv_index.toFixed(1);
  const uvLevel = getUvCategory(current.uv_index);
  dom.uvIndexLevel.textContent = uvLevel.name;
  dom.uvIndexLevel.className = `text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${uvLevel.color}`;
  
  // Position UV Index Slider
  const uvPercent = Math.min((current.uv_index / 12) * 100, 100);
  dom.uvIndexBar.style.left = `${uvPercent}%`;

  // Wind
  if (appUnit === 'C') {
    dom.windSpeedVal.textContent = `${current.wind_speed.toFixed(1)} m/s`;
  } else {
    const windSpeedMph = current.wind_speed * 2.23694;
    dom.windSpeedVal.textContent = `${windSpeedMph.toFixed(1)} mph`;
  }
  dom.windDegVal.textContent = `${current.wind_deg}° ${getWindDirection(current.wind_deg)}`;
  dom.compassNeedle.style.transform = `rotate(${current.wind_deg}deg)`;

  // AQI
  dom.aqiVal.textContent = current.aqi;
  dom.aqiDesc.textContent = current.aqi_description;
  const aqiColors = ['bg-emerald-500', 'bg-emerald-400', 'bg-amber-400', 'bg-orange-500', 'bg-red-500'];
  dom.aqiDesc.className = `text-xs font-bold ml-2 ${current.aqi <= 2 ? 'text-emerald-500 dark:text-emerald-400' : current.aqi === 3 ? 'text-amber-500' : 'text-red-500'}`;
  
  // AQI Bar progress
  const aqiPercent = (current.aqi / 5) * 100;
  dom.aqiBar.style.width = `${aqiPercent}%`;
  dom.aqiBar.className = `h-full rounded-full transition-all duration-500 ${aqiColors[current.aqi - 1] || 'bg-emerald-500'}`;

  // AQI Particulates
  dom.pm25Val.textContent = activeCity.air_quality.pm25;
  dom.pm10Val.textContent = activeCity.air_quality.pm10;
  dom.coVal.textContent = activeCity.air_quality.co;
  dom.no2Val.textContent = activeCity.air_quality.no2;
  dom.o3Val.textContent = activeCity.air_quality.o3;
  dom.so2Val.textContent = activeCity.air_quality.so2;

  // Sunrise/Sunset Times
  dom.sunriseVal.textContent = new Date(current.sunrise * 1000).toLocaleTimeString('en-US', { timeZone: activeCity.timezone, hour: 'numeric', minute: '2-digit' });
  dom.sunsetVal.textContent = new Date(current.sunset * 1000).toLocaleTimeString('en-US', { timeZone: activeCity.timezone, hour: 'numeric', minute: '2-digit' });
  updateSolarArc();

  // Humidity
  dom.humidityVal.textContent = current.humidity;
  const strokeOffset = 251.2 - (current.humidity / 100) * 251.2;
  dom.humidityRing.style.strokeDashoffset = strokeOffset;
  dom.humidityGaugeCenter.textContent = `${current.humidity}%`;

  // Pressure & Visibility
  dom.pressureVal.textContent = `${current.pressure} hPa`;
  if (appUnit === 'C') {
    dom.visibilityVal.textContent = `${(current.visibility / 1000).toFixed(0)} km`;
  } else {
    dom.visibilityVal.textContent = `${(current.visibility / 1609.34).toFixed(1)} mi`;
  }

  // 4. Render Chart
  renderChart();
}

function renderFavorites() {
  dom.favoritesCount.textContent = favorites.length;
  
  if (favorites.length === 0) {
    dom.favoritesList.innerHTML = `
      <div class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs italic w-full border border-dashed border-slate-300 dark:border-white/10 rounded-2xl">
        No pinned cities yet. Use search to pin cities.
      </div>
    `;
    return;
  }
  
  dom.favoritesList.innerHTML = '';
  
  favorites.forEach(favId => {
    const city = weatherData.cities.find(c => c.id === favId);
    if (!city) return;
    
    const iconName = getWeatherIconName(city.current.weather_state);
    const activeClass = activeCity.id === city.id 
      ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 border-transparent bg-white/60 dark:bg-slate-900/60' 
      : 'border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/20';

    const card = document.createElement('div');
    card.className = `glass-card ${activeClass} rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 relative select-none shrink-0 w-52 lg:w-full`;
    card.setAttribute('onclick', `changeActiveCity('${city.id}')`);
    
    card.innerHTML = `
      <div class="flex items-center gap-2.5">
        <div class="text-indigo-500 dark:text-indigo-400 shrink-0">
          ${WEATHER_ICONS[iconName] || WEATHER_ICONS['cloud']}
        </div>
        <div class="truncate">
          <p class="font-extrabold text-xs text-slate-800 dark:text-white truncate">${city.name}</p>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">${city.country} • ${city.current.weather_state}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-sm text-slate-700 dark:text-indigo-200">
          ${formatTemp(city.current.temp, appUnit)}°
        </span>
        <button 
          class="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
          onclick="event.stopPropagation(); removeFavorite('${city.id}')"
          aria-label="Remove favorite"
        >
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
    dom.favoritesList.appendChild(card);
  });
}

function renderDailyForecast() {
  if (!activeCity) return;
  dom.dailyForecastList.innerHTML = '';
  
  activeCity.daily.forEach((day, index) => {
    const iconName = getWeatherIconName(day.weather_state);
    
    // Parse short date format e.g. "Aug 10"
    const parsedDate = new Date(day.date);
    const formattedDate = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const row = document.createElement('div');
    row.className = "glass-card rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer hover:translate-x-1 select-none";
    row.setAttribute('onclick', `openDailyModal(${index})`);
    
    row.innerHTML = `
      <div class="flex items-center gap-2.5 w-1/3">
        <div class="text-indigo-500 dark:text-indigo-400 shrink-0">
          ${WEATHER_ICONS[iconName] || WEATHER_ICONS['cloud']}
        </div>
        <div>
          <p class="text-xs font-extrabold text-slate-800 dark:text-white">${day.day}</p>
          <p class="text-[9px] text-slate-400 font-bold">${formattedDate}</p>
        </div>
      </div>
      
      <div class="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 w-1/4">
        ${day.pop > 0 ? `<span>💧 ${(day.pop * 100).toFixed(0)}%</span>` : `<span class="opacity-30">💧 0%</span>`}
      </div>
      
      <div class="flex items-center justify-end gap-2 text-right w-5/12">
        <span class="text-xs font-extrabold text-slate-800 dark:text-white">
          ${formatTemp(day.temp_max, appUnit)}°
        </span>
        <span class="text-[10px] font-bold text-slate-400">
          / ${formatTemp(day.temp_min, appUnit)}°
        </span>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600"></i>
      </div>
    `;
    
    dom.dailyForecastList.appendChild(row);
  });
}

// ----------------------------------------------------
// Weather detail helpers
// ----------------------------------------------------

function updateSolarArc() {
  if (!activeCity) return;
  
  const current = activeCity.current;
  const timezone = activeCity.timezone;
  
  // Calculate relative solar position using local time minutes since midnight
  try {
    // 1. Sunrise/Sunset times convert to Date
    const sunriseDate = new Date(current.sunrise * 1000);
    const sunriseTimeStr = sunriseDate.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
    const [srHour, srMin] = sunriseTimeStr.split(':').map(Number);
    const sunriseMinOffset = srHour * 60 + srMin;
    
    const sunsetDate = new Date(current.sunset * 1000);
    const sunsetTimeStr = sunsetDate.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
    const [ssHour, ssMin] = sunsetTimeStr.split(':').map(Number);
    const sunsetMinOffset = ssHour * 60 + ssMin;
    
    // 2. Current local time convert to Date
    const localTimeStr = new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
    const [cHour, cMin] = localTimeStr.split(':').map(Number);
    const currentMinOffset = cHour * 60 + cMin;
    
    // 3. Compute daylight elapsed ratio
    let progress = 0;
    let isDay = true;
    
    if (currentMinOffset < sunriseMinOffset || currentMinOffset > sunsetMinOffset) {
      // Night time
      isDay = false;
      progress = currentMinOffset > sunsetMinOffset ? 1 : 0;
    } else {
      progress = (currentMinOffset - sunriseMinOffset) / (sunsetMinOffset - sunriseMinOffset);
    }
    
    // 4. Compute coordinates on circle with Center(50, 45), Radius(45)
    // Angles: pi (180deg) to 0 (0deg)
    const theta = Math.PI - progress * Math.PI;
    const x = 50 + 45 * Math.cos(theta);
    const y = 45 - 45 * Math.sin(theta);
    
    // 5. Update SVG DOM Elements
    if (isDay) {
      dom.solarSunIndicator.setAttribute('cx', x);
      dom.solarSunIndicator.setAttribute('cy', y);
      dom.solarSunIndicator.setAttribute('fill', '#f59e0b');
      dom.solarArcElapsed.setAttribute('d', `M 5,45 A 45,45 0 0,1 ${x},${y}`);
    } else {
      // Hide sun or put at start/end, show blue moon indicator
      const finalX = currentMinOffset < sunriseMinOffset ? 5 : 95;
      dom.solarSunIndicator.setAttribute('cx', finalX);
      dom.solarSunIndicator.setAttribute('cy', 45);
      dom.solarSunIndicator.setAttribute('fill', '#6366f1'); // Indigo moon theme
      dom.solarArcElapsed.setAttribute('d', currentMinOffset < sunriseMinOffset ? `M 5,45 A 45,45 0 0,1 5,45` : `M 5,45 A 45,45 0 0,1 95,45`);
    }
  } catch (err) {
    console.error("Error drawing solar arc:", err);
  }
}

function getUvCategory(index) {
  if (index <= 2) return { name: 'Low', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20' };
  if (index <= 5) return { name: 'Moderate', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20' };
  if (index <= 7) return { name: 'High', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20' };
  if (index <= 10) return { name: 'Very High', color: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20' };
  return { name: 'Extreme', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/20' };
}

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

function toggleAqiDetails(show = null) {
  const panel = document.getElementById('aqi-pollutants-panel');
  if (show === null) {
    panel.classList.toggle('opacity-0');
    panel.classList.toggle('pointer-events-none');
  } else if (show) {
    panel.classList.remove('opacity-0', 'pointer-events-none');
  } else {
    panel.classList.add('opacity-0', 'pointer-events-none');
  }
}

// ----------------------------------------------------
// Chart.js Hourly Configuration
// ----------------------------------------------------

function renderChart() {
  if (!activeCity) return;
  
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  
  // Prepare hourly lists
  const labels = activeCity.hourly.map(h => h.time);
  const tempCData = activeCity.hourly.map(h => h.temp);
  const popData = activeCity.hourly.map(h => h.pop * 100);
  
  const tempConverted = tempCData.map(t => {
    return appUnit === 'C' ? t : (t * 9 / 5 + 32);
  });
  
  // Theme Color definitions for chart axes/grids
  const isDark = document.documentElement.classList.contains('dark');
  const fontColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(71, 85, 105, 0.7)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.12)';
  
  const config = {
    data: {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: `Temp (°${appUnit})`,
          data: tempConverted,
          yAxisID: 'y-temp',
          borderColor: isDark ? '#fbbf24' : '#f59e0b',
          backgroundColor: isDark ? 'rgba(251, 191, 36, 0.07)' : 'rgba(245, 158, 11, 0.07)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fbbf24',
          pointHoverBackgroundColor: '#fbbf24',
          pointBorderWidth: 0,
        },
        {
          type: 'bar',
          label: 'Precipitation %',
          data: popData,
          yAxisID: 'y-pop',
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.35)',
          hoverBackgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 'flex',
          maxBarThickness: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false // We use our custom legend in HTML
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#fff' : '#1e293b',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 12,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.datasetIndex === 0) {
                label += context.raw.toFixed(1) + `°${appUnit}`;
              } else {
                label += context.raw.toFixed(0) + '%';
              }
              return label;
            },
            footer: function(tooltipItems) {
              const idx = tooltipItems[0].dataIndex;
              const hourData = activeCity.hourly[idx];
              const windSpeed = appUnit === 'C' ? `${hourData.wind_speed} m/s` : `${(hourData.wind_speed * 2.23694).toFixed(1)} mph`;
              return `Wind: ${windSpeed}\nDescription: ${hourData.weather_description}`;
            }
          },
          footerColor: isDark ? '#818cf8' : '#4f46e5',
          footerFont: {
            weight: 'bold',
            size: 10
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: fontColor,
            font: {
              family: 'Plus Jakarta Sans',
              size: 10,
              weight: 'bold'
            }
          }
        },
        'y-temp': {
          type: 'linear',
          position: 'left',
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: fontColor,
            font: {
              family: 'Plus Jakarta Sans',
              size: 10,
              weight: 'bold'
            },
            callback: function(value) {
              return value + '°';
            }
          }
        },
        'y-pop': {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 100,
          grid: {
            display: false
          },
          ticks: {
            color: fontColor,
            font: {
              family: 'Plus Jakarta Sans',
              size: 10,
              weight: 'bold'
            },
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  };

  // Re-create chart instance
  if (hourlyChartInstance) {
    hourlyChartInstance.destroy();
  }
  hourlyChartInstance = new Chart(ctx, config);
}

// ----------------------------------------------------
// Favorites Add/Remove State Trigger
// ----------------------------------------------------

function toggleFavorite() {
  if (!activeCity) return;
  
  const index = favorites.indexOf(activeCity.id);
  
  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
  } else {
    // Add to favorites
    favorites.push(activeCity.id);
  }
  
  saveState();
  renderAll();
}

function removeFavorite(cityId) {
  const index = favorites.indexOf(cityId);
  if (index > -1) {
    favorites.splice(index, 1);
    saveState();
    renderAll();
  }
}

// ----------------------------------------------------
// Search Suggestion Engine (Case-insensitive match & keys)
// ----------------------------------------------------

function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  
  if (query.length === 0) {
    dom.searchSuggestions.classList.add('hidden');
    dom.searchClear.classList.add('hidden');
    return;
  }
  
  dom.searchClear.classList.remove('hidden');
  
  // Filter matching cities
  searchSuggestionsList = weatherData.cities.filter(city => {
    return city.name.toLowerCase().includes(query) || 
           city.country.toLowerCase().includes(query);
  });
  
  searchSelectedIndex = -1;
  renderSuggestions(query);
}

function renderSuggestions(query) {
  if (searchSuggestionsList.length === 0) {
    dom.searchSuggestions.innerHTML = `
      <div class="px-4 py-3 text-slate-400 text-xs italic text-center">No results found</div>
    `;
    dom.searchSuggestions.classList.remove('hidden');
    return;
  }
  
  dom.searchSuggestions.innerHTML = '';
  
  searchSuggestionsList.forEach((city, index) => {
    const item = document.createElement('div');
    item.className = `px-4 py-2.5 flex items-center justify-between text-xs font-semibold cursor-pointer border-b border-slate-200/40 dark:border-white/5 last:border-b-0 hover:bg-indigo-500/10 dark:hover:bg-white/5 transition-colors select-none`;
    item.setAttribute('id', `search-item-${index}`);
    item.setAttribute('onclick', `selectSearchCity('${city.id}')`);
    
    // Highlight matching characters in name
    const cityName = city.name;
    const matchStart = cityName.toLowerCase().indexOf(query);
    let nameMarkup = cityName;
    if (matchStart > -1) {
      const matchEnd = matchStart + query.length;
      nameMarkup = `${cityName.slice(0, matchStart)}<span class="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400 font-extrabold">${cityName.slice(matchStart, matchEnd)}</span>${cityName.slice(matchEnd)}`;
    }
    
    item.innerHTML = `
      <div>
        <p class="text-slate-800 dark:text-white font-bold">${nameMarkup}, ${city.country}</p>
        <p class="text-[10px] text-slate-400 mt-0.5 capitalize">${city.current.weather_description}</p>
      </div>
      <span class="text-indigo-600 dark:text-indigo-300 font-extrabold">${formatTemp(city.current.temp, appUnit)}°</span>
    `;
    
    dom.searchSuggestions.appendChild(item);
  });
  
  dom.searchSuggestions.classList.remove('hidden');
}

function selectSearchCity(cityId) {
  dom.searchInput.value = '';
  dom.searchSuggestions.classList.add('hidden');
  dom.searchClear.classList.add('hidden');
  dom.searchInput.blur();
  changeActiveCity(cityId);
}

function handleSearchKeydown(e) {
  if (dom.searchSuggestions.classList.contains('hidden') || searchSuggestionsList.length === 0) return;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    searchSelectedIndex = (searchSelectedIndex + 1) % searchSuggestionsList.length;
    highlightSuggestion();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    searchSelectedIndex = (searchSelectedIndex - 1 + searchSuggestionsList.length) % searchSuggestionsList.length;
    highlightSuggestion();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (searchSelectedIndex > -1 && searchSelectedIndex < searchSuggestionsList.length) {
      selectSearchCity(searchSuggestionsList[searchSelectedIndex].id);
    }
  } else if (e.key === 'Escape') {
    dom.searchSuggestions.classList.add('hidden');
    dom.searchInput.blur();
  }
}

function highlightSuggestion() {
  // Clear other active highlights
  for (let i = 0; i < searchSuggestionsList.length; i++) {
    const el = document.getElementById(`search-item-${i}`);
    if (el) {
      el.classList.remove('bg-indigo-500/20', 'dark:bg-white/10');
    }
  }
  
  // Highlight active
  const activeEl = document.getElementById(`search-item-${searchSelectedIndex}`);
  if (activeEl) {
    activeEl.classList.add('bg-indigo-500/20', 'dark:bg-white/10');
    activeEl.scrollIntoView({ block: 'nearest' });
  }
}

// ----------------------------------------------------
// Daily Forecast Modal Controllers
// ----------------------------------------------------

function openDailyModal(index) {
  if (!activeCity) return;
  
  const day = activeCity.daily[index];
  if (!day) return;
  
  const iconName = getWeatherIconName(day.weather_state);
  
  // Set modal contents
  dom.modalDayIcon.innerHTML = WEATHER_ICONS[iconName] || WEATHER_ICONS['cloud'];
  dom.modalDayName.textContent = day.day;
  
  const parsedDate = new Date(day.date);
  dom.modalDayDate.textContent = parsedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  dom.modalDayDesc.textContent = day.weather_description;
  dom.modalTempMax.textContent = `${formatTemp(day.temp_max, appUnit)}°${appUnit}`;
  dom.modalTempMin.textContent = `${formatTemp(day.temp_min, appUnit)}°${appUnit}`;
  dom.modalPop.textContent = `${(day.pop * 100).toFixed(0)}%`;
  
  const windVal = appUnit === 'C' ? `${day.wind_speed.toFixed(1)} m/s` : `${(day.wind_speed * 2.23694).toFixed(1)} mph`;
  dom.modalWind.textContent = windVal;
  dom.modalHumidity.textContent = `${day.humidity}%`;
  dom.modalUv.textContent = day.uv_index.toFixed(1);
  
  // Open with transition animation
  dom.dailyDetailModal.classList.remove('opacity-0', 'pointer-events-none');
  dom.modalBox.classList.remove('scale-95');
  dom.modalBox.classList.add('scale-100');
  
  lucide.createIcons();
}

function closeDailyModal() {
  dom.dailyDetailModal.classList.add('opacity-0', 'pointer-events-none');
  dom.modalBox.classList.remove('scale-100');
  dom.modalBox.classList.add('scale-95');
}

// Helper to match text to clean icon names in dictionaries
function getWeatherIconName(state) {
  const s = state.toLowerCase();
  if (s.includes('clear') || s.includes('sun')) return 'sun';
  if (s.includes('storm') || s.includes('lightning') || s.includes('thunder')) return 'cloud-lightning';
  if (s.includes('drizzle')) return 'cloud-drizzle';
  if (s.includes('rain') || s.includes('shower')) return 'cloud-rain';
  if (s.includes('snow')) return 'snowflake';
  if (s.includes('fog') || s.includes('mist') || s.includes('haze') || s.includes('dust')) return 'cloud-fog';
  return 'cloud'; // default
}

function formatTemp(tempC, unit) {
  const val = unit === 'C' ? tempC : (tempC * 9 / 5 + 32);
  return Math.round(val);
}

function formatTempPrecision(tempC, unit) {
  const val = unit === 'C' ? tempC : (tempC * 9 / 5 + 32);
  return val.toFixed(1) + '°' + unit;
}
