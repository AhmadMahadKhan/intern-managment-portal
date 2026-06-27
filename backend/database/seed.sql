\c intern_portal;

INSERT INTO admins (username, password) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO interns (name, email, department, joining_date, attendance) VALUES
('Ali Hassan', 'ali.hassan@example.com', 'IT', '2024-01-15', TRUE),
('Sara Khan', 'sara.khan@example.com', 'HR', '2024-02-01', FALSE),
('Usman Tariq', 'usman.tariq@example.com', 'Marketing', '2024-01-20', TRUE),
('Fatima Malik', 'fatima.malik@example.com', 'Finance', '2024-03-05', FALSE),
('Bilal Ahmed', 'bilal.ahmed@example.com', 'IT', '2024-02-15', TRUE),
('Ayesha Siddiqui', 'ayesha.s@example.com', 'HR', '2024-03-10', TRUE),
('Hamza Raza', 'hamza.raza@example.com', 'Marketing', '2024-01-28', FALSE),
('Zainab Noor', 'zainab.noor@example.com', 'Finance', '2024-02-20', TRUE);

INSERT INTO tasks (intern_id, title, description, status) VALUES
(1, 'Setup Dev Environment', 'Install Node.js, PostgreSQL, and Git', 'Completed'),
(1, 'API Integration', 'Integrate REST APIs with frontend', 'Pending'),
(2, 'Onboarding Documentation', 'Prepare onboarding docs for new joiners', 'Completed'),
(3, 'Social Media Campaign', 'Design Q2 social media posts', 'Pending'),
(4, 'Monthly Report', 'Prepare April financial summary', 'Completed'),
(5, 'Database Optimization', 'Index key tables for performance', 'Pending'),
(6, 'Recruitment Drive', 'Coordinate campus recruitment', 'Pending'),
(7, 'Brand Kit Update', 'Refresh logos and color palette', 'Completed'),
(8, 'Budget Forecast', 'Q3 budget planning spreadsheet', 'Pending');