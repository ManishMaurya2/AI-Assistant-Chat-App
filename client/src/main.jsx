import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
            <App />
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '10px',
                    fontSize: '14px',
                }
            }}
        />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
