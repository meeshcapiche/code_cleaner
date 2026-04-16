function buildDividerMarkup(divider = {}) {
  const color = divider.color || "#e2e2e2";
  const width = divider.width || 2;

  return `
  <tr>
    <td style="border-top:${width}px solid ${color};font-size:1px;line-height:1px;">&nbsp;</td>
  </tr>`;
}

function applyBrandOptions(template, options) {
  return (template || "")
    .replace(/__HEADER_OUTER_BG__/g, options.headerOuterBg || options.headerBg)
    .replace(/__FOOTER_OUTER_BG__/g, options.footerOuterBg || options.footerBg)
    .replace(/__HEADER_BG__/g, options.headerBg)
    .replace(/__FOOTER_BG__/g, options.footerBg)
    .replace(/__HEADER_DARK_ATTR__/g, options.headerDarkAttr || "")
    .replace(/__FOOTER_DARK_ATTR__/g, options.footerDarkAttr || "")
    .replace(/__HEADER_DIVIDER__/g, options.showDividers ? buildDividerMarkup(options.headerDivider) : "")
    .replace(/__FOOTER_DIVIDER__/g, options.showDividers ? buildDividerMarkup(options.footerDivider) : "");
}

function cloneMatcher(matcher) {
  return new RegExp(matcher.source, matcher.flags.replace(/g/g, ""));
}

function removeMatchedWrapper(container, matcher) {
  const scopedMatcher = cloneMatcher(matcher);
  const candidates = Array.from(container.querySelectorAll("table, div, section, article, tr, td"))
    .filter(node => scopedMatcher.test(node.outerHTML))
    .sort((a, b) => a.outerHTML.length - b.outerHTML.length);

  const target = candidates[0];
  if (target) {
    target.remove();
    return true;
  }

  return false;
}

function pruneEmptyWrappers(container) {
  let removed = true;

  while (removed) {
    removed = false;
    Array.from(container.querySelectorAll("table, div, section, article, tr, td")).forEach(node => {
      const hasStructuredChild = node.querySelector("table, img, a, p, div, section, article");
      const text = (node.textContent || "").replace(/\u00a0/g, " ").trim();
      if (!hasStructuredChild && !text) {
        node.remove();
        removed = true;
      }
    });
  }
}

export function createBrand(config) {
  const {
    id,
    name,
    header,
    footer,
    matchers = [],
    divider = {}
  } = config;

  return {
    ...config,
    id,
    name,
    renderHeader(options = {}) {
      return applyBrandOptions(header, {
        headerOuterBg: options.headerOuterBg || options.headerBg || "#ffffff",
        footerOuterBg: options.footerOuterBg || options.footerBg || "#ffffff",
        headerBg: options.headerBg || "#ffffff",
        footerBg: options.footerBg || "#ffffff",
        headerDarkAttr: options.headerDarkAttr || "",
        footerDarkAttr: options.footerDarkAttr || "",
        showDividers: options.showDividers !== false,
        headerDivider: divider.header || divider.shared || {},
        footerDivider: divider.footer || divider.shared || {}
      });
    },
    renderFooter(options = {}) {
      return applyBrandOptions(footer, {
        headerOuterBg: options.headerOuterBg || options.headerBg || "#ffffff",
        footerOuterBg: options.footerOuterBg || options.footerBg || "#ffffff",
        headerBg: options.headerBg || "#ffffff",
        footerBg: options.footerBg || "#ffffff",
        headerDarkAttr: options.headerDarkAttr || "",
        footerDarkAttr: options.footerDarkAttr || "",
        showDividers: options.showDividers !== false,
        headerDivider: divider.header || divider.shared || {},
        footerDivider: divider.footer || divider.shared || {}
      });
    },
    stripWrappedTemplate(html = "") {
      let cleaned = html;

      cleaned = cleaned.replace(/<!--\s*COBRAND_HEADER_START\s*-->[\s\S]*?<!--\s*COBRAND_HEADER_END\s*-->\s*/gi, "");
      cleaned = cleaned.replace(/<!--\s*COBRAND_FOOTER_START\s*-->[\s\S]*?<!--\s*COBRAND_FOOTER_END\s*-->\s*/gi, "");

      const container = document.createElement("div");
      container.innerHTML = cleaned;

      for (const matcher of matchers) {
        const removed = removeMatchedWrapper(container, matcher);
        if (!removed) {
          cleaned = cleaned.replace(matcher, "");
          container.innerHTML = cleaned;
        }
      }

      pruneEmptyWrappers(container);

      return container.innerHTML || cleaned;
    }
  };
}
