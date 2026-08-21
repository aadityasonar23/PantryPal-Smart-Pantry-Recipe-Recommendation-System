const API_URL = 'http://localhost:5000/api';

export async function getIngredients() {
  const response = await fetch(`${API_URL}/ingredients/`);

  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }

  return response.json();
}

export async function getPantry() {
  const response = await fetch(`${API_URL}/pantry/`);

  if (!response.ok) {
    throw new Error('Failed to fetch pantry');
  }

  return response.json();
}

export async function addPantryItem(data) {
  const response = await fetch(`${API_URL}/pantry/`, {
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
  const response = await fetch(`${API_URL}/match-recipes/`, {
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
  const response = await fetch(`${API_URL}/pantry/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete pantry item');
  }

  return response.json();
}

export async function getRecipes() {
  const response = await fetch(`${API_URL}/recipes/`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
}

export async function getRecipeById(id) {
  const response = await fetch(`${API_URL}/recipes/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }

  return response.json();
}
