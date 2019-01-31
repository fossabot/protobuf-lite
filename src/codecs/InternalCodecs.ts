import { Constructable } from "../utils";
import { ICustomFieldCodec } from "./ICustomFieldCodec";
import { DateCodec } from "./DateCodec";

export class InternalCodecs {
  private static instance: InternalCodecs;

  private internalCodecs: Map<Object, Constructable<ICustomFieldCodec<any>>> = new Map();

  private constructor() {
    this.internalCodecs.set(Date, DateCodec);
  }

  public static lookup(type: Object) {
    if (!this.instance) {
      this.instance = new InternalCodecs();
    }

    return this.instance.internalCodecs.get(type);
  }
}
