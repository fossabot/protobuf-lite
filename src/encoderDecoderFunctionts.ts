import { Message } from "protobufjs";
import { getMetadataObject, hasMetadataObject } from "./metadataHelpers";

export const encode = <T>(MessageClass: new () => T, payload: T): Buffer => {
  if (!payload) {
    throw new Error(`Payload wasnt provided!`);
  }

  if (!hasMetadataObject(MessageClass)) {
    throw new Error(`MessageClass doesn't have protobuf lite metadata assosiated!`);
  }

  const metadataObject = getMetadataObject(MessageClass);
  const MessageClassProto = metadataObject.getProto();

  payload = metadataObject.runCustomEncoders(payload);

  const errMsg = MessageClassProto.verify(payload);

  if (errMsg) {
    throw new Error(errMsg);
  }

  const encoded: Buffer | Uint8Array = MessageClassProto.encode(payload).finish();

  /* istanbul ignore next line */
  return Buffer.isBuffer(encoded) ? encoded : Buffer.from(encoded);
};

export const decode = <T extends Object>(MessageClass: new () => T, encoded: Buffer): T => {
  if (!hasMetadataObject(MessageClass)) {
    throw new Error(`MessageClass doesn't have protobuf lite metadata assosiated!`);
  }

  const metadataObject = getMetadataObject(MessageClass);
  const MessageClassProto = metadataObject.getProto();

  const decoded: Message<T> = MessageClassProto.decode(encoded);

  metadataObject.runCustomDecoders(decoded);
  metadataObject.fixPrototypes(decoded);

  return (decoded as unknown) as T;
};
