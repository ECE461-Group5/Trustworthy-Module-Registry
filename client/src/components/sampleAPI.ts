/*
Author(s): Geromy Cunningham
Purpose: File is a sampel API file for the project

// function handleSubmit(e) {
//     e.preventDefault();
//     setIsLoading(true);
//     fetch("/api/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//     })
//     .then((r) => {
//         setIsLoading(false);
//         if (r.ok) {
//             r.json().then((user) => onLogin(user));
//         }
//     });
// }

// Breaking Down the Fetch Request
// Prevent Default Behavior: The e.preventDefault() method stops the form from refreshing the page upon submission.
// Set Loading State: We use a state variable (setIsLoading) to indicate that a network request is in progress, which can help improve the user experience by showing a loading indicator.
// Fetch API Call:
// We make a POST request to /api/login, which is handled by our Vite proxy.
// The request contains the user’s email and password as a JSON string in the body.
// 4. Response Handling:

// After the request completes, we check if the response is okay (r.ok).
// If successful, we parse the JSON response and handle the logged-in user with the onLogin function
// */

// async function func_name(url: string): Promise<any>{
//     const response = await fetch(api_url, method/request type, [other_params]);
//     const data = await response.json();
//     return data;
//   }
  
//   const BASE_URL = 'http://example.org';
  
//   //         Input T ↴   is thread through to ↴
//   async function api<T>(path: string): Promise<T> {
//       const response = await fetch(`${BASE_URL}/${path}`);
  
//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }
  
//       //    And can also be used here ↴
//       return await response.json() as T;
//   }
  
//   // Set up various fetches
//   async function getConfig() {
//     //             Passed to T ↴
//     return await api<{ version: number }>('config');
//   }
  
//   // Elsewhere
//   async function main() {
//     const config = await getConfig();
  
//     // At this point we can confidently say config has a .version
//     // of type number because we threaded the shape of config into 
//     // api() 
//     console.log(config.version); 
//   }