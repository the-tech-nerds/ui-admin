import React from 'react';
const Loader = () => (
    <div style={{
        margin: 'auto',
        padding: '200px',
    }}>
        <i className="fa fa-circle-o-notch fa-spin" style={
            {
                width: 35,
                fontSize: 20,
                color: '#e4566e',
            }}
        ></i>
    </div>
);

export default Loader;