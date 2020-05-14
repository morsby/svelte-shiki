import { getHighlighter, IThemedToken, getTheme } from "shiki";
import { HighlighterOptions } from "shiki/dist/highlighter";
import { IShikiTheme } from "shiki-themes";
import { SvelteHighlighter, RendererOptions } from "./types";
import { escapeHtml } from "./utils";

/**
 * custom renderToHtml function
 */
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

export const initHighlighter = async (options?: HighlighterOptions): Promise<SvelteHighlighter> => {
    const defaultOptions: HighlighterOptions = {
        theme: "nord",
    };

    options = { ...defaultOptions, ...options };

    // get theme
    let theme: IShikiTheme;
    if (typeof options.theme === "string") {
        theme = getTheme(options.theme);
    } else if (options.theme.name) {
        theme = options.theme;
    } else {
        theme = getTheme("nord");
    }

    const highlighter = (await getHighlighter({
        theme: options.theme,
    })) as SvelteHighlighter;

    highlighter.highlight = (code, lang, inline = false): string => {
        code = code.trim();
        if (isPlaintext(lang)) {
            return renderToHtml([[{ content: code }]], {
                bg: theme.bg,
            });
        }

        const tokens = highlighter.codeToThemedTokens(code, lang);
        return renderToHtml(tokens, {
            bg: theme.bg,
            inline,
        });
    };

    highlighter.theme = theme;
    return highlighter;
};
