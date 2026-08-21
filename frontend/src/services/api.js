const API_URL = 'https://pantrypal-api-9hse.onrender.com';

export async function getIngredients() {
  const response = await fetch(`${API_URL}/api/ingredients/`);

  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }

  return response.json();
}

export async function getPantry() {
  const response = await fetch(`${API_URL}/api/pantry/`);

  if (!response.ok) {
    throw new Error('Failed to fetch pantry');
  }

  return response.json();
}

export async function addPantryItem(data) {
  const response = await fetch(`${API_URL}/api/pantry/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to add pantry item');
  }

  return response.json();
}

export async function matchRecipes(ingredientIds) {
  const response = await fetch(`${API_URL}/api/match-recipes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredient_ids: ingredientIds,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to find recipes');
  }

  return response.json();
}

export async function deletePantryItem(id) {
  const response = await fetch(`${API_URL}/api/pantry/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete pantry item');
  }

  return response.json();
}

export async function getRecipes() {
  const response = await fetch(`${API_URL}/api/recipes/`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
}

export async function getRecipeById(id) {
  const response = await fetch(`${API_URL}/api/recipes/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }

  return response.json();
}
