CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    cooking_time INTEGER,
    difficulty VARCHAR(50)
);

CREATE TABLE recipe_ingredients (
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    quantity VARCHAR(100),

    PRIMARY KEY (recipe_id, ingredient_id),

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
        ON DELETE CASCADE
);

CREATE TABLE pantry (
    id SERIAL PRIMARY KEY,
    ingredient_id INTEGER NOT NULL,
    quantity VARCHAR(100),
    expiry_date DATE,

    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_pantry_ingredient
        UNIQUE (ingredient_id)
);