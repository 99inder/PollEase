import React from 'react';

const Spinner = () => {
    const spinnerStyle = {
        width: '56px',
        height: '56px',
        display: 'grid',
        animation: 'spinner-plncf9 4s infinite',
    };

    const pseudoElementStyle = {
        content: "''",
        gridArea: '1/1',
        border: '9px solid',
        borderRadius: '50%',
        borderColor: '#9d9d9d #9d9d9d #0000 #0000',
        mixBlendMode: 'darken',
        animation: 'spinner-plncf9 1s infinite linear',
    };

    const afterPseudoElementStyle = {
        borderColor: '#0000 #0000 #eeeeee #eeeeee',
        animationDirection: 'reverse',
    };

    return (
        <>
            <div className='absolute top-[50%] left-[50%]'>
                <div className='-translate-x-[50%] -translate-y-[50%]'>
                    <div className="spinner" style={spinnerStyle}>
                        <div style={pseudoElementStyle}></div>
                        <div style={{ ...pseudoElementStyle, ...afterPseudoElementStyle }}></div>
                    </div>
                </div>
            </div>

            <style>
                {`
          @keyframes spinner-plncf9 {
            100% {
              transform: rotate(1turn);
            }
          }
        `}
            </style>
        </>
    );
};

export default Spinner;