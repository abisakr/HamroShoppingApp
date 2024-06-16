import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignIn = () => {
    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await fetch('https://localhost:7223/api/UserAccount/google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: response.credential,  // Ensure this matches the expected structure
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log('JWT Token:', data.token);
                // Handle successful login, show confirmation message, redirect, etc.
            } else {
                console.error('Token not found in response', data);
                // Handle the case where token is not in response
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            // Handle error, show message to user, etc.
        }
    };

    const handleGoogleLoginFailure = (response) => {
        console.error('Google login failed:', response);
        // Optionally, provide feedback to the user that the login failed
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
            />
        </div>
    );
};

export default GoogleSignIn;
