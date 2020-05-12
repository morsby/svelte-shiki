import { parse } from "svelte/compiler";
import { TLang } from "shiki-languages";
import { walk } from "estree-walker";
import { SvelteNode, SvelteAst } from "./types";
import { initHighlighter } from "./highlighter";
import { getProp, replaceContents } from "./utils";
import { PreprocessorGroup, Processed } from "svelte/types/compiler/preprocess";
let options = {};

const highlightCode = async (content: string): Promise<string> => {
    // if no code elements, return
    if (!content.includes("<code")) return content;

    let ast;
    const codeNodes: SvelteNode[] = [];
    try {
        ast = parse(content) as SvelteAst;
    } catch (e) {
        console.error(e, "Error parsing component content");
    }

    const highlighter = await initHighlighter();
    if (!ast) {
        console.log("No AST created ...");
        return content;
    }

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

    const beforeProcessed = {
        content,
        offset: 0,
    };

    const processed = codeNodes.reduce((edited, node) => {
        if (!node.children) {
            return edited;
        }

        const { content, offset } = edited;
        const { start, end } = node;
        let inline = true;
        if (node.name === "pre") {
            inline = false;
            const childNode = node.children.find((c) => c.name === "code");
            if (childNode) {
                node = childNode;
                if (!node.children) {
                    return edited;
                }
            }
        }

        let codeToHighlight = node.children[0].data;

        if (!codeToHighlight) {
            return edited;
        }

        let lang = "";
        const langProp = getProp(node, "lang");

        if (langProp) {
            lang = langProp[0].raw;
        } else if (!inline) {
            const langClass = (getProp(node, "class") || []).find((c) => c.data.includes("language-"));

            if (langClass) {
                lang = langClass.raw.split("-")[1];
            }
        }

        if (inline) {
            const index = codeToHighlight.indexOf(" ");
            const guessedLang = codeToHighlight.substring(0, index);
            if (["javascript", "js", "jsx", "svelte", "go", "golang", "ts", "typescript"].includes(guessedLang)) {
                lang = guessedLang;
                codeToHighlight = codeToHighlight.substring(index + 1);
            }
        }

        // Do the highlighting and lots of cleanup
        if (lang.length > 0 && highlighter.codeToHtml) {
            codeToHighlight = highlighter.codeToHtml(codeToHighlight, lang as TLang);
            codeToHighlight = codeToHighlight.replace(/{/g, "&#123;");
            codeToHighlight = codeToHighlight.replace(/}/g, "&#125;");
            codeToHighlight = codeToHighlight.replace(/(<span .*?>)(.*?)<\/span>/g, (_match, p1, p2) => {
                return `${p1}${p2.replace(/ /g, "&#x2007;")}</span>`;
            });
        }

        // Inline formatting
        if (inline && lang) {
            const bgColor = codeToHighlight.match(/background-color:(.+?)[";]/);
            if (bgColor) {
                codeToHighlight = codeToHighlight.replace(/<\/?pre.*?>/g, "");
                codeToHighlight = codeToHighlight.replace(
                    "<code>",
                    `<code style="background-color:${bgColor[1]}; padding: 0 5px">`,
                );
            }
        } else {
            codeToHighlight = `<code style="padding: 0 5px">${codeToHighlight}</code>`;
        }

        return replaceContents(content, codeToHighlight, start, end, offset);
    }, beforeProcessed);
    return processed.content;
};

const preprocessor = (opts = {}): PreprocessorGroup => {
    options = { ...options, ...opts };

    return {
        markup: async ({ content }): Promise<Processed> => {
            content = await highlightCode(content);

            return {
                code: content,
            };
        },
    };
};

export { preprocessor };
