import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { getIngredients, matchRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [ingredients, setIngredients] = useState([]);

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [results, setResults] = useState([]);

  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    async function loadIngredients() {
      try {
        setLoadingIngredients(true);
        setError('');

        const data = await getIngredients();

        setIngredients(Array.isArray(data) ? data : data.ingredients || []);
      } catch (error) {
        console.error(error);

        setError('Unable to load ingredients.');
      } finally {
        setLoadingIngredients(false);
      }
    }

    loadIngredients();
  }, []);

  function toggleIngredient(id) {
    setSelectedIngredients((current) => {
      if (current.includes(id)) {
        return current.filter((ingredientId) => ingredientId !== id);
      }

      return [...current, id];
    });
  }

  async function handleFindRecipes() {
    if (selectedIngredients.length === 0) {
      return;
    }

    try {
      setLoading(true);

      const data = await matchRecipes(selectedIngredients);

      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={15} />
            Smart kitchen assistant
          </div>

          <h1>
            Cook something
            <span> amazing.</span>
          </h1>

          <p>
            Tell PantryPal what you have. We'll find recipes you can make and
            help you use ingredients before they expire.
          </p>
        </div>
      </section>

      <section className="ingredient-section">
        {error && <div className="error-message">{error}</div>}
        <div className="section-heading">
          <div>
            <span className="eyebrow">What's in your kitchen?</span>

            <h2>Choose your ingredients</h2>
          </div>

          <span className="selected-count">
            {selectedIngredients.length} selected
          </span>
        </div>

        <div className="ingredient-grid">
          {loadingIngredients ? (
            <div className="ingredient-loading">Loading ingredients...</div>
          ) : ingredients.length === 0 ? (
            <div className="ingredient-loading">No ingredients available.</div>
          ) : (
            ingredients.map((ingredient) => (
              <button
                key={ingredient.id}
                className={
                  selectedIngredients.includes(ingredient.id)
                    ? 'ingredient-chip selected'
                    : 'ingredient-chip'
                }
                onClick={() => toggleIngredient(ingredient.id)}
              >
                {ingredient.name}
              </button>
            ))
          )}
        </div>

        <button
          className="find-button"
          onClick={handleFindRecipes}
          disabled={loading || selectedIngredients.length === 0}
        >
          <Search size={19} />

          {loading ? 'Finding recipes...' : 'Find recipes'}
        </button>
      </section>

      {results.length > 0 && (
        <section className="results-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Your matches</span>

              <h2>Recipes for you</h2>
            </div>
          </div>

          <div className="recipe-results">
            {results.map((recipe) => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
      <section className="how-section">
        <div className="how-heading">
          <div className="eyebrow">Simple by design</div>

          <h2>From pantry to plate.</h2>

          <p>
            PantryPal takes what you already have and turns it into something
            worth cooking.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <span>01</span>

            <h3>Pick ingredients</h3>

            <p>Select the ingredients currently available in your kitchen.</p>
          </div>

          <div className="how-card">
            <span>02</span>

            <h3>Find your match</h3>

            <p>
              PantryPal compares your ingredients against available recipes.
            </p>
          </div>

          <div className="how-card">
            <span>03</span>

            <h3>Cook before it expires</h3>

            <p>Recipes can highlight ingredients that need to be used soon.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
