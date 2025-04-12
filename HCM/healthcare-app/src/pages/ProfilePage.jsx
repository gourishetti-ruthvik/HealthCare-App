// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
// Assume you have an updateUser function in your authService or a dedicated userService
// import { updateUserProfile } from '../services/userService'; // Example import
// import { updateStoredUser } from '../services/authService'; // Example import for local storage update

const ProfilePage = () => {
    // Destructure setCurrentUser if available and needed for immediate UI update
    const { currentUser, loading, setCurrentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '', // Add username
        role: '',     // Add role
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data when currentUser loads or changes
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                username: currentUser.username || '', // Initialize username
                role: currentUser.role || '',         // Initialize role
            });
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <LoadingSpinner />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-center text-red-500 text-lg">Could not load user profile.</p>
            </div>
        );
    }

    // Helper to display data or a placeholder
    const displayData = (data, placeholder = 'Not Provided') => (
        data || <span className="text-gray-400 italic">{placeholder}</span>
    );

    const handleInputChange = (e) => {
        const { id, value, name, type, checked } = e.target;
        // Handle radio buttons for role specifically
        if (type === 'radio' && name === 'role') {
            setFormData((prevData) => ({
                ...prevData,
                role: value,
            }));
        } else {
            // Handle other inputs using id
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
        // Reset form data to original currentUser data
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                username: currentUser.username || '', // Reset username
                role: currentUser.role || '',         // Reset role
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation (add more as needed)
        if (!formData.name || !formData.username || !formData.role) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSaving(true);

        try {
            // --- Placeholder for actual update logic ---
            // You NEED a function like `updateUserProfile` in your service layer.
            // This function must securely handle updates, especially for username and role.
            // await updateUserProfile(currentUser.id, formData);
            console.log("Saving profile data:", formData); // Placeholder log
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // --- End Placeholder ---

            // Create the updated user object based on formData
            const updatedUser = {
                ...currentUser,
                name: formData.name,
                username: formData.username,
                role: formData.role,
            };

            // If the update is successful, update the context state (if possible)
            // This provides immediate UI feedback (e.g., Navbar name update)
            if (setCurrentUser) {
                 setCurrentUser(updatedUser); // Update context
                 // Also update the user in your persistent storage (e.g., localStorage)
                 // This ensures the user stays logged in with the updated info after refresh
                 // updateStoredUser(updatedUser); // You'd need this function in authService
            }


            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.message || 'Failed to update profile. Please try again.');
            // Optional: Revert formData if save fails? Or leave it for user to retry/cancel.
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 font-sans max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
                <form onSubmit={handleSave}>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Account Information</h2>

                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

                    <div className="space-y-4">
                        {/* Username (Editable) */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-medium text-gray-600">Username (Email):</span>
                            {isEditing ? (
                                <div className="col-span-2">
                                    <Input
                                        type="email"
                                        id="username" // Corresponds to formData key
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="mt-0 mb-0"
                                        required
                                    />
                                </div>
                            ) : (
                                <span className="col-span-2 text-gray-800">{displayData(currentUser.username)}</span>
                            )}
                        </div>

                        {/* Name (Editable) */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-medium text-gray-600">Full Name:</span>
                            {isEditing ? (
                                <div className="col-span-2">
                                    <Input
                                        type="text"
                                        id="name" // Corresponds to formData key
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your full name"
                                        className="mt-0 mb-0"
                                        required
                                    />
                                </div>
                            ) : (
                                <span className="col-span-2 text-gray-800">{displayData(currentUser.name)}</span>
                            )}
                        </div>

                        {/* Role (Editable) */}
                        <div className="grid grid-cols-3 gap-4 items-start pt-2"> {/* Use items-start for alignment */}
                            <span className="font-medium text-gray-600">Role:</span>
                            {isEditing ? (
                                <div className="col-span-2">
                                    {/* Role Selection - Use radio buttons */}
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="role" // Name groups the radio buttons
                                                value="patient"
                                                checked={formData.role === 'patient'}
                                                onChange={handleInputChange}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Patient</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="doctor"
                                                checked={formData.role === 'doctor'}
                                                onChange={handleInputChange}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Doctor</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-orange-600 mt-1">Warning: Changing role may affect your access.</p>
                                </div>
                            ) : (
                                <span className="col-span-2 text-gray-800 capitalize">{displayData(currentUser.role)}</span>
                            )}
                        </div>

                        {/* User ID (Not editable) */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-medium text-gray-600">User ID:</span>
                            <span className="col-span-2 text-gray-800 text-sm">{displayData(currentUser.id)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                        {isEditing ? (
                            <>
                                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        ) : (
                            <Button type="button" variant="primary" onClick={handleEdit}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
