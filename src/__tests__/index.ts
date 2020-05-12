import * as fs from "fs";
import * as path from "path";
import { preprocess } from "svelte/compiler";
import { preprocessor } from "..";

const data = [
    fs.readFileSync(path.resolve(__dirname, "data/CodeBlock.svelte")).toString(),
    fs.readFileSync(path.resolve(__dirname, "data/CodeInline.svelte")).toString(),
    fs.readFileSync(path.resolve(__dirname, "data/Test.svelte")).toString(),
];

describe("end-to-end", () => {
    test("code block", async () => {
        const preprocessed = await preprocess(data[0], preprocessor(), {
            filename: path.resolve(__dirname, "data/CodeBlock.svelte"),
        });

        expect(preprocessed.code).toBe(
            `<pre class="shiki" style="background-color: #2e3440"><code><span style="color: #D8DEE9">confirm</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">\'</span><span style="color: #A3BE8C">svelte-shiki</span><span style="color: #ECEFF4">\'</span><span style="color: #D8DEE9FF">)</span></code></pre>\n`,
        );
    });

    test("code inline", async () => {
        const preprocessed = await preprocess(data[1], preprocessor(), {
            filename: path.resolve(__dirname, "data/CodeInline.svelte"),
        });

        expect(preprocessed.code).toBe(
            `<code class="shiki" style="background-color: #2e3440"><span style="color: #D8DEE9">confirm</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">\'</span><span style="color: #A3BE8C">svelte-shiki</span><span style="color: #ECEFF4">\'</span><span style="color: #D8DEE9FF">)</span></code>\n`,
        );
    });

    test("complex page", async () => {
        const preprocessed = await preprocess(data[2], preprocessor(), {
            filename: path.resolve(__dirname, "data/Test.svelte"),
        });

        expect(preprocessed.code).toBe(
            '<script>\n    let name = "Johnny";\n</script>\n\n<style>\n    h1 {\n        color: red;\n    }\n</style>\n\n<h1>Well done, {name}!</h1>\n<img alt="Happy kid, yo" src="successkid.jpg" />\n\n<p>\n    <strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong>\n</p>\n<pre class="shiki" style="background-color: #2e3440"><code><span style="color: #81A1C1">const</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #D8DEE9">foo</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF">&#32;</span><span style="color: #88C0D0">bar</span><span style="color: #D8DEE9FF">()</span></code></pre>\n',
        );
    });
});
