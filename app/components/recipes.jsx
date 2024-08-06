import { useState, useEffect } from "react";
import { getRecipesByIngredients } from '../../edamamRecipeApi';
import '../globals.css';
import { Modal, Box, Typography, Button } from '@mui/material';

export default function Recipes({ inventory }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Function to fetch recipes based on inventory items
  const fetchRecipes = async () => {
    setIsLoading(true);
    const ingredients = inventory.map((item) => item.name);
    try {
      const recipeData = await getRecipesByIngredients(ingredients);
      setRecipes(recipeData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening the modal with a specific recipe
  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRecipe(null);
  };

  // Function to handle the "Get Recipe" button click
  const handleGetRecipe = async () => {
    await fetchRecipes();
    if (recipes.length > 0) {
      handleOpen(recipes[0]); // Automatically open the first recipe in the list
    } else {
      handleOpen(null); // Open an empty modal with a message if no recipes are found
    }
  };

  return (
    <section className="recipeSection">
      <h1 className="gradient-text">Pantry Tracker</h1>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleGetRecipe}
          sx={{
            backgroundColor: '#00B4D8', // Button color
            color: '#fff',
            border: 'none', // Remove any border
            '&:hover': {
              backgroundColor: '#00B4D8' // Same color on hover
            }
          }}
        >
          Get Recipe
        </Button>
      </Box>
      <div className="recipeContainer">
        {selectedRecipe && (
          <div className="recipes">
            <div className="recipeCard">
              <h3>{selectedRecipe.title}</h3>
              <img src={selectedRecipe.image} alt={selectedRecipe.title} />
              <Button
                variant="contained"
                onClick={() => handleOpen(selectedRecipe)}
                sx={{
                  mt: 2,
                  backgroundColor: '#00B4D8', // Same color
                  color: '#fff',
                  border: 'none', // Remove any border
                  '&:hover': {
                    backgroundColor: '#00B4D8' // Same color on hover
                  }
                }}
              >
                View Details
              </Button>
            </div>
          </div>
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
