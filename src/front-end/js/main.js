// JavaScript file (script.js)

async function fetchData() {
    try {
      const response = await fetch('YOUR_API_URL_HERE');
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function displayData(data) {
    // Reference to the container div
    const container = document.getElementById('container');
  
    // Clear any existing content
    container.innerHTML = '';
  
    // Iterate over the API data to create elements dynamically
    data.forEach((item, index) => {
      // Create a new div for each button option
      const buttonOption = document.createElement('div');
      buttonOption.classList.add('button-option');
  
      // Create a title element
      const title = document.createElement('h2');
      title.textContent = `Option ${index + 1}: ${item.title}`;
      buttonOption.appendChild(title);
  
      // Create a description element
      const description = document.createElement('p');
      description.textContent = item.description;
      buttonOption.appendChild(description);
  
      // Create a button element
      const button = document.createElement('button');
      button.classList.add('btn');
      button.textContent = item.buttonText;
      buttonOption.appendChild(button);
  
      // Append the new button option div to the container
      container.appendChild(buttonOption);
    });
  }
  
  // Call fetchData to populate the page
  fetchData();
  
