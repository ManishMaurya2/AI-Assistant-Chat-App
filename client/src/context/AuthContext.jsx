import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, saveToken as saveTokenUtil, removeToken as removeTokenUtil } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedToken = getToken();
            if (storedToken) {
                const decodedUser = getUser();
                if (decodedUser) {
                    setToken(storedToken);
                    setUser(decodedUser);
                    setIsAuthenticated(true);
                } else {
                    removeTokenUtil();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (newToken) => {
        saveTokenUtil(newToken);
        setToken(newToken);
        const decodedUser = getUser();
        setUser(decodedUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeTokenUtil();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // Note: window.location triggers a reload and redirects naturally
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
