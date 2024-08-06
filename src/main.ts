import { bundledLanguages, createHighlighter } from "shiki";
import { h } from 'hastscript'
import { escapeHTML, stripIndent } from "hexo-util";
import Hexo from "hexo";
import { HighlightOptions } from "hexo/dist/extend/syntax_highlight";
import { fromHtml } from 'hast-util-from-html'

export async function init(hexo: Hexo) {
    const config = Object.assign(
        {
            theme: "dark-plus",
            strip_indent: true,
        },
        hexo.config.shiki || {}
    );
    const highlighter = await createHighlighter(
        {
            langs: Object.keys(bundledLanguages),
            themes: [config.theme],
        }
    );
    const supportedLanguages = highlighter.getLoadedLanguages().reduce((acc, lang) => {
        acc[lang] = true;
        return acc;
    }, {
        // Special Languages
        text: true,
        plain: true,
        ansi: true,
    });
    const hexoHighlighter = (code: string, options: HighlightOptions) => {
        try {
            var code = config.strip_indent ? stripIndent(code) as string : code;
            var lang = options.lang;
            if (!lang || !supportedLanguages[lang]) {
                lang = "text";
            }
            return highlighter.codeToHtml(code, {
                lang,
                theme: config.theme,
                transformers: [
                    {
                        pre(node) {
                            if (options.caption) {
                                const captionContent = fromHtml(options.caption, { fragment: true });
                                const captionDiv = h("div", { className: ["caption"] }, captionContent.children);
                                node.children.unshift(captionDiv);
                            }
                        },
                        line(node, line) {
                            if (options.mark && options.mark.includes(line)) {
                                this.addClassToHast(node, 'marked')
                            }
                        },
                    },
                ]
            });
        } catch (e) {
            console.error(e);
            return `<pre><code>${escapeHTML(code)}</code></pre>`;
        }
    }
    hexo.extend.highlight.register("shiki", hexoHighlighter);
}
