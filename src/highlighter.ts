import { getHighlighter, IThemedToken, HighlighterOptions } from "shiki";
import { TLang } from "shiki-languages";
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

const defaultOptions: HighlighterOptions = {
    theme: "nord",
};

export const initHighlighter = async (options?: HighlighterOptions): Promise<SvelteHighlighter> => {
    options = { ...defaultOptions, ...options };

    const highlighter = await getHighlighter({
        theme: options.theme,
    });

    const theme = highlighter.getTheme();

    const highlight = (code: string, lang: TLang, inline = false): string => {
        code = code.trim();
        if (isPlaintext(lang)) {
            return renderToHtml([[{ content: code }]], {
                bg: theme.bg,
                inline,
            });
        }

        const tokens = highlighter.codeToThemedTokens(code, lang);
        return renderToHtml(tokens, {
            bg: theme.bg,
            inline,
        });
    };

    return {
        highlight,
        theme,
    };
};
