import { Ast } from "svelte/types/compiler/interfaces";

export interface Value {
    start: number;
    end: number;
    type: string;
    raw: string;
    data: string;
}

export interface Attribute {
    start: number;
    end: number;
    type: string;
    name: string;
    value: Value[];
}

export interface SvelteNode {
    start: number;
    end: number;
    type: string;
    raw?: string;
    data?: string;
    name?: string;
    attributes?: Attribute[];
    children?: SvelteNode[];
}

export interface SvelteAst extends Ast {
    type: string;
}
