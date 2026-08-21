import { ArrowRight, Flame } from 'lucide-react';

import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  const isExpiringSoon =
    recipe.expiring_used && recipe.expiring_used.length > 0;

  return (
    <article className="recipe-card">
      <div className="recipe-image">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.recipe_name}
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

        <div className="match-badge">{recipe.match_percentage}% match</div>
      </div>

      <div className="recipe-content">
        <div className="recipe-title-row">
          <h3>{recipe.recipe_name}</h3>
        </div>

        {isExpiringSoon && (
          <div className="use-soon">
            <Flame size={14} />
            Use soon: {recipe.expiring_used.join(', ')}
          </div>
        )}

        <div className="matched-list">
          {recipe.matched_ingredients?.slice(0, 3).map((ingredient) => (
            <span key={ingredient} className="mini-tag">
              ✓ {ingredient}
            </span>
          ))}
        </div>

        {recipe.missing_ingredients?.length > 0 && (
          <p className="missing">
            Missing: {recipe.missing_ingredients.join(', ')}
          </p>
        )}

        <Link to={`/recipes/${recipe.recipe_id}`} className="view-recipe">
          View recipe
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default RecipeCard;
