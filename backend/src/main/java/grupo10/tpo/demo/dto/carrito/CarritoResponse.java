package grupo10.tpo.demo.dto.carrito;

import java.util.List;

public class CarritoResponse {

    private Long id;
    private Long usuarioId;
    private List<CartItemResponse> items;
    private Double total;

    public CarritoResponse() {
    }

    public CarritoResponse(Long id, Long usuarioId, List<CartItemResponse> items, Double total) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.items = items;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public Double getTotal() {
        return total;
    }
}
