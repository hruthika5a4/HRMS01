# HRMS Lite

A lightweight, professional Human Resource Management System (HRMS) built for administrative efficiency. This application allows admins to manage employee records, track daily attendance, and view real-time organizational statistics.

## ✨ Features

-   **Dashboard Overview**: Real-time stats for total employees, attendance rates, and a "Top Performers" leaderboard.
-   **Employee Management**:
    -   Full CRUD operations (Create, Read, Update, Delete).
    -   Auto-generating unique Employee IDs (e.g., EMP001, EMP002).
    -   Detailed profile view with persistent attendance counts.
    -   Department categorization and duplicate prevention (email/id).
-   **Attendance Tracking**:
    -   Mark attendance (Present/Absent) with date selection.
    -   Filterable attendance log (by employee, date, and status).
    -   Full CRUD for logs (Marking, Formal Updating via Modal, and Deleting).
    -   One-click "Today" and "All History" filters.
-   **Premium UI/UX**:
    -   Modern Dark Zinc theme with Violet/Indigo accents.
    -   Glassmorphism effects, smooth micro-animations, and responsive layout.
    -   Loading, empty, and error states for a robust user experience.
    -   Toast notifications for immediate action feedback.

## 🚀 Tech Stack

-   **Frontend**: React.js (Vite), Tailwind CSS (Architecture), Lucide Icons, Axios.
-   **Backend**: Python, Django, Django REST Framework (DRF), WhiteNoise (Static serving).
-   **Database**: SQLite (Local) / Ready for PostgreSQL (Production).
-   **Deployment**: Optimized for Render (Backend) and Vercel (Frontend).

## 🌍 Deployment Instructions

The application is prepared for production with dynamic environment variables and static file management.

### Backend (e.g., Render/Railway)
1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `gunicorn hrms_project.wsgi:application`
3. **Env Vars**: Set `DJANGO_DEBUG` to `False` for production security.

### Frontend (e.g., Vercel/Netlify)
1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Env Vars**: Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-api.onrender.com/api/`).

## 🛠️ Local Setup

### Prerequisites
-   Python 3.8+
-   Node.js 16+ & npm

### Backend Setup
1. Navigate to: `cd hrms_project`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Unix)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start server: `python manage.py runserver`

### Frontend Setup
1. Navigate to: `cd hrms-frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 📝 Assumptions & Limitations

-   **Authentication**: Designed for a single-admin internal use-case; auth is bypassed for this evaluation.
-   **Employee ID**: Generated sequentially on the backend to ensure data integrity and uniqueness.
-   **Data Consistency**: Prevents marking multiple attendance records for the same employee on the same date.
-   **Responsive Design**: Optimized for desktop administrative workflows, with fluid layouts for tablet screens.
