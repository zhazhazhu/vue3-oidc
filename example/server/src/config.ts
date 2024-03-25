export const userInfo = {
  sub: "818727",
  email: "AliceSmith@email.com",
  email_verified: true,
  role: ["Admin", "Geek"],
  avatar:
    "https://avatars.githubusercontent.com/u/80683658?s=400&u=9feb1c1ee3ae25b1b039ee1f0dca4581f44f041c&v=4",
};

function encodeBase64Url(str: string) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export const id_token = [{ alg: "none" }, userInfo]
  .map((item) => JSON.stringify(item))
  .map(encodeBase64Url)
  .join(".");
