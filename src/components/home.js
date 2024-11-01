import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId');
      console.log(userId)
      // Send request to backend
      const response = await axios.post('https://yt-1-a3d9.onrender.com/api/playlist', {
        playlistName,
        youtubeLink,
        userId // Send the userId along with the request
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error adding video:', error);
      setMessage('An error occurred while adding the video.');
    }
  };

  return (
    <div>
      <h1>Manage Playlists</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter Playlist Name"
          required
        />
        <input
          type="url"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="Enter YouTube Link"
          required
        />
        <button type="submit">Add Video</button>
      </form>

      {/* Display response message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Home;
