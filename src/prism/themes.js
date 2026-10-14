// Code colours in the site palette: slate for structure, petrol for
// values. The Prism defaults use five or six hues, which made a
// short JSON response look busier than the page around it.

const light = {
  plain: { color: "#1c2424", backgroundColor: "#f3f5f5" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#7a8686", fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "#7a8686" },
    },
    {
      types: ["property", "tag", "keyword", "selector", "attr-name"],
      style: { color: "#293333", fontWeight: "500" },
    },
    {
      types: ["string", "char", "attr-value", "url", "inserted"],
      style: { color: "#1d6b75" },
    },
    {
      types: ["number", "boolean", "null", "constant", "variable"],
      style: { color: "#4f5c5c" },
    },
    {
      types: ["function", "builtin", "class-name"],
      style: { color: "#144b52" },
    },
    { types: ["deleted"], style: { color: "#9b3d30" } },
  ],
};

const dark = {
  plain: { color: "#dce4e4", backgroundColor: "#1a2121" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#7d8d8d", fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "#7d8d8d" },
    },
    {
      types: ["property", "tag", "keyword", "selector", "attr-name"],
      style: { color: "#edf2f2", fontWeight: "500" },
    },
    {
      types: ["string", "char", "attr-value", "url", "inserted"],
      style: { color: "#7cb8cb" },
    },
    {
      types: ["number", "boolean", "null", "constant", "variable"],
      style: { color: "#b4c2c2" },
    },
    {
      types: ["function", "builtin", "class-name"],
      style: { color: "#98c8d7" },
    },
    { types: ["deleted"], style: { color: "#eb8a7c" } },
  ],
};

module.exports = { light, dark };
