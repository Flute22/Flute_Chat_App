export const HOST = "http://localhost:2122";

export const AUTH_ROUTES = "/api/v1/users";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO= `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_INFO = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const Delete_PROFILE_IMAGE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "/api/v1/contacts";
export const SEARCH_CONTACTS = `${CONTACT_ROUTES}/search-contacts`;
export const GET_CONTACTS = `${CONTACT_ROUTES}/get-contacts`;

export const MESSAGE_ROUTES = "/api/v1/messages";
export const GET_MESSAGES = `${MESSAGE_ROUTES}/get-messages`;