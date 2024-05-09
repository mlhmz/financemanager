package xyz.mlhmz.financemanager.config;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Order
    @Bean
    public SecurityFilterChain apiFilterChain(
            HttpSecurity http,
            ServerProperties serverProperties
    ) throws Exception {
        http.oauth2ResourceServer(server -> server.jwt(Customizer.withDefaults()));

        http.anonymous(anonymousConfigurer -> anonymousConfigurer.init(http));

        http.exceptionHandling(this::getHttpSecurityExceptionHandlingConfigurer);

        if (serverProperties.getSsl() != null && serverProperties.getSsl().isEnabled()) {
            http.requiresChannel(channelRequestMatcher -> channelRequestMatcher.anyRequest().requiresSecure());
        }

        http.authorizeHttpRequests(this::getRequestMatcherRegistry);

        return http.build();
    }

    private void getHttpSecurityExceptionHandlingConfigurer(
            ExceptionHandlingConfigurer<HttpSecurity> handling) {
        handling.authenticationEntryPoint((request, response, authException) -> {
            response.addHeader(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"" + authException.getMessage() +"\"");
            response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.getReasonPhrase());
        });
    }

    private void getRequestMatcherRegistry(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry authorizationManager) {
        authorizationManager.requestMatchers("/actuator/health", "/swagger/**", "/swagger-ui/**", "/v3/api-docs/**", "/graphiql/**")
                .permitAll()
                .anyRequest().authenticated();
    }
}
