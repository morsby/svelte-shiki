import { parse } from "svelte/compiler";
import { TLang } from "shiki-languages";
import { walk } from "estree-walker";
import { SvelteNode, SvelteAst } from "./types";
import { initHighlighter } from "./highlighter";
import { getProp, replaceContents } from "./utils";
import { PreprocessorGroup, Processed } from "svelte/types/compiler/preprocess";

import { HighlighterOptions } from "shiki/dist/highlighter";

const highlightCode = async (content: string, options?: HighlighterOptions): Promise<string> => {
    // if no code elements, return
    if (!content.includes("<code")) return content;

    // parse the file with Svelte
    let ast;
    try {
        ast = parse(content) as SvelteAst;
    } catch (e) {
        console.error(e, "Error parsing component content");
    }

    if (!ast) {
        console.log("No AST created ...");
        return content;
    }

    // walk the AST, find <code> nodes; push that (or its parent <pre>) to codeNodes
    const codeNodes: SvelteNode[] = [];
    walk(ast.html, {
        enter(baseNode, baseParent) {
            // type conversions; missing e.g. name
            const [node, parent] = [baseNode as SvelteNode, baseParent as SvelteNode];

            if (node.name !== "code") return;

            // Shiki adds a "pre" by default; if the parent is a <pre> element, we
            // replace the parent as well.
            if (parent.name === "pre") {
                codeNodes.push(parent);
            } else {
                codeNodes.push(node);
            }
        },
    });

    if (!codeNodes.length) return content;

    // untouched contents
    const beforeProcessed = {
        content,
        offset: 0,
    };

    // Init highlighter for reuse
    const highlighter = await initHighlighter(options);

    // Start the highlighting:
    const processed = codeNodes.reduce((editedSoFar, currentNode) => {
        const { content, offset } = editedSoFar;
        const { start, end } = currentNode;

        let inline = true;
        if (currentNode.name === "pre") {
            inline = false;
            const childNode = (currentNode.children || []).find((c) => c.name === "code");
            if (childNode) {
                currentNode = childNode;
            }
        }

        // needs at least a 'Text' child
        if (!currentNode.children) {
            return editedSoFar;
        }

        // The only child of a <code> is Text
        let codeToHighlight = currentNode.children[0].data;

        if (!codeToHighlight) {
            return editedSoFar;
        }

        let lang = "";
        const langProp = getProp(currentNode, "lang");

        // If used as regular <code lang="$$">
        if (langProp) {
            lang = langProp[0].raw;
        }

        // If used through markdown with "```$$"" syntax
        if (!langProp && !inline) {
            const langClass = (getProp(currentNode, "class") || []).find((c) => c.data.includes("language-"));

            if (langClass) {
                lang = langClass.raw.split("-")[1];
            }
        }

        // If used through inline markdown "`lang={$$}"" syntax, extract the language
        if (inline) {
            codeToHighlight.replace(/^lang={(.+?)}/, (_, extractedLang) => {
                lang = extractedLang;
                return "";
            });
        }

        // Do the highlighting
        if (lang.length > 0) {
            codeToHighlight = highlighter.highlight(codeToHighlight, lang as TLang, inline);
        }

        return replaceContents(content, codeToHighlight, start, end, offset);
    }, beforeProcessed);
    return processed.content;
};

const preprocessor = (options: HighlighterOptions = { theme: "nord" }): PreprocessorGroup => {
    return {
        markup: async ({ content }): Promise<Processed> => {
            content = await highlightCode(content, options);

            return {
                code: content,
            };
        },
    };
};

export { preprocessor };
