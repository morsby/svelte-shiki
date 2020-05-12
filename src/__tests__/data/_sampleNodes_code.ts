import { SvelteNode } from "../../types";

const nodes: SvelteNode[] = [
    {
        start: 148,
        end: 216,
        type: "Element",
        name: "code",
        attributes: [
            {
                start: 154,
                end: 163,
                type: "Attribute",
                name: "lang",
                value: [{ start: 160, end: 162, type: "Text", raw: "go", data: "go" }],
            },
        ],
        children: [
            {
                start: 164,
                end: 209,
                type: "Text",
                raw: '\nfmt.Println("Hello")\n12345678910111213141\n  ',
                data: '\nfmt.Println("Hello")\n12345678910111213141\n  ',
            },
        ],
    },
    {
        start: 318,
        end: 366,
        type: "Element",
        name: "code",
        attributes: [
            {
                start: 324,
                end: 341,
                type: "Attribute",
                name: "lang",
                value: [{ start: 330, end: 340, type: "Text", raw: "javascript", data: "javascript" }],
            },
        ],
        children: [{ start: 342, end: 359, type: "Text", raw: "const foo = bar()", data: "const foo = bar()" }],
    },
    {
        start: 318,
        end: 366,
        type: "Element",
        name: "code",
        attributes: [
            {
                start: 324,
                end: 341,
                type: "Attribute",
                name: "lang",
                value: [{ start: 330, end: 340, type: "Text", raw: "javascript", data: "javascript" }],
            },
        ],
        children: [{ start: 342, end: 359, type: "Text", raw: "const foo = bar()", data: "const foo = bar()" }],
    },
];

export default nodes;
