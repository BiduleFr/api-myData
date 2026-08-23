import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('myData_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (userData, token) => {
        localStorage.setItem('myData_user', JSON.stringify(userData));
        localStorage.setItem('myData_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('myData_user');
        localStorage.removeItem('myData_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
