# 🍳 PantryPal

> A smart ingredient-based recipe finder that helps users cook with what they already have and prioritize ingredients approaching expiry.

## 📌 Overview

PantryPal is a full-stack recipe recommendation application.

Users can:

- Select ingredients they currently have
- Find recipes based on those ingredients
- See matched and missing ingredients
- Maintain a personal pantry
- Track ingredient expiry dates
- Identify ingredients that should be used soon
- Browse and search recipes
- View complete recipe details

The main goal is to make recipe discovery simple while helping reduce food waste.

---

## ✨ Key Features

### 🥕 Ingredient-Based Recipe Matching

Users select available ingredients and PantryPal ranks recipes based on ingredient overlap.

### ⏳ Expiry-Aware Recommendations

Pantry items have expiry dates.

Recipes that use ingredients approaching expiry can receive a small ranking bonus.

### 🧺 Pantry Management

Users can:

- Add ingredients
- Store quantities
- Set expiry dates
- Delete pantry items
- See fresh, expiring and expired items

### 🔎 Recipe Search

Users can browse recipes and search by recipe name.

### 📖 Recipe Details

Each recipe displays:

- Recipe name
- Description
- Image
- Cooking time
- Difficulty
- Ingredients
- Quantities

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- React Router
- CSS
- Vite

### Backend

- Python
- Flask
- REST APIs

### Database

- PostgreSQL

### Development Tools

- Git
- GitHub
- Postman / Thunder Client
- VS Code

---

## 🏗️ Architecture

```text
React Frontend
      |
      | HTTP / REST API
      ↓
Flask Backend
      |
      ├── API Routes
      |
      ├── Recipe Matching Logic
      |
      ↓
PostgreSQL
```
