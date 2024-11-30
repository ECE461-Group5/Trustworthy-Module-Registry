/* eslint-disable react/react-in-jsx-scope */

import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {Example} from "./example-api";


const queryClient = new QueryClient()

function App() {
  return (
    
    // Provide the client to your App

    <QueryClientProvider client={queryClient}>
      <div className="App">
      <Example />
      </div>
      <div>Group 5 - Trustworthy Module Registry Front End Holder</div>
    </QueryClientProvider>
  )
}


export default App;
