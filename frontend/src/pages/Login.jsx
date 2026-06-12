import { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/slices/userSlice'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // El slice se encarga del POST, guardar token y guardar datos del usuario.
      const data = await dispatch(loginUser({ email, password })).unwrap()
      alert('Login exitoso')
      navigate(data.token ? '/perfil' : '/')
    } catch (err) {
      alert(err.message || err)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>

          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="login-register">
          ¿No tenés cuenta? <Link to="/registro">Registrarse</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
