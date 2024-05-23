import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import './App.css';

const Home: React.FC = () => {
  const [originalUrl, setOriginalUrl] = React.useState('');
  const [shortenedUrl, setShortenedUrl] = React.useState('');
  const [shorteningStatus, setShorteningStataus] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/shorten`, { original_url: originalUrl });
      setShorteningStataus('');
      setShortenedUrl(`${window.location.href}${response.data.shortened_url}`);
    } catch (error: any) {
      setShortenedUrl('');
      const { message } = (error as AxiosError).response?.data as any;
      console.error('Error shortening the URL', message);
      setShorteningStataus(message);
    }
  };

  return (
    <div className="container">
      <div className="url-shortener">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            className="url-input"
          />
          <button type="submit" className="shorten-button">Shorten</button>
        </form>
        {shorteningStatus && (
          <p>{shorteningStatus}</p>
        )}
        {shortenedUrl && (
          <div className="result">
            <p>Shortened URL:</p>
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
              {shortenedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
    );
  };

const Redirect: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();

  React.useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${hash}`);
        window.location.href = response.data;
      } catch (error) {
        console.error('Error fetching the original URL', error);
      }
    };

    fetchOriginalUrl();
  }, [hash]);

  return <p>Redirecting...</p>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:hash" element={<Redirect />} />
      </Routes>
    </Router>
  );
};

export default App;
