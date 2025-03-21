import React, { useState } from 'react';
import './App.css';

function App() {
  const [domain, setDomain] = useState('');
  const [infoType, setInfoType] = useState('domain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/whois', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, infoType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch domain information');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>WHOIS Domain Lookup</h1>
      </header>
      
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="domain">Domain Name:</label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., amazon.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Information Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="infoType"
                  value="domain"
                  checked={infoType === 'domain'}
                  onChange={() => setInfoType('domain')}
                />
                Domain Information
              </label>
              <label>
                <input
                  type="radio"
                  name="infoType"
                  value="contact"
                  checked={infoType === 'contact'}
                  onChange={() => setInfoType('contact')}
                />
                Contact Information
              </label>
            </div>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Lookup'}
          </button>
        </form>
        
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
        
        {result && (
          <div className="result-container">
            <h2>{result.type === 'domain' ? 'Domain Information' : 'Contact Information'}</h2>
            
            {result.type === 'domain' ? (
              <table className="info-table">
                <thead>
                  <tr>
                    <th>Domain Name</th>
                    <th>Registrar</th>
                    <th>Registration Date</th>
                    <th>Expiration Date</th>
                    <th>Estimated Domain Age</th>
                    <th>Hostnames</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{result.data.domainName}</td>
                    <td>{result.data.registrar}</td>
                    <td>{result.data.createdDate}</td>
                    <td>{result.data.expiresDate}</td>
                    <td>{result.data.estimatedAge}</td>
                    <td>{result.data.hostnames}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="info-table">
                <thead>
                  <tr>
                    <th>Registrant Name</th>
                    <th>Technical Contact Name</th>
                    <th>Administrative Contact Name</th>
                    <th>Contact Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{result.data.registrantName}</td>
                    <td>{result.data.technicalContactName}</td>
                    <td>{result.data.administrativeContactName}</td>
                    <td>{result.data.contactEmail}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
      
      <footer>
        <p>WHOIS Lookup Service - TLV300 Home Assignment</p>
      </footer>
    </div>
  );
}

export default App;