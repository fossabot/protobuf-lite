import { DateCodec } from "../../src/codecs";

describe("DateCodec", () => {
  it("should correctly handle date", () => {
    const codec = new DateCodec();
    const date = new Date();

    const encoded = codec.encode(date);
    const decoded = codec.decode(encoded);

    expect(Buffer.isBuffer(encoded)).toBe(true);
    expect(encoded.length).toBe(8);
    expect(decoded).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(decoded.getTime());
  });
});
