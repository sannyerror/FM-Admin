import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountdown';

const ShowCounter = ({ minutes, seconds }) => {
    return (
        <div className="show-counter">
            <DateTimeDisplay value={minutes} type={'Mins'} isClose={minutes < 2} />
            <p className="py-1">:</p>
            <DateTimeDisplay value={seconds} type={'Seconds'} isClose={minutes < 2} />
        </div>
    );
};

const CountdownTimer = ({ targetDate }) => {
    const [minutes, seconds] = useCountdown(targetDate);
    return <ShowCounter minutes={minutes} seconds={seconds} />;
};

export default CountdownTimer;
