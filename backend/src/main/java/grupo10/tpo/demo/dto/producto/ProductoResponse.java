package grupo10.tpo.demo.dto.producto;

import lombok.Data;
import java.util.List;

import grupo10.tpo.demo.dto.categoria.CategoriaDTOSimple;
import grupo10.tpo.demo.dto.marca.MarcaDTOSimple;

@Data
public class ProductoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private Boolean oferta;
    private Double precioOferta;
    private Integer stock;
    private String descripcion;
    private MarcaDTOSimple marca;

    private List<CategoriaDTOSimple> categorias;

    public ProductoResponse(Long id, String nombre, Double precio, Boolean oferta, Double precioOferta, Integer stock, String descripcion, MarcaDTOSimple marca, List<CategoriaDTOSimple> categorias) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.oferta = oferta;
        this.precioOferta = precioOferta;
        this.stock = stock;
        this.descripcion = descripcion;
        this.marca = marca;
        this.categorias = categorias;
    }
}