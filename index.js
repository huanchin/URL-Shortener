const crypto = require("crypto");

function md5ToBase62(input) {
  // crypto.createHash(algorithm) 方法建立並傳回一個 Hash 對象，該物件使用指定的演算法進行雜湊計算。在這個例子中，"md5" 是指定的演算法。
  // update(data) 方法用於向 Hash 物件提供數據，該數據將用於計算哈希值。 input 是我們要計算雜湊值的輸入字串。
  // digest(encoding) 方法計算出雜湊值並以指定的編碼格式傳回。在這個例子中，"hex" 指定傳回雜湊值的格式為十六進位字串。
  const md5Hash = crypto.createHash("md5").update(input).digest("hex");
  // console.log("md5Hash: ", md5Hash);
  // console.log("type: ", typeof md5Hash);

  let num = BigInt("0x" + md5Hash);

  // console.log("BigInt: ", num);

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

const inputString = "example";
const base62Result = md5ToBase62(inputString);
console.log(`Base62編碼结果: ${base62Result}`);

/*
假設num初始值為123456789：

123456789 % 62 = 21，base62Str = "L"（base62Chars[21]）
123456789 / 62 = 1991246
1991246 % 62 = 18，base62Str = "IL"（base62Chars[18] + "L"）
1991246 / 62 = 32116
32116 % 62 = 54，base62Str = "sIL"（base62Chars[54] + "IL"）
32116 / 62 = 518
518 % 62 = 22，base62Str = "MsIL"（base62Chars[22] + "sIL"）
518 / 62 = 8
8 % 62 = 8，base62Str = "8MsIL"（base62Chars[8] + "MsIL"）
8 / 62 = 0，結束循環
最終，123456789轉換為base62編碼結果為"8MsIL"。

當 num 不能被 62 整除時，num / 62n 的結果仍然是一個 BigInt 類型，只不過是一個向下取整的整數（因為 BigInt 的除法操作總是向下取整的）。例如：
如果 num 是 123，而 62n 是 62，num / 62n 的結果是 1n，因為 123 / 62 = 1.983870967741935，向下取整為 1。
*/
