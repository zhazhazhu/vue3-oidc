// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
import express from "express";
import useOidcRoutes from "./oidc";

const port = 4500;

const app = express();

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

useOidcRoutes(app);

console.log("listening on " + `http://localhost:${port}`);

app.listen(port);
