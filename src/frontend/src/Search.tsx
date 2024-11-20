import React, { useState } from 'react';

const Search: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [result, setResult] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResult(`You searched for: ${url}`);
    };

    return (
        <div className="search-component">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="searchUrl">Enter URL:</label>
                    <input
                        type="text"
                        id="searchUrl"
                        value={url}
                        onChange={handleInputChange}
                        placeholder="Enter a URL"
                        aria-required="true"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {result && <p className="search-result">{result}</p>}
        </div>
    );
};

export default Search;
