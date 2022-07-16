import React from 'react';

//Below is the client component

const Client = ({ username }) => {
    return (
        <div className="client">
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
