import decode from "jwt-decode";
import { loadState } from "./localStorage";
export default class AuthService {
  // Initializing important variables
  constructor(domain) {
    this.domain = domain || "http://localhost:8080"; // API server domain
    this.domain =
      domain || "https://staging.seerbitapigateway.com/FCMB_BACK/rest/api/";
    this.fetch = this.fetch.bind(this); // React binding stuff
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  static loggedIn() {
    // Checks if there is a saved token and it's still valid
    const state = loadState();
    if (
      state === undefined ||
      state.user === undefined ||
      state.user.data === undefined ||
      state.user.data.user_details === undefined ||
      state.user.data.loggedin === undefined ||
      state.user.data.loggedin.length === undefined ||
      state.user.data.loggedin.length < 100
    ) {
      return false;
    }
    const token = state.user.data.loggedin; // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  static isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  static setToken(idToken) {
    // Saves user token to localStorage
    const state = loadState();
    sessionStorage.setItem("id_token", state.user.data.loggedin);
  }

  static getToken() {
    // Retrieves the user token from localStorage
    return sessionStorage.getItem("id_token");
  }

  static logout() {
    // Clear user token and profile data from localStorage
    sessionStorage.removeItem("seerbit_state");
  }

  static getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
