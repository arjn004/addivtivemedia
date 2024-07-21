import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListedPage.css'; // Import CSS file

const ListedPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getAllUsers', {
            withCredentials: true,
          });
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewAll = async (userId) => {
    try {
      const response = await axios.get(`/api/users/allVideos/${userId}`, {
        withCredentials: true,
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userId === userId
            ? { ...user, videos: response.data } // Update videos for the specific user
            : user
        )
      );
    } catch (err) {
      setError('Error fetching videos.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="listed-page">
      <h1>Listed Page</h1>
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.userId} className="user-item">
              <div className="user-header">
                <h2 className="user-name">{user.firstName}</h2>
                <button
                  className="view-all-button"
                  onClick={() => handleViewAll(user.userId)}
                >
                  View All
                </button>
              </div>
              <div className="videos-container">
                {user.videos.length > 0 ? (
                  user.videos.map((video, index) => (
                    <div key={index} className="video-item">
                      <img src={video.thumbnailUrl} alt={video.videoTitle} className="video-thumbnail" />
                      <div className="video-info">
                        <strong>{video.videoTitle}</strong>
                        <p>{video.videoDescription}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No videos available</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ListedPage;
