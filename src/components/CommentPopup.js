import React, { useState } from 'react';
import './styles/Feed.css';

function CommentPopup({ postId, onAddComment, onClose }) {
    const [comment, setComment] = useState('');
  
    return (
        <div className="comment-popup">
          <textarea 
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <div className="buttons-container">
            <button 
              className="comment-button"
              onClick={() => {
                if (comment.trim()) {
                  onAddComment(postId, comment.trim());
                }
              }}>
              Add Comment
            </button>
            <button 
              className="comment-button comment-button-close"
              onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      );
      
  }

  export default CommentPopup;