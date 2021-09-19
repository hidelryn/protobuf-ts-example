import express from "express";
import protobuf from "protobufjs";

export class Util {
  static parseBody(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    let byteCount = 0;
    const body: Uint8Array[] = [];
    req
      .on("error", (err) => next(err))
      .on("data", (chunk) => {
        byteCount += Buffer.from(chunk).length;
        body.push(chunk);
      })
      .on("end", () => {
        try {
          if (
            req.is("application/octet-stream") === "application/octet-stream"
          ) {
            req.body = Buffer.concat(body);
          } else {
            // application/json
            if (body.length > 0) {
              req.body = JSON.parse(Buffer.concat(body).toString());
            }
          }
          console.log(
            "path: ",
            req.path,
            ",",
            "reqByteCount: ",
            byteCount + "Byte"
          );
          return next();
        } catch (error) {
          return next(error);
        }
      });
  }

  /**
   * pb load
   * @param path
   * @param message
   * @returns
   */
  async pbLoad(path: string, message: string) {
    const load = await protobuf.load(path); // 프로토버프 파일 로드
    return load.lookupType(message); // 사용하는 message name
  }

  /**
   * encode 하기 전에 argument 체크
   * @param arg
   */
  pbVerify(loadPB: protobuf.Type, arg: Record<string, any>) {
    const fail = loadPB.verify(arg); // argument 검사
    if (fail) {
      console.log('fail', fail)
      throw new Error(fail);
    }
  }

  pbEncode(loadPB: protobuf.Type, arg: Record<string, any>) {
    try {
      return loadPB.encode(arg).finish();
    } catch (error) {
      throw error;
    }
  }

  pbDecode(loadPB: protobuf.Type, binary: Uint8Array) {
    try {
      return loadPB.decode(binary).toJSON();
    } catch (error) {
      throw error;
    }
  }

  static getCurrentMS() {
    return new Date().getTime();
  }
}
