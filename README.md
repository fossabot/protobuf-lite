# @elderapo/protobuf-lite

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/elderapo/protobuf-lite.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/elderapo/protobuf-lite.svg?branch=master)](https://travis-ci.org/elderapo/protobuf-lite)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/yusq4o62o5fdhwgs?svg=true)](https://ci.appveyor.com/project/elderapo/protobuf-lite)
[![Coveralls](https://img.shields.io/coveralls/elderapo/protobuf-lite.svg)](https://coveralls.io/github/elderapo/protobuf-lite)
[![Dev Dependencies](https://david-dm.org/elderapo/protobuf-lite/dev-status.svg)](https://david-dm.org/elderapo/protobuf-lite?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Felderapo%2Fprotobuf-lite.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Felderapo%2Fprotobuf-lite?ref=badge_shield)

Minimalistic library for easy, fast and optimal serialization/deserialization of data to binary format. Under the hood uses [dcodeIO/protobuf.js](https://github.com/dcodeIO/protobuf.js) and some magic 🧙.

Mainly was created because [dcodeIO/protobuf.js](https://github.com/dcodeIO/protobuf.js) requires a lot of boilerplate and doesn't support native js `Date` object serialization/deserialization.

### How to install

```bash
yarn add @elderapo/protobuf-lite
# or
npm install @elderapo/protobuf-lite
```

### Usage

```typescript
import { decode, encode, ProtobufLiteProperty } from "@elderapo/protobuf-lite";

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

console.log(`Everything is working as expected 👍`);
```

### [Check out tests for more examples!](https://github.com/elderapo/protobuf-lite/tree/master/test)
