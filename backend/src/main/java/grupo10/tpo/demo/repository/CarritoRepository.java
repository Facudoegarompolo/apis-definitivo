package grupo10.tpo.demo.repository;

import grupo10.tpo.demo.model.Carrito;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuario_Id(Long usuarioId);
}
