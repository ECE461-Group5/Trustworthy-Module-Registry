import React, { Component } from 'react';


class Get extends Component {
    state = {  } 
    handleButtonClick = () => {
        alert('Button clicked');
    };

    render() { 
        return (
        
        <div>
            <h1> SWE 461-450 </h1>
            <button onClick={this.handleButtonClick}>GET</button> {/* Button to Click*/}
            <button onClick={this.handleButtonClick}>PUT</button> {/* Button to Click*/}
        </div>
        );
        
    }
}

export default Get;