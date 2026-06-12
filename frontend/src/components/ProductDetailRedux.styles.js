// Estilos del componente ProductDetailRedux
export const styles = {
  container: {
    padding: '2rem'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  price: {
    color: '#2D3277',
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#666'
  },
  addToCartButton: {
    backgroundColor: '#2D3277',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  detailsSection: {
    marginTop: '2rem'
  },
  detailsList: {
    listStyle: 'none',
    padding: 0
  },
  detailsListItem: {
    margin: '0.5rem 0',
    color: '#666'
  }
};
