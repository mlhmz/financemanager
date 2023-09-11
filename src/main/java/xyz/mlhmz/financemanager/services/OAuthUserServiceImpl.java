package xyz.mlhmz.financemanager.services;

import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.repositories.OAuthUserRepository;

import java.util.UUID;

@Service
@AllArgsConstructor
public class OAuthUserServiceImpl implements OAuthUserService {
    private final OAuthUserRepository oAuthUserRepository;

    @Override
    public OAuthUser createUser(OAuthUser oAuthUser) {
        return this.oAuthUserRepository.save(oAuthUser);
    }

    @Override
    public OAuthUser findUserByJwt(Jwt jwt) {
        UUID id = extractUuidFromJwt(jwt);
        return this.oAuthUserRepository.findById(id)
                .orElseGet(() -> this.createUser(OAuthUser.builder().oauthUserId(id).build()));
    }

    @Override
    public UUID extractUuidFromJwt(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
