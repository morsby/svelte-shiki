import { replaceContents, getProp } from "../utils";

import sampleNodes from "./data/_sampleNodes_code";

test("test replaceContents", () => {
    expect(replaceContents("Hej med dig", "MED", 4, 7, 0)).toEqual({ content: "Hej MED dig", offset: 0 });
});

test("getProp", () => {
    const testNode = sampleNodes[0];
    expect(getProp(testNode, "lang")).toEqual([{ start: 160, end: 162, type: "Text", raw: "go", data: "go" }]);
    expect(getProp(testNode, "src")).toBe(undefined);
});
