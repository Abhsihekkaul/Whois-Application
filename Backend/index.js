// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const WHOIS_API_KEY = process.env.WHOIS_API_KEY;

app.use(cors());
app.use(express.json());

// Main endpoint to handle WHOIS lookup
app.post('/api/whois', async (req, res) => {
  try {
    const { domain, infoType } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required' });
    }
    
    // Make request to WHOIS API
    const response = await axios.get('https://www.whoisxmlapi.com/whoisserver/WhoisService', {
      params: {
        apiKey: WHOIS_API_KEY,
        domainName: domain,
        outputFormat: 'JSON'
      }
    });
    
    // Process the data based on the requested info type
    if (infoType === 'domain') {
      const domainInfo = processDomainInfo(response.data);
      return res.json({ type: 'domain', data: domainInfo });
    } else if (infoType === 'contact') {
      const contactInfo = processContactInfo(response.data);
      return res.json({ type: 'contact', data: contactInfo });
    } else {
      return res.status(400).json({ error: 'Invalid info type' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to fetch WHOIS data' });
  }
});

// Function to process domain information
function processDomainInfo(data) {
  const whoisRecord = data.WhoisRecord || {};
  
  // Extract required domain information
  const domainName = whoisRecord.domainName || 'N/A';
  const registrar = whoisRecord.registrarName || 'N/A';
  const createdDate = whoisRecord.createdDate || 'N/A';
  const expiresDate = whoisRecord.expiresDate || 'N/A';
  
  // Calculate estimated domain age
  let estimatedAge = 'N/A';
  if (createdDate !== 'N/A') {
    const createdYear = new Date(createdDate).getFullYear();
    const currentYear = new Date().getFullYear();
    estimatedAge = `${currentYear - createdYear} years`;
  }
  
  // Process hostnames
  let hostnames = 'N/A';
  if (whoisRecord.nameServers && whoisRecord.nameServers.hostNames) {
    hostnames = whoisRecord.nameServers.hostNames.join(', ');
    if (hostnames.length > 25) {
      hostnames = hostnames.substring(0, 25) + '...';
    }
  }
  
  return {
    domainName,
    registrar,
    createdDate,
    expiresDate,
    estimatedAge,
    hostnames
  };
}

// Function to process contact information
function processContactInfo(data) {
  const whoisRecord = data.WhoisRecord || {};
  const registrant = whoisRecord.registrant || {};
  const administrativeContact = whoisRecord.administrativeContact || {};
  const technicalContact = whoisRecord.technicalContact || {};
  
  return {
    registrantName: registrant.name || 'N/A',
    technicalContactName: technicalContact.name || 'N/A',
    administrativeContactName: administrativeContact.name || 'N/A',
    contactEmail: registrant.email || technicalContact.email || administrativeContact.email || 'N/A'
  };
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});