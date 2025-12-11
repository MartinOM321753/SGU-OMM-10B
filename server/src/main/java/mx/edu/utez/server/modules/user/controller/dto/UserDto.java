package mx.edu.utez.server.modules.user.controller.dto;

import lombok.Value;
import java.io.Serializable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Value
public class UserDto implements Serializable {
    @NotBlank(message = "El campo de nombre no puede estar vacio")
    @Size(max = 20, message = "El nombre de ser maximo de 20 caracteres")
    String name;

    @NotBlank(message = "El campo de apellido 1 no puede estar vacio")
    @Size(max = 20, message = "El nombre de ser maximo de 20 caracteres")
    String lastname1;

    @NotBlank(message = "El campo de apellido 2 no puede estar vacio")
    @Size(max = 20, message = "El nombre de ser maximo de 20 caracteres")
    String lastname2;

    @NotBlank(message = "El campo de email no puede estar vacio")
    @Email(message = "El email no cumple con un formato valido")
    String email;

    @Size(max = 10, message = "El numero telefonico debe ser maximo de 10 caracteres")
    String phoneNumber;

}