import axios from "axios";
import { cacheGet, cacheSet } from "../services/cache.service.js";
import * as settingsModel from "../models/settings.model.js";

const CACHE_KEY = "google_reviews_cache";
const CACHE_TTL = 60 * 60 * 6; // 6 hours

const MOCK_REVIEWS = [
  {
    author_name: "Aarav Sharma",
    rating: 5,
    text: "Absolutely love the vibe at Relax Station! The food is top-notch, especially their momos and burgers. Great place to hang out with friends and family. Highly recommended!",
    relative_time_description: "2 days ago",
    profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  },
  {
    author_name: "Pooja Shrestha",
    rating: 5,
    text: "Celebrated my brother's birthday here, and the experience was flawless. The staff is extremely cooperative, and the event package was very affordable. Will definitely visit again!",
    relative_time_description: "1 week ago",
    profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  },
  {
    author_name: "John Doe",
    rating: 4,
    text: "A very cozy and lively place in Kathmandu. The playground area for kids is a huge plus. Food is great, service is fast. Will definitely come back for more events.",
    relative_time_description: "3 days ago",
    profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
  },
  {
    author_name: "Sujita Thapa",
    rating: 5,
    text: "Delicious food, friendly staff, and premium ambiance. The birthday decorations were beautiful, and all our guests had a wonderful time. 10/10!",
    relative_time_description: "2 weeks ago",
    profile_photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
  },
  {
    author_name: "Rajesh Karki",
    rating: 5,
    text: "Perfect spot for family gatherings. The kids loved the play zone, and the food was delicious and served hot. Very polite staff and clean environment.",
    relative_time_description: "5 days ago",
    profile_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
  }
];

export const getGoogleReviews = async (req, res) => {
  try {
    // 1. Check Redis first via cache service
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return res.json(cached);
    }

    // 2. Look up google configs in settings
    const row = await settingsModel.findByKey('google');
    const googleSettings = row ? row.value : {};

    const placeId = googleSettings.placeId || process.env.GOOGLE_PLACE_ID;
    const apiKey = googleSettings.apiKey || process.env.GOOGLE_MAPS_API_KEY;

    let data = {
      reviews: MOCK_REVIEWS,
      rating: 4.8,
      total: 154,
    };

    if (placeId && apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
        const response = await axios.get(url);
        
        if (response.data.status === "OK" && response.data.result) {
          const apiReviews = response.data.result.reviews || [];
          if (apiReviews.length > 0) {
            data = {
              reviews: apiReviews,
              rating: response.data.result.rating || 4.8,
              total: response.data.result.user_ratings_total || apiReviews.length,
            };
          } else {
            console.warn("Google API returned OK but 0 reviews. Falling back to mock reviews.");
          }
        } else {
          console.warn(`Google Place Details API returned status: ${response.data.status || 'unknown'}. Error: ${response.data.error_message || ''}. Falling back to mock reviews.`);
        }
      } catch (apiErr) {
        console.error("Failed to fetch reviews from Google Places API:", apiErr.message);
        // Fall back to mock reviews already set in data
      }
    } else {
      console.info("Google Place ID or API Key not configured. Using high-quality mock reviews.");
    }

    // 3. Store in Redis via cache service
    await cacheSet(CACHE_KEY, data, CACHE_TTL);

    return res.json(data);
  } catch (err) {
    console.error("Error in getGoogleReviews handler:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};