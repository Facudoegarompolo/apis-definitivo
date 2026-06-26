package grupo10.tpo.demo.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import grupo10.tpo.demo.dto.producto.ProductoRequest;
import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.exception.producto.ProductoNotFoundException;
import grupo10.tpo.demo.mapper.ProductoMapper;
import grupo10.tpo.demo.model.Categoria;
import grupo10.tpo.demo.model.Marca;
import grupo10.tpo.demo.model.Pedido;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.repository.CategoriaRepository;
import grupo10.tpo.demo.repository.FavoritoRepository;
import grupo10.tpo.demo.repository.MarcaRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import grupo10.tpo.demo.repository.PedidoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final PedidoRepository pedidoRepository;
    private final FavoritoRepository favoritoRepository;
    private final ProductoMapper productoMapper;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository,
                           MarcaRepository marcaRepository,
                           PedidoRepository pedidoRepository,
                           FavoritoRepository favoritoRepository,
                           ProductoMapper productoMapper) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.pedidoRepository = pedidoRepository;
        this.favoritoRepository = favoritoRepository;
        this.productoMapper = productoMapper;
    }

    public List<ProductoResponse> getAllProductos() {
        return productoRepository.findAll()
                .stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    public ProductoResponse getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        return productoMapper.toResponse(producto);
    }

    public List<ProductoResponse> getProductosByCategoriaId(Long categoriaId) {
        return productoRepository.findByCategorias_Id(categoriaId)
                .stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    public ProductoResponse crearProductoConCategorias(ProductoRequest req) {
        Producto producto = new Producto();
        aplicarDatosProducto(producto, req);

        Producto guardado = productoRepository.save(producto);
        return productoMapper.toResponse(guardado);
    }

    public ProductoResponse actualizarProducto(Long id, ProductoRequest req) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        aplicarDatosProducto(producto, req);

        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toResponse(actualizado);
    }

    private void aplicarDatosProducto(Producto producto, ProductoRequest req) {
        producto.setNombre(req.getNombre());
        producto.setDescripcion(req.getDescripcion());
        producto.setPrecio(req.getPrecio());
        producto.setOferta(req.getOferta() != null ? req.getOferta() : false);
        producto.setPrecioOferta(req.getOferta() != null && req.getOferta() ? req.getPrecioOferta() : null);
        producto.setStock(req.getStock());

        if (req.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(req.getMarcaId())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            producto.setMarca(marca);
        } else {
            if (producto.getMarca() != null) {
                producto.getMarca().getProductos().remove(producto);
            }
            producto.setMarca(null);
        }

        List<Long> categoriaIds = req.getCategoriaIds() != null ? req.getCategoriaIds() : Collections.emptyList();
        List<Categoria> categorias = categoriaRepository.findAllById(categoriaIds);
        producto.setCategorias(categorias);
    }

    public List<ProductoResponse> getProductosEnOferta() {
        return productoRepository.findByOfertaTrue()
                .stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    public List<ProductoResponse> getProductosByMarcaId(Long marcaId) {
        return productoRepository.findByMarca_Id(marcaId)
                .stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    public void eliminarProducto(Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (producto.getMarca() != null) {
            producto.getMarca().getProductos().remove(producto);
            producto.setMarca(null);
        }

        for (Categoria categoria : producto.getCategorias()) {
            categoria.getProductos().remove(producto);
        }
        producto.getCategorias().clear();

        List<Pedido> pedidos = pedidoRepository.findByProductos_Id(id);

        for (Pedido pedido : pedidos) {
            pedido.getProductos().remove(producto);
        }

        favoritoRepository.deleteAllByProducto_Id(id);
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
        return productoMapper.toResponse(actualizado);
    }
}
