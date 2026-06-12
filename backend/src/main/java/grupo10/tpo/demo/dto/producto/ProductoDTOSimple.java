package grupo10.tpo.demo.dto.producto;

import lombok.Data;


@Data
public class ProductoDTOSimple {
    private Long id;
    private String nombre;

    public ProductoDTOSimple(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

