// App.js
import React, { useState, useEffect } from 'react';
import './styles/Feed.css';
import CommentPopup from './CommentPopup.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserSearch from './Search';
import { useNavigate } from 'react-router-dom';


const dummyTimeline = [
  {
    ID: 1,
    Username: "user1",
    Image: "https://picsum.photos/200",
    Caption: "This is the first post",
    Likes: [{ Username: "user2" }, { Username: "user3" }],
    Comments: [{ Username: "user4", Message: "Nice post!" }, { Username: "user5", Message: "Great picture!" }]
  },
  {
    ID: 2,
    Username: "user2",
    Image: "https://picsum.photos/200",
    Caption: "This is the second post",
    Likes: [{ Username: "user1" }, { Username: "user3" }],
    Comments: [{ Username: "user3", Message: "Cool!" }, { Username: "user4", Message: "Awesome shot!" }]
  },
  {
    ID: 3,
    Username: "user3",
    Image: "https://picsum.photos/200",
    Caption: "This is the third post",
    Likes: [{ Username: "user1" }, { Username: "user2" }],
    Comments: [{ Username: "user1", Message: "Love it!" }, { Username: "user2", Message: "Fantastic!" }]
  }
];

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(dummyTimeline); // Use a state to manage posts for reactivity
  const [popupPostId, setPopupPostId] = useState(null); // null when no popup is shown
  const [drawerOpen, setDrawerOpen] = useState(false); // State to toggle the drawer
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assume the user's ID is stored in localStorage
    axios.get(`/api/feed/${userId}`)
      .then(response => {
        const postsWithLikeStatus = response.data.map(post => ({
          ...post,
          likedByCurrentUser: post.Likes.some(like => like.Username === localStorage.getItem('username'))
        }));
        setPosts(postsWithLikeStatus);
      })
      .catch(error => {
        console.error('Error fetching posts', error);
      });
  }, []);


  const toggleLike = (postId) => {
    const postIndex = posts.findIndex(post => post.ID === postId);
    if (postIndex === -1) return; // Post not found

    const post = posts[postIndex];
    const currentUser = "user1";// localStorage.getItem('username'); // Get the current logged-in user's username
    const hasLiked = post.Likes.some(like => like.Username === currentUser);
    const updatedLikes = hasLiked
      ? post.Likes.filter(like => like.Username !== currentUser)
      : [...post.Likes, { Username: currentUser }];

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...post,
      Likes: updatedLikes
    };
    setPosts(updatedPosts);
    /*

    

    axios.post(`/api/likes/${postId}`, { like: !hasLiked })
      .then(response => {
        // Assuming the API returns the entire updated post or just the updated likes array
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = {
          ...post,
          Likes: response.data.Likes, // assuming response.data.Likes contains the new likes array
          likedByCurrentUser: !hasLiked
        };
        setPosts(updatedPosts);
      })
      .catch(error => {
        console.error('Error toggling like', error);
      });*/
  };

  const isLikedByCurrentUser = (post) => {
    const currentUser = "user1"; // Simulating logged-in user
    return post.Likes.some(like => like.Username === currentUser);
  };

  /*
  const isLikedByCurrentUser = (post) => {
    const currentUser = localStorage.getItem('username');
    return post.Likes.some(like => like.Username === currentUser);
  };
  */
  

  const handleCommentClick = (postId) => {
    setPopupPostId(postId); // Set the current post ID for which the popup should be visible
  };

  const closePopup = () => {
    setPopupPostId(null);
  };

  const addCommentToPost = (username, message) => {
    const updatedPosts = posts.map(post => {
      if (post.ID === popupPostId) {
        const newComments = [...post.Comments, { Username: username, Message: message }];
        return { ...post, Comments: newComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    closePopup();
  };
  
  const [expandedPostId, setExpandedPostId] = useState(null);


  const renderComments = (comments, postId) => {
    const isExpanded = expandedPostId === postId;
    const visibleComments = isExpanded ? comments : comments.slice(0, 4);
  
    return (
      <>
        {visibleComments.map((comment, index) => (
          <div key={index} className="Comment">
            <strong>{comment.Username}:</strong> {comment.Message}
          </div>
        ))}
        {comments.length > 4 && !isExpanded && (
          <button onClick={() => setExpandedPostId(postId)}>Show all {comments.length} comments</button>
        )}
        {isExpanded && (
          <button onClick={() => setExpandedPostId(null)}>Show less</button>
        )}
      </>
    );
  }; 
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("Email");
    localStorage.removeItem("Token_id")
    localStorage.removeItem("Expiration");
    navigate("/login");
  };


  return (
    <div className="App">
           <div className="Header">
        <button className="MenuButton" onClick={toggleDrawer}>☰</button>
        <img src="/socials-logo-2.png" alt="Instagram" />
        <Link to={`/profile/${localStorage.getItem('userId')}`} className="ProfileLink">My Profile</Link>
        <UserSearch />
      </div>
      {drawerOpen && (
        <div className="SideDrawer">
          {/* <Link to="/explore" className="DrawerItem">Explore</Link> */}
          {/* <Link to="/notifications" className="DrawerItem">Notifications</Link> */}

          <button className="DrawerItem" onClick={() => alert('Upload functionality')}>Create</button>
          <div className="LogoutBtn"><button onClick={handleLogout} className="logout-btn">Logout</button></div>

        </div>
      )}
      <div className="Posts">
        {posts.map(post => (
          <div key={post.ID} className="Post">
            <div className="PostHeader">
            <Link to={`/profile/${post.Username}`} className="Username">{post.Username}</Link>
              <div className="Logo">
                <img src="/logo.png" alt="logo img" />
              </div>
            </div>
            <img 
            src={post.Image} 
            alt="post"
            onDoubleClick={() => toggleLike(post.ID)}
            style={{ cursor: 'pointer' }} 
            />
            <div className="Interactions">
              <button className="LikeButton" onClick={() => toggleLike(post.ID)}>
                {isLikedByCurrentUser(post) ? '❤️' : '♡'} {post.Likes.length}
              </button>
              <button className="CommentButton" onClick={() => handleCommentClick(post.ID)}>
                💬{post.Comments.length}
              </button>
            </div>
            <div className="Caption">{post.Caption}</div>
            <div className="Comments">
              {renderComments(post.Comments)}
            </div>
            {popupPostId === post.ID && (
              <CommentPopup
                postId={post.ID}
                onAddComment={addCommentToPost}
                onClose={closePopup}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;