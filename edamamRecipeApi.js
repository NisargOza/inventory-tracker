import axios from "axios";

const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
const BASE_URL = "https://api.edamam.com/search";
const CACHE_KEY = "recipeCache";
const LAST_CALL_TIME_KEY = "lastRecipeCallTime";
const CALL_INTERVAL = 0 * 60 * 1000; // 15 minutes in milliseconds

export const getRecipesByIngredients = async (ingredients) => {
  const currentTime = new Date().getTime();
  const lastCallTime = localStorage.getItem(LAST_CALL_TIME_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  if (
    lastCallTime &&
    currentTime - parseInt(lastCallTime) < CALL_INTERVAL &&
    cachedData
  ) {
    console.log("Returning cached recipe data");
    return JSON.parse(cachedData);
  }

  try {
    // Filter out non-food items (you may want to expand this list)
    const foodIngredients = ingredients.filter(
      (item) => !["grass"].includes(item.toLowerCase())
    );

    // Use only the first 5 ingredients to increase chances of finding recipes
    const queryIngredients = foodIngredients.slice(0, 5);

    const response = await axios.get(BASE_URL, {
      params: {
        q: queryIngredients.join(" OR "), // Use OR logic
        app_id: APP_ID,
        app_key: APP_KEY,
        from: 0,
        to: 3,
      },
    });

    console.log("API response:", response.data);
    const recipes = response.data.hits.map((hit) => ({
      id: hit.recipe.uri.split("#recipe")[1],
      title: hit.recipe.label,
      image: hit.recipe.image,
      url: hit.recipe.url,
      ingredients: hit.recipe.ingredientLines,
    }));

    localStorage.setItem(CACHE_KEY, JSON.stringify(recipes));
    localStorage.setItem(LAST_CALL_TIME_KEY, currentTime.toString());

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};