import React from 'react';
import { GoogleLogin } from 'react-google-login';

const CLIENT_ID = '1014862725084-c4jjkvtjo43m36nb45u27g2jvel9eo3l.apps.googleusercontent.com';

const GoogleSignIn = () => {
    const responseGoogle = async (response) => {
        // const tokenId = response.tokenId;

        // try {
        //     const res = await fetch('https://localhost:7223/api/UserAccount/login-google', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ tokenId })
        //     });

        //     if (res.ok) {
        //         const data = await res.json();
        //         console.log('JWT Token:', data.Token);
        //         localStorage.setItem('token', data.Token);
        //     } else {
        //         console.error('Error during Google logins:', res.statusText);
        //     }
        // } catch (error) {
        //     console.error('Error during Google login:', error);
        // }
    };

    return (
        <div>
            <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default GoogleSignIn;
