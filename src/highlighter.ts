import { getHighlighter, IThemedToken, getTheme } from "shiki";
import { Highlighter, HighlighterOptions } from "shiki/dist/highlighter";
import { HtmlRendererOptions } from "shiki/dist/renderer";
import { TLang } from "shiki-languages";
import { IShikiTheme } from "shiki-themes";

/**
 * ESCAPING HTML
 */
interface SpecialChars {
    char: "<" | ">" | "{" | "}" | " ";
    replacement: string;
}

const escapeHtml = (html: string): string => {
    const specialChars: SpecialChars[] = [
        {
            char: " ",
            replacement: "&#32;",
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

/**
 * custom renderToHtml function
 */
interface RendererOptions extends HtmlRendererOptions {
    inline?: boolean;
}

export const renderToHtml = (lines: IThemedToken[][], options: RendererOptions = {}): string => {
    const bg = options.bg || "#fff";

    let html = "";

    if (!options.inline) {
        html += `<pre class="shiki" style="background-color: ${bg}">`;
        if (options.langId) {
            html += `<div class="language-id">${options.langId}</div>`;
        }
        html += `<code>`;
    } else {
        html += `<code class="shiki" style="background-color: ${bg}">`;
    }

    lines.forEach((l) => {
        if (l.length === 0) {
            html += `\n`;
        } else {
            l.forEach((token) => {
                html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`;
            });
            html += `\n`;
        }
    });
    html = html.trim(); // trim whitespace
    html += `</code>`;

    if (!options.inline) {
        html += `</pre>`;
    }

    return html;
};

// checks if it's plain text
const isPlaintext = (lang: string): boolean => {
    return ["plaintext", "txt", "text"].indexOf(lang) !== -1;
};

/**
 * Extend the Highlighter to include the custom renderer and a theme prop
 */
interface SvelteHighlighter extends Highlighter {
    theme: IShikiTheme;
    highlight(code: string, lang: TLang, inline?: boolean): string;
}

export const initHighlighter = async (options?: HighlighterOptions): Promise<SvelteHighlighter> => {
    const defaultOptions: HighlighterOptions = {
        theme: "nord",
    };

    options = { ...defaultOptions, ...options };

    // get theme
    let t: IShikiTheme;
    if (typeof options.theme === "string") {
        t = getTheme(options.theme);
    } else if (options.theme.name) {
        t = options.theme;
    } else {
        t = getTheme("nord");
    }

    const highlighter = (await getHighlighter({
        theme: options.theme,
    })) as SvelteHighlighter;

    highlighter.highlight = (code, lang, inline = false): string => {
        if (isPlaintext(lang)) {
            return renderToHtml([[{ content: code }]], {
                bg: t.bg,
            });
        }

        const tokens = highlighter.codeToThemedTokens(code, lang);
        return renderToHtml(tokens, {
            bg: t.bg,
            inline,
        });
    };

    highlighter.theme = t;
    return highlighter;
};
