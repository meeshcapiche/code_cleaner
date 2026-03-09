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
    .replace(/__HEADER_BG__/g, options.headerBg)
    .replace(/__FOOTER_BG__/g, options.footerBg)
    .replace(/__HEADER_DARK_ATTR__/g, options.headerDarkAttr || "")
    .replace(/__FOOTER_DARK_ATTR__/g, options.footerDarkAttr || "")
    .replace(/__HEADER_DIVIDER__/g, options.showDividers ? buildDividerMarkup(options.headerDivider) : "")
    .replace(/__FOOTER_DIVIDER__/g, options.showDividers ? buildDividerMarkup(options.footerDivider) : "");
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

      for (const matcher of matchers) {
        cleaned = cleaned.replace(matcher, "");
      }

      return cleaned;
    }
  };
}
