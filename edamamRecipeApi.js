import axios from 'axios';

const APP_ID = "c5825417";
const APP_KEY = "39b25af700e8e681f169e65c90ac462c";
const BASE_URL = 'https://api.edamam.com/search';
const CACHE_KEY = 'recipeCache';
const LAST_CALL_TIME_KEY = 'lastRecipeCallTime';
const CALL_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

export const getRecipesByIngredients = async (ingredients) => {
  const currentTime = new Date().getTime();
  const lastCallTime = localStorage.getItem(LAST_CALL_TIME_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If it's been less than the interval since the last call and we have cached data, return the cached data
  if (lastCallTime && currentTime - parseInt(lastCallTime) < CALL_INTERVAL && cachedData) {
    console.log('Returning cached recipe data');
    return JSON.parse(cachedData);
  }

  try {
    console.log(`Fetching recipes with ingredients: ${ingredients.join(', ')}`);
    const response = await axios.get(BASE_URL, {
      params: {
        q: ingredients.join(' '),
        app_id: APP_ID,
        app_key: APP_KEY,
        from: 0,
        to: 5 // Increase the number of recipes
      }
    });

    console.log('API response:', response.data);
    const recipes = response.data.hits.map(hit => ({
      id: hit.recipe.uri.split('#recipe')[1],
      title: hit.recipe.label,
      image: hit.recipe.image,
      url: hit.recipe.url,
      missedIngredientCount: hit.recipe.ingredients.length - ingredients.length
    }));

    // Cache the results and update the last call time
    localStorage.setItem(CACHE_KEY, JSON.stringify(recipes));
    localStorage.setItem(LAST_CALL_TIME_KEY, currentTime.toString());

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
