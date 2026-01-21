import { PrimeReactProvider } from "primereact/api"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { AppProvider } from "./contexts/AppProvider"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <AppProvider>
        <App />
      </AppProvider>
    </PrimeReactProvider>
  </StrictMode>
)
