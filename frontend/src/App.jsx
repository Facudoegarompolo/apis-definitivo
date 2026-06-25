import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import AdminPanel from './pages/AdminPanel'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import { restoreSession } from './store/slices/userSlice'
import { loadFavorites, resetFavorites } from './store/slices/favoriteSlice'

function ProtectedRoute({ children }) {
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.user)

  if (!sessionChecked) {
    return <div>Cargando sesión...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
  
function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    if (!sessionChecked) return

    if (isAuthenticated) {
      dispatch(loadFavorites())
    } else {
      dispatch(resetFavorites())
    }
  }, [dispatch, isAuthenticated, sessionChecked])

  return (
    <>
      <Navbar />
      <main>
        <RouteErrorBoundary key={location.pathname}>
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
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
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
        </RouteErrorBoundary>
      </main>

      <Footer />
    </>
  )
}

export default App
