# TaskLite ⚡ 

**TaskLite** is a modern, full-stack MERN (MongoDB, Express.js, React, Node.js) task management workspace featuring interactive drag-and-drop Kanban boards, mobile-first responsive bottom navigation, instant status selectors, Clerk authentication integration, PDF task exports, real-time analytics, and advanced filtering.

---

## ✨ Features

- **Task Management**: Create, edit, delete, and organize daily tasks seamlessly.
- **Interactive Kanban Board**: Drag and drop tasks between `To Do`, `In Progress`, and `Done` columns with touch-friendly drag handles.
- **Status & Priority Tracking**: Assign priorities (`High`, `Medium`, `Low`) and due dates with overdue tracking.
- **Search & Filtering**: Quick search by title or description, and filter by status or priority.
- **Mobile-First Responsive UI**: Fixed mobile bottom navigation bar and mobile column view switcher.
- **PDF Export**: Export individual task details as formatted PDF documents.
- **User Authentication**: Integrated user sign-in and profile management.
- **Analytics Dashboard**: Real-time stats showing completion rates, total tasks, and overdue items.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Drag and Drop**: `@hello-pangea/dnd`
- **Routing & Notifications**: `react-router-dom` v7 + `react-hot-toast`
- **PDF Generation**: `jspdf` + `html2canvas`
- **Authentication**: `@clerk/clerk-react`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose ODM)
- **Utilities**: `dotenv`, `cors`, `nodemon`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB Database URI](https://www.mongodb.com/) (Local or MongoDB Atlas)

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Muhammed-Jasir-M/Task-Manager.git
   cd Task-Manager
   ```

2. **Configure Environment Variables**

   - **Backend Environment**: Copy `backend/.env.example` to `backend/.env`:
     ```env
     PORT=
     MONGODB_URI=
     FRONTEND_URL=
     ```

   - **Frontend Environment**: Copy `frontend/.env.example` to `frontend/.env`:
     ```env
     VITE_API_URL=
     VITE_CLERK_PUBLISHABLE_KEY=
     ```

3. **Install Dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

---

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`.

2. **Start Frontend Client**
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks |
| `GET` | `/api/tasks/:id` | Get a specific task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## 💻 Project Structure

```
Task-Manager/
├── backend/
│   ├── controllers/    
│   ├── models/         
│   ├── routes/         
│   ├── config/         
│   ├── app.js          
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/ 
│   │   ├── pages/      
│   │   ├── services/   
│   │   ├── App.jsx     
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 👤 Author

- **Muhammed Jasir M** - [GitHub Profile](https://github.com/Muhammed-Jasir-M)
