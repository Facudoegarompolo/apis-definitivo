package grupo10.tpo.demo.dto.pedido;

import java.util.List;

public class PedidoResponse {

    private Long id;
    private Long usuarioId;
    private List<ItemPedidoResponse> items;
    private String estado;
    private String direccionEnvio;

    public PedidoResponse() {}

    public PedidoResponse(Long id, Long usuarioId, List<ItemPedidoResponse> items, String estado, String direccionEnvio) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.items = items;
        this.estado = estado;
        this.direccionEnvio = direccionEnvio;
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public List<ItemPedidoResponse> getItems() {
        return items;
    }

    public String getEstado() {
        return estado;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }
}