/* @TODO replace with your variables
 * ensure all variables on this page match your project
 */

export const environment = {
  production: false,
  apiServerUrl: 'http://127.0.0.1:5000',   // dein Flask-Backend

  auth0: {
    url: 'dev-nz2uujp47cdujste.us',       // dein Tenant-Domain (ohne https:// und ohne /)
    audience: 'coffee',                   // dein API Identifier
    clientId: 'bjT5t0iCLg6ad5jDOSBsQ1f9tOhu2ah6',  // Client ID deiner SPA App
    callbackURL: 'http://localhost:8100/tabs/user-page', // wo Ionic zurückleitet
  }
};

