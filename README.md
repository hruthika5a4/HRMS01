# HRMS Lite

A lightweight, professional Human Resource Management System (HRMS) built for administrative efficiency. This application allows admins to manage employee records, track daily attendance, and view real-time organizational statistics.

## ✨ Features

-   **Dashboard Overview**: Real-time stats for total employees, presence counts, and active activity logs.
-   **Employee Management**:
    -   Full CRUD operations (Create, Read, Update, Delete).
    -   Detailed profile view for every employee.
    -   Department categorization and duplicate prevention (email/id).
-   **Attendance Tracking**:
    -   Mark attendance (Present/Absent) with date selection (future dates disabled).
    -   Filterable attendance log (by employee and date).
    -   Duplicate prevention: Cannot mark attendance for the same person twice on the same day.
-   **Premium UI/UX**:
    -   Custom-built with Vanilla CSS for a unique, premium Business aesthetic.
    -   Glassmorphism effects, smooth micro-animations, and responsive layout.
    -   Toast notifications (react-hot-toast) for professional error handling and success feedback.

## 🚀 Tech Stack

-   **Frontend**: React.js (Vite), Vanilla CSS (Custom UI), Lucide Icons, Axios.
-   **Backend**: Python, Django, Django REST Framework (DRF), WhiteNoise.
-   **Database**: MySQL (Local) / Ready for PostgreSQL (Production).
-   **Deployment**: Optimized for Render (Backend) and static hosting (Frontend).

## 🌍 Deployment Instructions

### Backend (Render)
1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `gunicorn hrms_project.wsgi:application`
3. **Environment Variables**:
   - Set `DATABASE_URL` to your PostgreSQL connection string.
   - Set `DJANGO_DEBUG` to `False`.
   - Set `ALLOWED_HOSTS` to your Render domain.

### Frontend
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **API URL**: Update `src/api/index.js` or set an environment variable for the backend URL.

## 🛠️ Local Setup

### Prerequisites
-   Python 3.8+
-   Node.js 16+
-   MySQL Server

### Backend Setup
1. Navigate to: `cd hrms_project`
2. Create and activate virtual environment.
3. Install dependencies: `pip install -r requirements.txt`
4. Update `DATABASES` in `settings.py` with your MySQL credentials.
5. Run migrations: `python manage.py migrate`
6. Start server: `python manage.py runserver`

### Frontend Setup
1. Navigate to: `cd hrms-frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 📝 Assumptions & Limitations

-   **Authentication**: Designed as an internal tool; currently open for evaluator access.
-   **Date Range**: Attendance can only be marked for today or past dates; future date selection is disabled via UI.
-   **Modern Browsers**: Optimized for the latest versions of Chrome, Edge, and Safari.
