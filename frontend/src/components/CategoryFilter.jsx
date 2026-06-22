function CategoryFilter({ categories, selectedCategoryId, onSelect }) {
  const orderedCategories = [...categories].sort((categoryA, categoryB) =>
    categoryA.nombre.localeCompare(categoryB.nombre, 'es'),
  )

  return (
    <section aria-labelledby="category-filter-title">
      <h2 id="category-filter-title" className="filter__section-title">
        Categorias
      </h2>
      <div className="productos__filters">
        <button
          type="button"
          className={`filter__button ${selectedCategoryId === 'all' ? 'filter__button--active' : ''}`}
          aria-pressed={selectedCategoryId === 'all'}
          onClick={() => onSelect('all')}
        >
          Todas
        </button>
        {orderedCategories.map((category) => {
          const categoryId = String(category.id)
          const isSelected = selectedCategoryId === categoryId

          return (
            <button
              key={category.id}
              type="button"
              className={`filter__button ${isSelected ? 'filter__button--active' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(categoryId)}
            >
              {category.nombre}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryFilter
