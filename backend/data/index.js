const python = require("./python");
const javascript = require("./javascript");
const c = require("./c");
const cpp = require("./cpp");
const java = require("./java");

const LANGUAGES = {
  python: { label: "Python", icon: "🐍", data: python },
  javascript: { label: "JavaScript", icon: "🟨", data: javascript },
  c: { label: "C", icon: "🔧", data: c },
  cpp: { label: "C++", icon: "➕", data: cpp },
  java: { label: "Java", icon: "☕", data: java }
};

module.exports = { LANGUAGES };
