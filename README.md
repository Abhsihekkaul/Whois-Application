WHOIS Domain Lookup App
A full-stack application that retrieves and displays WHOIS information for domain names. This application allows users to query domain information or contact information for any domain using the WHOIS XML API.
Features

Query domain information (registration details, age, hostnames)
Query contact information (registrant, technical contact, administrative contact)
Responsive design
Error handling
Clean, user-friendly interface

Tech Stack

Backend: Node.js with Express
Frontend: React
Styling: CSS

Prerequisites

Node.js (v14.x or higher)
npm (v6.x or higher)
A WHOIS XML API key (get one from whoisxmlapi.com)

Installation
Backend Setup

Navigate to the backend directory:
Copycd backend

Install dependencies:
Copynpm install

Create a .env file in the backend directory with your API key:
CopyWHOIS_API_KEY=your_api_key_here

Start the backend server:
Copynpm start
The server will run on http://localhost:5000

Frontend Setup

Navigate to the frontend directory:
Copycd frontend

Install dependencies:
Copynpm install

Start the frontend development server:
Copynpm start
The application will open in your browser at http://localhost:3000

Usage

Enter a domain name (e.g., amazon.com) in the input field
Select the type of information you want to retrieve (Domain Information or Contact Information)
Click the "Lookup" button
View the retrieved information in the table below

API Endpoints
POST /api/whois
Retrieves WHOIS information for a given domain name.
Request Body:
jsonCopy{
  "domain": "example.com",
  "infoType": "domain" // or "contact"
}
Response:
jsonCopy{
  "type": "domain",
  "data": {
    "domainName": "example.com",
    "registrar": "Example Registrar, LLC",
    "createdDate": "1995-08-14T04:00:00Z",
    "expiresDate": "2023-08-13T04:00:00Z",
    "estimatedAge": "28 years",
    "hostnames": "ns1.example.com, ns2.ex..."
  }
}
License
This project is submitted as part of the TLV300 Home Assignment.