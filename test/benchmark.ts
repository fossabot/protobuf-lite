import { Field, Type } from "protobufjs";
import "reflect-metadata";
import { decode, encode, ProtobufLiteProperty } from "../src/protobuf-lite";
import { newSuite } from "./benchmarkSute";

class AwesomeMessage {
  @ProtobufLiteProperty()
  public awesomeField: string;

  @ProtobufLiteProperty()
  public someBoolean: boolean;
}

const AwesomeMessageReflection = new Type("AwesomeMessageReflection")
  .add(new Field("awesomeField", 1, "string", "required"))
  .add(new Field("someBoolean", 2, "bool", "required"));

const awesomeMessageProtobufDecoratorsLite = new AwesomeMessage();
awesomeMessageProtobufDecoratorsLite.awesomeField = "dupa";
awesomeMessageProtobufDecoratorsLite.someBoolean = true;

const json = JSON.parse(JSON.stringify(awesomeMessageProtobufDecoratorsLite));
const awesomeMessageReflection = AwesomeMessageReflection.create(json);

const jsonStringEncoded = JSON.stringify(json);
const protobufDecoratorsLiteEncoded = encode(AwesomeMessage, awesomeMessageProtobufDecoratorsLite);
const awesomeMessageReflectionEncoded = AwesomeMessageReflection.encode(
  awesomeMessageReflection
).finish();

// add tests
newSuite("encode")
  .add("JSON(string)", function() {
    JSON.stringify(json);
  })
  .add("protobuf-reflection", function() {
    AwesomeMessageReflection.verify(awesomeMessageProtobufDecoratorsLite);
    AwesomeMessageReflection.encode(awesomeMessageProtobufDecoratorsLite).finish();
  })
  .add("protobuf-decorators-lite", function() {
    encode(AwesomeMessage, awesomeMessageProtobufDecoratorsLite);
  })
  .run();

newSuite("decode")
  .add("JSON(string)", function() {
    JSON.parse(jsonStringEncoded);
  })
  .add("protobuf-reflection", function() {
    const decoded = AwesomeMessageReflection.decode(awesomeMessageReflectionEncoded);
    AwesomeMessageReflection.verify(decoded);
  })
  .add("protobuf-decorators-lite", function() {
    decode(AwesomeMessage, protobufDecoratorsLiteEncoded);
  })
  .run();

newSuite("combined")
  .add("JSON(string)", function() {
    JSON.parse(JSON.stringify(json));
  })
  .add("protobuf-reflection", function() {
    AwesomeMessageReflection.verify(awesomeMessageProtobufDecoratorsLite);

    const encoded = AwesomeMessageReflection.encode(awesomeMessageProtobufDecoratorsLite).finish();

    const decoded = AwesomeMessageReflection.decode(encoded);

    AwesomeMessageReflection.verify(decoded);
  })
  .add("protobuf-decorators-lite", function() {
    decode(AwesomeMessage, encode(AwesomeMessage, awesomeMessageProtobufDecoratorsLite));
  })
  .run();
