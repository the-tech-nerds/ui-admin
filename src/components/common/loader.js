import React from 'react';
const Loader = () => (
    <div style={{
        margin: 'auto',
        padding: '2rem',
    }}>
        <i className="fa fa-refresh fa-spin" style={
            {
                fontSize: 20,
                color: '#e4566e',
            }}
        ></i>
    </div>
);

export default Loader;