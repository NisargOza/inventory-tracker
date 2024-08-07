import { useState, useEffect } from "react";
import { getRecipesByIngredients } from '../../edamamRecipeApi';
import '../globals.css';
import { Modal, Box, Typography, Button } from '@mui/material';

export default function Recipes({ inventory }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchRecipes = async () => {
    setIsLoading(true);
    const ingredients = inventory.map((item) => item.name);
    try {
      const recipeData = await getRecipesByIngredients(ingredients);
      setRecipes(recipeData);
      console.log('Recipes fetched:', recipeData); // Add this line
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecipe(null);
  };

  const handleGetRecipe = async () => {
    await fetchRecipes();
  };


  return (
    <section className="recipeSection">
      <h1 className="gradient-text">PantryPal</h1>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleGetRecipe}
          sx={{
            backgroundColor: '#00B4D8',
            color: '#fff',
            border: 'none',
            '&:hover': {
              backgroundColor: '#00B4D8'
            }
          }}
        >
          Get Recipes
        </Button>
      </Box>
      <div className="recipeContainer">
        {isLoading ? (
          <p>Loading recipes...</p>
        ) : recipes.length > 0 ? (
          <div className="recipes">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipeCard">
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <Button
                  variant="contained"
                  onClick={() => handleOpen(recipe)}
                  sx={{
                    mt: 2,
                    backgroundColor: '#00B4D8',
                    color: '#fff',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#00B4D8'
                    }
                  }}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>Try clicking &quot;Get Recipes&quot; or adding more ingredients to your inventory.</p>
        )}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80%',
            maxWidth: '600px',
            bgcolor: '#001F3F', // Navy background color
            color: '#ffffff', // White text color for contrast
            border: 'none', // Remove any border
            boxShadow: 24,
            p: 4,
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
            textAlign: 'center',
          }}
        >
          {selectedRecipe ? (
            <>
              <Typography variant="h6" component="h2">{selectedRecipe.title}</Typography>
              <img src={selectedRecipe.image} alt={selectedRecipe.title} style={{ width: '100%', height: 'auto', margin: '10px 0' }} />
              <Typography variant="body1">
                <a href={selectedRecipe.url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff' }}>View Recipe Instructions</a>
              </Typography>
            </>
          ) : (
            <Typography variant="body1">
              No recipes found based on your inventory.
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ mt: 2, backgroundColor: '#dc3545', color: '#fff', border: 'none', '&:hover': { backgroundColor: '#c82333' } }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </section>
  );
}