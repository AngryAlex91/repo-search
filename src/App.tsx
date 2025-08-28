
import './App.css'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RepoPage } from './pages/RepoPage'

function App() {

  return (
    <div className="app">
    <Header />
    <RepoPage />
    <Footer />  
    </div>
  )
}

export default App
