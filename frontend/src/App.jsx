import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCourseForm from './components/AddCourseForm'; 

const API_BASE_URL = 'http://127.0.0.1:8000'; // my FastAPI backend URL

function App() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('student'); // Default role

  // --- Fetch Users ---
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users!');
    }
  };

  // --- Fetch Courses ---
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses!');
    }
  };

  // --- Create User ---
  const handleCreateUser = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUserName,
          email: newUserEmail,
          password: newUserPassword, // In a real app, this would be hashed
          role: newUserRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      setUsers([...users, newUser]); // Add new user to state
      toast.success('User created successfully!');
      // Clear form fields
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('student');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(`Failed to create user: ${error.message}`);
    }
  };

  // --- Initial Data Fetch ---
  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 dark:text-blue-400 mb-8">
            Smarter Education Portal
        </h1>

        {/* ToastContainer for notifications */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        {/* User Creation Form */}
        {/* Background and shadow adjusted for dark mode */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Username:</label>
                    <input
                        type="text"
                        id="username"
                        // Input field styles: Adjusted for dark mode text/background
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Role:</label>
                    <select
                        id="role"
                        // Select field styles: Adjusted for dark mode text/background
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>

        {/* Users List */}
        {/* Background and shadow adjusted for dark mode */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Users</h2>
            {users.length === 0 ? (
                <p>No users found. Try creating one!</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        // List item background and text adjusted for dark mode
                        <li key={user.id} className="bg-blue-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{user.username} ({user.role})</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        {/* Courses List */}
        {/* Background and shadow adjusted for dark mode */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg"> 

        {/* Section for Adding New Course */}
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Add New Course</h2>
        <AddCourseForm onCourseAdded={fetchCourses} /> {/* <-- The Add Course Form */}

        {/* Section for Displaying Courses List */}
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mt-8 mb-4">Available Courses</h2> 
        {courses.length === 0 ? (
            <p>No courses found.</p>
        ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <li key={course.id} className="bg-green-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{course.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Teacher: {course.teacher_username}</p>
                    </li>
                ))}
            </ul>
        )}
    </div>

        
    </div>
  );
}

export default App;