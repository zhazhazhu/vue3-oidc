export const userInfo = {
  sub: "818727",
  email: "AliceSmith@email.com",
  email_verified: true,
  role: ["Admin", "Geek"],
  avatar:
    "https://cdn.jsdelivr.net/gh/zhazhazhu/image-hosting@master/blog-photo/WechatIMG235_f6tvl0_.jpeg",
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
