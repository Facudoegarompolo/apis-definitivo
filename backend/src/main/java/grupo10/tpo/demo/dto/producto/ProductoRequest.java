package grupo10.tpo.demo.dto.producto;

import lombok.Data;

import java.util.List;

@Data
public class ProductoRequest {
    private Long id;
    private String nombre;
    private Double precio;
    private Boolean oferta;
    private Double precioOferta;
    private Integer stock;
    private String descripcion;
    private Long marcaId;
    private List<Long> categoriaIds;
    
}
