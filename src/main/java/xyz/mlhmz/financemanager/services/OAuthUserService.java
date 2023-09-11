package xyz.mlhmz.financemanager.services;

import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.OAuthUser;

import java.util.UUID;

public interface OAuthUserService {
    OAuthUser createUser(OAuthUser oAuthUser);

    OAuthUser findUserByJwt(Jwt jwt);

    UUID extractUuidFromJwt(Jwt jwt);
}
