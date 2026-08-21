import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pantry from './pages/Pantry';
import RecipeDetails from './pages/RecipeDetails';
import Recipes from './pages/Recipes';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/pantry" element={<Pantry />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route path="/recipes/:id" element={<RecipeDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
