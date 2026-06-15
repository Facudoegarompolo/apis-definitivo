package grupo10.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo10.tpo.demo.dto.categoria.CategoriaDTOSimple;
import grupo10.tpo.demo.dto.producto.ProductoRequest;
import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.exception.producto.ProductoNotFoundException;
import grupo10.tpo.demo.model.Categoria;
import grupo10.tpo.demo.model.Pedido;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.repository.CategoriaRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import grupo10.tpo.demo.repository.PedidoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PedidoRepository pedidoRepository; // 🔥 FALTABA ESTO

    public List<ProductoResponse> getAllProductos() {
        return productoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductoResponse getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        return toResponse(producto);
    }

    public List<ProductoResponse> getProductosByCategoriaId(Long categoriaId) {
        return productoRepository.findByCategorias_Id(categoriaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductoResponse crearProductoConCategorias(ProductoRequest req) {
        Producto producto = new Producto();
        producto.setNombre(req.getNombre());
        producto.setDescripcion(req.getDescripcion());
        producto.setPrecio(req.getPrecio());
        producto.setStock(req.getStock());

        List<Categoria> categorias = categoriaRepository.findAllById(req.getCategoriaIds());
        producto.setCategorias(categorias);

        Producto guardado = productoRepository.save(producto);
        return toResponse(guardado);
    }

    public ProductoResponse actualizarProducto(Long id, ProductoRequest req) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        producto.setNombre(req.getNombre());
        producto.setDescripcion(req.getDescripcion());
        producto.setPrecio(req.getPrecio());
        producto.setStock(req.getStock());

        List<Categoria> categorias = categoriaRepository.findAllById(req.getCategoriaIds());
        producto.setCategorias(categorias);

        Producto actualizado = productoRepository.save(producto);
        return toResponse(actualizado);
    }

    public void eliminarProducto(Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        for (Categoria categoria : producto.getCategorias()) {
            categoria.getProductos().remove(producto);
        }
        producto.getCategorias().clear();

        List<Pedido> pedidos = pedidoRepository.findByProductos_Id(id);

        for (Pedido pedido : pedidos) {
            pedido.getProductos().remove(producto);
        }

        productoRepository.delete(producto);
    }

    public ProductoResponse descontarStock(Long id, int cantidad) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("No hay suficiente stock disponible");
        }

        producto.setStock(producto.getStock() - cantidad);

        Producto actualizado = productoRepository.save(producto);
        return toResponse(actualizado);
    }

    private ProductoResponse toResponse(Producto producto) {
        List<CategoriaDTOSimple> categorias = producto.getCategorias()
                .stream()
                .map(categoria -> new CategoriaDTOSimple(
                        categoria.getId(),
                        categoria.getNombre()))
                .toList();

        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getDescripcion(),
                categorias
        );
    }
}