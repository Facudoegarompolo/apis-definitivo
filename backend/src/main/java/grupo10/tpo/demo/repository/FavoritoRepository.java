package grupo10.tpo.demo.repository;

import grupo10.tpo.demo.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findAllByUsuario_IdOrderByIdAsc(Long usuarioId);

    Optional<Favorito> findByUsuario_IdAndProducto_Id(Long usuarioId, Long productoId);

    void deleteAllByUsuario_Id(Long usuarioId);

    void deleteAllByProducto_Id(Long productoId);
}
