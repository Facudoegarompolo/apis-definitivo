import { useState } from 'react'

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

  const Pill = ({ id, label }) => (
    <button
      type="button"
      className={`cat-pill ${selectedCategoryId === id ? 'cat-pill--active' : ''}`}
      aria-pressed={selectedCategoryId === id}
      onClick={() => onSelect(id)}
    >
      {label}
    </button>
  )

  return (
    <section aria-labelledby="category-filter-title" className="cat-filter">
      <h2 id="category-filter-title" className="filter__section-title">
        Categorías
      </h2>

      {drillParent === null ? (
        <>
          <Pill id="all" label="Todas" />
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
          <Pill id={String(drillParent.id)} label={`Todos los ${drillParent.nombre}`} />
          {childrenOf(drillParent.id).map(child => (
            <Pill key={child.id} id={String(child.id)} label={child.nombre} />
          ))}
        </>
      )}
    </section>
  )
}

export default CategoryFilter