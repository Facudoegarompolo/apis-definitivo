import { Component } from 'react'
import './RouteErrorBoundary.css'

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('No se pudo renderizar la pagina actual', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="route-error" role="alert">
          <h1>No pudimos mostrar esta pagina</h1>
          <p>Ocurrio un error inesperado. Volve al inicio para seguir navegando.</p>
          <a href="/">Volver al inicio</a>
        </section>
      )
    }

    return this.props.children
  }
}

export default RouteErrorBoundary
