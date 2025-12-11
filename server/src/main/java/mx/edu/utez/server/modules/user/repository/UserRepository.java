package mx.edu.utez.server.modules.user.repository;

import mx.edu.utez.server.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
