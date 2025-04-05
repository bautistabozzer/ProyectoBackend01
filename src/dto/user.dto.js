export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.role = user.role;
        this.lastConnection = user.lastConnection;
        // Excluimos password y otros datos sensibles
    }

    static from(user) {
        if (!user) return null;
        return new UserDTO(user);
    }

    static fromArray(users) {
        if (!users) return [];
        return users.map(user => UserDTO.from(user));
    }
} 