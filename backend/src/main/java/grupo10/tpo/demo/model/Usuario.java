package grupo10.tpo.demo.model;

import grupo10.tpo.demo.model.enums.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "usuario")
public class Usuario  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
}
