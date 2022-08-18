import React from 'react';

const DateTimeDisplay = ({ value, type, isClose }) => {
    return (
        <div className={isClose ? 'countdown success' : 'countdown warning'}>
            <h3 className="font-weight-bold">{value}</h3>
            <span>{type}</span>
        </div>
    );
};

export default DateTimeDisplay;
