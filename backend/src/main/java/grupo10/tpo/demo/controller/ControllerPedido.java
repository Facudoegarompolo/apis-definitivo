package grupo10.tpo.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import grupo10.tpo.demo.service.PedidoService;

import java.util.List;
import grupo10.tpo.demo.dto.pedido.PedidoResponse;
import grupo10.tpo.demo.dto.pedido.PedidoRequest;


@RestController
@RequestMapping("/api/pedidos")
public class ControllerPedido {
    @Autowired  
    private PedidoService pedidoService;

    ControllerPedido(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> getAllPedidos() {
        return pedidoService.getAllPedidos();
    }

    @GetMapping("/{id}")
    public PedidoResponse getPedidoById(@PathVariable Long id) {
        return pedidoService.getPedidoById(id);
    }
    
    @PostMapping
    public PedidoResponse crearPedido(@RequestBody PedidoRequest req) {
        return pedidoService.crearPedido(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
