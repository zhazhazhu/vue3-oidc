import cors from "cors";
import express from "express";
import { id_token, userInfo } from "./config";

const app = express();

app.use(cors());

const baseUrl = "http://localhost:4000";

const metaData = {
  jwks_uri: "/.well-known/jwks",
  authorization_endpoint: "/connect/authorize",
  userinfo_endpoint: "/connect/userinfo",
  end_session_endpoint: "/connect/endsession",
  token_endpoint: "/connect/token",
};

app.get("/.well-known/openid-configuration", (req, res) => {
  const result: any = {};

  for (const key in metaData) {
    result[key] = baseUrl + metaData[key];
  }
  res.send(result);
});

app.get(metaData.jwks_uri, (req, res) => {
  res.send({
    kty: "RSA",
    use: "sig",
    kid: "1",
    e: "E",
    n: "N",
  });
});

app.get(metaData.authorization_endpoint, (req, res) => {
  const url = new URL(req.query.redirect_uri as string);
  const paramsKey = req.query.response_mode === "fragment" ? "hash" : "search";
  const params = new URLSearchParams(url[paramsKey].slice(1));
  const state = req.query.state as string;

  if (state) {
    params.append("state", state);
    if (req.query.code_challenge) {
      params.append("code", "foo");
    }
  }
  url[paramsKey] = params.toString();

  if (req.query.display === "popup") {
    res.status(200);
    res.type("text/html");
    res.send(`<!DOCTYPE html>
      <html>
        <head>
            <meta http-equiv="refresh" content="3;url=${url.href}" />
        </head>
        <body>
            <h1>Redirecting in 3 seconds...</h1>
        </body>
      </html>`);
  } else {
    res.redirect(url.href);
  }
});

app.post(metaData.token_endpoint, (req, res) => {
  res.send({
    access_token: "foobar",
    token_type: "Bearer",
    id_token,
  });
});

app.get(metaData.userinfo_endpoint, (req, res) => {
  res.contentType("application/json");
  res.send(JSON.stringify(userInfo));
});

app.get(metaData.end_session_endpoint, function (req, res) {
  let url = req.query.post_logout_redirect_uri as string;
  const state = req.query.state as string;
  if (url) {
    if (state) {
      url += "?state=" + state;
    }
    res.redirect(url);
  } else {
    res.send("will redirect url,logged out...");
  }
});

app.listen(4000);
console.log("Server started at http://localhost:4000");
