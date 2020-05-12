import { getHighlighter, IThemedToken } from "shiki";
import { Highlighter, HighlighterOptions } from "shiki/dist/highlighter";
import { HtmlRendererOptions } from "shiki/dist/renderer";

const defaultOptions: HighlighterOptions = {
    theme: "nord",
};

export const initHighlighter = async (options?: HighlighterOptions): Promise<Highlighter> => {
    options = { ...defaultOptions, ...options };
    return await getHighlighter({
        theme: options.theme,
    });
};

interface SpecialChars {
    char: "<" | ">" | "{" | "}" | " ";
    replacement: string;
}

const escapeHtml = (html: string): string => {
    const specialChars: SpecialChars[] = [
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
        {
            char: " ",
            replacement: "&#32;",
        },
    ];
    return specialChars.reduce(
        (replaced, { char, replacement }) => replaced.replace(new RegExp(char, "g"), replacement),
        html,
    );
};

interface RendererOptions extends HtmlRendererOptions {
    inline?: boolean;
}

export const codeToHtml = (lines: IThemedToken[][], options: RendererOptions = {}): string => {
    //todo get theme
    const bg = options.bg || "#fff";

    let html = "";

    if (!options.inline) {
        html += `<pre class="shiki" style="background-color: ${bg}">`;
        /*if (options.langId) {
        html += `<div class="language-id">${options.langId}</div>`;
    }*/
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
