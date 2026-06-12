package grupo10.tpo.demo.dto.producto;

import lombok.Data;

import java.util.List;

@Data
public class ProductoDTO {
    private String nombre;
    private Double precio;
    private Integer stock;
    private String descripcion;
    private List<Long> categoriaIds;

}
