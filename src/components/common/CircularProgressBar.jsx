import React from 'react';

const getColorForPercentage = (percentage) => {
    // Define color ranges and corresponding classes
    const colorRanges = [
        { color: 'text-pink-500', maxPercentage: 25 },
        { color: 'text-yellow-200', maxPercentage: 50 },
        { color: 'text-yellow-50', maxPercentage: 75 },
        { color: 'text-blue-200', maxPercentage: 100 },
    ];

    // Find the correct color class based on the percentage
    const colorClass = colorRanges.find((range) => percentage < range.maxPercentage)?.color;

    return colorClass || 'text-caribbeangreen-200'; // Default to green if the percentage exceeds 100%
};

const CircularProgressBar = ({ percentage }) => {
    const radius = 50;
    const strokeWidth = 4;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    const colorClass = getColorForPercentage(percentage);

    if (parseInt(percentage) === 0) {
        return (
            <svg height={radius * 2} width={radius * 2} className="text-richblack-200">
                <circle
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-xl font-bold"
                >
                    {percentage}%
                </text>
            </svg>
        )
    }

    return (
        <svg height={radius * 2} width={radius * 2} className={`${colorClass} `}>
            <circle
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                }}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-xl font-bold"
            >
                {percentage}%
            </text>
        </svg>
    );
};

export default CircularProgressBar;
