export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.fullName = `${user.firstName} ${user.lastName}`;
        this.email = user.email;
        this.role = user.role;
        this.lastConnection = user.lastConnection;
        this.createdAt = user.createdAt;
        this.status = this.calculateStatus(user.lastConnection);
        this.avatar = this.generateAvatar(user.firstName, user.lastName);
    }

    calculateStatus(lastConnection) {
        if (!lastConnection) return 'Nunca conectado';
        const now = new Date();
        const diff = now - new Date(lastConnection);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days > 7) return 'Inactivo';
        if (days > 2) return 'Ausente';
        return 'Activo';
    }

    generateAvatar(firstName, lastName) {
        return {
            initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
            color: this.generateColor(firstName + lastName)
        };
    }

    generateColor(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    static from(user) {
        if (!user) return null;
        return new UserDTO(user);
    }

    static fromArray(users) {
        if (!users) return [];
        return users.map(user => UserDTO.from(user));
    }

    toJSON() {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email,
            role: this.role,
            status: this.status,
            lastConnection: this.lastConnection,
            createdAt: this.createdAt,
            avatar: this.avatar
        };
    }
} 