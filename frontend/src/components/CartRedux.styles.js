// Estilos del componente CartRedux
export const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  itemsContainer: {
    marginBottom: '2rem'
  },
  itemCard: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee'
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  itemTitle: {
    margin: '0 0 0.5rem 0'
  },
  itemPrice: {
    margin: '0.5rem 0',
    color: '#2D3277',
    fontWeight: 'bold'
  },
  removeButton: {
    padding: '0.5rem',
    background: 'none',
    border: '1px solid #ff4444',
    color: '#ff4444',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  linksContainer: {
    display: 'flex',
    gap: '1rem'
  },
  linkBase: {
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  shoppingLink: {
    backgroundColor: '#2D3277',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  checkoutLink: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none'
  }
};
