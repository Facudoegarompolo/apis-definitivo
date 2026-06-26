package grupo10.tpo.demo.service;

import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.exception.producto.ProductoNotFoundException;
import grupo10.tpo.demo.exception.usuario.UsuarioNotFoundException;
import grupo10.tpo.demo.mapper.ProductoMapper;
import grupo10.tpo.demo.model.Favorito;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.model.Usuario;
import grupo10.tpo.demo.repository.FavoritoRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import grupo10.tpo.demo.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;

    public FavoritoService(FavoritoRepository favoritoRepository,
                           UsuarioRepository usuarioRepository,
                           ProductoRepository productoRepository,
                           ProductoMapper productoMapper) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.productoMapper = productoMapper;
    }

    public List<ProductoResponse> getFavoritos(String email) {
        Usuario usuario = getUsuario(email);

        return favoritoRepository.findAllByUsuario_IdOrderByIdAsc(usuario.getId())
                .stream()
                .map(Favorito::getProducto)
                .map(productoMapper::toResponse)
                .toList();
    }

    public List<ProductoResponse> agregar(String email, Long productoId) {
        Usuario usuario = getUsuario(email);

        if (favoritoRepository.findByUsuario_IdAndProducto_Id(usuario.getId(), productoId).isEmpty()) {
            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new ProductoNotFoundException(productoId));

            Favorito favorito = new Favorito();
            favorito.setUsuario(usuario);
            favorito.setProducto(producto);
            favoritoRepository.save(favorito);
        }

        return getFavoritos(email);
    }

    public List<ProductoResponse> eliminar(String email, Long productoId) {
        Usuario usuario = getUsuario(email);

        favoritoRepository.findByUsuario_IdAndProducto_Id(usuario.getId(), productoId)
                .ifPresent(favoritoRepository::delete);

        return getFavoritos(email);
    }

    private Usuario getUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));
    }
}
