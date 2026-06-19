import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Favourites from './pages/Favourites'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import { restoreSession } from './store/slices/userSlice'

function ProtectedRoute({ children }) {
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.user)

  if (!sessionChecked) {
    return <div>Cargando sesión...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
  
function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/productos" element={<ProductList />} />

          <Route path="/productos/:id" element={<ProductDetail />} />

          <Route path="/login" element={<Login />} />

          <Route path="/registro" element={<Register />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favoritos"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
