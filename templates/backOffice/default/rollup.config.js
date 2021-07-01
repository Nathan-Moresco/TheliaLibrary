import css from "rollup-plugin-import-css";
import typescript from "@rollup/plugin-typescript";
import cleaner from 'rollup-plugin-cleaner';

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  axios: "axios",
};

export default [
  {
    input: "src/library.tsx",
    output: [
      {
        file: "dist/library.es.js",
        format: "es",
        globals,
      },
      {
        name: "TheliaLibrary",
        file: "dist/library.umd.js",
        format: "umd",
        globals,
      },
    ],
    external: ["react", "axios", "react-dom"],
    plugins: [
      typescript(),
      css({
        output: "library.css",
        alwaysOutput: true
      }),
      cleaner({
        targets: [
          '../../../../../../web/assets/backOffice/default/TheliaLibrary'
        ]
      })
    ],
  },
];