import crypto from "crypto";

function md5ToBase62(input) {
  const md5Hash = crypto.createHash("md5").update(input).digest("hex");
  let num = BigInt("0x" + md5Hash);

  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let base62Str = "";

  while (num > 0) {
    let rem = Number(num % 62n);
    base62Str = base62Chars[rem] + base62Str;
    num = num / 62n;
  }

  return base62Str;
}

exports.handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);
    const { hostname, pathname, search } = new URL(url);
    const shortHostname = md5ToBase62(hostname);
    const shortPathname = md5ToBase62(pathname);
    const shortSearch = md5ToBase62(search);
    const shortUrl = `https://${shortHostname}/${shortPathname}/${shortSearch}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ shortUrl }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
