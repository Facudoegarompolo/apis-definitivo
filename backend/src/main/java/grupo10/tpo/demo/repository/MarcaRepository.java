package grupo10.tpo.demo.repository;

import grupo10.tpo.demo.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
}
