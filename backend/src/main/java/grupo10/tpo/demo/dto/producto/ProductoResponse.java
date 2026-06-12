package grupo10.tpo.demo.dto.producto;

import lombok.Data;
import java.util.List;

import grupo10.tpo.demo.dto.categoria.CategoriaDTOSimple;

@Data
public class ProductoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private Integer stock;
    private String descripcion;

    private List<CategoriaDTOSimple> categorias;

    public ProductoResponse(Long id, String nombre, Double precio, Integer stock, String descripcion, List<CategoriaDTOSimple> categorias) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.descripcion = descripcion;
        this.categorias = categorias;
    }
}