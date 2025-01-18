export default function authHeader() {
  if (localStorage.getItem("authUser") == "undefined") {
    return "";
  } else {
    const obj = JSON.parse(localStorage.getItem("authUser"));

    if (obj && obj.token) {
      return obj.token;
    } else {
      return "";
    }
  }
}
