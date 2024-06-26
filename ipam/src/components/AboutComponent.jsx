import React from "react";
import './AboutComponent.css'
function AboutComponent() {
    return (
     
        <div className="about">

        <h1>Dmail: Your Temporary Email Solution</h1>
        <h2>Overview:</h2>
        <p>Dmail is an innovative email service designed to provide users with limitless temporary email addresses, ensuring a clean inbox free from spam and unwanted advertisements. With a quick and easy signup process requiring no personal information, Dmail offers a convenient solution for signing up for discount deals or any other purposes without the hassle of managing subsequent spam emails.</p>
        <h2>Key Features:</h2>
        <ul>
          <li>Quick and Easy Signup: No personal information required for signup.</li>
          <li>Temporary Addresses: Keep your main email address clean by using temporary Dmail addresses.</li>
          <li>Automatic Deletion: Email addresses are automatically deleted after 24 hours, unless specified otherwise for up to one week.</li>
          <li>Send Emails</li>
          <li>Receive and Reply: Read and reply to received emails.</li>
          <li>Manual Deletion: Delete any unwanted emails manually.</li>
          <li>Multiple Addresses: Sign up for as many temporary email addresses as needed.</li>
        </ul>
        <h2>Usage Guidelines:</h2>
        <p>Not for Sensitive Data: Avoid using Dmail for sensitive data or purposes requiring long-term storage, as emails are temporary and will be deleted.</p>
        <p>Dmail offers a responsive and fully functional email service tailored for temporary use, ensuring a clutter-free inbox experience. Enjoy the convenience of temporary email addresses without compromising your privacy or security.</p>
        </div>
    );
    }


export default AboutComponent;
