import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import defaultImage from '../assets/imgXdefault.jpg';
import { agregarItemCarrito } from '../store/slices/cartSlice';
import { apiUrl } from '../services/apiBase';

const ProductDetail = () => {
  const dispatch = useDispatch();
  
  // useParams es un hook de React Router que extrae los parámetros de la URL.
  // En este caso, desestructura el objeto devuelto para obtener el 'id' del producto.
  // Por ejemplo, si la URL es /products/123, useParams devolverá { id: '123' }.
  const { id } = useParams();

  // useNavigate es un hook que proporciona una función para navegar programáticamente.
  // La función 'navigate' se puede usar para redirigir al usuario a otras rutas.
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        //http://localhost:8080/api/productos/{id}
        // const response = await fetch(`http://localhost:3000/productos/${id}`);
        const response = await fetch(apiUrl(`/productos/${id}`), {
          // Especificamos el método HTTP a utilizar
          method: 'GET',
          
          headers: {
            // Indica al servidor que esperamos recibir JSON como respuesta
            'Accept': 'application/json',
            
            // Indica al servidor que estamos enviando datos en formato JSON
            'Content-Type': 'application/json'
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

  const handleAddToCart = async () => {
    try {
      await dispatch(
        agregarItemCarrito({
          productoId: product.id,
          cantidad: 1,
        })
      ).unwrap();

      navigate('/carrito');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No se encontró el producto</div>;

  const price = Number(product.precio ?? product.price ?? 0)
  const offerPrice = Number(product.precioOferta ?? product.priceOferta ?? 0)
  const hasOffer = Boolean(product.oferta) && offerPrice > 0
  const displayPrice = hasOffer ? offerPrice : price

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.nombre}</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        width: '100%'
      }}>
        <div>
          <img 
            src={product.imagen || defaultImage}
            alt={product.nombre}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </div>
        <div>
          <h2 style={{ color: '#2D3277', fontSize: '2rem', marginBottom: '1rem' }}>
            {hasOffer ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '0.75rem' }}>
                  ${price.toLocaleString('es-AR')}
                </span>
                <span>${displayPrice.toLocaleString('es-AR')}</span>
              </>
            ) : (
              <>${displayPrice.toLocaleString('es-AR')}</>
            )}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#666' }}>
            {product.descripcion}
          </p>
          {product.marca?.nombre && (
        <p style={{ color: '#444', marginBottom: '1rem' }}>
          <strong>Marca:</strong> {product.marca.nombre}
        </p>
      )}
      <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: '#2D3277',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Agregar al Carrito
          </button>
          <div style={{ marginTop: '2rem' }}>
            <h3>Detalles del producto</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {product.detalles && Object.entries(product.detalles).map(([key, value]) => (
                <li key={key} style={{ margin: '0.5rem 0', color: '#666' }}>
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

export default ProductDetail;
