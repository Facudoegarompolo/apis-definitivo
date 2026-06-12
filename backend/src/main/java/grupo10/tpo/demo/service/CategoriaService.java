package grupo10.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo10.tpo.demo.dto.categoria.CategoriaDTOSimple;
import grupo10.tpo.demo.dto.categoria.CategoriaRequest;
import grupo10.tpo.demo.dto.categoria.CategoriaResponse;
import grupo10.tpo.demo.model.Categoria;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.repository.CategoriaRepository;
import grupo10.tpo.demo.exception.categoria.CategoriaNotFoundException;


@Service

public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();   
    }

    public CategoriaResponse getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new CategoriaNotFoundException(id));

        return toResponse(categoria);

    }


    public CategoriaResponse save(CategoriaRequest req) {
        Categoria categoria = new Categoria();
        categoria.setNombre(req.getNombre());

        if (req.getCategoriaPadreId() != null) {
            Categoria padre = categoriaRepository.findById(req.getCategoriaPadreId())
                .orElseThrow(() -> new CategoriaNotFoundException(req.getCategoriaPadreId()));

            categoria.setCategoriaPadre(padre);
        }

        Categoria guardada = categoriaRepository.save(categoria);
        return toResponse(guardada);
    }

    public void eliminar(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new CategoriaNotFoundException(id));

        for (Producto p : categoria.getProductos()) {
            p.getCategorias().remove(categoria);
        }
        
        categoria.getProductos().clear();
        categoriaRepository.delete(categoria);
    }


    private CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getCategoriaPadre() != null 
                ? categoria.getCategoriaPadre().getId() 
                : null,
            categoria.getSubCategorias().stream()
                .map(sub -> new CategoriaDTOSimple(sub.getId(), sub.getNombre()))
                .toList()
        );
    }
}
