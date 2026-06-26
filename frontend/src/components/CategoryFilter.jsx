import { useState } from 'react'

function CategoryPill({ id, label, selectedCategoryId, onSelect }) {
  const isSelected = selectedCategoryId === id

  return (
    <button
      type="button"
      className={`cat-pill ${isSelected ? 'cat-pill--active' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(id)}
    >
      {label}
    </button>
  )
}

function CategoryFilter({ categories, selectedCategoryId, onSelect }) {
  const [drillParent, setDrillParent] = useState(null)

  const parents = categories
    .filter(c => c.categoriaPadreId == null)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const childrenOf = (parentId) =>
    categories
      .filter(c => String(c.categoriaPadreId) === String(parentId))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const handleBack = () => {
    setDrillParent(null)
    onSelect('all')
  }

  const handleParentClick = (parent) => {
    setDrillParent(parent)
    onSelect(String(parent.id))
  }

  return (
    <section aria-labelledby="category-filter-title" className="cat-filter">
      <h2 id="category-filter-title" className="filter__section-title">
        Categorías
      </h2>

      {drillParent === null ? (
        <>
          <CategoryPill id="all" label="Todas" selectedCategoryId={selectedCategoryId} onSelect={onSelect} />
          {parents.map(parent => (
            <button
              key={parent.id}
              type="button"
              className={`cat-pill cat-pill--arrow`}
              onClick={() => handleParentClick(parent)}
            >
              {parent.nombre}
              <span aria-hidden="true">›</span>
            </button>
          ))}
        </>
      ) : (
        <>
          <button type="button" className="cat-back" onClick={handleBack}>
            ← {drillParent.nombre}
          </button>
          <CategoryPill
            id={String(drillParent.id)}
            label={`Todos los ${drillParent.nombre}`}
            selectedCategoryId={selectedCategoryId}
            onSelect={onSelect}
          />
          {childrenOf(drillParent.id).map(child => (
            <CategoryPill
              key={child.id}
              id={String(child.id)}
              label={child.nombre}
              selectedCategoryId={selectedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </section>
  )
}

export default CategoryFilter
