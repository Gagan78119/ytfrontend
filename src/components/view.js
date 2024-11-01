import React, { useEffect, useState } from 'react';

const getThumbnailUrl = (youtubeLink) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^&\n]{11})/;
    const match = youtubeLink.match(regExp);
    if (match && match[2]) {
        const videoId = match[2];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else {
        console.error('Invalid YouTube link:', youtubeLink);
        return null; // Handle invalid link
    }
};

const ViewPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null); // State to hold selected video

    useEffect(() => {
        const fetchPlaylists = async () => {
            const userId = localStorage.getItem('userId'); // Get userId from local storage
            try {
                const response = await fetch(`https://yt-1-a3d9.onrender.com/api/playlist/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching playlists: ${response.statusText}`);
                }
                const data = await response.json();
                // Map playlists to include thumbnails
                const playlistsWithThumbnails = data.map(playlist => ({
                    ...playlist,
                    thumbnails: playlist.videos.map(getThumbnailUrl).filter(url => url !== null) // Use the function here
                }));
                setPlaylists(playlistsWithThumbnails);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch playlists.');
            }
        };

        fetchPlaylists();
    }, []);

    const handleThumbnailClick = (youtubeLink) => {
        setSelectedVideo(youtubeLink); // Set the selected video link
    };

    const renderVideoPlayer = () => {
        if (selectedVideo) {
            const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^&\n]{11})/;
            const match = selectedVideo.match(regExp);
            if (match && match[2]) {
                const videoId = match[2];
                return (
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube Video Player"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                );
            }
        }
        return null;
    };

    if (error) return <div>{error}</div>; // Handle error display

    return (
        <div>
            <h1>Your Playlists</h1>
            {playlists.length === 0 ? (
                <p>No playlists found.</p>
            ) : (
                playlists.map((playlist, index) => (
                    <div key={index}>
                        <h2>{playlist.name}</h2>
                        <div>
                            {playlist.thumbnails.map((thumbnail, idx) => (
                                <img
                                    key={idx}
                                    src={thumbnail}
                                    alt={`Thumbnail for ${playlist.name}`}
                                    style={{ width: '120px', height: '90px', cursor: 'pointer', margin: '5px' }}
                                    onClick={() => handleThumbnailClick(playlist.videos[idx])} // On thumbnail click
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
            <div>
                {renderVideoPlayer()} {/* Render the video player */}
            </div>
        </div>
    );
};

export default ViewPlaylists;
