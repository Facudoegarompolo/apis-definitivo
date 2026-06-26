package grupo10.tpo.demo.dto.carrito;

public class CartItemResponse {

    private Long productoId;
    private String nombre;
    private Double precio;
    private Integer cantidad;
    private Double subtotal;

    public CartItemResponse() {
    }

    public CartItemResponse(Long productoId, String nombre, Double precio, Integer cantidad, Double subtotal) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }

    public Long getProductoId() {
        return productoId;
    }

    public String getNombre() {
        return nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Double getSubtotal() {
        return subtotal;
    }
}
