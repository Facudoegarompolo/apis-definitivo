package grupo10.tpo.demo.dto.marca;

import lombok.Data;

@Data
public class MarcaDTOSimple {
    private Long id;
    private String nombre;

    public MarcaDTOSimple(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
