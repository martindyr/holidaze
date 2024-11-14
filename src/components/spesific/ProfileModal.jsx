import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { getProfileByName, updateProfileByName } from '../../services/profiles'; // Ensure this path is correct

const ProfileModal = ({ show, handleClose }) => {
    const [profile, setProfile] = useState({});
    const [profileBio, setProfileBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [isVenueManager, setIsVenueManager] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const name = localStorage.getItem('name');
            if (name) {
                const profileData = await getProfileByName(name);
                setProfile(profileData);
                setProfileBio(profileData.data.bio || '');
                setAvatarUrl(profileData.data.avatar?.url || '');
                setBannerUrl(profileData.data.banner?.url || '');
                setIsVenueManager(profileData.data.venueManager || false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async () => {
        const profileName = localStorage.getItem('name'); 
        if (!profileName) {
            console.error("Profile name is undefined.");
            return;
        }

       
        if (!profileBio && !avatarUrl && !bannerUrl && !isVenueManager) {
            setError('Please fill out at least one field before saving.');
            return;
        }

        const dataToUpdate = {};
        if (profileBio) dataToUpdate.bio = profileBio;
        if (avatarUrl) dataToUpdate.avatar = { url: avatarUrl, alt: "User Avatar" };
        if (bannerUrl) dataToUpdate.banner = { url: bannerUrl, alt: "User Banner" };
        dataToUpdate.venueManager = isVenueManager; 

        const result = await updateProfileByName(profileName, dataToUpdate);
        if (result.error) {
            setError(result.message);
            setSuccess('');
        } else {
            setSuccess('Profile updated successfully!');
            setError('');
            // Optionally refresh the profile state
            setProfile(result);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <div 
                    className="profile-banner"
                    style={{
                        backgroundImage: `url(${bannerUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'flex-end', 
                        justifyContent: 'flex-end',
                    }}
                >
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt="Profile Avatar"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginBottom: '10px',
                                marginRight: '10px',
                                border: '4px solid white',
                            }}
                        />
                    )}
                </div>
                
                <Form>
                    <Form.Group controlId="profileBio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            value={profileBio} 
                            onChange={(e) => setProfileBio(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group controlId="avatarUrl">
                        <Form.Label>Avatar URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={avatarUrl} 
                            onChange={(e) => setAvatarUrl(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group controlId="bannerUrl">
                        <Form.Label>Banner URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={bannerUrl} 
                            onChange={(e) => setBannerUrl(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group controlId="venueManager">
                        <Form.Check 
                            type="checkbox" 
                            label="Venue Manager" 
                            checked={isVenueManager} 
                            onChange={(e) => setIsVenueManager(e.target.checked)} 
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleProfileUpdate}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProfileModal;
