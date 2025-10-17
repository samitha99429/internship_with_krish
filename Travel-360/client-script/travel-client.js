import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_VERSION = process.env.API_VERSION || "1";
const BASE_URL = "http://localhost:3000/trips";

async function getTrips() {
  try {
    let url;
    if (API_VERSION === "2") {
      url = `${BASE_URL}/v2/search?from=CMB&destination=BKK&departTime=08:00`;
      console.log("using v2 API with includes weather");
    } else {
      url = `${BASE_URL}/v1/search?from=CMB&destination=BKK&departTime=08:00`;
      console.log("Using v1 API flights + hotels only");
    }

    const response = await axios.get(url);
    console.log("Response Data:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error fetching trips:", error.message);
  }
}

getTrips();
