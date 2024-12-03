// this is needed for API calls. for example the usequery is for getting only data.
// the useMutation is for posting data (after user clikced a buton for example)
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {config} from './config'


export function Example() {
    const apiCall = useQuery({  
        queryKey: ['todos'], 
        queryFn: async () => {
          return await axios.get(config.appRoute + "/test")
        }
    })
    axios.get('https://www.npmjs.com/package/axios')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
 console.log(apiCall)

  return (
    <div>
      <h1>Example</h1>
      <p>Example component</p>
    </div>
  );
}   