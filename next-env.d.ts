/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_API_ROOT: string;
  }
}
