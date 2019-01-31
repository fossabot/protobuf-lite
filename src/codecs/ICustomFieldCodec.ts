export interface ICustomFieldCodec<In> {
  encode: (value: In) => Buffer;
  decode: (value: Buffer) => In;
}
