package grupo10.tpo.demo.dto.pedido;

public class ItemPedidoResponse {

    private Long productoId;
    private String productoNombre;
    private Integer cantidad;

    public ItemPedidoResponse() {}

    public ItemPedidoResponse(Long productoId, String productoNombre, Integer cantidad) {
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.cantidad = cantidad;
    }

    public Long getProductoId() {
        return productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public Integer getCantidad() {
        return cantidad;
    }
}