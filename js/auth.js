// Mock user database
const mockUsers = [
    { email: 'student@lifecare.com', password: 'password123', role: 'Student', name: 'Marjorie Student' },
    { email: 'nurse@lifecare.com', password: 'password123', role: 'Nursing Student', name: 'Juna Nurse' },
    { email: 'prof@lifecare.com', password: 'password123', role: 'Professional', name: 'Dr. Pascua Professional' }
];

class AuthManager {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Get stored user from localStorage
    getStoredUser() {
        const userData = localStorage.getItem('lifecareUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Login function
    login(email, password, role) {
        const user = mockUsers.find(
            u => u.email === email && u.password === password && u.role === role
        );

        if (user) {
            const userData = {
                email: user.email,
                role: user.role,
                name: user.name,
                nickname: user.name.split(' ')[0], // Default nickname is first name
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('lifecareUser', JSON.stringify(userData));
            this.currentUser = userData;
            return { success: true, user: userData };
        }

        return { success: false, error: 'Invalid login credentials!' };
    }

    // Logout function
    logout() {
        localStorage.removeItem('lifecareUser');
        this.currentUser = null;
    }

    // Update user profile
    updateProfile(nickname, email) {
        if (this.currentUser) {
            this.currentUser.nickname = nickname;
            this.currentUser.email = email;
            localStorage.setItem('lifecareUser', JSON.stringify(this.currentUser));
            return { success: true, user: this.currentUser };
        }
        return { success: false, error: 'No user logged in' };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

const authManager = new AuthManager();
