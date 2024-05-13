import React, { useState, useEffect } from 'react';
import './styles/Feed.css';
import CommentPopup from './CommentPopup.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserSearch from './Search';
import CreatePostPopup from './CreatePostPopup';
import { useNavigate } from 'react-router-dom';

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // Initialize with empty array
  const [popupPostId, setPopupPostId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search query
  

   // Define handleSearchChange
   const handleSearchChange = (query) => {
    setSearchQuery(query);
    // if (!query) {
    //   setFilteredPosts(posts); // If no query, show all posts
    // } else {
    //   const lowercasedQuery = query.toLowerCase();
   
    // }
  };
  useEffect(() => {
    const token = localStorage.getItem("Token_id");
    if (!token) {
      console.error("Token not found");
      return;
    }

    axios.post("https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/feed", {}, {
      headers: {
        'Bearer': `${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const formattedPosts = response.data.map(post => ({
          ...post,
          isLikedByCurrentUser: false // Initialize like status, modify as per your actual logic
        }));
        setPosts(formattedPosts);
      })
      .catch(error => {
        console.error('Error fetching posts', error);
      });
  }, []);

  const toggleLike = (postId) => {
    const postIndex = posts.findIndex(post => post.ID === postId);
    if (postIndex === -1) return; // Post not found
  
    const post = posts[postIndex];
    const actionType = post.isLikedByCurrentUser ? 'dislike' : 'like';
  
    axios.post("https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/like-post", {
      post_id: postId,
      action_type: actionType
    }, {
      headers: {
        'Bearer': `${localStorage.getItem("Token_id")}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = {
          ...post,
          Likes: response.data, // Update likes count from response
          isLikedByCurrentUser: !post.isLikedByCurrentUser
        };
        setPosts(updatedPosts);
      })
      .catch(error => {
        console.error('Error toggling like', error);
      });
  };

  const isLikedByCurrentUser = (post) => post.isLikedByCurrentUser;

  const toggleCreatePost = () => setCreatePostOpen(!createPostOpen);

  const addPost = (newPost) => {
    const newPosts = [
      ...posts,
      {
        ID: posts.length + 1,
        Username: "user1", // Assuming a static username for simplicity
        Image: newPost.image,
        Caption: newPost.caption,
        Likes: 0,
        Comments: [],
        isLikedByCurrentUser: false
      }
    ];
    setPosts(newPosts);
    setCreatePostOpen(false);
  };

  const handleCommentClick = (postId) => {
    setPopupPostId(postId); // Set the current post ID for which the popup should be visible
  };

  const closePopup = () => {
    setPopupPostId(null);
  };

  const addCommentToPost = (postId, message) => {
    axios.post("https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/comment-post", {
      post_id: popupPostId,
      comment: message
    },{
      headers: {
        'Bearer': `${localStorage.getItem("Token_id")}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post.ID === popupPostId) {
            const newComments = [...post.Comments, { Username: response.data['commented_name'], Message: message }];
            return { ...post, Comments: newComments };
          }
          return post;
        });
        setPosts(updatedPosts);
        closePopup();
      })
      .catch(error => {
        console.error('Error adding comment', error);
      });
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
    localStorage.removeItem("Token_id");
    localStorage.removeItem("Expiration");
    navigate("/login");
  };

  const handleUserClick = (username, userId) => {
    // Navigate with state
    navigate(`/profile/${username}`, { state: { user_id: userId }});
  };

  return (
    <div className="App">
      <div className={`Content ${drawerOpen ? 'with-drawer' : 'full-width'}`}>
      <div className="Header">
  <button className="MenuButton" onClick={toggleDrawer}>☰</button>
  <div className="HeaderLeft">
    <img src="/socials-logo-2.png" alt="Logo" />
  </div>
 

  <div className="HeaderCenter">
    <UserSearch onSearchChange={handleSearchChange} />
  </div>
  <div className="HeaderRight">
    <Link to={`/profile/abc/`} className="ProfileLink">My Profile</Link>
  </div>
 
</div>

        <div className={`SideDrawer ${drawerOpen ? 'open' : ''}`}>
          <Link to="/explore" className="DrawerItem">Explore</Link>
          <Link to="/notifications" className="DrawerItem">Notifications</Link>
          <button className="DrawerItem" onClick={toggleCreatePost}>Create (Upload)</button>
          {createPostOpen && (
            <CreatePostPopup
              onClose={() => setCreatePostOpen(false)}
              onSubmit={addPost}
            />
          )}
          <div className="LogoutBtn"><button onClick={handleLogout} className="logout-btn">Logout</button></div>
        </div>

        <div className="Posts">
          {posts.map(post => (
            <div key={post.ID} className="Post">
              <div className="PostHeader">
                <span className="Username" onClick={() => handleUserClick(post.Username, post.UserID)} style={{ cursor: 'pointer' }}>
                  {post.Username}
                </span>
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
                  {isLikedByCurrentUser(post) ? '❤️' : '♡'} {post.Likes}
                </button>
                <button className="CommentButton" onClick={() => handleCommentClick(post.ID)}>
                  💬 {post.Comments.length}
                </button>
              </div>
              <div className="Caption">{post.Caption}</div>
              <div className="Comments">
                {renderComments(post.Comments, post.ID)}
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
    </div>
  );
}

export default Feed;
