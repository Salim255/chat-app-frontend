// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
/*   firebaseConfig: {
    apiKey: "AIzaSyDHIOD38rLTJ3oschEswBjMycY9aiEm7Ho",
    authDomain: "chat-app-d15ec.firebaseapp.com",
    projectId: "chat-app-d15ec",
    storageBucket: "chat-app-d15ec.firebasestorage.app",
    messagingSenderId: "80385309310",
    appId: "1:80385309310:web:780e4abc15b5fbc6f2762f",
    measurementId: "G-19M6RW2GR4"
  }, */
 /*  apiUrl: 'http://intimacy.com/api/v2', */
/*   socketUrl: 'http://intimacy.com:3000', */
  //socketUrl: 'http://intimacy.com/socket',
  apiUrl: 'http://localhost:3000/api/v2',
  socketUrl: 'http://localhost:3000',
  mapBaseUrl: 'https://api.opencagedata.com/geocode/v1/json',
  mapApiKey: 'd5adeba61c104499a2bfb61f2d2c898d',
};
/* export const environment = {
  production: false,
  apiUrl: "https://chat-app-backend-duj2.onrender.com/api/v1",
  mapBaseUrl: "https://api.opencagedata.com/geocode/v1/json",
  mapApiKey: "d5adeba61c104499a2bfb61f2d2c898d"
}; */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
