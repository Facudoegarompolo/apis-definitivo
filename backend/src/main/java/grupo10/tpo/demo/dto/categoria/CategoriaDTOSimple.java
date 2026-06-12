package grupo10.tpo.demo.dto.categoria;

import lombok.Data;

@Data
public class CategoriaDTOSimple {
    private Long id;
    private String nombre;

    public CategoriaDTOSimple(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
