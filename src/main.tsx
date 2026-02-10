import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import './i18n/i18n.ts';
import { LanguageProvider } from "./i18n/LanguageProvider.tsx"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
