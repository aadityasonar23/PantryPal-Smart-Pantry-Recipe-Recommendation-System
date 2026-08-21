import { useEffect, useState } from 'react';

import {
  Plus,
  Trash2,
  Refrigerator,
  CalendarDays,
  Package,
  AlertTriangle,
} from 'lucide-react';

import {
  getIngredients,
  getPantry,
  addPantryItem,
  deletePantryItem,
} from '../services/api';

function Pantry() {
  // STATE

  const [ingredients, setIngredients] = useState([]);
  const [pantry, setPantry] = useState([]);

  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // CALCULATE DAYS UNTIL EXPIRY

  function getDaysUntilExpiry(expiryDate) {
    if (!expiryDate) {
      return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);

    const difference = expiry.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  // EXPIRY STATISTICS

  const expiredCount = pantry.filter((item) => {
    const days = getDaysUntilExpiry(item.expiry_date);

    return days !== null && days < 0;
  }).length;

  const expiringSoonCount = pantry.filter((item) => {
    const days = getDaysUntilExpiry(item.expiry_date);

    return days !== null && days >= 0 && days <= 2;
  }).length;

  const freshCount = pantry.filter((item) => {
    const days = getDaysUntilExpiry(item.expiry_date);

    return days === null || days > 2;
  }).length;

  // EXPIRING SOON LIST

  const expiringSoon = pantry
    .filter((item) => {
      const days = getDaysUntilExpiry(item.expiry_date);

      return days !== null && days >= 0 && days <= 2;
    })
    .sort((a, b) => {
      return (
        getDaysUntilExpiry(a.expiry_date) - getDaysUntilExpiry(b.expiry_date)
      );
    });

  // LOAD PANTRY DATA

  async function loadPantryData() {
    try {
      setLoading(true);
      setError('');

      const [ingredientsData, pantryData] = await Promise.all([
        getIngredients(),

        getPantry(),
      ]);

      setIngredients(
        Array.isArray(ingredientsData)
          ? ingredientsData
          : ingredientsData.ingredients || [],
      );

      setPantry(
        Array.isArray(pantryData) ? pantryData : pantryData.pantry || [],
      );
    } catch (error) {
      console.error('Pantry loading error:', error);

      setError('Unable to load pantry data.');
    } finally {
      setLoading(false);
    }
  }

  // LOAD DATA WHEN PAGE OPENS

  useEffect(() => {
    loadPantryData();
  }, []);

  // ADD INGREDIENT

  async function handleAddIngredient(event) {
    event.preventDefault();

    if (!ingredientId) {
      setError('Please select an ingredient.');

      return;
    }

    try {
      setAdding(true);
      setError('');

      await addPantryItem({
        ingredient_id: Number(ingredientId),

        quantity,

        expiry_date: expiryDate || null,
      });

      // Clear form

      setIngredientId('');
      setQuantity('');
      setExpiryDate('');

      // Reload pantry

      await loadPantryData();
    } catch (error) {
      console.error('Add ingredient error:', error);

      setError('Could not add this ingredient.');
    } finally {
      setAdding(false);
    }
  }

  // DELETE INGREDIENT

  async function handleDeleteIngredient(id) {
    try {
      setError('');

      await deletePantryItem(id);

      await loadPantryData();
    } catch (error) {
      console.error('Delete ingredient error:', error);

      setError('Could not delete this ingredient.');
    }
  }

  // GET EXPIRY STATUS

  function getExpiryStatus(expiryDate) {
    if (!expiryDate) {
      return {
        label: 'No expiry date',

        className: 'expiry-neutral',
      };
    }

    const days = getDaysUntilExpiry(expiryDate);

    if (days < 0) {
      return {
        label: 'Expired',

        className: 'expiry-danger',
      };
    }

    if (days <= 2) {
      return {
        label: 'Use soon',

        className: 'expiry-warning',
      };
    }

    return {
      label: 'Fresh',

      className: 'expiry-good',
    };
  }

  // LOADING SCREEN

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">Loading your pantry...</div>
      </main>
    );
  }

  // PAGE

  return (
    <main className="page-container">
      {/* ==========================================
                PAGE HEADER
            ========================================== */}

      <section className="page-header">
        <div>
          <div className="eyebrow">Your kitchen</div>

          <h1>My Pantry</h1>

          <p>
            Keep track of what you have and use ingredients before they expire.
          </p>
        </div>

        <div className="pantry-count">
          <Package size={20} />

          <div>
            <strong>{pantry.length}</strong>

            <span>ingredients</span>
          </div>
        </div>
      </section>

      {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

      {error && <div className="error-message">{error}</div>}

      {/* ==========================================
                STATISTICS
            ========================================== */}

      <section className="pantry-stats">
        {/* FRESH */}

        <div className="stat-card">
          <div className="stat-number">{freshCount}</div>

          <div>
            <span>Fresh</span>

            <small>Good to use</small>
          </div>
        </div>

        {/* USE SOON */}

        <div className="stat-card warning-stat">
          <div className="stat-number">{expiringSoonCount}</div>

          <div>
            <span>Use soon</span>

            <small>Within 2 days</small>
          </div>
        </div>

        {/* EXPIRED */}

        <div className="stat-card danger-stat">
          <div className="stat-number">{expiredCount}</div>

          <div>
            <span>Expired</span>

            <small>Needs attention</small>
          </div>
        </div>
      </section>

      {/* ==========================================
                EXPIRING SOON
            ========================================== */}

      {expiringSoon.length > 0 && (
        <section className="expiring-section">
          <div className="expiring-heading">
            <div>
              <div className="eyebrow">Don't waste it</div>

              <h2>Expiring soon</h2>
            </div>

            <span>
              {expiringSoon.length}{' '}
              {expiringSoon.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="expiring-list">
            {expiringSoon.map((item) => {
              const days = getDaysUntilExpiry(item.expiry_date);

              return (
                <div className="expiring-item" key={item.id}>
                  <div className="ingredient-symbol">
                    {item.ingredient_name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{item.ingredient_name}</strong>

                    <span>{item.quantity || 'Quantity not specified'}</span>
                  </div>

                  <div className="expiry-text">
                    <AlertTriangle size={14} />

                    {days === 0
                      ? 'Expires today'
                      : days === 1
                        ? 'Expires tomorrow'
                        : `Expires in ${days} days`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==========================================
                MAIN PANTRY AREA
            ========================================== */}

      <section className="pantry-layout">
        {/* ======================================
                    ADD INGREDIENT
                ====================================== */}

        <div className="add-card">
          <div className="card-heading">
            <div className="card-icon">
              <Plus size={19} />
            </div>

            <div>
              <h2>Add to pantry</h2>

              <p>What do you have available?</p>
            </div>
          </div>

          <form onSubmit={handleAddIngredient}>
            {/* INGREDIENT */}

            <label>Ingredient</label>

            <select
              value={ingredientId}
              onChange={(event) => setIngredientId(event.target.value)}
            >
              <option value="">Select ingredient</option>

              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </option>
              ))}
            </select>

            {/* QUANTITY */}

            <label>Quantity</label>

            <input
              type="text"
              placeholder="e.g. 2 kg"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />

            {/* EXPIRY */}

            <label>Expiry date</label>

            <input
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
            />

            {/* SUBMIT */}

            <button type="submit" className="primary-button" disabled={adding}>
              <Plus size={18} />

              {adding ? 'Adding...' : 'Add ingredient'}
            </button>
          </form>
        </div>

        {/* ======================================
                    PANTRY LIST
                ====================================== */}

        <div className="pantry-card">
          <div className="card-heading">
            <div className="card-icon">
              <Refrigerator size={19} />
            </div>

            <div>
              <h2>What's in your pantry?</h2>

              <p>Your current ingredients</p>
            </div>
          </div>

          {/* EMPTY PANTRY */}

          {pantry.length === 0 ? (
            <div className="empty-state">
              <Refrigerator size={42} />

              <h3>Your pantry is empty</h3>

              <p>Add your first ingredient to get started.</p>
            </div>
          ) : (
            /* PANTRY ITEMS */

            <div className="pantry-list">
              {pantry.map((item) => {
                const expiry = getExpiryStatus(item.expiry_date);

                return (
                  <div className="pantry-item" key={item.id}>
                    {/* SYMBOL */}

                    <div className="ingredient-symbol">
                      {item.ingredient_name?.charAt(0).toUpperCase()}
                    </div>

                    {/* INFO */}

                    <div className="pantry-info">
                      <h3>{item.ingredient_name}</h3>

                      <span>{item.quantity || 'Quantity not specified'}</span>
                    </div>

                    {/* EXPIRY */}

                    <div className="pantry-expiry">
                      <div className={`expiry-badge ${expiry.className}`}>
                        {expiry.label}
                      </div>

                      <span>
                        <CalendarDays size={14} />

                        {item.expiry_date || 'No date'}
                      </span>
                    </div>

                    {/* DELETE */}

                    <button
                      className="delete-button"
                      title="Delete ingredient"
                      onClick={() => handleDeleteIngredient(item.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Pantry;
