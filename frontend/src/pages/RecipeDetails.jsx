import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, ChefHat } from 'lucide-react';

import { Link, useParams } from 'react-router-dom';

import { getRecipeById } from '../services/api';

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);

        const data = await getRecipeById(id);

        setRecipe(data);
      } catch (error) {
        console.error(error);

        setError('Unable to load this recipe.');
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">Loading recipe...</div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="page-container">
        <div className="error-message">{error || 'Recipe not found.'}</div>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="recipe-details-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} />
        Back to recipes
      </Link>

      <section className="recipe-hero">
        <div className="details-image">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
                event.currentTarget.parentElement
                  .querySelector('.image-placeholder')
                  ?.classList.add('show');
              }}
            />
          ) : (
            <div className="image-placeholder">🍳</div>
          )}
        </div>

        <div className="details-content">
          <span className="eyebrow">Recipe</span>

          <h1>{recipe.name}</h1>

          {recipe.description && (
            <p className="details-description">{recipe.description}</p>
          )}

          <div className="recipe-meta">
            {recipe.cooking_time && (
              <div>
                <Clock size={17} />

                <span>{recipe.cooking_time} minutes</span>
              </div>
            )}

            {recipe.difficulty && (
              <div>
                <ChefHat size={17} />

                <span>{recipe.difficulty}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="ingredients-details">
        <div className="eyebrow">Ingredients</div>

        <h2>What you'll need</h2>

        <div className="ingredient-detail-list">
          {recipe.ingredients?.length > 0 ? (
            recipe.ingredients.map((ingredient) => (
              <div className="ingredient-detail" key={ingredient.id}>
                <span>{ingredient.name}</span>

                <span>{ingredient.quantity || 'As needed'}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">No ingredients added yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default RecipeDetails;
