package grupo10.tpo.demo.mapper;

import grupo10.tpo.demo.dto.categoria.CategoriaDTOSimple;
import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.model.Producto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductoMapper {

    public ProductoResponse toResponse(Producto producto) {
        List<CategoriaDTOSimple> categorias = producto.getCategorias()
                .stream()
                .map(categoria -> new CategoriaDTOSimple(
                        categoria.getId(),
                        categoria.getNombre()))
                .toList();

        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getDescripcion(),
                categorias
        );
    }
}
