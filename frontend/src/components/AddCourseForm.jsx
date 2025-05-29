import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed

function AddCourseForm({ onCourseAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [teacherId, setTeacherId] = useState(''); // Stores the ID of the teacher

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const newCourse = {
            title,
            description,
            teacher_id: parseInt(teacherId), // Convert teacherId to an integer
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/courses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add course');
            }

            const addedCourse = await response.json();
            console.log('Course added successfully:', addedCourse);
            toast.success('Course added successfully!');

            // Clear the form
            setTitle('');
            setDescription('');
            setTeacherId('');

            // Notify parent component (App.jsx) that a new course was added
            // This will trigger a re-fetch of courses in App.jsx
            if (onCourseAdded) {
                onCourseAdded();
            }

        } catch (error) {
            console.error('Error adding course:', error.message);
            toast.error(`Error adding course: ${error.message}`);
        }
    };

    return (
        <div className="add-course-form-container p-4 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="teacherId" className="block text-sm font-medium text-gray-300">Teacher ID:</label>
                    <input
                        type="number" // Use type="number" for IDs
                        id="teacherId"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                        **Note:** Ensure this ID belongs to an existing user with 'teacher' or 'admin' role.
                    </p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Course
                </button>
            </form>
        </div>
    );
}

export default AddCourseForm;