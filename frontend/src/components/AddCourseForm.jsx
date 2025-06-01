
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// handles both adding and editing courses
export default function AddCourseForm({ onCourseAdded, teachers, editingCourse, onCancelEdit, API_BASE_URL }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [teacherId, setTeacherId] = useState(''); // State to hold the selected teacher ID

    // Effect to populate form fields when editingCourse prop changes
    useEffect(() => {
        if (editingCourse) {
            // When editing, populate form fields with the course's data
            setTitle(editingCourse.title);
            setDescription(editingCourse.description || ''); // Use empty string if description is null/undefined
            // Ensure teacherId is set as a string for the <select> element
            setTeacherId(editingCourse.teacher_id ? String(editingCourse.teacher_id) : '');
        } else {
            // When not editing (e.g., after successful add/edit or cancel), clear form fields
            setTitle('');
            setDescription('');
            setTeacherId('');
        }
    }, [editingCourse]); // This effect runs whenever the editingCourse prop changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !teacherId) {
            toast.error("Title and Teacher must be provided.");
            return;
        }

        const courseData = {
            title: title,
            description: description,
            teacher_id: parseInt(teacherId, 10), // Ensure teacher_id is an integer for the API
        };

        try {
            let response;
            if (editingCourse) {
                // If editingCourse exists, it's an update operation (PUT request)
                response = await fetch(`${API_BASE_URL}/courses/${editingCourse.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(courseData),
                });
            } else {
                // Otherwise, it's a create operation (POST request)
                response = await fetch(`${API_BASE_URL}/courses/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(courseData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            // Clear form fields and notify parent component
            setTitle('');
            setDescription('');
            setTeacherId('');
            onCourseAdded(); // Trigger re-fetch of courses in App.jsx

            // Handle success messages and clear editing state
            if (editingCourse) {
                onCancelEdit(); // Clear editing state in parent after successful update
                toast.success("Course updated successfully!");
            } else {
                toast.success("Course created successfully!");
            }
        } catch (error) {
            console.error("Error submitting course:", error);
            toast.error(`Failed to ${editingCourse ? 'update' : 'create'} course: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="courseTitle" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Course Title:</label>
                <input
                    type="text"
                    id="courseTitle"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced React"
                    required
                />
            </div>
            <div>
                <label htmlFor="courseDescription" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description:</label>
                <textarea
                    id="courseDescription"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="A comprehensive course on..."
                ></textarea>
            </div>
            <div>
                <label htmlFor="courseTeacher" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Teacher:</label>
                <select
                    id="courseTeacher"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                    value={teacherId} // This value must match one of the <option> values
                    onChange={(e) => setTeacherId(e.target.value)}
                    required
                >
                    <option value="">Select a Teacher</option>
                    {teachers.map((user) => (
                        <option key={user.id} value={user.id}> {/* Option value is the numeric ID */}
                            {user.username} ({user.role})
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3">
                {editingCourse && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel Edit
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
            </div>
        </form>
    );
}
