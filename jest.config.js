module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    testPathIgnorePatterns: ["/node_modules/", "__tests__/data/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
