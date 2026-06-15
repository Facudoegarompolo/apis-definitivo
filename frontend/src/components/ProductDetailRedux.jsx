import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { agregarItemCarrito } from '../store/slices/cartSlice';
import { styles } from './ProductDetailRedux.styles';
import defaultImage from '../assets/imgXdefault.jpg';

const ProductDetailRedux = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioId = useSelector((state) => state.user.user?.id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          credentials: 'include',
          mode: 'cors'
        });
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!usuarioId) {
      alert('Debés iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    dispatch(agregarItemCarrito({ usuarioId, productoId: product.id, cantidad: 1 }));
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No se encontró el producto</div>;

  return (
    <div style={styles.container}>
      <h1>{product.nombre}</h1>
      <div style={styles.gridContainer}>
        <div>
          <img
            src={product.imagen || defaultImage}
            alt={product.nombre}
            style={styles.image}
          />
        </div>
        <div>
          <h2 style={styles.price}>
            ${product.precio.toLocaleString('es-AR')}
          </h2>
          <p style={styles.description}>{product.descripcion}</p>
          <button onClick={handleAddToCart} style={styles.addToCartButton}>
            Agregar al Carrito
          </button>
          <div style={styles.detailsSection}>
            <h3>Detalles del producto</h3>
            <ul style={styles.detailsList}>
              {product.detalles && Object.entries(product.detalles).map(([key, value]) => (
                <li key={key} style={styles.detailsListItem}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailRedux;