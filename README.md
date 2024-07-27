# Shiki Highlighter for Hexo
[![npm-image]][npm-url]
[![license-image]](LICENSE)  

A hexo plugin to use [Shiki 式](https://github.com/shikijs/shiki) as code block highlighter, which is accurate and powerful.

Hexo v7.0.0+ is required, due to highlighter api and top-level await support.

## Features
- Accurate and powerful syntax highlighting.
- Line marker support. \(This highlighter only adds `.marked` class to the line, you need to style it yourself.\)
- Support code block with caption. \(You may need to style it yourself.\)

## Setup
First, install this package.

```bash
pnpm add hexo-shiki-highlighter
```

Then, switch the highlighter to `shiki` in your `_config.yml`.

```yaml
syntax_highlighter: "shiki"
```

Finally, configure the options for shiki in your `_config.yml`.

```yaml
shiki:
  theme: "dark-plus"
```

## Usage
You can use the normal backtick code block to highlight your code, but if you want more control, use the `codeblock` tag, just like the official highlighter (e.g. `highlight.js` or `prismjs`).

```
{% codeblock pyproject.toml lang:toml mark:2 %}
[tool.poetry]
package-mode = false
{% endcodeblock %}
```

[npm-image]: https://img.shields.io/npm/v/hexo-shiki-highlighter?style=flat-square
[license-image]: https://img.shields.io/npm/l/hexo-shiki-highlighter?style=flat-square
[npm-url]: https://www.npmjs.com/package/hexo-shiki-highlighter