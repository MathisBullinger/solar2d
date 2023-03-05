export type Tuple<
  N extends number,
  T = number,
  L extends T[] = []
> = Length<L> extends N ? L : Tuple<N, T, [...L, T]>;

export type Add<A extends number, B extends number> = Length<
  Push<Tuple<A>, Tuple<B>>
>;

export type Subtract<
  A extends number,
  B extends number,
  LA extends any[] = Tuple<A>,
  LB extends any[] = []
> = Length<LB> extends B
  ? Length<LA>
  : LA extends [infer H, ...infer T]
  ? Subtract<A, B, T, [...LB, H]>
  : 0;

export type Multiply<A extends number, B extends number> = Length<
  Flatten<Tuple<A, Tuple<B, unknown>>>
>;

type Flatten<T extends any[][]> = T extends [infer A, infer B, ...infer C]
  ? Flatten<
      [
        Push<A extends any[] ? A : never, B extends any[] ? B : never>,
        ...(C extends any[][] ? C : never)
      ]
    >
  : T[0];

type Push<A extends any[], B extends any[]> = B extends [infer H, ...infer T]
  ? Push<[...A, H], T>
  : A;

type Length<T> = T extends { length: infer I extends number } ? I : number;
