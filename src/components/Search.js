import React, { useState } from 'react';
import axios from 'axios';
import './styles/Search.css';
import { useNavigate } from 'react-router-dom';


function UserSearch({ onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length === 0) {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.length > 0) {
      try {
        const response = await axios.post(
          "https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev/search",
          { query_string: searchQuery },{
            headers: {
              'Bearer': `${localStorage.getItem("Token_id")}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setFilteredSuggestions(response.data.map(user => ({
          id: user.user_id,
          name: `${user.user_first_name} ${user.user_last_name}`
        })));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setShowSuggestions(false);  // Optionally handle errors more gracefully
      }
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="SearchContainer">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        className="SearchInput"
        autoFocus
      />
      <button onClick={handleSearchSubmit} className="SearchButton">
        🔍
      </button>
      {showSuggestions && (
        <ul className="SuggestionsList">
          {filteredSuggestions.map(user => (
            <li key={user.id} onClick={() => {
                if(user.id === localStorage.getItem("Email") )
                    navigate(`/profile/${user.name}` );
                else{
                    navigate(`/profile/${user.name}`, { state: { user_id: user.id }});
                }
              
              setSearchQuery(user.name);
              setShowSuggestions(false);
              onSearchChange(user.name);  // Optionally call onSearchChange on click
            }}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserSearch;
