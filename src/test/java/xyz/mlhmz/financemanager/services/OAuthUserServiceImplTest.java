package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.repositories.OAuthUserRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = {
        OAuthUserServiceImpl.class
})
class OAuthUserServiceImplTest {
    @MockBean
    Jwt jwt;
    @Autowired
    OAuthUserService oAuthUserService;
    @MockBean
    OAuthUserRepository oAuthUserRepository;

    @Test
    void findUserByJwt_WithExistingUserResultsInReturn() {
        UUID uuid = UUID.randomUUID();
        when(jwt.getSubject()).thenReturn(uuid.toString());

        OAuthUser user = OAuthUser.builder().oauthUserId(uuid).build();
        doReturn(Optional.of(user))
                .when(oAuthUserRepository)
                .findById(uuid);

        OAuthUser result = oAuthUserService.findUserByJwt(jwt);
        verify(oAuthUserRepository, times(0)).save(any());
        assertThat(result).isEqualTo(user);
    }


    @Test
    void findUserByJwt_WithNoExistingUserResultsInCreateUser() {
        UUID uuid = UUID.randomUUID();
        when(jwt.getSubject()).thenReturn(uuid.toString());
        oAuthUserService.findUserByJwt(jwt);
        verify(oAuthUserRepository, times(1)).save(any());
    }

    @Test
    void extractUuidFromJwt() {
        UUID uuid = UUID.randomUUID();
        when(jwt.getSubject()).thenReturn(uuid.toString());
        assertThat(oAuthUserService.extractUuidFromJwt(jwt)).isEqualTo(uuid);
    }
}