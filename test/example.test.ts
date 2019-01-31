import { decode, encode, ProtobufLiteProperty } from "../src/protobuf-lite";

describe("example", () => {
  it("example 1", () => {
    class Person {
      @ProtobufLiteProperty()
      public firstName: string;

      @ProtobufLiteProperty()
      public secondName: string;

      @ProtobufLiteProperty({ optional: true })
      public nickname?: string;

      @ProtobufLiteProperty()
      public isProgrammer: boolean;

      @ProtobufLiteProperty()
      public birthDate: Date;

      @ProtobufLiteProperty({ type: () => String })
      public hobbies: string[];
    }

    const payload: Person = {
      firstName: "Joe",
      secondName: "Doe",
      isProgrammer: true,
      hobbies: ["swimming", "eating"],
      birthDate: new Date("1990")
    };

    const encoded = encode(Person, payload);
    const decoded = decode(Person, encoded);

    expect(Buffer.isBuffer(encoded)).toBe(true);
    expect(decoded).toBeInstanceOf(Person);

    expect(decoded.firstName).toBe("Joe");
    expect(decoded.secondName).toBe("Doe");
    expect(decoded.isProgrammer).toBe(true);

    expect(decoded.hobbies).toBeInstanceOf(Array);
    expect(decoded.hobbies).toMatchObject(["swimming", "eating"]);

    expect(decoded.birthDate).toBeInstanceOf(Date);
    expect(decoded.birthDate.getTime()).toBe(new Date("1990").getTime());
  });
});
