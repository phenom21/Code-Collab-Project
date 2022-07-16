import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import Client from '../components/Client';
import Editor from '../components/Editor';
import React, { useState, useRef, useEffect } from 'react';
import {useLocation,useNavigate,Navigate,useParams,} from 'react-router-dom';

// Below is the editor page that appears when we enter a session

const EditorPage = () => {
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            // Below is for disconnected action

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );

            // Below is for joining action

            function handleErrors(e) {
                console.log('socket error', e);
                alert('Failed to connect,kindly try again!!');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

              // Below is for connected action

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );
            
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);


      // Below is for navigation when leaving the session 

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="page2">
               {/* Below is for the navbar  */}
        <div className="editornav">
            <h1 className='cchead'>Code Collab</h1>
            <h3 className='ssi'>Current Session ID: {roomId}</h3>
        </div>
        <div className="mainWrap">
            {/* Below is for showing the members of the current session */}
            <div className="aside">
                <div className="asideInner">
                    <h3>Session Members</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                {/* Below is the button for exiting */}
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Exit
                </button>
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
        </div>
    );
};

export default EditorPage;
