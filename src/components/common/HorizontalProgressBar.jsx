import React from 'react';

const getColorForPercentage = (percentage) => {
    // Define color ranges and corresponding classes
    const colorRanges = [
        { color: 'bg-pink-500', maxPercentage: 25 },
        { color: 'bg-yellow-200', maxPercentage: 50 },
        { color: 'bg-yellow-50', maxPercentage: 75 },
        { color: 'bg-blue-200', maxPercentage: 100 },
    ];

    // Find the correct color class based on the percentage
    const colorClass = colorRanges.find((range) => percentage < range.maxPercentage)?.color;

    return colorClass || 'bg-caribbeangreen-200'; // Default to green if the percentage exceeds 100%
};

const HorizontalProgressBar = ({ percentage, showPercentage = true }) => {
    const colorClass = getColorForPercentage(percentage);

    return (
        <div className="relative w-full h-full max-h-8 rounded-lg overflow-hidden bg-gray-300">
            <div
                className={`absolute top-0 left-0 h-full bg-richblack-50`}
                style={{ width: `100%` }}
            />
            <div
                className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-700`}
                style={{ width: `${percentage}%` }}
            />
            {
                showPercentage &&
                <div className="relative flex items-center justify-center h-full text-xl font-bold text-gray-900">
                    {percentage}%
                </div>
            }
        </div>
    );
};

export default HorizontalProgressBar;
