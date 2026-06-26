function BrandFilter({ brands, selectedBrandId, onSelect }) {
  return (
    <section aria-labelledby="brand-filter-title" className="cat-filter">
      <h2 id="brand-filter-title" className="filter__section-title">
        Marcas
      </h2>
      <button
        type="button"
        className={`cat-pill ${selectedBrandId === 'all' ? 'cat-pill--active' : ''}`}
        aria-pressed={selectedBrandId === 'all'}
        onClick={() => onSelect('all')}
      >
        Todas
      </button>
      {brands.map((brand) => {
        const isActive = String(brand.id) === selectedBrandId
        return (
          <button
            key={brand.id}
            type="button"
            className={`cat-pill ${isActive ? 'cat-pill--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onSelect(String(brand.id))}
          >
            {brand.nombre}
          </button>
        )
      })}
    </section>
  )
}

export default BrandFilter