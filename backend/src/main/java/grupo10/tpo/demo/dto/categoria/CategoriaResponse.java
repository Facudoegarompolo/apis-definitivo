package grupo10.tpo.demo.dto.categoria;

import java.util.List;

import lombok.Data;

@Data
public class CategoriaResponse {
    private Long id;
    private String nombre;
    private Long categoriaPadreId;
    private List<CategoriaDTOSimple> subcategorias;

    public CategoriaResponse(Long id, String nombre, Long categoriaPadreId, List<CategoriaDTOSimple> subcategorias) {
        this.id = id;
        this.nombre = nombre;
        this.categoriaPadreId = categoriaPadreId;
        this.subcategorias = subcategorias;
    }
}
