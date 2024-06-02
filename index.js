import crypto from "crypto";
// import AWS from "aws-sdk";
import mongoose from "mongoose";
import Url from "./urlModel.js";
// import User from "./userModel.js";

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = mongoose.connection.readyState;
    console.log("DB connection successful!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

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

export const handler = async (event) => {
  try {
    await connectToDatabase();

    if (!event.body) {
      throw new Error("Event body is undefined");
    }

    const { url } = event.body;

    if (!url) {
      throw new Error("URL is missing from the input");
    }

    let result = await Url.find({ longurl: url });

    if (result[0]) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: result,
      };
    }

    const shortUrl = md5ToBase62(url).slice(0, 8);
    const finalUrl = `https://r5pm4i5o76.execute-api.ap-southeast-2.amazonaws.com/v1/url?shorturl=${shortUrl}`;

    const payload = {
      shorturl: finalUrl,
      longurl: url,
    };

    result = await Url.create(payload);
    console.log(result);

    // const params = {
    //   FunctionName: "connectMongo",
    //   InvocationType: "Event", // 使用事件调用，异步执行
    //   Payload: JSON.stringify(payload),
    // };

    // 尝试调用 Lambda 函数
    // const invokeResponse = await lambda.invoke(params).promise();

    // if (invokeResponse.StatusCode === 200) {
    //   console.log("Successfully invoked the Lambda function");
    // } else {
    //   throw new Error(invokeResponse.FunctionError);
    // }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: result,
    };
  } catch (error) {
    console.error("Error message:", error.message);

    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: { error: error.message },
    };
  }
};
