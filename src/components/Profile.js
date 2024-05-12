import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState({ firstname: '', lastname: '', username: '', avatar: '' });
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = React.createRef();

  // Dummy posts for demonstration
  const [posts, setPosts] = useState([
    { id: 1, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 1' },
    { id: 2, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 2' },
    { id: 3, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 3' },
    { id: 4, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 4' },
    { id: 5, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 5' },
    { id: 6, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 6' },
    { id: 7, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 7' },
    { id: 8, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 8' },
    // { id: 9, imageUrl: 'https://via.placeholder.com/300x300', caption: 'Caption 9' }
  ]);

  useEffect(() => {
    // Simulate fetching profile
    const fetchProfile = async () => {
      const username = id || localStorage.getItem("Username") || "user1";
      try {
        const [profileRes, followersRes, followingRes] = await Promise.all([
          axios.get(`/api/profile/${username}`),
          axios.get(`/api/followers/${username}`),
          axios.get(`/api/following/${username}`)
        ]);
        setUserProfile(profileRes.data);
        setFollowers(followersRes.data.length);
        setFollowing(followingRes.data.length);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpenLightbox(true);
  };

  const closeLightbox = () => {
    setOpenLightbox(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("Email");
    localStorage.removeItem("Token_id")
    localStorage.removeItem("Expiration");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img src={userProfile.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h1>{userProfile.username}</h1>
          <button className="btn follow-btn">Follow</button>
          <div className="stats">
            <p><strong>{posts.length}</strong> posts</p>
            <p><strong>{followers}</strong> followers</p>
            <p><strong>{following}</strong> following</p>
          </div>
          <p className="bio">
            {userProfile.firstname} {userProfile.lastname}<br />
            {/* Lifestyle | Travel | Photography */}
          </p>
        </div>
      </header>
      <div className="gallery">
        {Array.isArray(posts) && posts.map((post, index) => (
          <div key={post.id} className="gallery-item" onClick={() => handleImageClick(index)}>
            <img src={post.imageUrl} alt={post.caption} />
          </div>
        ))}
      </div>
      {openLightbox && (
        <Lightbox
          mainSrc={posts[selectedImageIndex].imageUrl}
          nextSrc={posts[(selectedImageIndex + 1) % posts.length].imageUrl}
          prevSrc={posts[(selectedImageIndex + posts.length - 1) % posts.length].imageUrl}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setSelectedImageIndex((selectedImageIndex + posts.length - 1) % posts.length)
          }
          onMoveNextRequest={() =>
            setSelectedImageIndex((selectedImageIndex + 1) % posts.length)
          }
        />
      )}
      <div className="LogoutBtn"><button onClick={handleLogout} className="logout-btn">Logout</button></div>
      <div className="home-button" onClick={() => navigate('/feed')}>
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
    </div>
  );
};

export default Profile;
