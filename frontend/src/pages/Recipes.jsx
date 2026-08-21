import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

import { getRecipes } from '../services/api';

import RecipeCard from '../components/RecipeCard';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);

        const data = await getRecipes();

        setRecipes(Array.isArray(data) ? data : data.recipes || []);
      } catch (error) {
        console.error(error);

        setError('Unable to load recipes.');
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">Loading recipes...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-header">
        <div>
          <div className="eyebrow">Explore</div>

          <h1>Recipes</h1>

          <p>Browse recipes and discover something delicious to cook.</p>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <div className="recipe-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state recipes-empty">
          <h3>No recipes found</h3>

          <p>Try a different search.</p>
        </div>
      ) : (
        <div className="recipe-results">
          {filteredRecipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
              <div className="recipe-image">
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt={recipe.name} />
                ) : (
                  <div className="image-placeholder">🍳</div>
                )}
              </div>

              <div className="recipe-content">
                <h3>{recipe.name}</h3>

                {recipe.description && <p>{recipe.description}</p>}

                <Link to={`/recipes/${recipe.id}`} className="view-recipe">
                  View recipe
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Recipes;
