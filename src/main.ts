import { bundledLanguages, bundledThemes, createHighlighter, ShikiTransformer } from "shiki";
import { h } from 'hastscript'
import { escapeHTML, stripIndent } from "hexo-util";
import Hexo from "hexo";
import { HighlightOptions } from "hexo/dist/extend/syntax_highlight";
import { fromHtml } from 'hast-util-from-html'
import { promises as fs } from 'fs';
import path from "path";

export async function init(hexo: Hexo) {
    const config = Object.assign(
        {
            theme: "dark-plus" as string | object,
            strip_indent: true,
        },
        hexo.config.shiki || {}
    );
    const themes = typeof config.theme === "object" ? Object.values(config.theme) : [config.theme];
    const requiredBundledThemes = themes.filter(theme => !!bundledThemes[theme]);
    const highlighter = await createHighlighter(
        {
            langs: Object.keys(bundledLanguages),
            themes: requiredBundledThemes,
        }
    );

    // Load custom themes
    if (config.custom_themes) {
        for (const filePath of config.custom_themes) {
            // load theme from file
            const themeContent = await fs.readFile(path.resolve(hexo.base_dir, filePath), "utf-8");
            await highlighter.loadTheme(JSON.parse(themeContent));
        }
    }

    // Check if all themes are supported
    for (const theme of themes) {
        if (!highlighter.getLoadedThemes().includes(theme)) {
            throw new Error(`Theme "${theme}" is not supported.`);
        }
    }

    // Load custom languages
    if (config.custom_languages) {
        for (const filePath of config.custom_languages) {
            // load language from file
            const langContent = await fs.readFile(path.resolve(hexo.base_dir, filePath), "utf-8");
            await highlighter.loadLanguage(JSON.parse(langContent));
        }
    }

    // Get all supported languages
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
            var transformers: ShikiTransformer[] = [
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
            ];
            if (typeof config.theme === "object") {
                return highlighter.codeToHtml(code, {
                    lang,
                    themes: config.theme,
                    defaultColor: typeof config.default_color === "undefined" ? "light" : config.default_color,
                    transformers
                });
            } else {
                return highlighter.codeToHtml(code, {
                    lang,
                    theme: config.theme,
                    transformers
                });
            }
        } catch (e) {
            console.error(e);
            return `<pre><code>${escapeHTML(code)}</code></pre>`;
        }
    }
    hexo.extend.highlight.register("shiki", hexoHighlighter);
}
