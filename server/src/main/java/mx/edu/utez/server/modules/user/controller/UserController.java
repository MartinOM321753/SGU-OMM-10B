// language: java
package mx.edu.utez.server.modules.user.controller;

import mx.edu.utez.server.modules.config.ApiResponse;
import mx.edu.utez.server.modules.user.controller.dto.UserDto;
import mx.edu.utez.server.modules.user.model.User;
import mx.edu.utez.server.modules.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<User>> create(@RequestBody UserDto userDto) {
        return userService.create(userDto);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> findAll() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> findById(@PathVariable Integer id) {
        return userService.findById(id);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateById(@PathVariable Integer id, @RequestBody UserDto userDto) {
        return userService.updateById(id, userDto);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> deleteById(@PathVariable Integer id) {
        return userService.deleteById(id);
    }
}