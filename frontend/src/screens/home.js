// src/screens/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AWS from 'aws-sdk';
import './HomePage.css';


// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const HomePage = () => {
  const [bio, setBio] = useState('');
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [charCount, setCharCount] = useState(500);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    mobileNumber: '',
    profilePicUrl: '',
  });
  const [videos, setVideos] = useState([]);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileError, setVideoFileError] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Show loader
      try {
        const response = await axios.get('/api/getProfile/getProfile', {
          withCredentials: true,
        });
        setUserInfo({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          emailId: response.data.email,
          mobileNumber: response.data.number,
          profilePicUrl: response.data.profilePicUrl || '',
        });
        setBio(response.data.bio || '');
        setVideos(response.data.videoDetails || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchUserProfile();
  }, []);

  const handleBioChange = (e) => {
    const value = e.target.value;
    setBio(value);
    setCharCount(500 - value.length);
  };

  const handleAddUpdateBio = () => {
    setShowBioPopup(true);
  };

  const handleClosePopup = async () => {
    setShowBioPopup(false);
    setLoading(true); // Show loader
    try {
      await axios.post('/api/updateProfile/updateBio', {
        bio,
      }, {
        withCredentials: true,
      });
      const response = await axios.get('/api/getProfile/getProfile', {
        withCredentials: true,
      });
      setBio(response.data.bio || '');
      setUserInfo({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        emailId: response.data.email,
        mobileNumber: response.data.number,
        profilePicUrl: response.data.profilePicUrl || '',
      });
    } catch (error) {
      console.error('Error updating bio:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleVideoUpload = async () => {
    if (videoFile && videoFile.type === 'video/mp4' && videoFile.size <= 4 * 1024 * 1024) {
      const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
        Key: `videos/${videoFile.name}`,
        Body: videoFile,
        ContentType: videoFile.type,
      };

      setLoading(true); // Show loader
      try {
        const { Location } = await s3.upload(params).promise();
        const response = await axios.post('/api/updateProfile/addVideo', {
          videoTitle,
          videoDescription,
          videoKey: Location,
        }, {
          withCredentials: true,
        });

        setVideos([...videos, response.data.video]);
        setShowVideoPopup(false);
        setVideoTitle('');
        setVideoDescription('');
        setVideoFile(null);
        setVideoFileError('');
      } catch (error) {
        console.error('Error uploading video:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    } else {
      setVideoFileError('Please select a valid MP4 video file with a size up to 4 MB.');
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'video/mp4' && file.size <= 4 * 1024 * 1024) {
      setVideoFile(file);
      setVideoFileError('');
    } else {
      setVideoFile(null);
      setVideoFileError('Please select a valid MP4 video file with a size up to 4 MB.');
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) { // 1 MB size limit
      const params = {
        Bucket: 'arjun-addictive-media',
        Key: `profile-pics/${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      setLoading(true); // Show loader
      try {
        const { Location } = await s3.upload(params).promise();
        await axios.post('/api/updateProfile/updateProfilePic', {
          profilePicUrl: Location,
        }, {
          withCredentials: true,
        });

        setUserInfo(prev => ({ ...prev, profilePicUrl: Location }));
        setProfilePic(null);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    } else {
      console.error('Please select a valid image file with a size up to 1 MB.');
    }
  };

  const handleTabClick = () => {
    navigate('/listedPage'); // Navigate to ListedPage
  };

  return (
    <div className="home-page">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      <div className="tab-bar">
        <button className="tab-button" onClick={handleTabClick}>ListedPage</button>
      </div>
      <h2>Home Page</h2>
      <div className="user-info">
        <div className="profile-pic">
          <img
            src={userInfo.profilePicUrl || 'path/to/broken-image.png'}
            alt="Profile"
            className="profile-pic-image"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>
        <p><strong>First Name:</strong> {userInfo.firstName}</p>
        <p><strong>Last Name:</strong> {userInfo.lastName}</p>
        <p><strong>Email ID:</strong> {userInfo.emailId}</p>
        <p><strong>Mobile Number:</strong> {userInfo.mobileNumber}</p>
        <h3><strong>Bio:</strong> {bio ? <p>{bio}</p> : <p>No bio available.</p>}</h3>
        <button className="bio-button" onClick={handleAddUpdateBio}>Add/Update Bio</button>
      </div>
      <div className="videos-map">
        <div className="videos-header">
          <h3>Uploaded Videos</h3>
          <button className="add-more-videos-button" onClick={() => setShowVideoPopup(true)}>Add More Videos</button>
        </div>
        {videos.length > 0 ? (
          <div className="videos-list">
            {videos.map((video, index) => (
              video ? (
                <div key={index} className="video-item">
                  <img src={`https://img.youtube.com/vi/${video.videoKey}/0.jpg`} alt={video.videoTitle} className="video-thumbnail" />
                  <div className="video-content">
                    <h4 className="video-title">{video.videoTitle}</h4>
                    <p className="video-description">{video.videoDescription}</p>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ) : (
          <button className="add-first-video-button" onClick={() => setShowVideoPopup(true)}>Add Your First Video</button>
        )}
      </div>
      {showBioPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add/Update Bio</h3>
            <textarea
              maxLength="500"
              value={bio}
              onChange={handleBioChange}
              placeholder="Write your bio here..."
            />
            <p>{charCount} characters remaining</p>
            <button className="close-button" onClick={handleClosePopup}>Update Bio</button>
          </div>
        </div>
      )}
      {showVideoPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add Video</h3>
            <input
              type="text"
              placeholder="Video Title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
            <textarea
              placeholder="Video Description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
            />
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoFileChange}
            />
            {videoFileError && <p className="error-message">{videoFileError}</p>}
            <button className="close-button" onClick={handleVideoUpload}>Upload Video</button>
            <button className="close-button" onClick={() => setShowVideoPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
