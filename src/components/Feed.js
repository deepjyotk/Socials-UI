// App.js
import React, { useState } from 'react';
import './styles/Feed.css';
import CommentPopup from './CommentPopup.js';

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
  const [posts, setPosts] = useState(dummyTimeline); // Use a state to manage posts for reactivity
  const [popupPostId, setPopupPostId] = useState(null); // null when no popup is shown

  const handleLike = (postId) => {
    console.log(`Liked post with ID: ${postId}`); // Future: Implement actual like functionality
  };

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

  const handlePhotoDoubleClick = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.ID === postId) {
        let newLikes;
        if (post.likedByCurrentUser) {
          newLikes = post.Likes.length - 1; 
        } else {
          newLikes = post.Likes.length + 1; 
        }
        return {
          ...post,
          Likes: Array(newLikes).fill({Username: "dummy"}), 
          likedByCurrentUser: !post.likedByCurrentUser 
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };
  
  

  return (
    <div className="App">
      <div className="Header">
        <img src="socials-logo-2.png" alt="Instagram" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="Posts">
        {posts.map(post => (
          <div key={post.ID} className="Post">
            <div className="PostHeader">
              <span className="Username">{post.Username}</span>
              <div className="Logo">
                <img src="logo.png" alt="logo img" />
              </div>
            </div>
            <img 
            src={post.Image} 
            alt="post"
            onDoubleClick={() => handlePhotoDoubleClick(post.ID)}
            style={{ cursor: 'pointer' }} />
            <div className="Interactions">
              <button className="LikeButton" onClick={() => handleLike(post.ID)}>
                ❤️{post.Likes.length}
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