import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './styles/Profile.css';
import AWS from '../config/aws-config';

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState({ firstname: '', lastname: '', username: '', avatar: '' });
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow/unfollow
  const fileInputRef = React.createRef();
  const location = useLocation();
  const userId = location.state?.user_id;
  const s3 = new AWS.S3();

  // Dummy posts for demonstration
  const [posts, setPosts] = useState([]);
  const currentUserEmail = localStorage.getItem("Email");

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[1];
      const email = localStorage.getItem('Email');
      const sanitizedEmail = email.replace(/[@.]/g, '_');
      const params = {
        Bucket: 'socials-profile-pic-s3',
        Key: `/${sanitizedEmail}/profile_pic.${fileType}`,  // Ensure the path is correct
        Body: file
      };

      try {
        const data = await s3.upload(params).promise();
        console.log('Successfully uploaded avatar:', data.Location);
        setUserProfile(prevState => ({ ...prevState, avatar: data.Location }));
      } catch (err) {
        console.error('Error uploading avatar:', err);
        alert('Failed to upload avatar. Please try again.');
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();  // Trigger the hidden file input click
  };

  useEffect(() => {
    // Simulate fetching profile
    const fetchProfile = async () => {
      try {
        const response = await axios.post('https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/profile/abc', {
          user_id: userId
        }, {
          headers: {
            'Bearer': `${localStorage.getItem("Token_id")}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response)

        setUserProfile({
          firstname: response.data["First Name"],
          lastname: response.data["Last Name"],
          username: response.data["Email"],
          // avatar: response.data.avatar
        });
        setFollowers(response.data["Followers"].length);
        setFollowing(response.data["Following"].length);
        setPosts(response.data["Image URLs"].map((url, index) => ({
          id: index,
          imageUrl: url
        })));
        setIsFollowing(response.data["isCurrentUserFollowing"]); // Set initial following status
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfile();
  }, [id, followers, following]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpenLightbox(true);
  };

  const closeLightbox = () => {
    setOpenLightbox(false);
  };

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post('https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/follow', {
        "otherUserID": userId
      }, {
        headers: {
          'Bearer': `${localStorage.getItem("Token_id")}`,
          'Content-Type': 'application/json'
        }
      });
      // Toggle the following state
   
      
      // setFollowers(followers_length);
      // setresponse.data["Followers"].length


      // Update followers count based on the response
      setFollowers(response.data["followers_length"]);
      
    } catch (error) {
      console.error('Error toggling follow', error);
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img
          src={ userProfile.avatar || 'https://via.placeholder.com/150'}
          alt="Avatar"
          className="profile-avatar"
          onClick={triggerFileInput}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <div className="profile-info">
          <h1>{userProfile.username}</h1>
          {currentUserEmail !== userProfile.username && (
            <button className="btn follow-btn" onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
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
  
      {/* Conditionally render the gallery */}
      {(isFollowing || currentUserEmail === userProfile.username) && (
        <div className="gallery">
          {Array.isArray(posts) && posts.map((post, index) => (
            <div key={post.id} className="gallery-item" onClick={() => handleImageClick(index)}>
              <img src={post.imageUrl} alt={post.caption} />
            </div>
          ))}
        </div>
      )}
  
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
  
      <div className="home-button" onClick={() => navigate('/feed')}>
        <FontAwesomeIcon icon={faHome} size="2x" />
      </div>
    </div>
  );
  
};

export default Profile;
