const { lstatSync } = require("node:fs");
const path = require("node:path");
const sass = require("sass");

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", ({ directories }) => {
    const output = path.resolve(directories.output);
    if (output !== path.join(__dirname, "dist") || lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error("Eleventy output must be the portfolio's local dist directory.");
    }
  });

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile(_content, inputPath) {
      const result = sass.compile(inputPath, { style: "compressed" });
      this.addDependencies(inputPath, result.loadedUrls);
      return () => result.css;
    },
  });
  eleventyConfig.addWatchTarget("sass/");
  eleventyConfig.addPassthroughCopy({
    "public/images": "images",
    "public/resume.pdf": "resume.pdf",
  });

  return {
    dir: { input: "src", output: "dist" },
    templateFormats: ["liquid", "scss"],
  };
};
