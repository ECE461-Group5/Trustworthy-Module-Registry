/* eslint-disable react/react-in-jsx-scope */

import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {Example} from "./example-api";
import './App.css';
import MainNavbar from './MainNavbar';
import Buttons from './Buttons';
import PackageDownloader from './PackageDownloader';
import PackageUploader from './PackageUploader';
import Search from './Search';


const queryClient = new QueryClient()

function App() {
  return (
    
    // Provide the client to your App

    <QueryClientProvider client={queryClient}>
      <div className="App">
        <MainNavbar />
        <Example />
        <Buttons />
        <PackageUploader />
        <Search />
        <PackageDownloader />
      </div>
      <div>Group 5 - Trustworthy Module Registry Front End Holder</div>
    </QueryClientProvider>
  )
}


export default App;
