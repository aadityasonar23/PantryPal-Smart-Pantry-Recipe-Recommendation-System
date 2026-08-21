import { Link } from 'react-router-dom';
import { ChefHat, Refrigerator, Home, BookOpen } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <div className="brand-icon">
          <ChefHat size={22} />
        </div>

        <span>PantryPal</span>
      </Link>

      <div className="nav-links">
        <Link to="/">
          <Home size={17} />
          Home
        </Link>

        <Link to="/pantry">
          <Refrigerator size={17} />
          My Pantry
        </Link>

        <Link to="/recipes">
          <BookOpen size={17} />
          Recipes
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
