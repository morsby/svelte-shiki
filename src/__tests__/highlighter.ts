import { initHighlighter, codeToHtml } from "../highlighter";

test("codeToHtml", async () => {
    const codeToHighlight = `
const foo = bar();
console.log(foo)
`.trim();

    const highlighter = await initHighlighter();
    const tokens = highlighter.codeToThemedTokens(codeToHighlight, "js");
    expect(codeToHtml(tokens)).toBe("hej");
});
