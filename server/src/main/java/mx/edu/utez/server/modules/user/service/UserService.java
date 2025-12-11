package mx.edu.utez.server.modules.user.service;

import mx.edu.utez.server.modules.config.ApiResponse;
import mx.edu.utez.server.modules.user.controller.dto.UserDto;
import mx.edu.utez.server.modules.user.model.User;
import mx.edu.utez.server.modules.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<ApiResponse<User>> create(UserDto userDto) {
        User newUser = User.builder()
                .name(userDto.getName())
                .lastname1(userDto.getLastname1())
                .lastname2(userDto.getLastname2())
                .email(userDto.getEmail())
                .phoneNumber(userDto.getPhoneNumber())
                .build();

        User savedUser = userRepository.save(newUser);

        ApiResponse<User> response = new ApiResponse<>(
                savedUser,
                "Usuario creado",
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<User>> findById(Integer id) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            ApiResponse<User> response = new ApiResponse<>(
                    null,
                    "Usuario no encontrado",
                    HttpStatus.NOT_FOUND
            );
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        ApiResponse<User> response = new ApiResponse<>(
                opt.get(),
                "Usuario encontrado",
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<List<User>>> findAll() {
        List<User> users = userRepository.findAll();
        ApiResponse<List<User>> response = new ApiResponse<>(
                users,
                "Lista de usuarios",
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<User>> updateById(Integer id, UserDto userDto) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            ApiResponse<User> response = new ApiResponse<>(
                    null,
                    "Usuario no encontrado",
                    HttpStatus.NOT_FOUND
            );
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        User user = opt.get();
        user.setName(userDto.getName());
        user.setLastname1(userDto.getLastname1());
        user.setLastname2(userDto.getLastname2());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        User savedUser = userRepository.save(user);

        ApiResponse<User> response = new ApiResponse<>(
                savedUser,
                "Usuario actualizado",
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<User>> deleteById(Integer id) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            ApiResponse<User> response = new ApiResponse<>(
                    null,
                    "Usuario no encontrado",
                    HttpStatus.NOT_FOUND
            );
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        User user = opt.get();
        userRepository.delete(user);

        ApiResponse<User> response = new ApiResponse<>(
                user,
                "Usuario eliminado",
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}