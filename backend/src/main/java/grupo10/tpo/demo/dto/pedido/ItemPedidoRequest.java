package grupo10.tpo.demo.dto.pedido;

public class ItemPedidoRequest {

    private Long productoId;
    private Integer cantidad;

    public ItemPedidoRequest() {}

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}