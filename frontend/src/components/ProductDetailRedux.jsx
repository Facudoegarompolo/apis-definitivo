import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { styles } from './ProductDetailRedux.styles';
import defaultImage from '../assets/imgXdefault.jpg';

const ProductDetailRedux = () => {
  // Hook para despachar acciones a Redux (agregar al carrito, eliminar del carrito, reset etc.)
  const dispatch = useDispatch();
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          // Especificamos el método HTTP a utilizar
          method: 'GET',
          
          headers: {
            // Indica al servidor que esperamos recibir JSON como respuesta
            'Accept': 'application/json',
            
            // Indica al servidor que estamos enviando datos en formato JSON
            'Content-Type': 'application/json',
            
            // Envía el token JWT si existe en localStorage (necesario para rutas protegidas)
            'Authorization': localStorage.getItem('token')
          },
          
          // Permite el envío de cookies y credenciales de autenticación
          // Esto es necesario porque en el backend tienes configuration.setAllowCredentials(true)
          credentials: 'include',
          
          // Especifica que esta es una petición CORS (Cross-Origin Resource Sharing)
          // Útil cuando el frontend y backend están en diferentes puertos/dominios
          mode: 'cors'
        });
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
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
    // ejecuta el dispatch de Redux para agregar el producto al carrito, en lugar de usar la función addToCart del contexto
    // product tiene info json  { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
    dispatch(addToCart(product));
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
          <p style={styles.description}>
            {product.descripcion}
          </p>
          <button
            onClick={handleAddToCart}
            style={styles.addToCartButton}
          >
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
