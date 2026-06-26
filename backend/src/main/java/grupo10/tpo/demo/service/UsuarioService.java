package grupo10.tpo.demo.service;

import grupo10.tpo.demo.dto.usuario.AuthResponse;
import grupo10.tpo.demo.dto.usuario.UsuarioRegistroRequest;
import grupo10.tpo.demo.dto.usuario.UsuarioResponse;
import grupo10.tpo.demo.exception.RecursosDuplicadosException;
import grupo10.tpo.demo.exception.usuario.UsuarioNotFoundException;
import grupo10.tpo.demo.model.Usuario;
import grupo10.tpo.demo.model.enums.Rol;
import grupo10.tpo.demo.repository.UsuarioRepository;
import grupo10.tpo.demo.repository.FavoritoRepository;
import grupo10.tpo.demo.security.JwtService;
import grupo10.tpo.demo.security.LoginRequest;
import jakarta.transaction.Transactional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FavoritoRepository favoritoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager,
                          FavoritoRepository favoritoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.favoritoRepository = favoritoRepository;
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().name()
        );
    }

    public List<UsuarioResponse> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse getUser(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));
        return toResponse(usuario);
    }

    public UsuarioResponse getUserByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));
        return toResponse(usuario);
    }

    public AuthResponse registrarUsuario(UsuarioRegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RecursosDuplicadosException("Ya existe un usuario con ese email");
        }
        

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.ROLE_USER);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuarioGuardado);

        return new AuthResponse(token, toResponse(usuarioGuardado));
    }
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        String token = jwtService.generateToken(usuario);

        return new AuthResponse(token, toResponse(usuario));
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNotFoundException("Usuario no encontrado");
        }
        favoritoRepository.deleteAllByUsuario_Id(id);
        usuarioRepository.deleteById(id);
    }
}
