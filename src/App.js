import React from 'react';
import { Grid }  from '@material-ui/core';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { DetailsComponent } from './components/Details/DetailsComponent';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants';


function onLoginSuccess(data) {
  console.log("Handle login");
  window.localStorage.setItem('google_session',
   JSON.stringify({clientId: data.clientId, credential: data.credential}));
   window.location.reload(false);
}

function onLoginError(data) {}

function logout() {
  googleLogout();
  window.localStorage.removeItem('google_session');
  window.location.reload(false);
}

function jwtDecode(t) {
  let token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split('.')[0]));
  token.payload = JSON.parse(window.atob(t.split('.')[1]));
  return (token)
}

function isLoggedIn() {
  // If there's no Google Oauth client ID configured, then we don't need to login
  if (!GOOGLE_CLIENT_ID) return true;
  let session = JSON.parse(window.localStorage.getItem('google_session'));
  if (session){
    let credential = jwtDecode(session.credential)
    let expiration =  credential.payload.exp;    
    if (expiration > Date.now() / 1000) {
      return true;
    }    
  }
  return false;
}

function ShowLogin() {  
  if (!isLoggedIn())  {
    window.localStorage.removeItem('google_session');
    return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <GoogleLogin onSuccess={credentialResponse => {onLoginSuccess(credentialResponse)}}
              onError={error=>{onLoginError(error)}}
    />
    </GoogleOAuthProvider>
    )
  }
  else  return GOOGLE_CLIENT_ID ? (<button onClick={()=>{logout()}}>Logout</button>) : (<p/>)
}

function ShowDashboard() {
  if (isLoggedIn()) {
    return     (<Grid container spacing={1}>
    <Grid item xs={12} sm={12} md={12}>
      <HeaderComponent />
    </Grid>
    <Grid item xs={12} sm={9} md={9}>
      <NetworkGraphComponent />
    </Grid>
    <Grid item xs={12} sm={3} md={3}>
      <DetailsComponent />
    </Grid>
  </Grid>)
  }
  else
  {
    return <p></p>
  }
}

export class App extends React.Component{
  render(){
    return (
      <div>
        <ShowLogin />
        <ShowDashboard/>
      </div>
      );
  }
}

