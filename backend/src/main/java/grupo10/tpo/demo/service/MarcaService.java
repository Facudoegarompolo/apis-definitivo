package grupo10.tpo.demo.service;

import grupo10.tpo.demo.dto.marca.MarcaRequest;
import grupo10.tpo.demo.dto.marca.MarcaResponse;
import grupo10.tpo.demo.model.Marca;
import grupo10.tpo.demo.repository.MarcaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcaService {
    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public List<MarcaResponse> getAllMarcas() {
        return marcaRepository.findAll()
                .stream()
                .map(marca -> new MarcaResponse(marca.getId(), marca.getNombre()))
                .toList();
    }

    public MarcaResponse getMarcaById(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
        return new MarcaResponse(marca.getId(), marca.getNombre());
    }

    public MarcaResponse crearMarca(MarcaRequest req) {
        Marca marca = new Marca();
        marca.setNombre(req.getNombre());
        Marca guardada = marcaRepository.save(marca);
        return new MarcaResponse(guardada.getId(), guardada.getNombre());
    }

    public void eliminarMarca(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        marca.getProductos().forEach(producto -> producto.setMarca(null));
        marcaRepository.delete(marca);
    }
}
