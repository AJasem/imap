import React from "react";
import './Api.css';

function APIDocumentation() {
    return (
        <div className="api-doc">
            <h1>Dmail API Documentation</h1>
            <h2>Introduction</h2>
            <p>Welcome to the Dmail API documentation. This API allows developers to interact with the Dmail service programmatically. Below you will find detailed information about each endpoint, including the HTTP methods, parameters, and sample responses.</p>
            
            <h2>Endpoints</h2>
            
            <h3>1. Create Temporary Email</h3>
            <p><strong>Endpoint:</strong> <code>POST /api/create</code></p>
            <p><strong>Description:</strong> Creates a new temporary email address.</p>
            <p><strong>Parameters:</strong></p>
            <ul>
                <li><code>duration</code> (optional): Time in hours the email should exist. Default is 24 hours.</li>
            </ul>
            <p><strong>Sample Request:</strong></p>
            <pre>
                <code>
{`POST /api/create
{
    "duration": 24
}`}
                </code>
            </pre>
            <p><strong>Sample Response:</strong></p>
            <pre>
                <code>
{`{
    "email": "example@dmail.com",
    "expires_in": "24 hours"
}`}
                </code>
            </pre>

            <h3>2. Send Email</h3>
            <p><strong>Endpoint:</strong> <code>POST /api/send</code></p>
            <p><strong>Description:</strong> Sends an email from a temporary email address.</p>
            <p><strong>Parameters:</strong></p>
            <ul>
                <li><code>from</code> (required): The temporary email address to send from.</li>
                <li><code>to</code> (required): The recipient's email address.</li>
                <li><code>subject</code> (required): The subject of the email.</li>
                <li><code>body</code> (required): The body of the email.</li>
            </ul>
            <p><strong>Sample Request:</strong></p>
            <pre>
                <code>
{`POST /api/send
{
    "from": "example@dmail.com",
    "to": "recipient@example.com",
    "subject": "Hello!",
    "body": "This is a test email."
}`}
                </code>
            </pre>
            <p><strong>Sample Response:</strong></p>
            <pre>
                <code>
{`{
    "status": "success",
    "message": "Email sent successfully."
}`}
                </code>
            </pre>

            <h3>3. Receive Emails</h3>
            <p><strong>Endpoint:</strong> <code>GET /api/receive</code></p>
            <p><strong>Description:</strong> Retrieves emails received by a temporary email address.</p>
            <p><strong>Parameters:</strong></p>
            <ul>
                <li><code>email</code> (required): The temporary email address to check.</li>
            </ul>
            <p><strong>Sample Request:</strong></p>
            <pre>
                <code>
{`GET /api/receive?email=example@dmail.com`}
                </code>
            </pre>
            <p><strong>Sample Response:</strong></p>
            <pre>
                <code>
{`{
    "emails": [
        {
            "from": "sender@example.com",
            "subject": "Welcome!",
            "body": "Welcome to Dmail!",
            "received_at": "2024-06-21T12:34:56Z"
        }
    ]
}`}
                </code>
            </pre>

            <h3>4. Delete Email</h3>
            <p><strong>Endpoint:</strong> <code>DELETE /api/delete</code></p>
            <p><strong>Description:</strong> Deletes a specific email received by a temporary email address.</p>
            <p><strong>Parameters:</strong></p>
            <ul>
                <li><code>email</code> (required): The temporary email address.</li>
                <li><code>email_id</code> (required): The ID of the email to delete.</li>
            </ul>
            <p><strong>Sample Request:</strong></p>
            <pre>
                <code>
{`DELETE /api/delete
{
    "email": "example@dmail.com",
    "email_id": "12345"
}`}
                </code>
            </pre>
            <p><strong>Sample Response:</strong></p>
            <pre>
                <code>
{`{
    "status": "success",
    "message": "Email deleted successfully."
}`}
                </code>
            </pre>
        </div>
    );
}

export default APIDocumentation;
