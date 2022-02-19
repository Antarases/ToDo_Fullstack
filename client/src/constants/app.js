export const NOIMAGE_IMAGE_URL = "https://c-lj.gnst.jp/public/img/common/noimage.jpg?20190112050043";

export const LISTS_FETCH_THROTTLING_TIME = 10000;
export const COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS = 0.7;

export const DATE_TIME_INPUT_FORMAT = "D MMM YYYY, HH:mm";

const SERVER_HTTP_URI_SHEME = (process.env.NODE_ENV === "production")
    ? "https"
    : "http";
const SERVER_WS_URI_SHEME = (process.env.NODE_ENV === "production")
    ? "wss"
    : "ws";
const SERVER_URI_HOSTNAME = (process.env.NODE_ENV === "production")
    ? "aqueous-wildwood-77878.herokuapp.com"
    : "localhost";
const SERVER_PORT =  (process.env.NODE_ENV === "production")
    ? ""
    : ":5000";
const SERVER_HTTP_URI_PATH = "graphql";
const SERVER_WS_URI_PATH = "graphql_ws";

export const SERVER_HTTP_URI = SERVER_HTTP_URI_SHEME + "://" + SERVER_URI_HOSTNAME + SERVER_PORT + "/" + SERVER_HTTP_URI_PATH;
export const SERVER_WS_URI = SERVER_WS_URI_SHEME + "://" + SERVER_URI_HOSTNAME + SERVER_PORT + "/" + SERVER_WS_URI_PATH;
