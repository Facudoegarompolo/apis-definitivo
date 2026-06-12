package grupo10.tpo.demo.repository;

import grupo10.tpo.demo.model.Carrito;
import grupo10.tpo.demo.model.CarritoItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    Optional<CarritoItem> findByCarritoAndProducto_Id(Carrito carrito, Long productoId);
}
