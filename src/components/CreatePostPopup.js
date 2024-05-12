import React, { useState } from 'react';
import AWS from '../config/aws-config';
import './styles/CreatePostPopup.css';

function CreatePostPopup({ onClose, onSubmit }) {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const handleImageChange = (event) => {
        setFile(event.target.files[0]); // Store file directly without converting to Base64
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

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'socials-images', // Replace with your S3 bucket name
            Key: `${file.name}`, // Ensure the file name is unique in production use
            Body: file,
            // ACL: 'public-read', // Or another ACL according to your security needs
            Metadata: {
                'caption': caption,
                'user_id': localStorage.getItem('Email') // Assuming userId is stored in localStorage
            }
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.log("Error uploading image: ", err);
                alert('Error uploading image. Please try again.');
            } else {
                console.log("Successfully uploaded image: ", data.Location);
                onSubmit({ image: data.Location, caption }); 
                onClose();
            }
        });
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
