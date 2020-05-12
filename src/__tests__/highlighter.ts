import { initHighlighter, renderToHtml } from "../highlighter";

test("codeToHtml", async () => {
    const codeToHighlight = `
const foo = bar();
console.log(foo)
`.trim();

    const expected = `
<pre class="shiki" style="background-color: #2e3440"><code><span style="color: #81A1C1">const</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #D8DEE9">foo</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #88C0D0">bar</span><span style="color: #D8DEE9FF">()</span><span style="color: #81A1C1">;</span>
<span style="color: #8FBCBB">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #D8DEE9">foo</span><span style="color: #D8DEE9FF">)</span></code></pre>
`.trim();
    const highlighter = await initHighlighter();
    const tokens = highlighter.codeToThemedTokens(codeToHighlight, "js");
    expect(renderToHtml(tokens, { bg: highlighter.theme.bg })).toBe(expected);
});
