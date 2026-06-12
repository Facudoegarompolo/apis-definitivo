package grupo10.tpo.demo.dto.pedido;

public class ItemPedidoResponse {

    private Long productoId;
    private Integer cantidad;

    public ItemPedidoResponse() {}

    public ItemPedidoResponse(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    public Long getProductoId() {
        return productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }
}