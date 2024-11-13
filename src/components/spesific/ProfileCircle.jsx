// ProfileCircle.js
import React, { useEffect, useState } from 'react';
import { getProfileByName } from '../../services/profiles'; 
import ProfileModal from './ProfileModal';

const ProfileCircle = () => {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            // Get the name from local storage
            const name = localStorage.getItem('name'); 
            if (name) {
                const profileData = await getProfileByName(name);
                if (!profileData.error) {
                    setProfile(profileData);
                }
            }
        };

        fetchProfile();
    }, []);

    const handleCircleClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    if (!profile) return null; 
    console.log('profile: ', profile)


    // Extract initials from the name
    const initials = profile.data.name ? profile.data.name.charAt(0).toUpperCase() : '';

    return (
        <>
            <div
                className="profile-circle"
                onClick={handleCircleClick}
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    alignSelf: 'center',
                }}
            >
                {initials}
            </div>

            <ProfileModal show={showModal} handleClose={handleCloseModal} profile={profile} />
        </>
    );
};

export default ProfileCircle;
