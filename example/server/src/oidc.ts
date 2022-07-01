import type { Express } from "express";

const path = "/oidc";

const metadataPath = path + "/.well-known/openid-configuration";

const signingKeysPath = path + "/.well-known/jwks";
const authorizationPath = path + "/connect/authorize";
const userInfoPath = path + "/connect/userinfo";
const endSessionPath = path + "/connect/endsession";
const tokenPath = path + "/connect/token";

const metaData = {
  issuer: path,
  jwks_uri: signingKeysPath,
  authorization_endpoint: authorizationPath,
  userinfo_endpoint: userInfoPath,
  end_session_endpoint: endSessionPath,
  token_endpoint: tokenPath,
};

const keys = {
  keys: [
    {
      kty: "RSA",
      use: "sig",
      kid: "1",
      e: "E",
      n: "N",
    },
  ],
};

const claims = {
  sub: "818727",
  email: "AliceSmith@email.com",
  email_verified: true,
  role: ["Admin", "Geek"],
};

function prependBaseUrlToMetadata(baseUrl = "http://localhost:4500") {
  for (const name in metaData) {
    metaData[name] = baseUrl + metaData[name];
  }
}

function encodeBase64Url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function useOidcRoutes(app: Express) {
  prependBaseUrlToMetadata();

  app.get(metadataPath, function (req, res) {
    //res.send("<h1>not json...</h1>"); return;
    res.json(metaData);
  });

  app.get(signingKeysPath, function (req, res) {
    res.json(keys);
  });

  app.get(authorizationPath, function (req, res) {
    var url = new URL(req.query.redirect_uri as string);
    const paramsKey =
      req.query.response_mode === "fragment" ? "hash" : "search";
    const params = new URLSearchParams(url[paramsKey].slice(1));
    var state = req.query.state as string;
    if (state) {
      params.append("state", state);
      if (req.query.code_challenge) {
        params.append("code", "foo");
      }
    }
    //params.append("error", "bad_stuff");
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

  app.get(userInfoPath, function (req, res) {
    res.json(claims);
  });

  app.get(endSessionPath, function (req, res) {
    var url = req.query.post_logout_redirect_uri as string;
    if (url) {
      var state = req.query.state;
      if (state) {
        url += "?state=" + state;
      }
      res.redirect(url);
    } else {
      res.send("logged out");
    }
  });

  app.post(tokenPath, function (req, res) {
    res.json({
      access_token: "foobar",
      token_type: "Bearer",
      id_token:
        [{ alg: "none" }, claims]
          .map((obj) => JSON.stringify(obj))
          .map(encodeBase64Url)
          .join(".") + ".",
    });
  });
}

export default useOidcRoutes;
