import React from "react";
import './Api.css';

function APIDocumentation() {
        return (
            <div className="api-doc">
              <h1>API Documentation</h1>

            <h2>All Requests should be send to <strong>api.ahmads.dev</strong></h2>
              <section>
                <h2>1. Sign Up</h2>
                <p>Creates a new email account and schedules its deletion after a specified time.</p>
                <h3>Endpoint:</h3>
                <code>POST /sign-up</code>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h4>Body:</h4>
                <pre>{`{
          "email": "user@example.com",
          "password": "password123",
          "deletionTime": "30" // Time in days after which the account will be deleted
        }`}</pre>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`{
          "token": "jwt_token",
          "deleteTimeStamp": 1627891234567 // Timestamp when the account will be deleted
        }`}</pre>
                <h4>400 Bad Request:</h4>
                <pre>{`{
          "error": "error details"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while creating the email address",
          "message": "error details"
        }`}</pre>
              </section>
        
              <section>
                <h2>2. Send Email</h2>
                <p>Sends an email and appends the sent email to the "Sent" folder.</p>
                <h3>Endpoint:</h3>
                <code>POST /send-email</code>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h4>Body:</h4>
                <pre>{`{
          "to": "recipient@example.com",
          "subject": "Email Subject",
          "text": "Email Body",
          "attachments": [
            {
              "filename": "file.txt",
              "content": "file content"
            }
          ]
        }`}</pre>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`{
          "message": "Email sent successfully",
          "messageId": "message_id"
        }`}</pre>
                <h4>401 Unauthorized:</h4>
                <pre>{`{
          "error": "Invalid token"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while sending the email",
          "message": "error details"
        }`}</pre>
              </section>
        
              <section>
                <h2>3. Mark Email as Seen</h2>
                <p>Marks an email as seen in the "INBOX" folder.</p>
                <h3>Endpoint:</h3>
                <code>POST /mark-as-seen</code>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h4>Body:</h4>
                <pre>{`{
          "uid": "email_uid"
        }`}</pre>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`{
          "message": "Email marked as seen"
        }`}</pre>
                <h4>401 Unauthorized:</h4>
                <pre>{`{
          "error": "Invalid token"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while marking email as seen",
          "message": "error details"
        }`}</pre>
              </section>
        
              <section>
                <h2>4. Login</h2>
                <p>Logs in a user and returns a JWT token and the deletion timestamp of the email account.</p>
                <h3>Endpoint:</h3>
                <code>POST /login</code>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h4>Body:</h4>
                <pre>{`{
          "email": "user@example.com",
          "password": "password123"
        }`}</pre>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`{
          "token": "jwt_token",
          "deleteTimeStamp": 1627891234567 // Timestamp when the account will be deleted
        }`}</pre>
                <h4>401 Unauthorized:</h4>
                <pre>{`{
          "error": "Invalid credentials"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while checking user existence"
        }`}</pre>
              </section>
        
              <section>
                <h2>5. Fetch Emails</h2>
                <p>Fetches emails from the "INBOX" or "Sent" folder based on the endpoint.</p>
                <h3>Endpoints:</h3>
                <p>Fetch from INBOX: <code>GET /fetch-emails</code></p>
                <p>Fetch from Sent: <code>GET /sent</code></p>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`[
          {
            "uid": "email_uid",
            "seen": false,
            "from": {
              "name": "Sender Name",
              "address": "sender@example.com"
            },
            "subject": "Email Subject",
            "date": "17:35 Tue, 1 Jan 2023",
            "html": "<p>Email body</p>"
          }
        ]`}</pre>
                <h4>401 Unauthorized:</h4>
                <pre>{`{
          "error": "Invalid token"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while fetching emails",
          "message": "error details"
        }`}</pre>
              </section>
        
              <section>
                <h2>6. Delete Email</h2>
                <p>Deletes an email permanently from the "INBOX" or "Sent" folder based on the endpoint.</p>
                <h3>Endpoint:</h3>
                <code>DELETE /delete-message/:ENDPOINT/:uid</code>
                <h3>Request:</h3>
                <h4>Headers:</h4>
                <pre>{`{
          "Authorization": "Bearer jwt_token"
        }`}</pre>
                <h4>Parameters:</h4>
                <p><strong>ENDPOINT:</strong> <code>inbox</code> or <code>sent</code></p>
                <p><strong>uid:</strong> UID of the email to be deleted</p>
                <h3>Response:</h3>
                <h4>200 OK:</h4>
                <pre>{`{
          "message": "Email permanently deleted"
        }`}</pre>
                <h4>401 Unauthorized:</h4>
                <pre>{`{
          "error": "Invalid token"
        }`}</pre>
                <h4>500 Internal Server Error:</h4>
                <pre>{`{
          "error": "An error occurred while marking email as deleted",
          "message": "error details"
        }`}</pre>
              </section>
            </div>
          );
}

export default APIDocumentation;
