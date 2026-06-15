import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchCarrito } from './store/slices/cartSlice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetailRedux from './components/ProductDetailRedux'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Favourites from './pages/Favourites'
import CartRedux from './components/CartRedux'
import Checkout from './components/Checkout'

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const dispatch = useDispatch()
  const usuarioId = useSelector((state) => state.user.user?.id)

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchCarrito(usuarioId))
    }
  }, [usuarioId])

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:id" element={<ProductDetailRedux />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/favoritos" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
          <Route path="/carrito" element={<ProtectedRoute><CartRedux /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App