import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'sonner'
import PainelMedicoes from './pages/PainelMedicoes'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-gray-50">
          <PainelMedicoes />
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App