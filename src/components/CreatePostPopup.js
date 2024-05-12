import React, { useState } from 'react';
import './styles/CreatePostPopup.css';

function CreatePostPopup({ onClose, onSubmit }) {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const handleImageChange = (event) => {
        const reader = new FileReader();
        const file = event.target.files[0]; // Get the first file
        reader.onloadend = () => {
            setFile(reader.result); // Convert image file to Base64 string
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please upload an image.');
            return;
        }
        onSubmit({ image: file, caption });
    };

    return (
        <div className="CreatePostPopup">
            <div className="PopupContent">
                <button onClick={onClose} className="CloseButton">X</button>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <input
                        type="text"
                        value={caption}
                        onChange={handleCaptionChange}
                        placeholder="Caption"
                        required
                    />
                    <button type="submit">Create Post</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePostPopup;
