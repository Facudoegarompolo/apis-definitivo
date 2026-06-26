package grupo10.tpo.demo.security;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletRequest;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class JwtCookieServiceTest {

    private final JwtCookieService jwtCookieService =
            new JwtCookieService(86_400_000, false, "Lax");

    @Test
    void createsHttpOnlyAuthenticationCookie() {
        ResponseCookie cookie = jwtCookieService.createCookie("signed-jwt");

        assertThat(cookie.getName()).isEqualTo(JwtCookieService.COOKIE_NAME);
        assertThat(cookie.getValue()).isEqualTo("signed-jwt");
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.isSecure()).isFalse();
        assertThat(cookie.getSameSite()).isEqualTo("Lax");
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofDays(1));
    }

    @Test
    void readsAuthenticationTokenFromCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(
                new Cookie("theme", "dark"),
                new Cookie(JwtCookieService.COOKIE_NAME, "signed-jwt")
        );

        assertThat(jwtCookieService.getToken(request)).isEqualTo("signed-jwt");
    }

    @Test
    void createsExpiredCookieForLogout() {
        ResponseCookie cookie = jwtCookieService.deleteCookie();

        assertThat(cookie.getValue()).isEmpty();
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ZERO);
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getPath()).isEqualTo("/");
    }
}
