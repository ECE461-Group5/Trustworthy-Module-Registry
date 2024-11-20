import React from 'react';
import Button from './Buttons';

function Buttons() {
    const handlePrimaryClick = () => {
        alert('Primary Button Clicked!');
    };

    const handleSecondaryClick = () => {
        alert('Secondary Button Clicked!');
    };

    return (
        <div className="buttons">
            <button className="primary-button" onClick={handlePrimaryClick}>
                Primary Button
            </button>
            <button className="secondary-button" onClick={handleSecondaryClick}>
                Secondary Button
            </button>
        </div>
    );
}

export default Buttons;
