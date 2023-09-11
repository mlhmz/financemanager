package xyz.mlhmz.financemanager.services;

import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.User;
import xyz.mlhmz.financemanager.exceptions.UserNotFoundException;
import xyz.mlhmz.financemanager.repositories.UserRepository;

import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return this.userRepository.save(user);
    }

    @Override
    public User findUserByJwt(Jwt jwt) {
        return this.userRepository.findById(extractUuidFromJwt(jwt)).orElseThrow(UserNotFoundException::new);
    }

    @Override
    public UUID extractUuidFromJwt(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
