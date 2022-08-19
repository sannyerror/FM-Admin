import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
        if (countDown > 1000) {
            const interval = setInterval(() => {
                setCountDown(countDownDate - new Date().getTime());
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCountDown(1000);
        }
    });
    return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
    // calculate time left
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [minutes, seconds];
};

export { useCountdown };
