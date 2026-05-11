class LifeCareApp {
    constructor() {
        this.currentPage = 'home';
        this.dashboardData = this.initializeDashboardData();
        this.init();
    }

    // Initialize app
    init() {
        this.renderApp();
        this.setupEventListeners();
    }

    // Initialize dashboard data
    initializeDashboardData() {
        const stored = localStorage.getItem('dashboardData');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            tasks: [],
            health: { water: 0, sleep: 0, exercise: 0 },
            budget: { limit: 1000, spent: 450 },
            schedules: [],
            mood: [],
            notes: []
        };
    }

    // Save dashboard data
    saveDashboardData() {
        localStorage.setItem('dashboardData', JSON.stringify(this.dashboardData));
    }

    // Render main app
    renderApp() {
        const app = document.getElementById('app');
        
        if (authManager.isLoggedIn()) {
            app.innerHTML = this.renderDashboardLayout();
        } else {
            app.innerHTML = this.renderLoginLayout();
        }
    }

    // Render Login Layout
    renderLoginLayout() {
        return `
            ${this.renderNavigation()}
            ${this.renderLoginPage()}
        `;
    }

    // Render Dashboard Layout
    renderDashboardLayout() {
        return `
            ${this.renderDashboardNavigation()}
            <div class="dashboard-container">
                <aside class="dashboard-sidebar">
                    ${this.renderDashboardSidebar()}
                </aside>
                <main class="dashboard-main">
                    ${this.renderDashboardContent()}
                </main>
            </div>
            ${this.renderModals()}
        `;
    }

    // Render Navigation Bar
    renderNavigation() {
        const currentPage = this.currentPage;
        return `
            <header>
                <nav class="navbar">
                    <a class="navbar-brand" onclick="app.navigateTo('home')">LifeCare</a>
                    <div class="hamburger" id="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul class="nav-menu" id="navMenu">
                        <li><a class="nav-link ${currentPage === 'home' ? 'active' : ''}" onclick="app.navigateTo('home')">Home</a></li>
                        <li><a class="nav-link ${currentPage === 'features' ? 'active' : ''}" onclick="app.navigateTo('features')">Features</a></li>
                        <li><a class="nav-link ${currentPage === 'about' ? 'active' : ''}" onclick="app.navigateTo('about')">About</a></li>
                        <li><a class="nav-link ${currentPage === 'contact' ? 'active' : ''}" onclick="app.navigateTo('contact')">Contact</a></li>
                    </ul>
                </nav>
            </header>
        `;
    }

    // Render Dashboard Navigation
    renderDashboardNavigation() {
        const user = authManager.getCurrentUser();
        return `
            <header>
                <nav class="navbar">
                    <a class="navbar-brand" onclick="app.navigateTo('dashboard')">LifeCare</a>
                    <div class="hamburger" id="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="navbar-right">
                        <div class="user-info">Hi, ${user.nickname} (${user.role})</div>
                        <a class="nav-link" onclick="app.navigateTo('profile')" style="color: white;">Profile</a>
                        <button class="logout-btn" onclick="app.logout()">Logout</button>
                    </div>
                </nav>
            </header>
        `;
    }

    // Render Login Page
    renderLoginPage() {
        return `
            <div class="login-page">
                <div class="login-container">
                    <h1>Login to LifeCare</h1>
                    <p class="login-subtitle">Manage your health, academics, and life</p>
                    <div class="error-message" id="errorMessage"></div>
                    <form onsubmit="app.handleLogin(event)">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" name="role" required>
                                <option value="">Select a role</option>
                                <option value="Nursing Student">Nursing Student</option>
                                <option value="Student">Student</option>
                                <option value="Professional">Professional</option>
                            </select>
                        </div>
                        <button type="submit" class="login-button">Login</button>
                    </form>
                    <p style="text-align: center; margin-top: 1.5rem; color: #7F8C8D; font-size: 0.9rem;">
                        Demo credentials: student@lifecare.com / password123
                    </p>
                </div>
            </div>
        `;
    }

    // Render Dashboard Sidebar
    renderDashboardSidebar() {
        return `
            <ul class="sidebar-menu">
                <li class="sidebar-item ${this.currentPage === 'dashboard' ? 'active' : ''}">
                    <a onclick="app.navigateTo('dashboard')">Dashboard</a>
                </li>
                <li class="sidebar-item">
                    <a onclick="app.openModal('academicPlanner')">Smart Academic Planner</a>
                </li>
                <li class="sidebar-item">
                    <a onclick="app.openModal('health')">Health & Wellness</a>
                </li>
                <li class="sidebar-item">
                    <a onclick="app.openModal('mentalHealth')">Mental Health</a>
                </li>
                <li class="sidebar-item">
                    <a onclick="app.openModal('dailyLife')">Daily Life Tools</a>
                </li>
                <li class="sidebar-item">
                    <a onclick="app.openModal('studentSupport')">Student Support</a>
                </li>
                <li class="sidebar-item ${this.currentPage === 'profile' ? 'active' : ''}">
                    <a onclick="app.navigateTo('profile')">Profile</a>
                </li>
            </ul>
        `;
    }

    // Render Dashboard Content
    renderDashboardContent() {
        if (this.currentPage === 'profile') {
            return this.renderProfilePage();
        }

        return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Dashboard Overview</h1>
            </div>
            <div class="dashboard-grid">
                ${this.renderDashboardCards()}
            </div>
        `;
    }

    // Render Dashboard Cards
    renderDashboardCards() {
        const cards = [
            {
                id: 'academicPlanner',
                title: 'Smart Academic Planner',
                stat: `${this.dashboardData.tasks.length} Tasks`,
                description: 'Manage schedules & assignments',
                onclick: 'app.openModal("academicPlanner")'
            },
            {
                id: 'health',
                title: 'Health & Wellness',
                stat: `${this.dashboardData.health.water}ml Water`,
                description: 'Track health metrics',
                onclick: 'app.openModal("health")'
            },
            {
                id: 'mentalHealth',
                title: 'Mental Health',
                stat: 'Mood Tracking',
                description: 'Support & wellness',
                onclick: 'app.openModal("mentalHealth")'
            },
            {
                id: 'dailyLife',
                title: 'Daily Life Tools',
                stat: `$${this.dashboardData.budget.spent}/$${this.dashboardData.budget.limit}`,
                description: 'Budget & habits',
                onclick: 'app.openModal("dailyLife")'
            },
            {
                id: 'schedules',
                title: 'Scheduled Duties',
                stat: `${this.dashboardData.schedules.length} Duties`,
                description: 'Manage shifts',
                onclick: 'app.openModal("schedules")'
            },
            {
                id: 'studentSupport',
                title: 'Student Support',
                stat: 'Community',
                description: 'Peer support & tips',
                onclick: 'app.openModal("studentSupport")'
            }
        ];

        return cards.map(card => `
            <div class="dashboard-card" onclick="${card.onclick}">
                <h3>${card.title}</h3>
                <p class="dashboard-card-content">${card.description}</p>
                <div class="dashboard-card-stat">${card.stat}</div>
            </div>
        `).join('');
    }

    // Render Modals
    renderModals() {
        return `
            <div id="academicPlannerModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Smart Academic Planner</h2>
                        <button class="close-btn" onclick="app.closeModal('academicPlanner')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h3>Add New Task/Assignment</h3>
                        <div class="form-group">
                            <label>Task Name</label>
                            <input type="text" id="taskName" placeholder="Enter task name">
                        </div>
                        <div class="form-group">
                            <label>Deadline</label>
                            <input type="date" id="taskDeadline">
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select id="taskPriority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <h4>Current Tasks:</h4>
                            <div id="tasksList">${this.dashboardData.tasks.map((t, i) => `
                                <div style="padding: 0.5rem; border-bottom: 1px solid #eee;">
                                    ${t.name} - ${t.priority} - ${t.deadline}
                                </div>
                            `).join('')}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.addTask()">Add Task</button>
                        <button class="btn-cancel" onclick="app.closeModal('academicPlanner')">Close</button>
                    </div>
                </div>
            </div>

            <div id="healthModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Health & Wellness Monitoring</h2>
                        <button class="close-btn" onclick="app.closeModal('health')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Water Intake (ml)</label>
                            <input type="number" id="waterIntake" placeholder="Enter ml" value="${this.dashboardData.health.water}">
                        </div>
                        <div class="form-group">
                            <label>Sleep Hours</label>
                            <input type="number" id="sleepHours" placeholder="Enter hours" step="0.5" value="${this.dashboardData.health.sleep}">
                        </div>
                        <div class="form-group">
                            <label>Physical Activity (minutes)</label>
                            <input type="number" id="exercise" placeholder="Enter minutes" value="${this.dashboardData.health.exercise}">
                        </div>
                        <div class="form-group">
                            <label>Medication Reminder</label>
                            <input type="text" id="medication" placeholder="Enter medication & time">
                        </div>
                        <div class="form-group">
                            <label>Meal Log</label>
                            <input type="text" id="mealLog" placeholder="What did you eat?">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.saveHealth()">Save Health Data</button>
                        <button class="btn-cancel" onclick="app.closeModal('health')">Close</button>
                    </div>
                </div>
            </div>

            <div id="mentalHealthModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Mental Health & Stress Support</h2>
                        <button class="close-btn" onclick="app.closeModal('mentalHealth')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Today's Mood</label>
                            <select id="mood">
                                <option value="">Select mood</option>
                                <option value="Happy">Happy</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Sad">Sad</option>
                                <option value="Stressed">Stressed</option>
                                <option value="Anxious">Anxious</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Stress Level (1-10)</label>
                            <input type="number" id="stressLevel" min="1" max="10" placeholder="Rate your stress">
                        </div>
                        <div class="form-group">
                            <label>Journal Entry</label>
                            <textarea id="journalEntry" placeholder="Write your thoughts..." style="width: 100%; padding: 0.75rem; border: 2px solid #D6E4F5; border-radius: 6px; font-family: Roboto; min-height: 150px;"></textarea>
                        </div>
                        <div style="background-color: #D6E4F5; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                            <h4>Guided Breathing Exercise</h4>
                            <p>Inhale for 4 seconds, hold for 4, exhale for 4. Repeat 5 times.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.saveMentalHealth()">Save Entry</button>
                        <button class="btn-cancel" onclick="app.closeModal('mentalHealth')">Close</button>
                    </div>
                </div>
            </div>

            <div id="dailyLifeModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Daily Life Management Tools</h2>
                        <button class="close-btn" onclick="app.closeModal('dailyLife')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="background-color: #D6E4F5; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                            <h4>Budget Tracker</h4>
                            <p>Budget: $${this.dashboardData.budget.limit}</p>
                            <p>Spent: $${this.dashboardData.budget.spent}</p>
                            <p>Remaining: $${this.dashboardData.budget.limit - this.dashboardData.budget.spent}</p>
                        </div>
                        <div class="form-group">
                            <label>Add Expense</label>
                            <input type="number" id="expenseAmount" placeholder="Amount" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="expenseCategory">
                                <option value="Groceries">Groceries</option>
                                <option value="Transport">Transport</option>
                                <option value="Health">Health</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Habit Tracker</label>
                            <input type="text" id="habitName" placeholder="Enter habit (e.g., Exercise, Study)">
                        </div>
                        <div class="form-group">
                            <label>Personal Notes</label>
                            <textarea id="personalNotes" placeholder="Quick notes..." style="width: 100%; padding: 0.75rem; border: 2px solid #D6E4F5; border-radius: 6px; font-family: Roboto; min-height: 100px;"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.saveDailyLife()">Save</button>
                        <button class="btn-cancel" onclick="app.closeModal('dailyLife')">Close</button>
                    </div>
                </div>
            </div>

            <div id="schedulesModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Scheduled Duties</h2>
                        <button class="close-btn" onclick="app.closeModal('schedules')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Duty Type</label>
                            <input type="text" id="dutyType" placeholder="e.g., Clinical Shift, Lab">
                        </div>
                        <div class="form-group">
                            <label>Date & Time</label>
                            <input type="datetime-local" id="dutyDateTime">
                        </div>
                        <div class="form-group">
                            <label>Duration (hours)</label>
                            <input type="number" id="dutyDuration" placeholder="Hours" step="0.5">
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea id="dutyNotes" placeholder="Bring stethoscope, etc..." style="width: 100%; padding: 0.75rem; border: 2px solid #D6E4F5; border-radius: 6px; font-family: Roboto; min-height: 100px;"></textarea>
                        </div>
                        <div>
                            <h4>Scheduled Duties:</h4>
                            <div id="schedulesList">${this.dashboardData.schedules.map((s, i) => `
                                <div style="padding: 0.5rem; border-bottom: 1px solid #eee;">
                                    ${s.type} - ${s.dateTime}
                                </div>
                            `).join('')}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.addSchedule()">Add Duty</button>
                        <button class="btn-cancel" onclick="app.closeModal('schedules')">Close</button>
                    </div>
                </div>
            </div>

            <div id="studentSupportModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Student Support System</h2>
                        <button class="close-btn" onclick="app.closeModal('studentSupport')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="background-color: #70AD47; color: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                            <h4>Motivational Quote</h4>
                            <p style="font-style: italic;">${this.getMotivationalQuote()}</p>
                        </div>
                        <div class="form-group">
                            <label>Find Study Group</label>
                            <select id="studyGroup">
                                <option value="">Select subject</option>
                                <option value="Anatomy">Anatomy</option>
                                <option value="Pharmacology">Pharmacology</option>
                                <option value="Nursing">Nursing</option>
                                <option value="Biology">Biology</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Emergency Contacts</label>
                            <input type="text" id="emergencyContact" placeholder="Name & Phone">
                        </div>
                        <div style="background-color: #FFF3CD; padding: 1rem; border-radius: 6px;">
                            <h4>Self-Care Recommendations</h4>
                            <p>📌 Take a 5-minute break every hour</p>
                            <p>📌 Stay hydrated throughout the day</p>
                            <p>📌 Practice deep breathing exercises</p>
                            <p>📌 Get at least 7-8 hours of sleep</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" onclick="app.saveStudentSupport()">Save</button>
                        <button class="btn-cancel" onclick="app.closeModal('studentSupport')">Close</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Profile Page
    renderProfilePage() {
        const user = authManager.getCurrentUser();
        return `
            <div class="profile-page">
                <div class="profile-card">
                    <h2>Edit Profile</h2>
                    <div class="profile-form-group">
                        <label>Nickname</label>
                        <input type="text" id="profileNickname" value="${user.nickname}">
                    </div>
                    <div class="profile-form-group">
                        <label>Email</label>
                        <input type="email" id="profileEmail" value="${user.email}">
                    </div>
                    <div class="profile-form-group">
                        <label>Role</label>
                        <input type="text" value="${user.role}" disabled style="background-color: #f5f5f5;">
                    </div>
                    <button class="btn-update" onclick="app.updateProfile()">Update Profile</button>
                </div>
            </div>
        `;
    }

    // Render Home Page
    renderHomePage() {
        return `
            ${this.renderNavigation()}
            <div class="home-page">
                <section class="hero">
                    <h1>LifeCare</h1>
                    <p class="hero-tagline">Stay healthy. Stay organized. Stay prepared. Stay in control.</p>
                    <button class="cta-button" onclick="app.navigateTo('login')">Get Started</button>
                </section>

                <section class="what-is-lifecare">
                    <h2>What is LifeCare?</h2>
                    <p>LifeCare is an all-in-one student companion that helps students organize their schedules, track their health, manage stress, and stay productive every day.</p>
                </section>

                <section class="core-features">
                    <h2 class="features-title">Core Features of LifeCare</h2>
                    <div class="features-grid">
                        <div class="feature-card" onclick="app.navigateTo('features')">
                            <h3>Smart Academic Planner</h3>
                            <p>Organize your class and clinical schedules, track tasks and assignments, set deadline reminders, keep an eye on examination countdowns, and manage your workload with priority-based to-do lists.</p>
                        </div>
                        <div class="feature-card" onclick="app.navigateTo('features')">
                            <h3>Health and Wellness Monitoring</h3>
                            <p>Track your water intake, monitor your sleep patterns, set medication reminders, log your meals and nutrition, and stay active with physical activity tracking.</p>
                        </div>
                        <div class="feature-card" onclick="app.navigateTo('features')">
                            <h3>Mental Health and Stress Support</h3>
                            <p>Track your mood, check your stress levels, practice guided breathing and relaxation exercises, get motivational support and wellness tips, and reflect on your day with a journaling feature.</p>
                        </div>
                        <div class="feature-card" onclick="app.navigateTo('features')">
                            <h3>Daily Life Management Tools</h3>
                            <p>Stay on track with a habit tracker, manage your budget and expenses, keep personal notes and to-do lists, and store emergency contacts and quick-access resources.</p>
                        </div>
                        <div class="feature-card" onclick="app.navigateTo('features')">
                            <h3>Student Support System</h3>
                            <p>Connect with peer support through the community feature, receive academic encouragement, get self-care recommendations based on stress levels, and use personalized reminders and productivity insights to optimize your day.</p>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    // Render Features Page
    renderFeaturesPage() {
        return `
            ${this.renderNavigation()}
            <div class="features-page">
                <h2>LifeCare Features</h2>

                <div class="feature-section">
                    <h3>Smart Academic Planner</h3>
                    <ul class="feature-list">
                        <li>Class and clinical schedule organizer</li>
                        <li>Task and assignment tracker</li>
                        <li>Deadline reminders</li>
                        <li>Examination countdowns</li>
                        <li>Priority-based to-do lists</li>
                    </ul>
                </div>

                <div class="feature-section">
                    <h3>Health and Wellness Monitoring</h3>
                    <ul class="feature-list">
                        <li>Water intake tracker</li>
                        <li>Sleep monitoring</li>
                        <li>Medication reminders</li>
                        <li>Meal and nutrition logs</li>
                        <li>Physical activity tracking</li>
                    </ul>
                </div>

                <div class="feature-section">
                    <h3>Mental Health and Stress Support</h3>
                    <ul class="feature-list">
                        <li>Mood tracker</li>
                        <li>Stress level check-ins</li>
                        <li>Guided breathing and relaxation exercises</li>
                        <li>Motivational support and wellness tips</li>
                        <li>Journaling feature</li>
                    </ul>
                </div>

                <div class="feature-section">
                    <h3>Daily Life Management Tools</h3>
                    <ul class="feature-list">
                        <li>Habit tracker</li>
                        <li>Budget and expense tracker</li>
                        <li>Personal notes and checklist organizer</li>
                        <li>Emergency contacts and quick-access resources</li>
                    </ul>
                </div>

                <div class="feature-section">
                    <h3>Student Support System</h3>
                    <ul class="feature-list">
                        <li>Peer support/community feature</li>
                        <li>Academic encouragement tools</li>
                        <li>Self-care recommendations based on stress indicators</li>
                        <li>Personalized reminders and productivity insights</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Render About Page
    renderAboutPage() {
        return `
            ${this.renderNavigation()}
            <div class="about-page">
                <h2>About LifeCare</h2>

                <div class="about-section">
                    <h3>What is LifeCare?</h3>
                    <p>LifeCare: A Student Health & Life Management Companion is a comprehensive mobile application designed to help students manage their academic responsibilities, health, wellness, and daily routines in one place. Targeted particularly at nursing students and those in demanding academic programs, LifeCare provides tools to organize tasks, track health, monitor mental well-being, and offer emotional support. With its integrated platform, LifeCare empowers students to balance academic excellence with personal well-being.</p>
                </div>

                <div class="about-section">
                    <h3>Our Mission</h3>
                    <p>Our mission is to empower students to succeed academically, emotionally, and physically with LifeCare, an all-in-one digital companion. It helps students manage their academic workload, track physical and mental health, and maintain a balanced lifestyle through task management, wellness monitoring, emotional support, and self-care recommendations. Our goal is to enhance productivity, well-being, and academic success.</p>
                </div>

                <div class="about-section">
                    <h3>Our Vision</h3>
                    <p>We envision a future where students can effortlessly balance academic responsibilities, health, and personal life. LifeCare aims to be the leading tool that helps students manage tasks, prioritize self-care, and achieve their goals. Our vision is to build a community of students who are mentally healthy, physically active, and academically successful by providing the tools needed for success in both their studies and personal lives.</p>
                </div>
            </div>
        `;
    }

    // Render Contact Page
    renderContactPage() {
        return `
            ${this.renderNavigation()}
            <div class="contact-page">
                <h2>Contact LifeCare</h2>

                <div class="contact-info">
                    <div class="contact-item">
                        <label>Email</label>
                        <p><a href="mailto:lifecare000222@gmail.com" style="color: #5B9BD5; text-decoration: none;">lifecare000222@gmail.com</a></p>
                    </div>

                    <div class="contact-item">
                        <label>Phone</label>
                        <p><a href="tel:09063088746" style="color: #5B9BD5; text-decoration: none;">09063088746</a></p>
                    </div>

                    <div class="contact-item">
                        <label>Location</label>
                        <p>Quezon City, Philippines</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle Login
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const result = authManager.login(email, password, role);
        const errorMsg = document.getElementById('errorMessage');

        if (result.success) {
            this.currentPage = 'dashboard';
            this.renderApp();
            this.setupEventListeners();
        } else {
            errorMsg.textContent = result.error;
            errorMsg.classList.add('show');
        }
    }

    // Logout
    logout() {
        authManager.logout();
        this.currentPage = 'home';
        this.renderApp();
        this.setupEventListeners();
    }

    // Navigate
    navigateTo(page) {
        this.currentPage = page;
        
        if (page === 'login' && !authManager.isLoggedIn()) {
            this.renderApp();
        } else if (page === 'dashboard' && authManager.isLoggedIn()) {
            const app = document.getElementById('app');
            app.innerHTML = this.renderDashboardLayout();
        } else if (authManager.isLoggedIn() && page === 'profile') {
            const app = document.getElementById('app');
            app.innerHTML = this.renderDashboardLayout();
        } else {
            const app = document.getElementById('app');
            if (page === 'home') app.innerHTML = this.renderHomePage();
            else if (page === 'features') app.innerHTML = this.renderFeaturesPage();
            else if (page === 'about') app.innerHTML = this.renderAboutPage();
            else if (page === 'contact') app.innerHTML = this.renderContactPage();
        }
        
        this.setupEventListeners();
        window.scrollTo(0, 0);
    }

    // Open Modal
    openModal(modalType) {
        const modalId = modalType + 'Modal';
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Close Modal
    closeModal(modalType) {
        const modalId = modalType + 'Modal';
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Add Task
    addTask() {
        const name = document.getElementById('taskName').value;
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;

        if (name && deadline) {
            this.dashboardData.tasks.push({ name, deadline, priority });
            this.saveDashboardData();
            document.getElementById('taskName').value = '';
            document.getElementById('taskDeadline').value = '';
            alert('Task added successfully!');
            this.renderApp();
        } else {
            alert('Please fill in all fields');
        }
    }

    // Save Health Data
    saveHealth() {
        this.dashboardData.health.water = parseInt(document.getElementById('waterIntake').value) || 0;
        this.dashboardData.health.sleep = parseFloat(document.getElementById('sleepHours').value) || 0;
        this.dashboardData.health.exercise = parseInt(document.getElementById('exercise').value) || 0;
        
        this.saveDashboardData();
        alert('Health data saved!');
        this.closeModal('health');
        this.renderApp();
    }

    // Save Mental Health
    saveMentalHealth() {
        const mood = document.getElementById('mood').value;
        const stressLevel = document.getElementById('stressLevel').value;
        const journal = document.getElementById('journalEntry').value;
        
        if (mood || stressLevel || journal) {
            this.dashboardData.mood.push({
                date: new Date().toISOString().split('T')[0],
                mood,
                stressLevel,
                journal
            });
            this.saveDashboardData();
            alert('Mental health entry saved!');
            this.closeModal('mentalHealth');
            this.renderApp();
        }
    }

    // Save Daily Life
    saveDailyLife() {
        const expense = parseFloat(document.getElementById('expenseAmount').value) || 0;
        if (expense > 0) {
            this.dashboardData.budget.spent += expense;
        }
        this.saveDashboardData();
        alert('Daily life data saved!');
        this.closeModal('dailyLife');
        this.renderApp();
    }

    // Add Schedule
    addSchedule() {
        const type = document.getElementById('dutyType').value;
        const dateTime = document.getElementById('dutyDateTime').value;

        if (type && dateTime) {
            this.dashboardData.schedules.push({ type, dateTime });
            this.saveDashboardData();
            alert('Duty scheduled!');
            this.closeModal('schedules');
            this.renderApp();
        }
    }

    // Save Student Support
    saveStudentSupport() {
        alert('Support preferences saved!');
        this.closeModal('studentSupport');
    }

    // Update Profile
    updateProfile() {
        const nickname = document.getElementById('profileNickname').value;
        const email = document.getElementById('profileEmail').value;

        if (nickname && email) {
            const result = authManager.updateProfile(nickname, email);
            if (result.success) {
                alert('Profile updated successfully!');
                this.renderApp();
            }
        }
    }

    // Setup Event Listeners
    setupEventListeners() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    // Get Motivational Quote
    getMotivationalQuote() {
        const quotes = [
            "You've got this! Keep pushing forward!",
            "Success is just around the corner. Keep going!",
            "Every small step counts. You're doing great!",
            "Your hard work will pay off. Believe in yourself!",
            "Take a deep breath. You can handle this!"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}

// Initialize the app
const app = new LifeCareApp();
