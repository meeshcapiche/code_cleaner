import { brands, brandPresets } from "./brands/index.js";

window.addEventListener("DOMContentLoaded", () => {
  const sampleClientHtml = `
<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
  <tbody>
    <tr>
      <td align="center" style="padding:56px 20px;background:#ffffff;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" role="presentation" style="width:100%;max-width:600px;border:1px dashed #cbd5e1;border-radius:18px;">
          <tbody>
            <tr>
              <td align="center" style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:28px;line-height:1.2;color:#111827;font-weight:700;padding:40px 28px 14px;">
                Paste HTML in the side panel to see it displayed here
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4b5563;padding:0 28px 40px;">
                Paste your HTML to generate a preview here.
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
  `;

  const appEl = document.querySelector(".app");
  const inputHtml = document.getElementById("inputHtml");
  const previewFrame = document.getElementById("previewFrame");
  const qaReport = document.getElementById("qaReport");
  const qaCount = document.getElementById("qaCount");
  const qaSummary = document.getElementById("qaSummary");
  const qaSummaryText = document.getElementById("qaSummaryText");
  const statusPill = document.getElementById("statusPill");
  const adIdStatusPill = document.getElementById("adIdStatusPill");
  const statusMessage = document.getElementById("statusMessage");
  const helpBtn = document.getElementById("helpBtn");
  const helpUpdateBadge = document.getElementById("helpUpdateBadge");
  const helpDialog = document.getElementById("helpDialog");
  const closeHelpBtn = document.getElementById("closeHelpBtn");
  const cleanupSettingsBtn = document.getElementById("cleanupSettingsBtn");
  const cleanupDialog = document.getElementById("cleanupDialog");
  const closeCleanupBtn = document.getElementById("closeCleanupBtn");
  const trackingToolBtn = document.getElementById("trackingToolBtn");
  const trackingDialog = document.getElementById("trackingDialog");
  const closeTrackingBtn = document.getElementById("closeTrackingBtn");
  const qaToolBtn = document.getElementById("qaToolBtn");
  const qaDialog = document.getElementById("qaDialog");
  const closeQaBtn = document.getElementById("closeQaBtn");
  const brandSelect = document.getElementById("brandSelect");
  const brandHelperText = document.getElementById("brandHelperText");
  const toggleTemplateOptionsBtn = document.getElementById("toggleTemplateOptionsBtn");
  const templateDialog = document.getElementById("templateDialog");
  const closeTemplateBtn = document.getElementById("closeTemplateBtn");
  const resetTemplateOptionsBtn = document.getElementById("resetTemplateOptionsBtn");
  const headerOuterBgColor = document.getElementById("headerOuterBgColor");
  const footerOuterBgColor = document.getElementById("footerOuterBgColor");
  const headerBgColor = document.getElementById("headerBgColor");
  const footerBgColor = document.getElementById("footerBgColor");
  const headerOuterBgValue = document.getElementById("headerOuterBgValue");
  const footerOuterBgValue = document.getElementById("footerOuterBgValue");
  const headerBgValue = document.getElementById("headerBgValue");
  const footerBgValue = document.getElementById("footerBgValue");
  const toggleMatchFooterColor = document.getElementById("toggleMatchFooterColor");
  const toggleShowDividers = document.getElementById("toggleShowDividers");
  const toggleLiteralFullEmail = document.getElementById("toggleLiteralFullEmail");
  const adIdInput = document.getElementById("adIdInput");
  const stealthLinkInput = document.getElementById("stealthLinkInput");
  const stealthHelperText = document.getElementById("stealthHelperText");
  const resetBtn = document.getElementById("resetBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtnLabel = copyBtn.querySelector(".btn-label");
  const previewPane = document.getElementById("previewPane");
  const compareGrid = document.getElementById("compareGrid");
  const codePane = document.getElementById("codePane");
  const codeOutputInner = document.getElementById("codeOutputInner");
  const codeHighlight = document.getElementById("codeHighlight");
  const codePreviewFrame = document.getElementById("codePreviewFrame");
  const codeEditStatus = document.getElementById("codeEditStatus");
  const editCodeBtn = document.getElementById("editCodeBtn");
  const editCodeBtnIcon = document.getElementById("editCodeBtnIcon");
  const editCodeBtnLabel = document.getElementById("editCodeBtnLabel");
  const revertCodeBtn = document.getElementById("revertCodeBtn");
  const codeFindBar = document.getElementById("codeFindBar");
  const codeFindInput = document.getElementById("codeFindInput");
  const codeFindPrevBtn = document.getElementById("codeFindPrevBtn");
  const codeFindNextBtn = document.getElementById("codeFindNextBtn");
  const codeFindCount = document.getElementById("codeFindCount");
  const sourcePreviewFrame = document.getElementById("sourcePreviewFrame");
  const outputModeSwitch = document.getElementById("outputModeSwitch");
  const outputModeHint = document.getElementById("outputModeHint");
  const dropWrap = document.getElementById("dropWrap");
  const clearInputBtn = document.getElementById("clearInputBtn");
  const cleanupModeTitle = document.getElementById("cleanupModeTitle");
  const cleanupModeNote = document.getElementById("cleanupModeNote");
  const keepStylesRow = document.getElementById("keepStylesRow");
  const removePreviewRow = document.getElementById("removePreviewRow");
  const removeTitleRow = document.getElementById("removeTitleRow");
  const removeScriptsRow = document.getElementById("removeScriptsRow");
  const fullHandlingPanel = document.getElementById("fullHandlingPanel");
  const fullHandlingNote = document.getElementById("fullHandlingNote");
  const literalFullEmailRow = document.getElementById("literalFullEmailRow");
  const protectBrandLayoutRow = document.getElementById("protectBrandLayoutRow");
  let floatingTooltip = null;
  let activeTooltipTrigger = null;

  const STORAGE_KEY = "email-assembly-studio-state-v2";
  const HELP_UPDATES_VERSION = "2026-04-06";
  const HELP_UPDATES_STORAGE_KEY = "email-assembly-studio-help-updates-version";
  const DEFAULT_BRAND = "thinkadvisor";
  const outputStore = { html: "", generatedHtml: "", editedHtml: "", isEdited: false };
  let previewMode = "desktop";
  let lastVisualPreviewMode = "desktop";
  let outputMode = "full";
  let cleanupDrawerOpen = false;
  let templateDrawerOpen = false;
  let trackingDrawerOpen = false;
  let qaDrawerOpen = false;
  let lastCleanerOutputMode = "full";
  let lastCleanerShowDividers = true;
  let isRestoringState = false;
  let codeEditDebounceId = null;
  let isCodeEditing = false;
  let codeScrollSyncFrame = null;
  let codeFindMatches = [];
  let codeFindIndex = -1;
  let codeFindQuery = "";
  let currentStatusLevel = "info";
  let currentStatusText = "Ready";
  let currentStatusSizeText = "0 KB";
  const defaultTemplateOptions = {
    headerOuterBg: "#ffffff",
    footerOuterBg: "#ffffff",
    headerBg: "#ffffff",
    footerBg: "#ffffff",
    matchFooterColor: true,
    showDividers: true
  };
  const defaultCleanupOptions = {
    literalFullEmail: true,
    keepStyles: true,
    removePreview: true,
    removeTitle: true,
    removeScripts: true,
    protectBrandLayout: true
  };
  const defaultCleanupOptionsByMode = {
    fragment: {
      keepStyles: defaultCleanupOptions.keepStyles,
      removePreview: defaultCleanupOptions.removePreview,
      removeTitle: defaultCleanupOptions.removeTitle,
      removeScripts: defaultCleanupOptions.removeScripts
    },
    full: {
      literalFullEmail: defaultCleanupOptions.literalFullEmail,
      removePreview: defaultCleanupOptions.removePreview,
      removeTitle: defaultCleanupOptions.removeTitle,
      removeScripts: defaultCleanupOptions.removeScripts,
      protectBrandLayout: defaultCleanupOptions.protectBrandLayout
    }
  };
  const cleanupToggleIds = ["toggleKeepStyles", "toggleRemovePreview", "toggleRemoveTitle", "toggleRemoveScripts", "toggleProtectBrandLayout"];
  let cleanupOptionsByMode = structuredClone(defaultCleanupOptionsByMode);

  function populateBrandOptions() {
    const currentValue = brandSelect.value;
    const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

    brandSelect.innerHTML = '<option value="">Choose a brand…</option>';
    sortedBrands.forEach(brand => {
      const option = document.createElement("option");
      option.value = brand.id;
      option.textContent = brand.name;
      brandSelect.appendChild(option);
    });

    if (brandPresets[currentValue]) {
      brandSelect.value = currentValue;
    } else if (brandPresets[DEFAULT_BRAND]) {
      brandSelect.value = DEFAULT_BRAND;
    }
  }

  function formatHex(value) {
    return (value || "#ffffff").toUpperCase();
  }

  function updateColorLabels() {
    if (headerOuterBgValue && headerOuterBgColor) headerOuterBgValue.textContent = formatHex(headerOuterBgColor.value);
    if (footerOuterBgValue && footerOuterBgColor) footerOuterBgValue.textContent = formatHex(footerOuterBgColor.value);
    if (headerBgValue && headerBgColor) headerBgValue.textContent = formatHex(headerBgColor.value);
    if (footerBgValue && footerBgColor) footerBgValue.textContent = formatHex(footerBgColor.value);
  }

  function syncFooterColorState() {
    if (!footerBgColor || !footerOuterBgColor) return;

    const shouldMatch = !!toggleMatchFooterColor?.checked;
    if (shouldMatch && headerBgColor && headerOuterBgColor) {
      footerOuterBgColor.value = headerOuterBgColor.value;
      footerBgColor.value = headerBgColor.value;
    }

    footerOuterBgColor.disabled = shouldMatch;
    footerBgColor.disabled = shouldMatch;
    footerOuterBgColor.closest(".field-card")?.classList.toggle("is-disabled", shouldMatch);
    footerBgColor.closest(".field-card")?.classList.toggle("is-disabled", shouldMatch);
    updateColorLabels();
  }

  function resetTemplateOptions() {
    if (headerOuterBgColor) headerOuterBgColor.value = defaultTemplateOptions.headerOuterBg;
    if (footerOuterBgColor) footerOuterBgColor.value = defaultTemplateOptions.footerOuterBg;
    if (headerBgColor) headerBgColor.value = defaultTemplateOptions.headerBg;
    if (footerBgColor) footerBgColor.value = defaultTemplateOptions.footerBg;
    if (toggleMatchFooterColor) toggleMatchFooterColor.checked = defaultTemplateOptions.matchFooterColor;
    if (toggleShowDividers) toggleShowDividers.checked = defaultTemplateOptions.showDividers;
    syncFooterColorState();
    updatePreview();
  }

  function resetCleanupOptions() {
    cleanupOptionsByMode = structuredClone(defaultCleanupOptionsByMode);
    applyCleanupSettingsForMode(outputMode);
  }

  function getCleanupToggleRefs() {
    return {
      literalFullEmail: toggleLiteralFullEmail,
      keepStyles: document.getElementById("toggleKeepStyles"),
      removePreview: document.getElementById("toggleRemovePreview"),
      removeTitle: document.getElementById("toggleRemoveTitle"),
      removeScripts: document.getElementById("toggleRemoveScripts"),
      protectBrandLayout: document.getElementById("toggleProtectBrandLayout")
    };
  }

  function getCleanupDefaultsForMode(mode) {
    return defaultCleanupOptionsByMode[mode === "fragment" ? "fragment" : "full"];
  }

  function captureCleanupSettingsForMode(mode) {
    const refs = getCleanupToggleRefs();

    if (mode === "fragment") {
      return {
        keepStyles: !!refs.keepStyles?.checked,
        removePreview: !!refs.removePreview?.checked,
        removeTitle: !!refs.removeTitle?.checked,
        removeScripts: !!refs.removeScripts?.checked
      };
    }

    return {
      literalFullEmail: !!refs.literalFullEmail?.checked,
      removePreview: !!refs.removePreview?.checked,
      removeTitle: !!refs.removeTitle?.checked,
      removeScripts: !!refs.removeScripts?.checked,
      protectBrandLayout: !!refs.protectBrandLayout?.checked
    };
  }

  function applyCleanupSettingsForMode(mode) {
    const refs = getCleanupToggleRefs();
    const defaults = getCleanupDefaultsForMode(mode);
    const saved = cleanupOptionsByMode[mode === "fragment" ? "fragment" : "full"] || defaults;

    if (mode === "fragment") {
      if (refs.keepStyles) refs.keepStyles.checked = saved.keepStyles ?? defaults.keepStyles;
      if (refs.removePreview) refs.removePreview.checked = saved.removePreview ?? defaults.removePreview;
      if (refs.removeTitle) refs.removeTitle.checked = saved.removeTitle ?? defaults.removeTitle;
      if (refs.removeScripts) refs.removeScripts.checked = saved.removeScripts ?? defaults.removeScripts;
      if (refs.literalFullEmail) refs.literalFullEmail.checked = cleanupOptionsByMode.full.literalFullEmail ?? defaultCleanupOptionsByMode.full.literalFullEmail;
      if (refs.protectBrandLayout) refs.protectBrandLayout.checked = cleanupOptionsByMode.full.protectBrandLayout ?? defaultCleanupOptionsByMode.full.protectBrandLayout;
    } else {
      if (refs.literalFullEmail) refs.literalFullEmail.checked = saved.literalFullEmail ?? defaults.literalFullEmail;
      if (refs.removePreview) refs.removePreview.checked = saved.removePreview ?? defaults.removePreview;
      if (refs.removeTitle) refs.removeTitle.checked = saved.removeTitle ?? defaults.removeTitle;
      if (refs.removeScripts) refs.removeScripts.checked = saved.removeScripts ?? defaults.removeScripts;
      if (refs.protectBrandLayout) refs.protectBrandLayout.checked = saved.protectBrandLayout ?? defaults.protectBrandLayout;
      if (refs.keepStyles) refs.keepStyles.checked = cleanupOptionsByMode.fragment.keepStyles ?? defaultCleanupOptionsByMode.fragment.keepStyles;
    }
  }

  function saveCleanupSettingsForMode(mode) {
    cleanupOptionsByMode[mode === "fragment" ? "fragment" : "full"] = captureCleanupSettingsForMode(mode);
  }

  function extractStyleBlocks(html) {
    const styleBlocks = [];
    const htmlWithoutStyles = (html || "").replace(/<style\b[\s\S]*?<\/style>\s*/gi, match => {
      styleBlocks.push(match.trim());
      return "";
    });

    return { htmlWithoutStyles, styleBlocks };
  }

  function extractHeadHtml(html) {
    const match = (html || "").match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
    return match ? match[1] : "";
  }

  function extractBodyOpenTag(html) {
    const match = (html || "").match(/<body\b([^>]*)>/i);
    return match ? match[1] || "" : "";
  }

  function extractHtmlOpenTag(html) {
    const match = (html || "").match(/<html\b([^>]*)>/i);
    return match ? match[1] || "" : "";
  }

  function extractBodyInnerHtml(html) {
    const match = (html || "").match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1] : stripOuterDocument(html);
  }

  function extractPreservableHeadMarkup(headHtml) {
    const source = headHtml || "";
    const preserved = [];

    source.replace(/<meta\b[^>]*>\s*/gi, match => {
      preserved.push(match.trim());
      return match;
    });

    source.replace(/<link\b[^>]*>\s*/gi, match => {
      preserved.push(match.trim());
      return match;
    });

    source.replace(/<style\b[\s\S]*?<\/style>\s*/gi, match => {
      preserved.push(match.trim());
      return match;
    });

    source.replace(/<!--\[if[\s\S]*?<!\[endif\]-->\s*/gi, match => {
      if (/<style\b/i.test(match) || /\bmso\b/i.test(match)) {
        preserved.push(match.trim());
      }
      return match;
    });

    return preserved.join("\n");
  }

  function sanitizeBrandSensitiveCss(cssText) {
    return String(cssText || "").replace(/(^|})\s*([^@}{]+)\{([^{}]*)\}/g, (match, prefix, selectors, declarations) => {
      if (!/(^|,)\s*table\s*(?=,|$)/i.test(selectors)) {
        return match;
      }

      const cleanedDeclarations = declarations
        .replace(/(^|;)\s*table-layout\s*:\s*fixed\s*;?/gi, "$1")
        .replace(/;;+/g, ";")
        .trim()
        .replace(/^;|;$/g, "")
        .trim();

      if (cleanedDeclarations === declarations.trim()) {
        return match;
      }

      return cleanedDeclarations
        ? `${prefix} ${selectors.trim()} { ${cleanedDeclarations} }`
        : prefix || "";
    });
  }

  function sanitizeStyleMarkupForBrandLayout(markup) {
    return String(markup || "").replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (match, attrs, cssText) => {
      const sanitizedCss = sanitizeBrandSensitiveCss(cssText);
      return `<style${attrs}>${sanitizedCss}</style>`;
    });
  }

  function buildMergedBodyAttributes(sourceAttrs) {
    const rawAttrs = sourceAttrs || "";
    const safeAttrs = rawAttrs
      .replace(/\s+on[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .trim();

    const styleMatch = safeAttrs.match(/\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i);
    const sourceStyle = styleMatch ? (styleMatch[2] || styleMatch[3] || "").trim() : "";
    const attrsWithoutStyle = safeAttrs.replace(/\s*style\s*=\s*(?:"[^"]*"|'[^']*')/gi, "").trim();
    const baseStyle = "background:#fff;margin:0;padding:0;";
    const mergedStyle = sourceStyle ? `${baseStyle}${sourceStyle}` : baseStyle;

    return `${attrsWithoutStyle ? `${attrsWithoutStyle} ` : ""}style="${mergedStyle}"`.trim();
  }

  function stripOuterDocument(html) {
    let s = html || "";
    s = s.replace(/<!doctype[\s\S]*?>\s*/gi, "");
    s = s.replace(/<html\b[\s\S]*?>/gi, "");
    s = s.replace(/<\/html>\s*/gi, "");
    s = s.replace(/<head\b[\s\S]*?>[\s\S]*?<\/head>\s*/gi, "");
    s = s.replace(/<body\b[\s\S]*?>/gi, "");
    s = s.replace(/<\/body>\s*/gi, "");
    return s.trim();
  }

  function removeTitleTag(html) {
    return (html || "").replace(/<title\b[\s\S]*?>[\s\S]*?<\/title>\s*/gi, "");
  }

  function removeScripts(html) {
    return (html || "")
      .replace(/<script\b[\s\S]*?>[\s\S]*?<\/script>\s*/gi, "")
      .replace(/<script\b[^>]*\/?>\s*/gi, "");
  }

  function isLikelyPreheaderContent(innerHtml) {
    const content = String(innerHtml || "");
    const normalizedText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/[\u00a0\u200b\u00ad]/g, " ")
      .trim();

    return (
      !/<a\b/i.test(content) &&
      !/<img\b/i.test(content) &&
      !/<table\b/i.test(content) &&
      normalizedText.length > 0 &&
      normalizedText.length <= 400
    );
  }

  function removeClientPreheader(html) {
    let s = html || "";

    const hiddenPreheaderPattern = /<(span|div)\b([^>]*)style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi;

    s = s.replace(hiddenPreheaderPattern, (match, tagName, attrs, hiddenRule, innerHtml) => {
      return isLikelyPreheaderContent(innerHtml) ? "" : match;
    });

    return s.trim();
  }

  function insertTrackingMarkupNearTop(html, trackingMarkup) {
    const source = String(html || "");
    if (!trackingMarkup) return source;

    let inserted = false;
    const hiddenPreheaderPattern = /<(span|div)\b([^>]*)style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi;

    const withTrackingAfterPreheader = source.replace(hiddenPreheaderPattern, (match, tagName, attrs, hiddenRule, innerHtml) => {
      if (inserted || !isLikelyPreheaderContent(innerHtml)) {
        return match;
      }

      inserted = true;
      return `${match}\n${trackingMarkup}`;
    });

    if (inserted) {
      return withTrackingAfterPreheader;
    }

    return `${trackingMarkup}\n${source}`;
  }

  function stripKnownBrandWrappers(html, options = {}) {
    const preserveLayoutScaffolding = !!options.preserveLayoutScaffolding;

    return Object.values(brandPresets).reduce((current, brand) => {
      if (!brand) return current;

      if (preserveLayoutScaffolding && Array.isArray(brand.matchers)) {
        let cleaned = stripInjectedCobrandBlocks(current);
        brand.matchers.forEach(matcher => {
          cleaned = cleaned.replace(matcher, "");
        });
        return cleaned;
      }

      if (typeof brand.stripWrappedTemplate === "function") {
        return brand.stripWrappedTemplate(current);
      }
      return current;
    }, html || "");
  }

  function getEffectiveStealthLink() {
    const manualValue = stealthLinkInput?.value.trim() || "";
    if (manualValue) return manualValue;
    if (outputMode === "fragment") return "";

    const brand = brandPresets[brandSelect.value];
    return brand?.stealthLink || "";
  }

  function updateStealthHelper() {
    if (!stealthHelperText) return;

    const brand = brandPresets[brandSelect.value];
    if (stealthLinkInput?.value.trim()) {
      stealthHelperText.textContent = "A custom stealth link will be injected into the output.";
      return;
    }

    if (outputMode === "fragment") {
      stealthHelperText.textContent = "No default stealth link is used in Code fragment mode.";
      return;
    }

    if (brand?.stealthLink) {
      stealthHelperText.textContent = `Default stealth link ready for ${brand.name}. Leave the field blank to use it automatically.`;
      return;
    }

    stealthHelperText.textContent = "No default stealth link is available for the current selection.";
  }

  function ensureFloatingTooltip() {
    if (floatingTooltip) return floatingTooltip;

    floatingTooltip = document.createElement("div");
    floatingTooltip.className = "floating-tooltip";
    floatingTooltip.setAttribute("role", "tooltip");
    document.body.appendChild(floatingTooltip);
    return floatingTooltip;
  }

  function hideFloatingTooltip() {
    if (!floatingTooltip) return;
    floatingTooltip.classList.remove("is-visible");
    floatingTooltip.textContent = "";
    activeTooltipTrigger?.setAttribute("aria-expanded", "false");
    activeTooltipTrigger = null;
  }

  function showFloatingTooltip(trigger) {
    if (!trigger) return;

    const text = trigger.dataset.tooltip?.trim();
    if (!text) return;

    const tooltip = ensureFloatingTooltip();
    tooltip.textContent = text;
    tooltip.classList.add("is-visible");

    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = Math.max(8, rect.top - tooltipRect.height - 12);
    const left = Math.min(
      window.innerWidth - tooltipRect.width - 8,
      Math.max(8, rect.right - tooltipRect.width + 10)
    );

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    if (top <= 12) {
      tooltip.style.top = `${Math.min(window.innerHeight - tooltipRect.height - 8, rect.bottom + 12)}px`;
    }

    if (activeTooltipTrigger && activeTooltipTrigger !== trigger) {
      activeTooltipTrigger.setAttribute("aria-expanded", "false");
    }

    activeTooltipTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeInfoTips() {
    hideFloatingTooltip();
  }

  function buildTrackingMarkup() {
    const adId = (adIdInput?.value || "").trim();
    const stealthLink = getEffectiveStealthLink();
    const blocks = [];

    if (adId) {
      blocks.push(`<!-- // ADD ID -->\n<input value="${adId.replace(/"/g, "&quot;")}" name="advertiserid" type="hidden">\n<!-- // ADD ID -->`);
    }

    if (stealthLink) {
      const safeLink = stealthLink.replace(/"/g, "&quot;");
      blocks.push(`<!-- // STEALTH LINK -->\n<div style="display:none;visibility:hidden;opacity:0;max-height:0;max-width:0;overflow:hidden;font-size:0;line-height:0;mso-hide:all;">\n  <a href="${safeLink}" aria-hidden="true" style="display:none;visibility:hidden;opacity:0;font-size:0;line-height:0;text-decoration:none;">&#8203;</a>\n</div>\n<!-- // STEALTH LINK -->`);
    }

    return blocks.join("\n");
  }

  function stripInjectedCobrandBlocks(html) {
    let source = String(html || "");
    source = source.replace(/<!--\s*COBRAND_HEADER_START\s*-->[\s\S]*?<!--\s*COBRAND_HEADER_END\s*-->\s*/gi, "");
    source = source.replace(/<!--\s*COBRAND_FOOTER_START\s*-->[\s\S]*?<!--\s*COBRAND_FOOTER_END\s*-->\s*/gi, "");
    source = source.replace(/<!--\s*\/\/ ADD ID\s*-->[\s\S]*?<!--\s*\/\/ ADD ID\s*-->\s*/gi, "");
    source = source.replace(/<!--\s*\/\/ STEALTH LINK\s*-->[\s\S]*?<!--\s*\/\/ STEALTH LINK\s*-->\s*/gi, "");
    source = source.replace(/<div[^>]*>\s*<a[^>]*>\s*Stealth tracking link\s*<\/a>\s*<\/div>\s*/gi, "");
    return source;
  }

  function injectBrandIntoClientDocument(html, { brandHeader, brandFooter, trackingMarkup }) {
    let source = stripInjectedCobrandBlocks(html || "").trim();
    if (!source) return "";

    const hasBody = /<body\b[^>]*>/i.test(source) && /<\/body>/i.test(source);
    if (!hasBody) {
      return "";
    }

    source = source.replace(/(<body\b[^>]*>)([\s\S]*?)(<\/body>)/i, (match, bodyOpen, bodyInner, bodyClose) => {
      const trackedBodyInner = insertTrackingMarkupNearTop(bodyInner, trackingMarkup);
      return `${bodyOpen}
<!-- COBRAND_HEADER_START -->
${brandHeader}
<!-- COBRAND_HEADER_END -->
${trackedBodyInner}
<!-- COBRAND_FOOTER_START -->
${brandFooter}
<!-- COBRAND_FOOTER_END -->
${bodyClose}`;
    });

    if (!/<!doctype/i.test(source)) {
      source = `<!DOCTYPE html>\n${source}`;
    }

    return source;
  }

  function saveState() {
    if (isRestoringState) return;

    saveCleanupSettingsForMode(outputMode);

    const state = {
      previewMode,
      outputMode,
      brand: brandSelect?.value || "",
      inputHtml: inputHtml?.value || "",
      adId: adIdInput?.value || "",
      stealthLink: stealthLinkInput?.value || "",
      headerOuterBg: headerOuterBgColor?.value || "",
      footerOuterBg: footerOuterBgColor?.value || "",
      headerBg: headerBgColor?.value || "",
      footerBg: footerBgColor?.value || "",
      matchFooterColor: !!toggleMatchFooterColor?.checked,
      showDividers: !!toggleShowDividers?.checked,
      cleanupOptionsByMode,
      templateDrawerOpen
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error(err);
    }
  }

  function restoreState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const state = JSON.parse(raw);
      isRestoringState = true;

      if (typeof state.inputHtml === "string" && inputHtml) inputHtml.value = state.inputHtml;
      if (typeof state.brand === "string" && brandSelect) {
        brandSelect.value = state.brand || (brandPresets[DEFAULT_BRAND] ? DEFAULT_BRAND : "");
      }
      if (typeof state.adId === "string" && adIdInput) adIdInput.value = state.adId;
      if (typeof state.stealthLink === "string" && stealthLinkInput) stealthLinkInput.value = state.stealthLink;
      if (typeof state.headerOuterBg === "string" && headerOuterBgColor) headerOuterBgColor.value = state.headerOuterBg;
      if (typeof state.footerOuterBg === "string" && footerOuterBgColor) footerOuterBgColor.value = state.footerOuterBg;
      if (typeof state.headerBg === "string" && headerBgColor) headerBgColor.value = state.headerBg;
      if (typeof state.footerBg === "string" && footerBgColor) footerBgColor.value = state.footerBg;
      if (toggleMatchFooterColor) toggleMatchFooterColor.checked = !!state.matchFooterColor;
      if (toggleShowDividers) toggleShowDividers.checked = !!state.showDividers;
      cleanupOptionsByMode = structuredClone(defaultCleanupOptionsByMode);
      if (state.cleanupOptionsByMode && typeof state.cleanupOptionsByMode === "object") {
        cleanupOptionsByMode.fragment = {
          ...defaultCleanupOptionsByMode.fragment,
          ...(state.cleanupOptionsByMode.fragment || {})
        };
        cleanupOptionsByMode.full = {
          ...defaultCleanupOptionsByMode.full,
          ...(state.cleanupOptionsByMode.full || {})
        };
      } else {
        cleanupOptionsByMode.fragment = {
          ...defaultCleanupOptionsByMode.fragment,
          keepStyles: state.keepStyles ?? defaultCleanupOptionsByMode.fragment.keepStyles,
          removePreview: state.removePreview ?? defaultCleanupOptionsByMode.fragment.removePreview,
          removeTitle: state.removeTitle ?? defaultCleanupOptionsByMode.fragment.removeTitle,
          removeScripts: state.removeScripts ?? defaultCleanupOptionsByMode.fragment.removeScripts
        };
        cleanupOptionsByMode.full = {
          ...defaultCleanupOptionsByMode.full,
          literalFullEmail: state.literalFullEmail ?? defaultCleanupOptionsByMode.full.literalFullEmail,
          removePreview: state.removePreview ?? defaultCleanupOptionsByMode.full.removePreview,
          removeTitle: state.removeTitle ?? defaultCleanupOptionsByMode.full.removeTitle,
          removeScripts: state.removeScripts ?? defaultCleanupOptionsByMode.full.removeScripts,
          protectBrandLayout: state.protectBrandLayout ?? defaultCleanupOptionsByMode.full.protectBrandLayout
        };
      }
      lastCleanerShowDividers = !!state.showDividers;
      lastCleanerOutputMode = state.outputMode === "fragment" ? "fragment" : "full";
      templateDrawerOpen = !!state.templateDrawerOpen;

      syncFooterColorState();
      updateColorLabels();
      setBuilderMode("cleaner");
      setOutputMode(lastCleanerOutputMode);
      setViewMode(["desktop", "mobile", "compare", "code", "dark"].includes(state.previewMode) ? state.previewMode : "desktop");
      isRestoringState = false;
      return true;
    } catch (err) {
      console.error(err);
      isRestoringState = false;
      return false;
    }
  }

  function updateHelpBadge() {
    if (!helpUpdateBadge) return;
    const seenVersion = window.localStorage.getItem(HELP_UPDATES_STORAGE_KEY) || "";
    helpUpdateBadge.hidden = seenVersion === HELP_UPDATES_VERSION;
  }

  function markHelpUpdatesSeen() {
    try {
      window.localStorage.setItem(HELP_UPDATES_STORAGE_KEY, HELP_UPDATES_VERSION);
    } catch (err) {
      console.error(err);
    }
    updateHelpBadge();
  }

  function hasValidFullEmailSelection() {
    return outputMode !== "full" || !!brandSelect.value;
  }

  function updateActionButtons() {
    const enabled = hasValidFullEmailSelection();

    copyBtn.disabled = !enabled;
    downloadBtn.disabled = !enabled;

    copyBtn.classList.toggle("is-disabled", !enabled);
    downloadBtn.classList.toggle("is-disabled", !enabled);
  }

  function renderStatus(level, pillText, message) {
    currentStatusLevel = level;
    currentStatusText = pillText;

    if (statusPill) {
      statusPill.textContent = `${pillText} • ${currentStatusSizeText}`;
      statusPill.className = `status-pill ${level}`;
    }

    if (statusMessage) {
      statusMessage.textContent = message;
      statusMessage.className = "status-message";
    }

  }

  function getHtmlSizeBytes(html) {
    return new TextEncoder().encode(html || "").length;
  }

  function formatHtmlSize(bytes) {
    if (!bytes) return "0 KB";
    return bytes < 1024
      ? `${bytes} B`
      : `${(bytes / 1024).toFixed(bytes >= 10 * 1024 ? 0 : 1)} KB`;
  }

  function renderEmailSize(bytes) {
    currentStatusSizeText = formatHtmlSize(bytes);
    if (statusPill) {
      statusPill.textContent = `${currentStatusText} • ${currentStatusSizeText}`;
      statusPill.className = `status-pill ${currentStatusLevel}`;
    }
  }

  function renderAdIdStatus() {
    if (!adIdStatusPill) return;

    const adId = (adIdInput?.value || "").trim();
    if (!adId) {
      adIdStatusPill.textContent = "";
      adIdStatusPill.hidden = true;
      return;
    }

    adIdStatusPill.textContent = `Ad ID ${adId}`;
    adIdStatusPill.hidden = false;
  }

  function updateTemplateOptionsVisibility() {
    const canEditTemplate = outputMode === "full" && !!brandSelect.value;

    if (!canEditTemplate) {
      templateDrawerOpen = false;
    }

    if (appEl) {
      appEl.classList.toggle("template-open", canEditTemplate && templateDrawerOpen);
      appEl.classList.toggle("cleanup-open", cleanupDrawerOpen);
      appEl.classList.toggle("tracking-open", trackingDrawerOpen);
      appEl.classList.toggle("qa-open", qaDrawerOpen);
    }

    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.hidden = !canEditTemplate;
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateDrawerOpen && canEditTemplate));
    }

    if (templateDialog) {
      templateDialog.classList.toggle("is-open", canEditTemplate && templateDrawerOpen);
      templateDialog.setAttribute("aria-hidden", String(!(canEditTemplate && templateDrawerOpen)));
    }

    if (trackingDialog) {
      trackingDialog.classList.toggle("is-open", trackingDrawerOpen);
      trackingDialog.setAttribute("aria-hidden", String(!trackingDrawerOpen));
    }

    if (qaDialog) {
      qaDialog.classList.toggle("is-open", qaDrawerOpen);
      qaDialog.setAttribute("aria-hidden", String(!qaDrawerOpen));
    }

    if (brandHelperText) {
      brandHelperText.textContent = outputMode === "full"
        ? "Used only for full branded email."
        : "Not used in code fragment mode.";
    }

    updateStealthHelper();
  }

  function updateCleanupOptionsAvailability() {
    const isFullMode = outputMode === "full";
    const preserveFullTemplate = isFullMode && !!toggleLiteralFullEmail?.checked;
    const keepStylesInput = document.getElementById("toggleKeepStyles");
    const removePreviewInput = document.getElementById("toggleRemovePreview");
    const removeTitleInput = document.getElementById("toggleRemoveTitle");
    const removeScriptsInput = document.getElementById("toggleRemoveScripts");
    const protectBrandLayoutInput = document.getElementById("toggleProtectBrandLayout");

    if (cleanupModeTitle) {
      cleanupModeTitle.textContent = isFullMode
        ? (preserveFullTemplate ? "Cleanup unavailable" : "Cleanup")
        : "Fragment cleanup";
    }

    if (cleanupModeNote) {
      cleanupModeNote.textContent = isFullMode
        ? (preserveFullTemplate
          ? "Turn off Preserve full client template to use these cleanup options."
          : "Use only when preserving the full client template is off.")
        : "Use Keep embedded styles to preserve client styling.";
    }

    if (keepStylesRow) {
      keepStylesRow.hidden = isFullMode;
    }

    if (fullHandlingPanel) {
      fullHandlingPanel.hidden = !isFullMode;
    }

    if (fullHandlingNote) {
      fullHandlingNote.textContent = preserveFullTemplate
        ? "Inject-only mode leaves the client email structure intact."
        : "Use these only when the full email needs extra handling.";
    }

    [
      [removePreviewRow, removePreviewInput],
      [removeTitleRow, removeTitleInput],
      [removeScriptsRow, removeScriptsInput]
    ].forEach(([row, input]) => {
      if (!row || !input) return;
      row.classList.toggle("is-disabled", preserveFullTemplate);
      input.disabled = preserveFullTemplate;
    });

    if (protectBrandLayoutRow && protectBrandLayoutInput) {
      protectBrandLayoutRow.classList.toggle("is-disabled", preserveFullTemplate);
      protectBrandLayoutInput.disabled = preserveFullTemplate;
    }

    if (literalFullEmailRow) {
      literalFullEmailRow.classList.toggle("is-disabled", !isFullMode);
    }

    if (toggleLiteralFullEmail) {
      toggleLiteralFullEmail.disabled = !isFullMode;
    }

    if (protectBrandLayoutInput) {
      protectBrandLayoutInput.disabled = !isFullMode || preserveFullTemplate;
    }

    if (keepStylesInput) {
      keepStylesInput.disabled = false;
    }
  }

  function setCleanupDrawerOpen(isOpen) {
    cleanupDrawerOpen = !!isOpen;
    if (cleanupDrawerOpen) {
      templateDrawerOpen = false;
      trackingDrawerOpen = false;
      qaDrawerOpen = false;
    }

    if (appEl) {
      appEl.classList.toggle("cleanup-open", cleanupDrawerOpen);
      appEl.classList.toggle("template-open", templateDrawerOpen);
      appEl.classList.toggle("tracking-open", trackingDrawerOpen);
      appEl.classList.toggle("qa-open", qaDrawerOpen);
    }

    if (cleanupDialog) {
      cleanupDialog.classList.toggle("is-open", cleanupDrawerOpen);
      cleanupDialog.setAttribute("aria-hidden", String(!cleanupDrawerOpen));
    }

    if (cleanupSettingsBtn) {
      cleanupSettingsBtn.setAttribute("aria-expanded", String(cleanupDrawerOpen));
    }

    if (templateDialog) {
      templateDialog.classList.toggle("is-open", templateDrawerOpen && outputMode === "full" && !!brandSelect.value);
      templateDialog.setAttribute("aria-hidden", String(!(templateDrawerOpen && outputMode === "full" && !!brandSelect.value)));
    }

    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateDrawerOpen && outputMode === "full" && !!brandSelect.value));
    }

    if (trackingDialog) {
      trackingDialog.classList.toggle("is-open", trackingDrawerOpen);
      trackingDialog.setAttribute("aria-hidden", String(!trackingDrawerOpen));
    }
    if (trackingToolBtn) {
      trackingToolBtn.setAttribute("aria-expanded", String(trackingDrawerOpen));
    }

    if (qaDialog) {
      qaDialog.classList.toggle("is-open", qaDrawerOpen);
      qaDialog.setAttribute("aria-hidden", String(!qaDrawerOpen));
    }
    if (qaToolBtn) {
      qaToolBtn.setAttribute("aria-expanded", String(qaDrawerOpen));
    }
  }

  function setTemplateDrawerOpen(isOpen) {
    const canEditTemplate = outputMode === "full" && !!brandSelect.value;
    templateDrawerOpen = !!isOpen && canEditTemplate;
    if (templateDrawerOpen) {
      cleanupDrawerOpen = false;
      trackingDrawerOpen = false;
      qaDrawerOpen = false;
    }

    if (appEl) {
      appEl.classList.toggle("template-open", templateDrawerOpen);
      appEl.classList.toggle("cleanup-open", cleanupDrawerOpen);
      appEl.classList.toggle("tracking-open", trackingDrawerOpen);
      appEl.classList.toggle("qa-open", qaDrawerOpen);
    }

    if (templateDialog) {
      templateDialog.classList.toggle("is-open", templateDrawerOpen);
      templateDialog.setAttribute("aria-hidden", String(!templateDrawerOpen));
    }

    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateDrawerOpen));
    }

    if (cleanupDialog) {
      cleanupDialog.classList.toggle("is-open", cleanupDrawerOpen);
      cleanupDialog.setAttribute("aria-hidden", String(!cleanupDrawerOpen));
    }

    if (cleanupSettingsBtn) {
      cleanupSettingsBtn.setAttribute("aria-expanded", String(cleanupDrawerOpen));
    }

    if (trackingDialog) {
      trackingDialog.classList.toggle("is-open", trackingDrawerOpen);
      trackingDialog.setAttribute("aria-hidden", String(!trackingDrawerOpen));
    }
    if (trackingToolBtn) {
      trackingToolBtn.setAttribute("aria-expanded", String(trackingDrawerOpen));
    }

    if (qaDialog) {
      qaDialog.classList.toggle("is-open", qaDrawerOpen);
      qaDialog.setAttribute("aria-hidden", String(!qaDrawerOpen));
    }
    if (qaToolBtn) {
      qaToolBtn.setAttribute("aria-expanded", String(qaDrawerOpen));
    }
  }

  function setTrackingDrawerOpen(isOpen) {
    trackingDrawerOpen = !!isOpen;
    if (trackingDrawerOpen) {
      cleanupDrawerOpen = false;
      templateDrawerOpen = false;
      qaDrawerOpen = false;
    }

    if (appEl) {
      appEl.classList.toggle("tracking-open", trackingDrawerOpen);
      appEl.classList.toggle("cleanup-open", cleanupDrawerOpen);
      appEl.classList.toggle("template-open", templateDrawerOpen);
      appEl.classList.toggle("qa-open", qaDrawerOpen);
    }

    if (trackingDialog) {
      trackingDialog.classList.toggle("is-open", trackingDrawerOpen);
      trackingDialog.setAttribute("aria-hidden", String(!trackingDrawerOpen));
    }
    if (trackingToolBtn) {
      trackingToolBtn.setAttribute("aria-expanded", String(trackingDrawerOpen));
    }

    if (cleanupDialog) {
      cleanupDialog.classList.toggle("is-open", cleanupDrawerOpen);
      cleanupDialog.setAttribute("aria-hidden", String(!cleanupDrawerOpen));
    }
    if (cleanupSettingsBtn) {
      cleanupSettingsBtn.setAttribute("aria-expanded", String(cleanupDrawerOpen));
    }

    if (templateDialog) {
      templateDialog.classList.toggle("is-open", templateDrawerOpen && outputMode === "full" && !!brandSelect.value);
      templateDialog.setAttribute("aria-hidden", String(!(templateDrawerOpen && outputMode === "full" && !!brandSelect.value)));
    }
    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateDrawerOpen && outputMode === "full" && !!brandSelect.value));
    }

    if (qaDialog) {
      qaDialog.classList.toggle("is-open", qaDrawerOpen);
      qaDialog.setAttribute("aria-hidden", String(!qaDrawerOpen));
    }
    if (qaToolBtn) {
      qaToolBtn.setAttribute("aria-expanded", String(qaDrawerOpen));
    }
  }

  function setQaDrawerOpen(isOpen) {
    qaDrawerOpen = !!isOpen;
    if (qaDrawerOpen) {
      cleanupDrawerOpen = false;
      templateDrawerOpen = false;
      trackingDrawerOpen = false;
    }

    if (appEl) {
      appEl.classList.toggle("qa-open", qaDrawerOpen);
      appEl.classList.toggle("cleanup-open", cleanupDrawerOpen);
      appEl.classList.toggle("template-open", templateDrawerOpen);
      appEl.classList.toggle("tracking-open", trackingDrawerOpen);
    }

    if (qaDialog) {
      qaDialog.classList.toggle("is-open", qaDrawerOpen);
      qaDialog.setAttribute("aria-hidden", String(!qaDrawerOpen));
    }
    if (qaToolBtn) {
      qaToolBtn.setAttribute("aria-expanded", String(qaDrawerOpen));
    }

    if (cleanupDialog) {
      cleanupDialog.classList.toggle("is-open", cleanupDrawerOpen);
      cleanupDialog.setAttribute("aria-hidden", String(!cleanupDrawerOpen));
    }
    if (cleanupSettingsBtn) {
      cleanupSettingsBtn.setAttribute("aria-expanded", String(cleanupDrawerOpen));
    }

    if (templateDialog) {
      templateDialog.classList.toggle("is-open", templateDrawerOpen && outputMode === "full" && !!brandSelect.value);
      templateDialog.setAttribute("aria-hidden", String(!(templateDrawerOpen && outputMode === "full" && !!brandSelect.value)));
    }
    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateDrawerOpen && outputMode === "full" && !!brandSelect.value));
    }

    if (trackingDialog) {
      trackingDialog.classList.toggle("is-open", trackingDrawerOpen);
      trackingDialog.setAttribute("aria-hidden", String(!trackingDrawerOpen));
    }
    if (trackingToolBtn) {
      trackingToolBtn.setAttribute("aria-expanded", String(trackingDrawerOpen));
    }
  }

  function getProcessedClientContent(options = {}) {
    let client = inputHtml.value.trim();
    const applyFragmentCleanup = options.applyFragmentCleanup ?? (outputMode === "fragment");
    const preserveFullExportLayout = !!options.preserveFullExportLayout;
    const injectIntoClientTemplate = preserveFullExportLayout && !applyFragmentCleanup;
    const keepStyles = document.getElementById("toggleKeepStyles")?.checked !== false;
    const removeScriptsEnabled = !injectIntoClientTemplate && !!document.getElementById("toggleRemoveScripts")?.checked;
    const protectBrandLayout = !applyFragmentCleanup && !injectIntoClientTemplate && !!document.getElementById("toggleProtectBrandLayout")?.checked;

    if (!client) {
      client = sampleClientHtml.trim();
    }

    const originalHead = extractHeadHtml(client);
    const originalHtmlAttrs = extractHtmlOpenTag(client);
    const originalBodyAttrs = extractBodyOpenTag(client);

    client = stripKnownBrandWrappers(client, { preserveLayoutScaffolding: applyFragmentCleanup });

    const sourceHead = extractHeadHtml(client) || originalHead;
    const sourceHtmlAttrs = extractHtmlOpenTag(client) || originalHtmlAttrs;
    const sourceBodyAttrs = extractBodyOpenTag(client) || originalBodyAttrs;

    if (!injectIntoClientTemplate && document.getElementById("toggleRemoveTitle")?.checked) {
      client = removeTitleTag(client);
    }

    if (removeScriptsEnabled) {
      client = removeScripts(client);
    }

    let preservedHeadMarkup = "";
    if (preserveFullExportLayout) {
      preservedHeadMarkup = sourceHead.trim();
      client = extractBodyInnerHtml(client);
    } else {
      if (keepStyles) {
        preservedHeadMarkup = extractPreservableHeadMarkup(sourceHead);
      }

      if (keepStyles) {
        const { htmlWithoutStyles } = extractStyleBlocks(client);
        client = stripOuterDocument(htmlWithoutStyles);
      } else {
        client = stripOuterDocument(client);
        client = client.replace(/<style\b[\s\S]*?<\/style>\s*/gi, "");
      }
    }

    if (!injectIntoClientTemplate && document.getElementById("toggleRemovePreview")?.checked) {
      client = removeClientPreheader(client);
    }

    if (protectBrandLayout) {
      preservedHeadMarkup = sanitizeStyleMarkupForBrandLayout(preservedHeadMarkup);
      client = sanitizeStyleMarkupForBrandLayout(client);
    }

    return {
      clientHtml: client.trim(),
      preservedHeadMarkup,
      bodyAttributes: buildMergedBodyAttributes(sourceBodyAttrs),
      htmlAttributes: sourceHtmlAttrs.trim()
    };
  }

  function buildFullEmailHtml() {
    const brandKey = brandSelect.value;
    const brand = brandPresets[brandKey];
    const useLiteralFullEmail = !!toggleLiteralFullEmail?.checked && !!inputHtml.value.trim();

    if (!brand) {
      return "";
    }
    const headerOuterBg = headerOuterBgColor?.value || "#ffffff";
    const footerOuterBg = (toggleMatchFooterColor?.checked ? headerOuterBg : footerOuterBgColor?.value) || "#ffffff";
    const headerBg = headerBgColor?.value || "#ffffff";
    const footerBg = (toggleMatchFooterColor?.checked ? headerBg : footerBgColor?.value) || "#ffffff";
    const preserveDefaultSurface =
      headerOuterBg.toLowerCase() === "#ffffff" &&
      footerOuterBg.toLowerCase() === "#ffffff" &&
      headerBg.toLowerCase() === "#ffffff" &&
      footerBg.toLowerCase() === "#ffffff";
    const brandOptions = {
      headerOuterBg,
      footerOuterBg,
      headerBg,
      footerBg,
      showDividers: toggleShowDividers?.checked !== false,
      headerDarkAttr: preserveDefaultSurface ? 'data-cobrand-preserve-light="header"' : "",
      footerDarkAttr: preserveDefaultSurface ? 'data-cobrand-preserve-light="footer"' : ""
    };
    const brandHeader = typeof brand.renderHeader === "function" ? brand.renderHeader(brandOptions) : brand.header;
    const brandFooter = typeof brand.renderFooter === "function" ? brand.renderFooter(brandOptions) : brand.footer;
    const trackingMarkup = buildTrackingMarkup();

    if (useLiteralFullEmail) {
      const clientSource = inputHtml.value.trim() || sampleClientHtml.trim();
      const injectedDocument = injectBrandIntoClientDocument(clientSource, {
        brandHeader,
        brandFooter,
        trackingMarkup
      });

      if (injectedDocument) {
        return injectedDocument;
      }
    }

    const {
      clientHtml,
      preservedHeadMarkup,
      bodyAttributes,
      htmlAttributes
    } = getProcessedClientContent({
      applyFragmentCleanup: false,
      preserveFullExportLayout: false
    });

    const headMarkup = preservedHeadMarkup ? `${preservedHeadMarkup}\n` : "\n";
    const contentMarkup = insertTrackingMarkupNearTop(clientHtml, trackingMarkup);

    return `<!DOCTYPE html>
<html${htmlAttributes ? ` ${htmlAttributes}` : ' lang="en"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cobrand Email</title>
${headMarkup}</head>
<body ${bodyAttributes}>
<!-- COBRAND_HEADER_START -->
${brandHeader}
<!-- COBRAND_HEADER_END -->
${contentMarkup}
<!-- COBRAND_FOOTER_START -->
${brandFooter}
<!-- COBRAND_FOOTER_END -->
</body>
</html>`;
  }

  function buildFragmentHtml() {
    const { clientHtml, preservedHeadMarkup } = getProcessedClientContent({ applyFragmentCleanup: true });
    const trackingMarkup = buildTrackingMarkup();
    const contentMarkup = insertTrackingMarkupNearTop(clientHtml, trackingMarkup);
    return preservedHeadMarkup ? `${preservedHeadMarkup}\n${contentMarkup}`.trim() : contentMarkup;
  }

  function getCurrentOutputHtml() {
    return outputMode === "fragment" ? buildFragmentHtml() : buildFullEmailHtml();
  }

  function buildGmailDarkModeScript() {
    return `
<script>
  (function () {
    function parseColor(value) {
      if (!value) return null;
      var input = String(value).trim().toLowerCase();
      if (!input || input === "transparent" || input === "inherit") return null;

      var hexMatch = input.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hexMatch) {
        var hex = hexMatch[1];
        if (hex.length === 3) {
          hex = hex.split("").map(function (part) { return part + part; }).join("");
        }
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
      }

      var rgbMatch = input.match(/^rgba?\\(([^)]+)\\)$/);
      if (!rgbMatch) return null;
      var parts = rgbMatch[1].split(",").map(function (part) { return Number(part.trim()); });
      if (parts.length < 3 || parts.some(function (part) { return Number.isNaN(part); })) return null;
      return { r: parts[0], g: parts[1], b: parts[2] };
    }

    function luminance(color) {
      if (!color) return null;
      return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    }

    function shouldFlipBackground(color) {
      var value = luminance(color);
      return value !== null && value > 0.72;
    }

    function shouldFlipText(color) {
      var value = luminance(color);
      return value !== null && value < 0.45;
    }

    function applyDarkMode() {
      var darkBg = "#0f172a";
      var darkSurface = "#111827";
        var lightText = "#f8fafc";
        var mutedText = "#d1d5db";
        var linkText = "#93c5fd";
        var preserveBg = "#ffffff";
        var preserveText = "#1f2937";

      document.documentElement.style.backgroundColor = "#0b1220";
      document.body.style.backgroundColor = "#0b1220";
      document.body.style.color = lightText;

      var elements = document.body.querySelectorAll("*");
      elements.forEach(function (el) {
        if (["IMG", "SVG", "PATH", "VIDEO", "SOURCE"].includes(el.tagName)) return;

        var preserveLight = el.closest("[data-cobrand-preserve-light]");
        if (preserveLight) {
          el.style.setProperty("background-color", preserveBg, "important");
          if (el.hasAttribute("bgcolor")) {
            el.setAttribute("bgcolor", preserveBg);
          }
          if (el.tagName !== "A") {
            el.style.setProperty("color", preserveText, "important");
          }
          return;
        }

        var style = window.getComputedStyle(el);
        var inlineBackground = el.style.backgroundColor || el.getAttribute("bgcolor") || "";
        var computedBackground = style.backgroundColor;
        var backgroundColor = parseColor(inlineBackground) || parseColor(computedBackground);

        if (shouldFlipBackground(backgroundColor)) {
          el.style.setProperty("background-color", el.tagName === "BODY" ? "#0b1220" : darkSurface, "important");
          if (el.hasAttribute("bgcolor")) {
            el.setAttribute("bgcolor", el.tagName === "BODY" ? "#0b1220" : darkSurface);
          }
        }

        var textColor = parseColor(el.style.color || style.color);
        if (shouldFlipText(textColor)) {
          el.style.setProperty("color", /^(small|span|p|td|div)$/i.test(el.tagName) ? mutedText : lightText, "important");
        }

        var borderTop = parseColor(style.borderTopColor);
        if (borderTop && shouldFlipBackground(borderTop)) {
          el.style.setProperty("border-top-color", "#374151", "important");
        }

        var borderColor = parseColor(style.borderColor);
        if (borderColor && shouldFlipBackground(borderColor)) {
          el.style.setProperty("border-color", "#374151", "important");
        }

        if (el.tagName === "A") {
          el.style.setProperty("color", linkText, "important");
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyDarkMode, { once: true });
    } else {
      applyDarkMode();
    }
  })();
</script>`;
  }

  function buildPreviewDoc(finalHtml, modeOverride = previewMode) {
    const isDark = modeOverride === "dark";
    const isMobile = modeOverride === "mobile";

    let previewHead = "";
    let previewContent = finalHtml;

    if (outputMode === "full") {
      const headMatch = finalHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
      const bodyMatch = finalHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
      previewHead = headMatch ? headMatch[1].trim() : "";
      previewContent = bodyMatch ? bodyMatch[1].trim() : finalHtml;
    } else {
      const { htmlWithoutStyles, styleBlocks } = extractStyleBlocks(finalHtml);
      previewHead = styleBlocks.join("\n");
      previewContent = htmlWithoutStyles;
    }

    const gmailDarkScript = isDark ? buildGmailDarkModeScript() : "";
    const shellStyle = isMobile
      ? "width:100%;max-width:420px;margin:0;"
      : "width:100%;margin:0 auto;";

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${previewHead}
<style>
  html,body{
    margin:0;
    padding:0;
    background:${isDark ? "#0b1220" : "#d7dee6"};
    overflow:hidden;
  }
  body{
    font-family:Arial,Helvetica,sans-serif;
    overflow:hidden;
  }
  .stage{
    padding:${isMobile ? "0" : "28px"};
    overflow-x:${isMobile ? "auto" : "visible"};
  }
  .shell{
    ${shellStyle}
  }
</style>
${gmailDarkScript}
</head>
<body>
  <div class="stage">
    <div class="shell">
      ${previewContent}
    </div>
  </div>
</body>
</html>`;
  }

  function buildSourcePreviewDoc(sourceHtml) {
    const rawSource = (sourceHtml || "").trim() || sampleClientHtml.trim();
    const isMobile = previewMode === "mobile";

    let previewHead = "";
    let previewContent = rawSource;

    const headMatch = rawSource.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = rawSource.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

    if (headMatch || bodyMatch) {
      previewHead = headMatch ? headMatch[1].trim() : "";
      previewContent = bodyMatch ? bodyMatch[1].trim() : rawSource;
    } else {
      const { htmlWithoutStyles, styleBlocks } = extractStyleBlocks(rawSource);
      previewHead = styleBlocks.join("\n");
      previewContent = htmlWithoutStyles;
    }

    const shellStyle = isMobile
      ? "width:100%;max-width:420px;margin:0;"
      : "width:100%;margin:0 auto;";

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${previewHead}
<style>
  html,body{
    margin:0;
    padding:0;
    background:#d7dee6;
    overflow:hidden;
  }
  body{
    font-family:Arial,Helvetica,sans-serif;
    overflow:hidden;
  }
  .stage{
    padding:${isMobile ? "0" : "28px"};
    overflow-x:${isMobile ? "auto" : "visible"};
  }
  .shell{
    ${shellStyle}
  }
  .source-badge{
    display:inline-block;
    margin:0 0 14px 0;
    padding:8px 12px;
    border-radius:999px;
    background:#eef2ff;
    color:#4338ca;
    font:600 12px/1 Arial,Helvetica,sans-serif;
  }
</style>
</head>
<body>
  <div class="stage">
    <div class="source-badge">Source preview</div>
    <div class="shell">
      ${previewContent}
    </div>
  </div>
</body>
</html>`;
  }

  function resizePreviewFrame(frame, fallbackHeight = 420) {
    if (!frame) return;

    try {
      const doc = frame.contentDocument;
      const body = doc?.body;
      const html = doc?.documentElement;
      if (!body || !html) return;

      frame.style.height = "0px";
      const measuredHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.scrollHeight,
        html.offsetHeight,
        fallbackHeight
      );

      frame.style.height = `${measuredHeight}px`;
    } catch (err) {
      frame.style.height = `${fallbackHeight}px`;
    }
  }

  function resizePreviewFrames() {
    const baseHeight = previewMode === "mobile" ? 560 : 420;
    if (previewMode !== "code") {
      resizePreviewFrame(previewFrame, baseHeight);
    }

    if (previewMode === "compare" && sourcePreviewFrame) {
      resizePreviewFrame(sourcePreviewFrame, 420);
    }

    if (previewMode === "code" && codePreviewFrame) {
      resizePreviewFrame(codePreviewFrame, getCodePreviewMode() === "mobile" ? 560 : 420);
    }
  }

  function schedulePreviewResize() {
    window.requestAnimationFrame(() => {
      resizePreviewFrames();
      window.setTimeout(resizePreviewFrames, 80);
      window.setTimeout(resizePreviewFrames, 220);
    });
  }

  function runQA(finalHtml, rawClient) {
    const issues = [];
    const finalBytes = new TextEncoder().encode(finalHtml || "").length;
    const addCheck = ({ passed, passTitle, passText, failTitle, failText }) => {
      issues.push({
        level: passed ? "ok" : "warn",
        title: passed ? passTitle : failTitle,
        text: passed ? passText : failText
      });
    };
    const linkTags = finalHtml.match(/<a\b[^>]*>/gi) || [];
    const hrefValues = [];
    let linksMissingHref = 0;
    let emptyHrefCount = 0;
    let placeholderHrefCount = 0;
    let malformedHrefCount = 0;
    let nonHttpsHrefCount = 0;

    const isDynamicLink = value =>
      /@\{[^}]+\}@/.test(value) ||
      /\{\{[\s\S]+?\}\}/.test(value) ||
      /%%[^%]+%%/.test(value);

    const isAllowedNonHttpLink = value =>
      /^(mailto:|tel:)/i.test(value);

    const isPlaceholderLink = value => {
      const normalized = value.trim().toLowerCase();
      return normalized === "#" ||
        normalized === "/#" ||
        normalized === "javascript:void(0)" ||
        normalized === "javascript:void(0);" ||
        normalized === "javascript:;" ||
        normalized === "about:blank";
    };

    linkTags.forEach(tag => {
      const hrefMatch = tag.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      if (!hrefMatch) {
        linksMissingHref++;
        return;
      }

      const hrefValue = (hrefMatch[2] || hrefMatch[3] || hrefMatch[4] || "").trim();
      hrefValues.push(hrefValue);

      if (!hrefValue) {
        emptyHrefCount++;
        return;
      }

      if (isDynamicLink(hrefValue)) {
        return;
      }

      if (isPlaceholderLink(hrefValue)) {
        placeholderHrefCount++;
        return;
      }

      if (isAllowedNonHttpLink(hrefValue)) {
        return;
      }

      try {
        const parsed = new URL(hrefValue);
        if (parsed.protocol === "http:") {
          nonHttpsHrefCount++;
        } else if (parsed.protocol !== "https:") {
          malformedHrefCount++;
        }
      } catch (err) {
        malformedHrefCount++;
      }
    });

    const imgTags = finalHtml.match(/<img\b[^>]*>/gi) || [];
    let missingAlt = 0;
    imgTags.forEach(tag => {
      if (!/\balt\s*=/i.test(tag)) missingAlt++;
    });

    addCheck({
      passed: missingAlt === 0,
      passTitle: "Image alt text looks good",
      passText: "",
      failTitle: `${missingAlt} image(s) missing alt text`,
      failText: "Add descriptive alt text to improve accessibility and email client support."
    });

    addCheck({
      passed: linksMissingHref === 0,
      passTitle: "All links include href",
      passText: "",
      failTitle: `${linksMissingHref} link(s) missing href`,
      failText: "One or more links do not have a destination URL yet."
    });

    addCheck({
      passed: emptyHrefCount === 0,
      passTitle: "No empty links found",
      passText: "",
      failTitle: `${emptyHrefCount} empty link(s) found`,
      failText: "Fill in the missing destination so the link can be clicked."
    });

    addCheck({
      passed: placeholderHrefCount === 0,
      passTitle: "No placeholder links found",
      passText: "",
      failTitle: `${placeholderHrefCount} placeholder link(s) found`,
      failText: "Replace placeholder values like `#` or `javascript:void(0)` with real URLs."
    });

    addCheck({
      passed: malformedHrefCount === 0,
      passTitle: "All links look valid",
      passText: "",
      failTitle: `${malformedHrefCount} malformed link(s) found`,
      failText: "At least one link does not look like a complete, valid URL."
    });

    addCheck({
      passed: nonHttpsHrefCount === 0,
      passTitle: "All web links use HTTPS",
      passText: "",
      failTitle: `${nonHttpsHrefCount} non-HTTPS link(s) found`,
      failText: "Use HTTPS where possible so links stay secure and less likely to be flagged."
    });

    const externalCss = rawClient.match(/<link\b[^>]*stylesheet[^>]*>/gi) || [];
    addCheck({
      passed: externalCss.length === 0,
      passTitle: "No external stylesheet links found",
      passText: "",
      failTitle: "External stylesheet linked",
      failText: "Most email clients ignore external stylesheets, so these styles may not render."
    });

    const scriptTags = rawClient.match(/<script\b/gi) || [];
    addCheck({
      passed: scriptTags.length === 0,
      passTitle: "No script tags detected",
      passText: "",
      failTitle: "Script tags detected",
      failText: "Scripts are not supported in email and should be removed before send."
    });

    const forms = rawClient.match(/<form\b/gi) || [];
    addCheck({
      passed: forms.length === 0,
      passTitle: "No form markup detected",
      passText: "",
      failTitle: "Form markup detected",
      failText: "Most email clients do not support forms reliably."
    });

    const videos = rawClient.match(/<video\b/gi) || [];
    addCheck({
      passed: videos.length === 0,
      passTitle: "No video markup detected",
      passText: "",
      failTitle: "Video markup detected",
      failText: "Embedded video often fails in email clients, especially Outlook."
    });

    const outlookChecks = [
      { pattern: /display\s*:\s*flex/gi, label: "display:flex" },
      { pattern: /display\s*:\s*grid/gi, label: "display:grid" },
      { pattern: /position\s*:\s*fixed/gi, label: "position:fixed" },
      { pattern: /position\s*:\s*sticky/gi, label: "position:sticky" }
    ];

    const outlookUnsafe = outlookChecks
      .filter(check => check.pattern.test(finalHtml))
      .map(check => check.label);

    addCheck({
      passed: outlookUnsafe.length === 0,
      passTitle: "No major Outlook-risky CSS found",
      passText: "",
      failTitle: "Potential Outlook compatibility issues",
      failText: outlookUnsafe.length ? `Found ${outlookUnsafe.join(", ")}. Outlook may ignore or break these styles.` : ""
    });

    if (finalBytes >= 102 * 1024) {
      issues.push({
        level: "warn",
        title: "Email is very large",
        text: `${Math.round(finalBytes / 1024)} KB. Gmail may clip emails once they get close to 102 KB.`
      });
    } else if (finalBytes >= 90 * 1024) {
      issues.push({
        level: "warn",
        title: "Email size is getting high",
        text: `${Math.round(finalBytes / 1024)} KB. It may be worth trimming before send.`
      });
    } else {
      issues.push({
        level: "ok",
        title: "Email size looks safe",
        text: `${Math.round(finalBytes / 1024)} KB`
      });
    }

    return issues;
  }

  function renderQA(issues) {
    const warnCount = issues.filter(i => i.level === "warn").length;
    const failedChecks = issues.filter(i => i.level === "warn");
    const passedChecks = issues.filter(i => i.level === "ok");
    qaCount.textContent = warnCount ? `${warnCount} warning${warnCount === 1 ? "" : "s"}` : "0 issues";
    qaCount.className = `qa-pill ${warnCount ? "high" : "ok"}`;

    if (qaSummary) {
      qaSummary.className = `qa-summary ${warnCount ? "warn" : "ok"}`;
    }

    if (qaSummaryText) {
      qaSummaryText.textContent = warnCount
        ? `${warnCount} item${warnCount === 1 ? "" : "s"} need attention before export.`
        : `${passedChecks.length} checks passed.`;
    }

    const renderCheck = (item, icon) => `
      <div class="qa-check ${item.level}">
        <span class="qa-check-icon" aria-hidden="true">${icon}</span>
        <div class="qa-check-copy">
          <div class="qa-check-title">${item.title}</div>
          <div class="qa-check-text">${item.text}</div>
        </div>
      </div>
    `;

    qaReport.innerHTML = `
      ${failedChecks.length ? `
        <section class="qa-group">
          <div class="qa-group-title">Fails · ${failedChecks.length}</div>
          <div class="qa-checklist">
            ${failedChecks.map(item => renderCheck(item, "✕")).join("")}
          </div>
        </section>
      ` : ""}
      ${passedChecks.length ? `
        <section class="qa-group">
          <div class="qa-group-title">Passes · ${passedChecks.length}</div>
          <div class="qa-checklist">
            ${passedChecks.map(item => renderCheck(item, "✓")).join("")}
          </div>
        </section>
      ` : ""}
    `.trim();
  }

  function renderQABaseline() {
    qaCount.textContent = "0 issues";
    qaCount.className = "qa-pill ok";
    if (qaSummary) qaSummary.className = "qa-summary ok";
    if (qaSummaryText) qaSummaryText.textContent = "Checks will appear here after output is generated.";
    qaReport.innerHTML = `
      <section class="qa-group">
        <div class="qa-group-title">Passes</div>
        <div class="qa-checklist">
          <div class="qa-check ok">
            <span class="qa-check-icon" aria-hidden="true">✓</span>
            <div class="qa-check-copy">
              <div class="qa-check-title">Checks will appear here</div>
              <div class="qa-check-text">Once output is generated, this panel will list the QA results in this checklist.</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function prettyPrintHtml(html) {
    const tab = "  ";
    let formatted = "";
    let indent = 0;

    html
      .replace(/>\s*</g, ">\n<")
      .split("\n")
      .forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (/^<\/.+>/.test(trimmed)) indent = Math.max(indent - 1, 0);

        formatted += tab.repeat(indent) + trimmed + "\n";

        if (
          /^<[^!/][^>]*[^/]>$/.test(trimmed) &&
          !/^<(meta|img|br|hr|input|link)\b/i.test(trimmed) &&
          !/^<.*<\/.*>$/.test(trimmed)
        ) {
          indent += 1;
        }
      });

    return formatted.trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightHtmlCode(source) {
    const placeholders = [];
    let html = escapeHtml(source || "");

    const stash = (className, content) => {
      const token = `\uE000${placeholders.length}\uE001`;
      placeholders.push({ token, markup: `<span class="${className}">${content}</span>` });
      return token;
    };

    html = html.replace(/&lt;!--[\s\S]*?--&gt;/g, match => stash("code-comment", match));
    html = html.replace(/&lt;!DOCTYPE[\s\S]*?&gt;/gi, match => stash("code-doctype", match));
    html = html.replace(/\{\{[\s\S]*?\}\}/g, match => stash("code-template", match));
    html = html.replace(/&lt;\/?[\w:-]+(?:\s+[\w:@.-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*\s*\/?&gt;/g, match => {
      let tagMarkup = match;

      tagMarkup = tagMarkup.replace(/^(&lt;\/?)([\w:-]+)/, (_, bracket, tagName) =>
        `${stash("code-bracket", bracket)}${stash("code-tag", tagName)}`
      );

      tagMarkup = tagMarkup.replace(/([\w:@.-]+)(\s*=\s*)("[^"]*"|'[^']*')/g, (_, attr, equals, value) =>
        `${stash("code-attr", attr)}${stash("code-bracket", equals)}${stash("code-string", value)}`
      );

      tagMarkup = tagMarkup.replace(/(\/?&gt;)$/, ending => stash("code-bracket", ending));

      return tagMarkup;
    });
    html = html.replace(/&(?!lt;|gt;|amp;quot;|quot;)(?:[a-z0-9#]+);/gi, match => stash("code-entity", match));

    placeholders.slice().reverse().forEach(({ token, markup }) => {
      html = html.replaceAll(token, markup);
    });

    return html;
  }

  function syncCodeHighlight() {
    if (!codeHighlight || !codeOutputInner) return;
    codeHighlight.innerHTML = `${highlightHtmlCode(codeOutputInner.value)}\n`;
    applyCodeFindHighlights();
    codeHighlight.scrollTop = codeOutputInner.scrollTop;
    codeHighlight.scrollLeft = codeOutputInner.scrollLeft;
  }

  function syncCodeHighlightScroll() {
    if (!codeHighlight || !codeOutputInner) return;
    codeHighlight.scrollTop = codeOutputInner.scrollTop;
    codeHighlight.scrollLeft = codeOutputInner.scrollLeft;
  }

  function scheduleCodeHighlightScrollSync() {
    if (codeScrollSyncFrame) return;
    codeScrollSyncFrame = window.requestAnimationFrame(() => {
      codeScrollSyncFrame = null;
      syncCodeHighlightScroll();
    });
  }

  function scrollActiveCodeFindHitIntoView() {
    if (!codeHighlight || !codeOutputInner) return;
    const activeHit = codeHighlight.querySelector(".code-find-hit-active");
    if (!activeHit) return;

    const containerRect = codeHighlight.getBoundingClientRect();
    const hitRect = activeHit.getBoundingClientRect();
    const topDelta = hitRect.top - containerRect.top;
    const targetTop = Math.max(0, codeHighlight.scrollTop + topDelta - codeHighlight.clientHeight * 0.35);

    codeHighlight.scrollTop = targetTop;
    codeOutputInner.scrollTop = targetTop;
    codeHighlight.scrollLeft = 0;
    codeOutputInner.scrollLeft = 0;
  }

  function getActiveOutputHtml() {
    return outputStore.isEdited ? outputStore.editedHtml : outputStore.generatedHtml;
  }

  function getCodePreviewMode() {
    return ["mobile", "dark"].includes(lastVisualPreviewMode) ? lastVisualPreviewMode : "desktop";
  }

  function setCodeEditing(isEditing) {
    isCodeEditing = !!isEditing;

    if (codeOutputInner) {
      codeOutputInner.readOnly = !isCodeEditing;
      codeOutputInner.classList.toggle("is-editing", isCodeEditing);
    }

    if (codeHighlight) {
      codeHighlight.classList.toggle("is-editing", isCodeEditing);
    }

    if (codeFindBar) {
      codeFindBar.hidden = !isCodeEditing;
    }

    if (!isCodeEditing) {
      closeCodeFind();
    }

    if (editCodeBtn) {
      editCodeBtn.classList.toggle("is-active", isCodeEditing);
    }
    if (editCodeBtnLabel) {
      editCodeBtnLabel.textContent = isCodeEditing ? "Done editing" : "Edit code";
    }
    if (editCodeBtnIcon) {
      editCodeBtnIcon.textContent = isCodeEditing ? "🔓" : "🔒";
    }
  }

  function updateCodeEditorUi() {
    if (codeEditStatus) {
      if (outputStore.isEdited) {
        codeEditStatus.textContent = "Preview reflects manual code edits.";
      } else if (isCodeEditing) {
        codeEditStatus.textContent = "Live preview updates after you stop typing.";
      } else {
        codeEditStatus.textContent = "Generated output. Click Edit code to make changes or search.";
      }
    }

    if (revertCodeBtn) {
      revertCodeBtn.hidden = !outputStore.isEdited;
    }

    if (!isCodeEditing && codeFindBar && !codeFindBar.hidden) {
      closeCodeFind();
    }

    syncCodeHighlight();
  }

  function renderCodePreview(html) {
    if (!codePreviewFrame) return;
    codePreviewFrame.srcdoc = buildPreviewDoc(html, getCodePreviewMode());
  }

  function updateCodeFindCount() {
    if (!codeFindCount) return;
    if (!codeFindMatches.length) {
      codeFindCount.textContent = "0 results";
      return;
    }
    codeFindCount.textContent = `${codeFindIndex + 1} of ${codeFindMatches.length}`;
  }

  function clearCodeFindSelection() {
    codeFindMatches = [];
    codeFindIndex = -1;
    codeFindQuery = "";
    applyCodeFindHighlights();
    updateCodeFindCount();
  }

  function applyCodeFindHighlights() {
    if (!codeHighlight) return;

    const existing = Array.from(codeHighlight.querySelectorAll(".code-find-hit, .code-find-hit-active"));
    existing.forEach(node => {
      const parent = node.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(node.textContent || ""), node);
      parent.normalize();
    });

    if (!codeFindQuery || !codeFindMatches.length) {
      return;
    }

    const query = codeFindQuery.toLowerCase();
    let remainingActiveIndex = codeFindIndex;
    const walker = document.createTreeWalker(codeHighlight, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let textNode;

    while ((textNode = walker.nextNode())) {
      if (textNode.nodeValue) {
        textNodes.push(textNode);
      }
    }

    textNodes.forEach(node => {
      const original = node.nodeValue || "";
      const lower = original.toLowerCase();
      let cursor = 0;
      let found = lower.indexOf(query, cursor);

      if (found === -1) return;

      const fragment = document.createDocumentFragment();

      while (found !== -1) {
        if (found > cursor) {
          fragment.appendChild(document.createTextNode(original.slice(cursor, found)));
        }

        const mark = document.createElement("mark");
        const isActive = remainingActiveIndex === 0;
        mark.className = isActive ? "code-find-hit-active" : "code-find-hit";
        mark.textContent = original.slice(found, found + codeFindQuery.length);
        fragment.appendChild(mark);

        if (remainingActiveIndex >= 0) {
          remainingActiveIndex -= 1;
        }

        cursor = found + codeFindQuery.length;
        found = lower.indexOf(query, cursor);
      }

      if (cursor < original.length) {
        fragment.appendChild(document.createTextNode(original.slice(cursor)));
      }

      node.parentNode?.replaceChild(fragment, node);
    });
  }

  function runCodeFind(query, direction = "next", options = {}) {
    if (!codeOutputInner) return;
    const source = codeOutputInner.value || "";
    const needle = String(query || "");
    codeFindQuery = needle;
    const moveEditorSelection = options.moveEditorSelection !== false;

    if (!needle) {
      clearCodeFindSelection();
      return;
    }

    const lowerSource = source.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    const matches = [];
    let startIndex = 0;

    while (startIndex < lowerSource.length) {
      const foundAt = lowerSource.indexOf(lowerNeedle, startIndex);
      if (foundAt === -1) break;
      matches.push({ start: foundAt, end: foundAt + needle.length });
      startIndex = foundAt + Math.max(needle.length, 1);
    }

    codeFindMatches = matches;

    if (!matches.length) {
      codeFindIndex = -1;
      applyCodeFindHighlights();
      updateCodeFindCount();
      return;
    }

    if (direction === "prev") {
      codeFindIndex = codeFindIndex <= 0 ? matches.length - 1 : codeFindIndex - 1;
    } else if (codeFindIndex < 0 || codeFindIndex >= matches.length - 1) {
      codeFindIndex = 0;
    } else {
      codeFindIndex += 1;
    }

    const match = matches[codeFindIndex];
    if (moveEditorSelection) {
      codeOutputInner.setSelectionRange(match.start, match.end);
      codeOutputInner.focus({ preventScroll: true });
    }
    applyCodeFindHighlights();
    if (moveEditorSelection) {
      scrollActiveCodeFindHitIntoView();
    } else {
      scheduleCodeHighlightScrollSync();
    }
    updateCodeFindCount();
  }

  function openCodeFind() {
    if (previewMode !== "code" || !isCodeEditing || !codeFindBar || !codeFindInput) return;
    codeFindInput.focus();
    codeFindInput.select();
    runCodeFind(codeFindInput.value, "next", { moveEditorSelection: false });
  }

  function closeCodeFind() {
    if (!codeFindBar) return;
    codeFindBar.hidden = true;
    clearCodeFindSelection();
  }

  function setViewMode(mode) {
    previewMode = mode;
    if (mode !== "code" && mode !== "compare") {
      lastVisualPreviewMode = mode;
    }
    previewFrame.classList.toggle("is-mobile", mode === "mobile");
    previewFrame.classList.toggle("is-dark", mode === "dark");
    sourcePreviewFrame?.classList.remove("is-mobile", "is-dark");
    compareGrid?.classList.toggle("is-compare", mode === "compare");

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.previewMode === mode);
    });

    if (mode === "code") {
      previewPane.classList.remove("active");
      codePane.classList.add("active");
      renderCodePreview(getActiveOutputHtml());
      updateCodeEditorUi();
    } else {
      codePane.classList.remove("active");
      previewPane.classList.add("active");
    }
  }

  function setBuilderMode(mode) {
    appEl.classList.add("is-cleaner");
    document.querySelectorAll(".cleaner-only").forEach(section => {
      section.hidden = false;
    });
    updateTemplateOptionsVisibility();
    updateActionButtons();
    updatePreview();
  }

  function setOutputMode(mode) {
    if (!isRestoringState && outputMode) {
      saveCleanupSettingsForMode(outputMode);
    }

    outputMode = mode;
    lastCleanerOutputMode = mode;

    applyCleanupSettingsForMode(mode);

    outputModeSwitch?.querySelectorAll(".switch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.outputMode === mode);
    });

    if (outputModeHint) {
      outputModeHint.textContent = mode === "full"
        ? "Adds your selected header and footer"
        : "Outputs only cleaned client HTML";
    }

    appEl.classList.toggle("is-fragment", mode === "fragment");
    updateCleanupOptionsAvailability();
    updateActionButtons();
    updateTemplateOptionsVisibility();
    updatePreview();
  }

  function renderActiveOutputHtml(activeHtml, options = {}) {
    const finalBytes = getHtmlSizeBytes(activeHtml);
    outputStore.html = activeHtml;
    updateActionButtons();
    renderEmailSize(finalBytes);
    renderAdIdStatus();

    if (!inputHtml.value.trim()) {
      renderStatus("info", "Using sample", outputMode === "full"
        ? "Showing a sample content block inside the selected brand template."
        : "Showing sample content so you can preview the cleanup output before pasting real HTML.");
    } else if (options.isEdited) {
      renderStatus("info", "Edited output", "Preview reflects manual code edits. Revert to return to generated output.");
    } else {
      renderStatus("ok", "Output ready", outputMode === "full"
        ? "Full branded email generated. Review the preview and QA checks, then copy or export."
        : "Cleaned code generated. Review the preview and QA checks, then copy or export.");
    }

    if (previewMode === "code") {
      renderCodePreview(activeHtml);
    } else if (previewMode === "compare") {
      previewFrame.srcdoc = buildPreviewDoc(activeHtml);
      if (sourcePreviewFrame) {
        sourcePreviewFrame.srcdoc = buildSourcePreviewDoc(inputHtml.value.trim());
      }
    } else {
      previewFrame.srcdoc = buildPreviewDoc(activeHtml);
    }

    schedulePreviewResize();

    const issues = runQA(activeHtml, inputHtml.value.trim());

    renderQA(issues);
  }

  function applyManualCodeEdits() {
    const editedHtml = codeOutputInner?.value || "";
    const generatedHtml = outputStore.generatedHtml || "";
    const hasEdits = editedHtml.trim() !== generatedHtml.trim();

    outputStore.editedHtml = editedHtml;
    outputStore.isEdited = hasEdits;
    updateCodeEditorUi();
    renderActiveOutputHtml(hasEdits ? editedHtml : generatedHtml, { isEdited: hasEdits });
  }

  function revertManualCodeEdits() {
    outputStore.editedHtml = "";
    outputStore.isEdited = false;
    if (codeEditDebounceId) {
      window.clearTimeout(codeEditDebounceId);
      codeEditDebounceId = null;
    }
    if (codeOutputInner) {
      codeOutputInner.value = prettyPrintHtml(outputStore.generatedHtml || "");
    }
    setCodeEditing(false);
    updateCodeEditorUi();
    renderActiveOutputHtml(outputStore.generatedHtml || "", { isEdited: false });
  }

  function updatePreview() {
    try {
      if (outputMode === "full" && !brandSelect.value) {
        outputStore.html = "";
        outputStore.generatedHtml = "";
        outputStore.editedHtml = "";
        outputStore.isEdited = false;
        updateCodeEditorUi();
        updateActionButtons();
        renderEmailSize(0);
        renderAdIdStatus();
        renderStatus("warn", "Action needed", "Choose a brand to build a full branded email.");

      if (previewMode === "code") {
        codeOutputInner.value = "Choose a brand to generate a full branded email.";
        syncCodeHighlight();
        renderCodePreview("");
      } else {
          previewFrame.srcdoc = `
            <html>
              <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
                <div style="min-height:280px;display:flex;align-items:center;justify-content:center;color:#667085;padding:40px;text-align:center;">
                  Choose a brand to generate a full branded email.
                </div>
              </body>
            </html>
          `;
        }

        renderQABaseline();

        return;
      }

      const finalHtml = getCurrentOutputHtml();
      outputStore.generatedHtml = finalHtml;
      outputStore.editedHtml = "";
      outputStore.isEdited = false;
      setCodeEditing(false);
      if (codeEditDebounceId) {
        window.clearTimeout(codeEditDebounceId);
        codeEditDebounceId = null;
      }
      if (codeOutputInner) {
        codeOutputInner.value = prettyPrintHtml(finalHtml);
      }
      updateCodeEditorUi();
      renderActiveOutputHtml(finalHtml, { isEdited: false });
    } catch (err) {
      console.error(err);
      renderEmailSize(0);
      renderStatus("warn", "Error", "The preview could not be generated. Review the error in the QA panel.");
      qaCount.textContent = "error";
      qaCount.className = "qa-pill high";
      qaReport.innerHTML = `
        <div class="qa-item warn">
          <div class="qa-title">Preview failed</div>
          <div class="qa-text">${err.message}</div>
        </div>
      `;
    }
  }

  async function copyOutput() {
    if (!outputStore.html) return;

    try {
      await navigator.clipboard.writeText(outputStore.html);
      if (copyBtnLabel) copyBtnLabel.textContent = "Copied!";
      setTimeout(() => {
        if (copyBtnLabel) copyBtnLabel.textContent = "Copy HTML";
      }, 900);
    } catch (err) {
      console.error(err);
    }
  }

  function downloadOutput() {
    if (!outputStore.html) return;

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = String(now.getFullYear());
    const filename = `${month}${day}${year}_cobrand${outputMode === "fragment" ? ".txt" : ".html"}`;
    const blob = new Blob([outputStore.html], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    inputHtml.value = "";
    brandSelect.value = brandPresets[DEFAULT_BRAND] ? DEFAULT_BRAND : "";
    if (adIdInput) adIdInput.value = "";
    if (stealthLinkInput) stealthLinkInput.value = "";
    if (toggleLiteralFullEmail) toggleLiteralFullEmail.checked = defaultCleanupOptions.literalFullEmail;
    outputStore.html = "";
    outputStore.generatedHtml = "";
    outputStore.editedHtml = "";
    outputStore.isEdited = false;
    setCodeEditing(false);
    codeOutputInner.value = "";
    if (codePreviewFrame) codePreviewFrame.srcdoc = "";
    if (copyBtnLabel) copyBtnLabel.textContent = "Copy HTML";
    updateCodeEditorUi();
    templateDrawerOpen = false;
    cleanupDrawerOpen = false;
    trackingDrawerOpen = false;
    qaDrawerOpen = false;
    setOutputMode("full");
    setViewMode("desktop");
    resetTemplateOptions();
    resetCleanupOptions();

    previewFrame.srcdoc = `
      <html>
        <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
          <div style="min-height:280px;display:flex;align-items:center;justify-content:center;color:#667085;padding:32px;text-align:center;">
            Paste HTML in the side panel to see it displayed here.
          </div>
        </body>
      </html>
    `;

    renderStatus("info", "Ready", "Paste client HTML to begin. You can also drop in an .html file.");
    renderAdIdStatus();
    renderQABaseline();

    updateActionButtons();
    updateTemplateOptionsVisibility();
  }

  function clearInputOnly() {
    inputHtml.value = "";
    outputStore.html = "";
    outputStore.generatedHtml = "";
    outputStore.editedHtml = "";
    outputStore.isEdited = false;
    setCodeEditing(false);
    codeOutputInner.value = "";
    if (codePreviewFrame) codePreviewFrame.srcdoc = "";
    updateCodeEditorUi();
    updatePreview();
    inputHtml.focus();
  }

  function loadFile(file) {
    if (!file) return;
    if (!(/\.html?$/i.test(file.name) || file.type === "text/html" || file.type === "text/plain")) return;

    const reader = new FileReader();
    reader.onload = event => {
      inputHtml.value = event.target.result;
      updatePreview();
    };
    reader.readAsText(file);
  }

  copyBtn.addEventListener("click", copyOutput);
  downloadBtn.addEventListener("click", downloadOutput);
  previewFrame.addEventListener("load", schedulePreviewResize);
  if (codePreviewFrame) {
    codePreviewFrame.addEventListener("load", schedulePreviewResize);
  }
  if (sourcePreviewFrame) {
    sourcePreviewFrame.addEventListener("load", schedulePreviewResize);
  }
  window.addEventListener("resize", schedulePreviewResize);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearAll();
      saveState();
    });
  }
  inputHtml.addEventListener("input", () => {
    updatePreview();
    saveState();
  });
  if (codeOutputInner) {
    codeOutputInner.addEventListener("input", () => {
      syncCodeHighlight();
      if (codeFindBar && !codeFindBar.hidden) {
        runCodeFind(codeFindInput?.value || "", "next", { moveEditorSelection: false });
      }
      if (codeEditDebounceId) {
        window.clearTimeout(codeEditDebounceId);
      }
      codeEditDebounceId = window.setTimeout(() => {
        applyManualCodeEdits();
      }, 400);
    });
    codeOutputInner.addEventListener("scroll", scheduleCodeHighlightScrollSync);
  }
  if (codeFindInput) {
    codeFindInput.addEventListener("input", () => {
      codeFindIndex = -1;
      runCodeFind(codeFindInput.value, "next", { moveEditorSelection: false });
    });
    codeFindInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        runCodeFind(codeFindInput.value, event.shiftKey ? "prev" : "next");
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeCodeFind();
        codeOutputInner?.focus({ preventScroll: true });
      }
    });
  }
  if (codeFindNextBtn) {
    codeFindNextBtn.addEventListener("click", () => {
      runCodeFind(codeFindInput?.value || "", "next");
    });
  }
  if (codeFindPrevBtn) {
    codeFindPrevBtn.addEventListener("click", () => {
      runCodeFind(codeFindInput?.value || "", "prev");
    });
  }
  if (editCodeBtn) {
    editCodeBtn.addEventListener("click", () => {
      const previousScrollTop = codeOutputInner?.scrollTop ?? 0;
      const previousScrollLeft = codeOutputInner?.scrollLeft ?? 0;
      setCodeEditing(!isCodeEditing);
      updateCodeEditorUi();
      if (isCodeEditing) {
        codeOutputInner?.focus({ preventScroll: true });
        if (codeOutputInner) {
          codeOutputInner.scrollTop = previousScrollTop;
          codeOutputInner.scrollLeft = previousScrollLeft;
        }
        syncCodeHighlightScroll();
      }
    });
  }
  if (revertCodeBtn) {
    revertCodeBtn.addEventListener("click", () => {
      revertManualCodeEdits();
    });
  }
  brandSelect.addEventListener("change", () => {
    updateTemplateOptionsVisibility();
    updatePreview();
    saveState();
  });

  cleanupToggleIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", () => {
        updatePreview();
        saveState();
      });
    }
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener("click", clearInputOnly);
  }

  if (toggleTemplateOptionsBtn) {
    toggleTemplateOptionsBtn.addEventListener("click", () => {
      setTemplateDrawerOpen(!templateDrawerOpen);
      saveState();
    });
  }

  if (closeTemplateBtn) {
    closeTemplateBtn.addEventListener("click", () => {
      setTemplateDrawerOpen(false);
      saveState();
    });
  }

  if (resetTemplateOptionsBtn) {
    resetTemplateOptionsBtn.addEventListener("click", resetTemplateOptions);
  }

  [headerOuterBgColor, headerBgColor, footerOuterBgColor, footerBgColor, toggleShowDividers].forEach(el => {
    if (el) {
      el.addEventListener("input", () => {
        if (el === toggleShowDividers) {
          lastCleanerShowDividers = toggleShowDividers.checked;
        }
        updateColorLabels();
        updatePreview();
        saveState();
      });
      el.addEventListener("change", () => {
        if (el === toggleShowDividers) {
          lastCleanerShowDividers = toggleShowDividers.checked;
        }
        updateColorLabels();
        updatePreview();
        saveState();
      });
    }
  });

  if (toggleMatchFooterColor) {
    toggleMatchFooterColor.addEventListener("change", () => {
      syncFooterColorState();
      updatePreview();
      saveState();
    });
  }

  [headerOuterBgColor, headerBgColor].forEach(el => {
    if (!el) return;
    el.addEventListener("input", () => {
      syncFooterColorState();
    });
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setViewMode(btn.dataset.previewMode);
      if (outputStore.isEdited) {
        renderActiveOutputHtml(getActiveOutputHtml(), { isEdited: true });
      } else {
        updatePreview();
      }
      saveState();
    });
  });

  outputModeSwitch?.querySelectorAll(".switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setOutputMode(btn.dataset.outputMode);
      saveState();
    });
  });

  ["dragenter", "dragover"].forEach(type => {
    dropWrap.addEventListener(type, e => {
      e.preventDefault();
      e.stopPropagation();
      dropWrap.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(type => {
    dropWrap.addEventListener(type, e => {
      e.preventDefault();
      e.stopPropagation();
      dropWrap.classList.remove("dragover");
    });
  });

  dropWrap.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    loadFile(file);
  });

  [adIdInput, stealthLinkInput].forEach(el => {
    if (el) {
      el.addEventListener("input", () => {
        updateStealthHelper();
        renderAdIdStatus();
        updatePreview();
        saveState();
      });
    }
  });

  if (toggleLiteralFullEmail) {
    toggleLiteralFullEmail.addEventListener("change", () => {
      updateCleanupOptionsAvailability();
      updatePreview();
      saveState();
    });
  }

  if (helpBtn && helpDialog) {
    helpBtn.addEventListener("click", () => {
      markHelpUpdatesSeen();
      helpDialog.showModal();
    });
  }

  if (closeHelpBtn && helpDialog) {
    closeHelpBtn.addEventListener("click", () => {
      helpDialog.close();
    });
  }

  if (helpDialog) {
    helpDialog.addEventListener("click", event => {
      const bounds = helpDialog.getBoundingClientRect();
      const clickedBackdrop =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (clickedBackdrop) {
        helpDialog.close();
      }
    });
  }

  if (cleanupSettingsBtn && cleanupDialog) {
    cleanupSettingsBtn.addEventListener("click", () => {
      setCleanupDrawerOpen(!cleanupDrawerOpen);
    });
  }

  if (closeCleanupBtn && cleanupDialog) {
    closeCleanupBtn.addEventListener("click", () => {
      setCleanupDrawerOpen(false);
    });
  }

  if (trackingToolBtn && trackingDialog) {
    trackingToolBtn.addEventListener("click", () => {
      setTrackingDrawerOpen(!trackingDrawerOpen);
    });
  }

  if (closeTrackingBtn && trackingDialog) {
    closeTrackingBtn.addEventListener("click", () => {
      setTrackingDrawerOpen(false);
    });
  }

  if (qaToolBtn && qaDialog) {
    qaToolBtn.addEventListener("click", () => {
      setQaDrawerOpen(!qaDrawerOpen);
    });
  }

  if (closeQaBtn && qaDialog) {
    closeQaBtn.addEventListener("click", () => {
      setQaDrawerOpen(false);
    });
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest(".info-tip-trigger");
    if (!trigger) {
      if (!event.target.closest(".floating-tooltip")) {
        closeInfoTips();
      }
      return;
    }

    const isSame = activeTooltipTrigger === trigger && floatingTooltip?.classList.contains("is-visible");
    if (isSame) {
      closeInfoTips();
    } else {
      showFloatingTooltip(trigger);
    }
  });

  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f" && previewMode === "code" && isCodeEditing) {
      event.preventDefault();
      openCodeFind();
      return;
    }
    if (event.key === "Escape") {
      closeInfoTips();
      if (previewMode === "code" && codeFindBar && !codeFindBar.hidden) {
        closeCodeFind();
      }
    }
  });

  document.addEventListener("mouseover", event => {
    const trigger = event.target.closest(".info-tip-trigger");
    if (trigger) {
      showFloatingTooltip(trigger);
    }
  });

  document.addEventListener("mouseout", event => {
    const trigger = event.target.closest(".info-tip-trigger");
    if (!trigger) return;
    const related = event.relatedTarget;
    if (related && (trigger.contains(related) || related.closest?.(".floating-tooltip"))) return;
    if (activeTooltipTrigger === trigger) {
      hideFloatingTooltip();
    }
  });

  document.addEventListener("focusin", event => {
    const trigger = event.target.closest(".info-tip-trigger");
    if (trigger) {
      showFloatingTooltip(trigger);
    }
  });

  document.addEventListener("focusout", event => {
    const trigger = event.target.closest(".info-tip-trigger");
    if (!trigger) return;
    if (activeTooltipTrigger === trigger) {
      hideFloatingTooltip();
    }
  });

  window.addEventListener("scroll", () => {
    if (activeTooltipTrigger) {
      showFloatingTooltip(activeTooltipTrigger);
    }
  }, true);

  populateBrandOptions();
  const restoredState = restoreState();
  updateHelpBadge();
  if (!restoredState) {
    clearAll();
    setBuilderMode("cleaner");
    setOutputMode("full");
    setViewMode("desktop");
    saveState();
  } else {
    updatePreview();
  }
  updateCleanupOptionsAvailability();
  setCleanupDrawerOpen(false);
  setTemplateDrawerOpen(false);
  setTrackingDrawerOpen(false);
  setQaDrawerOpen(false);
  updateColorLabels();
  syncFooterColorState();
  updateStealthHelper();
});
