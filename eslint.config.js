// eslint.config.js
import yamlParser from 'yaml-eslint-parser'

export default [
    {
        rules: {
            "semi": "error",
        },
        languageOptions: {
            parser: yamlParser,
        },
    }
];

