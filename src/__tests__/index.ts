import * as fs from "fs";
import * as path from "path";
import { preprocess } from "svelte/compiler";
import { preprocessor } from "..";

const data = fs.readFileSync(path.resolve(__dirname, "data/Test.svelte")).toString();

test("end-to-end", async () => {
    const preprocessed = await preprocess(data, preprocessor(), {
        filename: path.resolve(__dirname, "data/Test.svelte"),
    });

    expect(preprocessed.code).toBe(
        '<script>\n    let name = "Johnny";\n</script>\n\n<style>\n    h1 {\n        color: red;\n    }\n</style>\n\n<h1>Well done, {name}!</h1>\n<img alt="Happy kid, yo" src="successkid.jpg" />\n\n<p>\n    <strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong>\n</p>\n<code style="padding: 0 5px"><pre class="shiki" style="background-color: #2e3440"><code><span style="color: #81A1C1">const</span><span style="color: #D8DEE9FF">&#x2007;</span><span style="color: #D8DEE9">foo</span><span style="color: #D8DEE9FF">&#x2007;</span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF">&#x2007;</span><span style="color: #88C0D0">bar</span><span style="color: #D8DEE9FF">()</span></code></pre></code>\n',
    );
});
