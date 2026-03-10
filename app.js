import { brands, brandPresets } from "./brands/index.js";

window.addEventListener("DOMContentLoaded", () => {
  const sampleClientHtml = `
<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
  <tbody>
    <tr>
      <td align="center" style="padding:40px 20px;background:#ffffff;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" role="presentation" style="width:100%;max-width:600px;">
          <tbody>
            <tr>
              <td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:28px;line-height:1.2;color:#111827;font-weight:700;padding:0 0 16px;">
                Client HTML goes here
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4b5563;padding:0;">
                This sample shows the brand header and footer wrapped around a neutral client content block.
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
  const statusPill = document.getElementById("statusPill");
  const statusMessage = document.getElementById("statusMessage");
  const brandSelect = document.getElementById("brandSelect");
  const brandHelperText = document.getElementById("brandHelperText");
  const toggleTemplateOptionsBtn = document.getElementById("toggleTemplateOptionsBtn");
  const templateControls = document.getElementById("templateControls");
  const resetTemplateOptionsBtn = document.getElementById("resetTemplateOptionsBtn");
  const headerBgColor = document.getElementById("headerBgColor");
  const footerBgColor = document.getElementById("footerBgColor");
  const headerBgValue = document.getElementById("headerBgValue");
  const footerBgValue = document.getElementById("footerBgValue");
  const toggleMatchFooterColor = document.getElementById("toggleMatchFooterColor");
  const toggleShowDividers = document.getElementById("toggleShowDividers");
  const adIdInput = document.getElementById("adIdInput");
  const stealthLinkInput = document.getElementById("stealthLinkInput");
  const stealthHelperText = document.getElementById("stealthHelperText");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtnLabel = copyBtn.querySelector(".btn-label");
  const previewPane = document.getElementById("previewPane");
  const codePane = document.getElementById("codePane");
  const codeOutputInner = document.getElementById("codeOutputInner");
  const dropWrap = document.getElementById("dropWrap");
  const clearInputBtn = document.getElementById("clearInputBtn");

  const outputStore = { html: "" };
  let previewMode = "desktop";
  let outputMode = "fragment";
  let templateOptionsOpen = false;
  const defaultTemplateOptions = {
    headerBg: "#ffffff",
    footerBg: "#ffffff",
    matchFooterColor: false,
    showDividers: true
  };

  function populateBrandOptions() {
    const currentValue = brandSelect.value;

    brandSelect.innerHTML = '<option value="">Choose a brand…</option>';
    brands.forEach(brand => {
      const option = document.createElement("option");
      option.value = brand.id;
      option.textContent = brand.name;
      brandSelect.appendChild(option);
    });

    if (brandPresets[currentValue]) {
      brandSelect.value = currentValue;
    }
  }

  function formatHex(value) {
    return (value || "#ffffff").toUpperCase();
  }

  function updateColorLabels() {
    if (headerBgValue && headerBgColor) headerBgValue.textContent = formatHex(headerBgColor.value);
    if (footerBgValue && footerBgColor) footerBgValue.textContent = formatHex(footerBgColor.value);
  }

  function syncFooterColorState() {
    if (!footerBgColor) return;

    const shouldMatch = !!toggleMatchFooterColor?.checked;
    if (shouldMatch && headerBgColor) {
      footerBgColor.value = headerBgColor.value;
    }

    footerBgColor.disabled = shouldMatch;
    footerBgColor.closest(".field-card")?.classList.toggle("is-disabled", shouldMatch);
    updateColorLabels();
  }

  function resetTemplateOptions() {
    if (headerBgColor) headerBgColor.value = defaultTemplateOptions.headerBg;
    if (footerBgColor) footerBgColor.value = defaultTemplateOptions.footerBg;
    if (toggleMatchFooterColor) toggleMatchFooterColor.checked = defaultTemplateOptions.matchFooterColor;
    if (toggleShowDividers) toggleShowDividers.checked = defaultTemplateOptions.showDividers;
    syncFooterColorState();
    updatePreview();
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

  function extractPreservableHeadMarkup(headHtml) {
    const source = headHtml || "";
    const preserved = [];

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

  function removeClientPreheader(html) {
    let s = html || "";
    s = s.replace(/<span\b[^>]*style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "");
    s = s.replace(/<div\b[^>]*style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
    return s.trim();
  }

  function stripKnownBrandWrappers(html) {
    return Object.values(brandPresets).reduce((current, brand) => {
      if (typeof brand.stripWrappedTemplate === "function") {
        return brand.stripWrappedTemplate(current);
      }
      return current;
    }, html || "");
  }

  function getEffectiveStealthLink() {
    const manualValue = stealthLinkInput?.value.trim() || "";
    if (manualValue) return manualValue;

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

    if (brand?.stealthLink) {
      stealthHelperText.textContent = `Default stealth link ready for ${brand.name}. Leave the field blank to use it automatically.`;
      return;
    }

    stealthHelperText.textContent = "No default stealth link is available for the current selection.";
  }

  function buildTrackingMarkup() {
    const adId = (adIdInput?.value || "").trim();
    const stealthLink = getEffectiveStealthLink();
    const blocks = [];

    if (adId) {
      blocks.push(`<p>\n  <!-- // ADD ID -->\n  <input value="${adId.replace(/"/g, "&quot;")}" name="advertiserid" type="hidden">\n  <!-- // ADD ID -->\n</p>`);
    }

    if (stealthLink) {
      const safeLink = stealthLink.replace(/"/g, "&quot;");
      blocks.push(`<div style="display:none;">\n  <a href="${safeLink}" style="display:none;visibility:hidden;"></a>\n</div>`);
    }

    return blocks.join("\n");
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
    if (statusPill) {
      statusPill.textContent = pillText;
      statusPill.className = `status-pill ${level}`;
    }

    if (statusMessage) {
      statusMessage.textContent = message;
      statusMessage.className = `status-card ${level}`;
    }
  }

  function updateTemplateOptionsVisibility() {
    const canEditTemplate = outputMode === "full" && !!brandSelect.value;

    if (!canEditTemplate) {
      templateOptionsOpen = false;
    }

    if (toggleTemplateOptionsBtn) {
      toggleTemplateOptionsBtn.hidden = !canEditTemplate;
      toggleTemplateOptionsBtn.setAttribute("aria-expanded", String(templateOptionsOpen && canEditTemplate));
      toggleTemplateOptionsBtn.classList.toggle("is-open", templateOptionsOpen && canEditTemplate);
      const label = toggleTemplateOptionsBtn.querySelector(".btn-label");
      if (label) {
        label.textContent = templateOptionsOpen && canEditTemplate ? "Hide template options" : "Edit template options";
      }
    }

    if (templateControls) {
      templateControls.hidden = !(canEditTemplate && templateOptionsOpen);
    }

    if (brandHelperText) {
      brandHelperText.textContent = outputMode === "full"
        ? "Required for full branded email. Pick the brand whose header and footer should wrap the client content."
        : "Optional in code-only mode. Choose a brand only if you want to switch to full branded email.";
    }

    updateStealthHelper();
  }

  function getProcessedClientContent() {
    let client = inputHtml.value.trim();
    const keepStyles = document.getElementById("toggleKeepStyles")?.checked;
    const removeScriptsEnabled = document.getElementById("toggleRemoveScripts")?.checked;

    if (!client) {
      client = sampleClientHtml.trim();
    }

    client = stripKnownBrandWrappers(client);

    const sourceHead = extractHeadHtml(client);
    const sourceBodyAttrs = extractBodyOpenTag(client);

    if (document.getElementById("toggleRemoveTitle")?.checked) {
      client = removeTitleTag(client);
    }

    if (removeScriptsEnabled) {
      client = removeScripts(client);
    }

    let preservedHeadMarkup = "";
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

    if (document.getElementById("toggleRemovePreview")?.checked) {
      client = removeClientPreheader(client);
    }

    return {
      clientHtml: client.trim(),
      preservedHeadMarkup,
      bodyAttributes: buildMergedBodyAttributes(sourceBodyAttrs)
    };
  }

  function buildFullEmailHtml() {
    const brandKey = brandSelect.value;
    const brand = brandPresets[brandKey];
    const { clientHtml, preservedHeadMarkup, bodyAttributes } = getProcessedClientContent();

    if (!brand) {
      return "";
    }

    const headMarkup = preservedHeadMarkup ? `${preservedHeadMarkup}\n` : "\n";
    const preserveLightSurfaceBrands = new Set(["thinkadvisor", "hrexecutive", "districtadministration", "universitybusiness"]);
    const preserveDefaultSurface =
      preserveLightSurfaceBrands.has(brand.id) &&
      (headerBgColor?.value || "#ffffff").toLowerCase() === "#ffffff" &&
      (((toggleMatchFooterColor?.checked ? headerBgColor?.value : footerBgColor?.value) || "#ffffff").toLowerCase() === "#ffffff");
    const brandOptions = {
      headerBg: headerBgColor?.value || "#ffffff",
      footerBg: (toggleMatchFooterColor?.checked ? headerBgColor?.value : footerBgColor?.value) || "#ffffff",
      showDividers: toggleShowDividers?.checked !== false,
      headerDarkAttr: preserveDefaultSurface ? 'data-cobrand-preserve-light="header"' : "",
      footerDarkAttr: preserveDefaultSurface ? 'data-cobrand-preserve-light="footer"' : ""
    };
    const brandHeader = typeof brand.renderHeader === "function" ? brand.renderHeader(brandOptions) : brand.header;
    const brandFooter = typeof brand.renderFooter === "function" ? brand.renderFooter(brandOptions) : brand.footer;
    const trackingMarkup = buildTrackingMarkup();
    const contentMarkup = trackingMarkup ? `${trackingMarkup}\n${clientHtml}` : clientHtml;

    return `<!DOCTYPE html>
<html lang="en">
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
    const { clientHtml, preservedHeadMarkup } = getProcessedClientContent();
    const trackingMarkup = buildTrackingMarkup();
    const contentMarkup = trackingMarkup ? `${trackingMarkup}\n${clientHtml}` : clientHtml;
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

  function buildPreviewDoc(finalHtml) {
    const isDark = previewMode === "dark";
    const isMobile = previewMode === "mobile";

    let previewHead = "";
    let previewContent = finalHtml;

    if (outputMode === "full") {
      if (!isDark) {
        return finalHtml;
      }

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
    const shellStyle = isMobile ? "max-width:420px;margin:0 auto;" : "width:100%;margin:0 auto;";

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
    background:${isDark ? "#0b1220" : "#eef2f7"};
  }
  body{
    font-family:Arial,Helvetica,sans-serif;
  }
  .stage{
    padding:20px;
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

  function runQA(finalHtml, rawClient) {
    const issues = [];
    const finalBytes = new TextEncoder().encode(finalHtml || "").length;

    const imgTags = finalHtml.match(/<img\b[^>]*>/gi) || [];
    let missingAlt = 0;
    imgTags.forEach(tag => {
      if (!/\balt\s*=/i.test(tag)) missingAlt++;
    });

    if (missingAlt) {
      issues.push({
        level: "warn",
        title: `${missingAlt} image(s) missing alt text`,
        text: "Add descriptive alt attributes to all image tags for accessibility and deliverability."
      });
    }

    const externalCss = rawClient.match(/<link\b[^>]*stylesheet[^>]*>/gi) || [];
    if (externalCss.length) {
      issues.push({
        level: "warn",
        title: "External stylesheet linked",
        text: "Most email clients ignore external CSS. Use inline styles instead."
      });
    }

    const scriptTags = rawClient.match(/<script\b/gi) || [];
    if (scriptTags.length) {
      issues.push({
        level: "warn",
        title: "Script tags detected",
        text: "Scripts are not supported in email and should be removed."
      });
    }

    const forms = rawClient.match(/<form\b/gi) || [];
    if (forms.length) {
      issues.push({
        level: "warn",
        title: "Form markup detected",
        text: "Forms usually do not work in email clients."
      });
    }

    const videos = rawClient.match(/<video\b/gi) || [];
    if (videos.length) {
      issues.push({
        level: "warn",
        title: "Video markup detected",
        text: "Embedded video is unsupported in many email clients, especially Outlook."
      });
    }

    const outlookChecks = [
      { pattern: /display\s*:\s*flex/gi, label: "display:flex" },
      { pattern: /display\s*:\s*grid/gi, label: "display:grid" },
      { pattern: /position\s*:\s*fixed/gi, label: "position:fixed" },
      { pattern: /position\s*:\s*sticky/gi, label: "position:sticky" }
    ];

    const outlookUnsafe = outlookChecks
      .filter(check => check.pattern.test(finalHtml))
      .map(check => check.label);

    if (outlookUnsafe.length) {
      issues.push({
        level: "warn",
        title: "Potential Outlook compatibility issues",
        text: `Found ${outlookUnsafe.join(", ")}. Desktop Outlook may ignore or break these styles.`
      });
    }

    if (finalBytes >= 102 * 1024) {
      issues.push({
        level: "warn",
        title: "Email is very large",
        text: `This email is about ${Math.round(finalBytes / 1024)} KB. Gmail may clip messages once they get close to 102 KB.`
      });
    } else if (finalBytes >= 90 * 1024) {
      issues.push({
        level: "warn",
        title: "Email size is getting high",
        text: `This email is about ${Math.round(finalBytes / 1024)} KB. It may be worth trimming before send.`
      });
    }

    if (!issues.length) {
      issues.push({
        level: "ok",
        title: "No major issues detected",
        text: "Basic checks look good."
      });
    }

    return issues;
  }

  function renderQA(issues) {
    const warnCount = issues.filter(i => i.level === "warn").length;
    qaCount.textContent = warnCount ? `${warnCount} warning${warnCount === 1 ? "" : "s"}` : "0 issues";
    qaCount.className = `qa-pill ${warnCount ? "high" : "ok"}`;

    qaReport.innerHTML = issues.map(item => `
      <div class="qa-item ${item.level}">
        <div class="qa-title">${item.title}</div>
        <div class="qa-text">${item.text}</div>
      </div>
    `).join("");
  }

  function renderQABaseline() {
    qaCount.textContent = "0 issues";
    qaCount.className = "qa-pill ok";
    qaReport.innerHTML = `
      <div class="qa-item ok">
        <div class="qa-title">Checks will appear here</div>
        <div class="qa-text">Once output is generated, this panel will flag email compatibility and size issues.</div>
      </div>
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

  function setViewMode(mode) {
    previewMode = mode;
    previewFrame.classList.toggle("is-mobile", mode === "mobile");
    previewFrame.classList.toggle("is-dark", mode === "dark");

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.previewMode === mode);
    });

    if (mode === "code") {
      previewPane.classList.remove("active");
      codePane.classList.add("active");
    } else {
      codePane.classList.remove("active");
      previewPane.classList.add("active");
    }
  }

  function setOutputMode(mode) {
    outputMode = mode;

    document.querySelectorAll(".switch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.outputMode === mode);
    });

    appEl.classList.toggle("is-fragment", mode === "fragment");
    updateActionButtons();
    updateTemplateOptionsVisibility();
    updatePreview();
  }

  function updatePreview() {
    try {
      if (outputMode === "full" && !brandSelect.value) {
        outputStore.html = "";
        updateActionButtons();
        renderStatus("warn", "Action needed", "Choose a brand to build a full branded email.");

        if (previewMode === "code") {
          codeOutputInner.value = "Choose a brand to generate a full branded email.";
        } else {
          previewFrame.srcdoc = `
            <html>
              <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
                <div style="height:100vh;display:flex;align-items:center;justify-content:center;color:#667085;padding:40px;text-align:center;">
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
      outputStore.html = finalHtml;
      updateActionButtons();

      if (!inputHtml.value.trim()) {
        renderStatus("info", "Using sample", outputMode === "full"
          ? "Showing a sample content block inside the selected brand template."
          : "Showing sample content so you can preview the cleanup output before pasting real HTML.");
      } else {
        renderStatus("ok", "Output ready", outputMode === "full"
          ? "Full branded email generated. Review the preview and QA checks, then copy or download."
          : "Cleaned code generated. Review the preview and QA checks, then copy or download.");
      }

      if (previewMode === "code") {
        const pretty = prettyPrintHtml(finalHtml);
        codeOutputInner.value = pretty;
      } else {
        previewFrame.srcdoc = buildPreviewDoc(finalHtml);
      }

      const issues = runQA(finalHtml, inputHtml.value.trim());

      if (outputMode === "fragment") {
        const styleBlocks = (finalHtml.match(/<style\b[\s\S]*?<\/style>/gi) || []).length;
        if (styleBlocks) {
          issues.unshift({
            level: "ok",
            title: `${styleBlocks} style block(s) kept`,
            text: "Style blocks were preserved to protect responsiveness and email layout."
          });
        }
      }

      renderQA(issues);
    } catch (err) {
      console.error(err);
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

    const filename = outputMode === "fragment" ? "clean-fragment.txt" : "cobrand-email.html";
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
    brandSelect.value = "";
    if (adIdInput) adIdInput.value = "";
    if (stealthLinkInput) stealthLinkInput.value = "";
    outputStore.html = "";
    codeOutputInner.value = "";
    if (copyBtnLabel) copyBtnLabel.textContent = "Copy HTML";
    templateOptionsOpen = false;

    previewFrame.srcdoc = `
      <html>
        <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
          <div style="height:100vh;display:flex;align-items:center;justify-content:center;color:#667085;">
            Paste email HTML on the left to see a preview here.
          </div>
        </body>
      </html>
    `;

    renderStatus("info", "Ready", "Paste client HTML to begin. You can also drop in an .html file.");
    renderQABaseline();

    updateActionButtons();
    updateTemplateOptionsVisibility();
  }

  function clearInputOnly() {
    inputHtml.value = "";
    outputStore.html = "";
    codeOutputInner.value = "";
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
  inputHtml.addEventListener("input", updatePreview);
  brandSelect.addEventListener("change", () => {
    updateTemplateOptionsVisibility();
    updatePreview();
  });

  ["toggleKeepStyles", "toggleRemovePreview", "toggleRemoveTitle", "toggleRemoveScripts"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updatePreview);
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener("click", clearInputOnly);
  }

  if (toggleTemplateOptionsBtn) {
    toggleTemplateOptionsBtn.addEventListener("click", () => {
      templateOptionsOpen = !templateOptionsOpen;
      updateTemplateOptionsVisibility();
    });
  }

  if (resetTemplateOptionsBtn) {
    resetTemplateOptionsBtn.addEventListener("click", resetTemplateOptions);
  }

  [headerBgColor, footerBgColor, toggleShowDividers].forEach(el => {
    if (el) {
      el.addEventListener("input", () => {
        updateColorLabels();
        updatePreview();
      });
      el.addEventListener("change", () => {
        updateColorLabels();
        updatePreview();
      });
    }
  });

  if (toggleMatchFooterColor) {
    toggleMatchFooterColor.addEventListener("change", () => {
      syncFooterColorState();
      updatePreview();
    });
  }

  if (headerBgColor) {
    headerBgColor.addEventListener("input", () => {
      syncFooterColorState();
    });
  }

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setViewMode(btn.dataset.previewMode);
      updatePreview();
    });
  });

  document.querySelectorAll(".switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setOutputMode(btn.dataset.outputMode);
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
        updatePreview();
      });
    }
  });

  populateBrandOptions();
  clearAll();
  updateColorLabels();
  syncFooterColorState();
  updateStealthHelper();
  setOutputMode("fragment");
  setViewMode("desktop");
});
