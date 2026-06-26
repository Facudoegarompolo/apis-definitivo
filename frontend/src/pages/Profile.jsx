import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateLocalUser } from '../store/slices/userSlice';
import { Link } from 'react-router-dom';
import Orders from '../components/Orders';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    dispatch(updateLocalUser({
      nombre: formData.get('nombre'),
      email: formData.get('email')
    }));

    alert('Datos de usuario actualizados');
  };

  const handleOnClickOrders = (e) => {
    e.preventDefault();
    window.location.href = '/pedidos'; // Redirige a la página de pedidos
  }

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <h1>Perfil</h1>
          <p>No hay datos de usuario cargados.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h1>Mi perfil</h1>
            <p>{user.email}</p>
          </div>
          <span className="profile-avatar">{(user.nombre || user.email || 'U').charAt(0)}</span>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              defaultValue={user.nombre || ''}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email || ''}
              required
            />
          </div>

          <button className="profile-button" type=" button" onClick={handleOnClickOrders}>
            <Link to="/pedidos">Ver mis pedidos</Link>
          </button>

          <button type="submit" className="profile-button">
            Guardar cambios
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
