import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    // Below is for handling input errors

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };


    // Below is for joining an existing session

    const joinRoom = () => {
        if (!roomId || !username) {
            alert('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    // Below is for creating a new session

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
    };

    

   
    return (
        <>
        <div className="homePageWrapper">
            <div className="formWrapper">
                <h1 className="heading">Code Collab</h1>
                <h4 className="mainLabel">Join existing session or create your own</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="SESSION ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="YOUR NAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <span className="createInfo">
                        <button className="btn joinBtn" onClick={joinRoom}>
                        Join Session
                        </button>
                    </span>
                    <span className="createInfo">
                        <button
                            onClick={createNewRoom}
                            className="btn joinBtn"
                        >
                            Create Session
                        </button>
                    </span>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;
