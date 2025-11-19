import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import CreateListing from './pages/CreateListing/CreateListing'
import ListingDetail from './pages/ListingDetail/ListingDetail'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import Messages from './pages/Messages/Messages'
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route 
                path="/create-listing" 
                element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

