import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                        <span>🛒</span>
                        <span>E-Commerce</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-gray-200 transition">🏠 Accueil</Link>
                        <Link to="/products" className="hover:text-gray-200 transition">📦 Produits</Link>

                        {isAuthenticated && (
                            <>
                                <Link to="/cart" className="hover:text-gray-200 transition">
                                    🛒 Panier
                                </Link>
                                <Link to="/orders" className="hover:text-gray-200 transition">
                                    📄 Mes Commandes
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="hover:text-gray-200 transition">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                                    Inscription
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="hover:text-gray-200 transition">
                                    👤 {user?.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
