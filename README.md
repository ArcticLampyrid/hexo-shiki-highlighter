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
### Get Started
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
  strip_indent: true # Strip the leading indent of the code block (default: true, just like the official highlighter)
```

### Dual/Multi Themes
You can use dual/multi themes by setting the `theme` option to an object.

```yaml
shiki:
  theme:
    light: "light-plus"
    dark: "dark-plus"
    # ... more themes
  default_color: "light" # The default color to use, use false to disable the default color (default: "light")
```

Thus the code block will be rendered like this:

```html
<!-- Default Color = light -->
<span style="color:#0000FF;--shiki-dark:#569CD6;">int</span>
<!-- Default Color = false -->
 <span style="--shiki-dark:#569CD6;--shiki-light:#0000FF">int</span>
```

Then you can use css to choose the theme based on the user's preference.

```css
/* Example from https://shiki.style/guide/dual-themes */ 
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
```

### Custom Themes
You can add custom themes:

```yaml
shiki:
  custom_themes:
    - "relative/path/to/custom-theme.json"
```

The theme file should be a JSON file that contains a valid theme config. For example, [it should look like this](https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/themes/dark-plus.json).

### Custom Languages
You can add custom languages:

```yaml
shiki:
  custom_languages:
    - "relative/path/to/custom-language.json"
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