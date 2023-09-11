package xyz.mlhmz.financemanager.services;

import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.User;

import java.util.UUID;

public interface UserService {
    User createUser(User user);

    User findUserByJwt(Jwt jwt);

    UUID extractUuidFromJwt(Jwt jwt);
}
