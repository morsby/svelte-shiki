import { Ast } from "svelte/types/compiler/interfaces";
import { Highlighter, HtmlRendererOptions } from "shiki";
import { IShikiTheme } from "shiki-themes";
import { TLang } from "shiki-languages";

// AST/Nodes
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

// Highlighter

// Extend the Highlighter to include the custom renderer and a theme prop
export interface SvelteHighlighter {
    theme: IShikiTheme;
    highlight(code: string, lang: TLang, inline?: boolean): string;
}

export interface RendererOptions extends HtmlRendererOptions {
    inline?: boolean;
}

/**
 * ESCAPING HTML
 */
export interface SpecialChars {
    char: "<" | ">" | "{" | "}" | " ";
    replacement: string;
}
