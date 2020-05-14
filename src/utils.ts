import { SvelteNode, Value, SpecialChars } from "./types";

// getProp gets a prop with name provided in "attr" from a node or undefined
export const getProp = (node: SvelteNode, attr: string): Value[] | undefined => {
    const prop = (node.attributes || []).find((a: { name: string }) => a.name === attr);
    return prop ? prop.value : undefined;
};

// replaceContents inserts modified contents, overwriting the original contents
export const replaceContents = (
    content: string,
    value: string,
    start: number,
    end: number,
    offset: number,
): { content: string; offset: number } => {
    return {
        content: content.substr(0, start + offset) + value + content.substr(end + offset),
        offset: offset + value.length - (end - start),
    };
};

// escapeHtml chars
export const escapeHtml = (html: string): string => {
    const specialChars: SpecialChars[] = [
        {
            char: " ",
            replacement: "&#8199;",
        },
        {
            char: "<",
            replacement: "&lt;",
        },
        {
            char: ">",
            replacement: "&gt;",
        },
        {
            char: "{",
            replacement: "&#123;",
        },
        {
            char: "}",
            replacement: "&#125;",
        },
    ];
    return specialChars.reduce(
        (replaced, { char, replacement }) => replaced.replace(new RegExp(char, "g"), replacement),
        html,
    );
};
