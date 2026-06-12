package grupo10.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import grupo10.tpo.demo.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    //findAll() ya está implementado por JpaRepository, no es necesario definirlo aquí
    // select * from categorias
    boolean existsByNombre(String nombre);
}
