export interface Constructable<T> {
  new (): T;
}

export const getPrototypeChain = (Class: Function): Function[] => {
  let p: Function = Class.prototype;

  const prototypes: Function[] = [p];

  while (p && p.name !== "") {
    p = Object.getPrototypeOf(p);
    if (p && Object.getPrototypeOf(p)) {
      prototypes.push(p);
    }
  }

  return prototypes;
};
