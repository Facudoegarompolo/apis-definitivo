package grupo10.tpo.demo.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Arrays;

@Service
public class JwtCookieService {

    public static final String COOKIE_NAME = "access_token";

    private final long expiration;
    private final boolean secure;
    private final String sameSite;

    public JwtCookieService(@Value("${jwt.expiration}") long expiration,
                            @Value("${jwt.cookie.secure:false}") boolean secure,
                            @Value("${jwt.cookie.same-site:Lax}") String sameSite) {
        this.expiration = expiration;
        this.secure = secure;
        this.sameSite = sameSite;
    }

    public ResponseCookie createCookie(String token) {
        return buildCookie(token, Duration.ofMillis(expiration));
    }

    public ResponseCookie deleteCookie() {
        return buildCookie("", Duration.ZERO);
    }

    public String getToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private ResponseCookie buildCookie(String value, Duration maxAge) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
