// src/components/Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:3000/profile/1', { // Replace with actual user ID logic
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div>
            <h2>Your Profile</h2>
            {profileData ? (
                <>
                    <p>Username: {profileData.username}</p>
                    {/* Add more fields as necessary */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
