import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/Search.css";

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // Dummy user data
    const dummyUserData = [
        {
            id: 1,
            username: "alice123",
            firstname: "Alice",
            lastname: "Johnson",
            avatar: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Alice",
        },
        {
            id: 2,
            username: "bob456",
            firstname: "Bob",
            lastname: "Smith",
            avatar: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Bob",
        },
        {
            id: 3,
            username: "carol789",
            firstname: "Carol",
            lastname: "Martinez",
            avatar: "https://via.placeholder.com/150/008000/FFFFFF?text=Carol",
        },
        {
            id: 4,
            username: "david101",
            firstname: "David",
            lastname: "Lee",
            avatar: "https://via.placeholder.com/150/F00FFF/FFFFFF?text=David",
        },
        {
            id: 5,
            username: "eve202",
            firstname: "Eve",
            lastname: "Taylor",
            avatar: "https://via.placeholder.com/150/FFFF00/000000?text=Eve",
        }
    ];

    // Filter function to handle the search query
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        if (value.length > 2) {
            /*
            axios.post('/api/search', { name: query })
                .then(response => {
                    setResults(response.data);
                })
                .catch(error => console.error('Search failed', error));
            */
            const filteredResults = dummyUserData.filter(user =>
                user.username.toLowerCase().includes(value.toLowerCase()) ||
                user.firstname.toLowerCase().includes(value.toLowerCase()) ||
                user.lastname.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (userId) => {
        navigate(`/profile/${userId}`); // Navigate to the user's profile page when clicked
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={handleSearchChange}
                className="search-input"
            />
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map(user => (
                        <li key={user.id} onClick={() => handleResultClick(user.id)} className="search-item">
                            {user.username} - {user.firstname} {user.lastname}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;
