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
  const builderModeSwitch = document.getElementById("builderModeSwitch");
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
  const outputModeSwitch = document.getElementById("outputModeSwitch");
  const dropWrap = document.getElementById("dropWrap");
  const clearInputBtn = document.getElementById("clearInputBtn");
  const fetchWebcastBtn = document.getElementById("fetchWebcastBtn");
  const webcastUrlInput = document.getElementById("webcastUrlInput");
  const webcastJsonInput = document.getElementById("webcastJsonInput");
  const webcastEventType = document.getElementById("webcastEventType");
  const webcastHeadline = document.getElementById("webcastHeadline");
  const webcastDate = document.getElementById("webcastDate");
  const webcastTime = document.getElementById("webcastTime");
  const webcastDuration = document.getElementById("webcastDuration");
  const webcastBody = document.getElementById("webcastBody");
  const webcastSponsorLogo = document.getElementById("webcastSponsorLogo");
  const webcastSpeakerImage = document.getElementById("webcastSpeakerImage");
  const webcastSpeakerName = document.getElementById("webcastSpeakerName");
  const webcastSpeakerRole = document.getElementById("webcastSpeakerRole");
  const webcastCtaUrl = document.getElementById("webcastCtaUrl");
  const webcastCtaLabel = document.getElementById("webcastCtaLabel");

  const STORAGE_KEY = "email-assembly-studio-state-v1";
  const outputStore = { html: "" };
  let builderMode = "cleaner";
  let previewMode = "desktop";
  let outputMode = "fragment";
  let lastCleanerOutputMode = "fragment";
  let lastCleanerShowDividers = true;
  let webcastSpeakers = [];
  let isRestoringState = false;
  let templateOptionsOpen = false;
  const defaultTemplateOptions = {
    headerBg: "#ffffff",
    footerBg: "#ffffff",
    matchFooterColor: false,
    showDividers: true
  };

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
    if (toggleShowDividers) toggleShowDividers.checked = builderMode === "webcast" ? false : defaultTemplateOptions.showDividers;
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
    const adId = builderMode === "webcast" ? "" : (adIdInput?.value || "").trim();
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

  function normalizeOn24Url(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `https://event.on24.com${url}`;
    return url;
  }

  function normalizeOn24HtmlAssets(html) {
    return String(html || "").replace(
      /\b(src|href)=["'](\/[^"']*)["']/gi,
      (_, attr, value) => `${attr}="${normalizeOn24Url(value)}"`
    );
  }

  function extractOn24Identifiers(url) {
    const match = (url || "").match(/\/wcc\/r\/(\d+)\/([A-Z0-9]+)/i);
    return match ? { eventId: match[1], key: match[2] } : null;
  }

  function formatDurationLabel(minutesValue) {
    const minutes = Number(minutesValue || 0);
    if (!minutes) return "";
    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    return `${minutes} minutes`;
  }

  function extractFirstImageFromHtml(html) {
    const match = (html || "").match(/<img\b[^>]*src=["']([^"']+)["']/i);
    return match ? normalizeOn24Url(match[1]) : "";
  }

  function extractSponsorSection(html) {
    const source = String(html || "").trim();
    if (!source) {
      return { bodyHtml: "", sponsorLogo: "" };
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = source;

    const sponsorMarkers = Array.from(wrapper.querySelectorAll("*")).filter(node =>
      /(this event is sponsored by|sponsored by\s*:?\s*$)/i.test((node.textContent || "").trim())
    );
    let sponsorLogo = "";

    function findRemovalRoot(node) {
      return node.closest("table, tr, td, section, article, div, p, h1, h2, h3, h4, h5, h6, li") || node;
    }

    function isImageOnlyBlock(node) {
      if (!node) return false;
      const text = (node.textContent || "").replace(/\s+/g, "").trim();
      return !!node.querySelector("img") && !text;
    }

    sponsorMarkers.forEach(marker => {
      let root = findRemovalRoot(marker);
      if (!sponsorLogo) {
        sponsorLogo = extractFirstImageFromHtml(root.outerHTML);
      }

      let sibling = root.nextElementSibling;
      let checkedSiblings = 0;
      while (sibling && checkedSiblings < 2) {
        const nextSibling = sibling.nextElementSibling;
        if (!sponsorLogo) {
          sponsorLogo = extractFirstImageFromHtml(sibling.outerHTML);
        }
        if (isImageOnlyBlock(sibling) || /sponsor/i.test(sibling.className || "")) {
          sibling.remove();
        }
        sibling = nextSibling;
        checkedSiblings += 1;
      }

      root.remove();
    });

    Array.from(wrapper.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6, td")).forEach(node => {
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (/^(this event is sponsored by|sponsored by):?$/i.test(text)) {
        node.remove();
      }
    });

    Array.from(wrapper.querySelectorAll("div, table, tr, td, p")).forEach(node => {
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      const hasImage = !!node.querySelector("img");
      if (!hasImage) return;

      const looksLikeSponsorCard =
        /^(sponsored by|this event is sponsored by):?$/i.test(text) ||
        (/sponsored by/i.test(text) && text.length < 40);

      if (!looksLikeSponsorCard) return;

      if (!sponsorLogo) {
        sponsorLogo = extractFirstImageFromHtml(node.outerHTML);
      }

      node.remove();
    });

    Array.from(wrapper.querySelectorAll("img")).forEach(img => {
      if (!sponsorLogo) return;
      const src = normalizeOn24Url(img.getAttribute("src") || "");
      if (src === sponsorLogo && !img.closest("[data-webcast-sponsor]")) {
        const parentBlock = img.closest("p, div, td, table");
        if (parentBlock && isImageOnlyBlock(parentBlock)) {
          parentBlock.remove();
        }
      }
    });

    const bodyHtml = wrapper.innerHTML
      .replace(/<(p|div|td|tr|table)\b[^>]*>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/\1>/gi, "")
      .trim();

    return { bodyHtml, sponsorLogo };
  }

  function parseOn24EventPayload(payload) {
    const event = payload?.event;
    const session = event?.session || {};
    const durationValue = event?.extendedeventinfo?.eventinfo?.sessionLengthMinutes?.value || "";
    const normalizedBodyHtml = normalizeOn24HtmlAssets(session.eventAbstract || "");
    const sponsorSection = extractSponsorSection(normalizedBodyHtml);
    const speakers = Array.isArray(session.speakers)
      ? session.speakers.map(speaker => ({
          name: speaker?.name || "",
          role: [speaker?.title, speaker?.company].filter(Boolean).join(", "),
          image: normalizeOn24Url(speaker?.photo || "")
        })).filter(speaker => speaker.name || speaker.role || speaker.image)
      : [];
    const firstSpeaker = speakers[0] || {};

    return {
      eventType: event?.custom2 || "Webinar",
      headline: event?.description || "",
      date: event?.localizedeventdate || "",
      time: event?.localizedeventtime || "",
      duration: formatDurationLabel(durationValue),
      bodyHtml: sponsorSection.bodyHtml,
      sponsorLogo: sponsorSection.sponsorLogo || extractFirstImageFromHtml(normalizedBodyHtml),
      speakers,
      speakerImage: firstSpeaker.image || "",
      speakerName: firstSpeaker.name || "",
      speakerRole: firstSpeaker.role || "",
      ctaUrl: webcastUrlInput?.value.trim() || event?.registrationurl || ""
    };
  }

  function populateWebcastFields(data = {}) {
    webcastSpeakers = Array.isArray(data.speakers) ? data.speakers : [];
    if (webcastEventType) webcastEventType.value = data.eventType || webcastEventType.value || "Webinar";
    if (webcastHeadline) webcastHeadline.value = data.headline || "";
    if (webcastDate) webcastDate.value = data.date || "";
    if (webcastTime) webcastTime.value = data.time || "";
    if (webcastDuration) webcastDuration.value = data.duration || "";
    if (webcastBody) webcastBody.value = data.bodyHtml || "";
    if (webcastSponsorLogo) webcastSponsorLogo.value = data.sponsorLogo || "";
    if (webcastSpeakerImage) webcastSpeakerImage.value = data.speakerImage || "";
    if (webcastSpeakerName) webcastSpeakerName.value = data.speakerName || "";
    if (webcastSpeakerRole) webcastSpeakerRole.value = data.speakerRole || "";
    if (webcastCtaUrl) webcastCtaUrl.value = data.ctaUrl || webcastUrlInput?.value.trim() || "";
    if (webcastCtaLabel && !webcastCtaLabel.value) webcastCtaLabel.value = "Register now";
  }

  function getWebcastFields() {
    const fallbackSpeaker = {
      image: webcastSpeakerImage?.value.trim() || "",
      name: webcastSpeakerName?.value.trim() || "",
      role: webcastSpeakerRole?.value.trim() || ""
    };
    const speakers = webcastSpeakers.length
      ? webcastSpeakers.filter(speaker => speaker?.name || speaker?.role || speaker?.image)
      : ((fallbackSpeaker.name || fallbackSpeaker.role || fallbackSpeaker.image) ? [fallbackSpeaker] : []);

    return {
      eventType: webcastEventType?.value.trim() || "Webinar",
      headline: webcastHeadline?.value.trim() || "",
      date: webcastDate?.value.trim() || "",
      time: webcastTime?.value.trim() || "",
      duration: webcastDuration?.value.trim() || "",
      bodyHtml: webcastBody?.value.trim() || "",
      sponsorLogo: webcastSponsorLogo?.value.trim() || "",
      speakers,
      speakerImage: fallbackSpeaker.image,
      speakerName: fallbackSpeaker.name,
      speakerRole: fallbackSpeaker.role,
      ctaUrl: webcastCtaUrl?.value.trim() || "",
      ctaLabel: webcastCtaLabel?.value.trim() || "Register now"
    };
  }

  function getWebcastTheme(brandKey) {
    if (brandKey === "hrexecutive") {
      return {
        accent: "#8b2436",
        accentDark: "#6f1c2b",
        buttonAccent: "#c33652",
        buttonAccentDark: "#a92d46",
        labelBackground: "#fdf0f2",
        labelText: "#8b2436",
        metaBackground: "#f7f7f8",
        metaText: "#374151",
        takeawayBackground: "#f7eaed",
        takeawayBorder: "#ebc6cf",
        takeawayText: "#6e2030",
        cardShadow: "0 1px 3px rgba(0,0,0,0.08),0 8px 30px rgba(139,36,54,0.06)"
      };
    }

    if (brandKey === "districtadministration") {
      return {
        accent: "#1f4f8c",
        accentDark: "#16385f",
        buttonAccent: "#1f4f8c",
        buttonAccentDark: "#16385f",
        labelBackground: "#edf4fb",
        labelText: "#1f4f8c",
        metaBackground: "#f7f8fb",
        metaText: "#374151",
        takeawayBackground: "#eef4fb",
        takeawayBorder: "#d4e2f5",
        takeawayText: "#123f73",
        cardShadow: "0 1px 3px rgba(0,0,0,0.08),0 8px 30px rgba(31,79,140,0.05)"
      };
    }

    if (brandKey === "universitybusiness") {
      return {
        accent: "#234a86",
        accentDark: "#17325b",
        buttonAccent: "#234a86",
        buttonAccentDark: "#17325b",
        labelBackground: "#edf4fb",
        labelText: "#234a86",
        metaBackground: "#f7f8fb",
        metaText: "#374151",
        takeawayBackground: "#eef4fb",
        takeawayBorder: "#d4e2f5",
        takeawayText: "#123f73",
        cardShadow: "0 1px 3px rgba(0,0,0,0.08),0 8px 30px rgba(35,74,134,0.05)"
      };
    }

    return {
      accent: "#5b53c9",
      accentDark: "#4b44af",
      buttonAccent: "#5b53c9",
      buttonAccentDark: "#4b44af",
      labelBackground: "#f3f1ff",
      labelText: "#5b53c9",
      metaBackground: "#f7f7fb",
      metaText: "#374151",
      takeawayBackground: "#eef4fb",
      takeawayBorder: "#d4e2f5",
      takeawayText: "#123f73",
      cardShadow: "0 1px 3px rgba(0,0,0,0.08),0 8px 30px rgba(91,83,201,0.05)"
    };
  }

  function extractTakeawaySection(bodyHtml) {
    const source = String(bodyHtml || "").trim();
    if (!source) return { bodyHtml: "", takeawaysHtml: "" };

    const labeledListMatch = source.match(
      /(<p\b[^>]*>[\s\S]*?(?:Key Takeaways|What You['’]ll Learn|What you['’]ll learn|In this webinar|In this session)[\s\S]*?<\/p>\s*)((?:<ul\b[\s\S]*?<\/ul>)|(?:<ol\b[\s\S]*?<\/ol>))/i
    );
    if (labeledListMatch) {
      const fullMatch = labeledListMatch[0];
      const introHtml = labeledListMatch[1];
      const listHtml = labeledListMatch[2];
      return {
        bodyHtml: source.replace(fullMatch, "").trim(),
        takeawaysHtml: `${introHtml}${listHtml}`.trim()
      };
    }

    const firstListMatch = source.match(/(<ul\b[\s\S]*?<\/ul>|<ol\b[\s\S]*?<\/ol>)/i);
    if (!firstListMatch) {
      return { bodyHtml: source, takeawaysHtml: "" };
    }

    return {
      bodyHtml: source.replace(firstListMatch[0], "").trim(),
      takeawaysHtml: firstListMatch[0].trim()
    };
  }

  function buildSpeakerCardsMarkup(speakers, fontStack) {
    if (!speakers.length) return "";

    return speakers.map(speaker => `
      <table class="webcast-speaker-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #f0f0f0;border-radius:12px;background:#ffffff;table-layout:fixed;">
        <tr>
          ${speaker.image ? `<td class="webcast-speaker-image-wrap" width="136" style="padding:24px 0 24px 24px;vertical-align:middle;">
            <img class="webcast-speaker-image" src="${speaker.image.replace(/"/g, "&quot;")}" alt="${(speaker.name || "Speaker").replace(/"/g, "&quot;")}" style="display:block;width:96px;max-width:96px;height:96px;border-radius:14px;border:0;object-fit:cover;">
          </td>` : ""}
          <td class="webcast-speaker-copy" style="padding:24px;vertical-align:middle;font-family:${fontStack};color:#1f2937;word-break:break-word;overflow-wrap:anywhere;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;">Speaker</p>
            <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#111827;">${speaker.name || ""}</p>
            <p style="margin:10px 0 0;font-size:13px;line-height:1.8;color:#6b7280;">${speaker.role || ""}</p>
          </td>
        </tr>
      </table>`).join('<div style="height:14px;line-height:14px;">&nbsp;</div>');
  }

  function saveState() {
    if (isRestoringState) return;

    const state = {
      builderMode,
      previewMode,
      outputMode,
      brand: brandSelect?.value || "",
      inputHtml: inputHtml?.value || "",
      adId: adIdInput?.value || "",
      stealthLink: stealthLinkInput?.value || "",
      headerBg: headerBgColor?.value || "",
      footerBg: footerBgColor?.value || "",
      matchFooterColor: !!toggleMatchFooterColor?.checked,
      showDividers: !!toggleShowDividers?.checked,
      templateOptionsOpen,
      webcastUrl: webcastUrlInput?.value || "",
      webcastJson: webcastJsonInput?.value || "",
      webcastEventType: webcastEventType?.value || "",
      webcastHeadline: webcastHeadline?.value || "",
      webcastDate: webcastDate?.value || "",
      webcastTime: webcastTime?.value || "",
      webcastDuration: webcastDuration?.value || "",
      webcastBody: webcastBody?.value || "",
      webcastSponsorLogo: webcastSponsorLogo?.value || "",
      webcastSpeakerImage: webcastSpeakerImage?.value || "",
      webcastSpeakerName: webcastSpeakerName?.value || "",
      webcastSpeakerRole: webcastSpeakerRole?.value || "",
      webcastCtaUrl: webcastCtaUrl?.value || "",
      webcastCtaLabel: webcastCtaLabel?.value || "",
      webcastSpeakers
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
      if (typeof state.brand === "string" && brandSelect) brandSelect.value = state.brand;
      if (typeof state.adId === "string" && adIdInput) adIdInput.value = state.adId;
      if (typeof state.stealthLink === "string" && stealthLinkInput) stealthLinkInput.value = state.stealthLink;
      if (typeof state.headerBg === "string" && headerBgColor) headerBgColor.value = state.headerBg;
      if (typeof state.footerBg === "string" && footerBgColor) footerBgColor.value = state.footerBg;
      if (toggleMatchFooterColor) toggleMatchFooterColor.checked = !!state.matchFooterColor;
      if (toggleShowDividers) toggleShowDividers.checked = !!state.showDividers;
      lastCleanerShowDividers = !!state.showDividers;
      lastCleanerOutputMode = state.outputMode === "full" ? "full" : "fragment";
      templateOptionsOpen = !!state.templateOptionsOpen;
      if (typeof state.webcastUrl === "string" && webcastUrlInput) webcastUrlInput.value = state.webcastUrl;
      if (typeof state.webcastJson === "string" && webcastJsonInput) webcastJsonInput.value = state.webcastJson;
      if (typeof state.webcastEventType === "string" && webcastEventType) webcastEventType.value = state.webcastEventType;
      if (typeof state.webcastHeadline === "string" && webcastHeadline) webcastHeadline.value = state.webcastHeadline;
      if (typeof state.webcastDate === "string" && webcastDate) webcastDate.value = state.webcastDate;
      if (typeof state.webcastTime === "string" && webcastTime) webcastTime.value = state.webcastTime;
      if (typeof state.webcastDuration === "string" && webcastDuration) webcastDuration.value = state.webcastDuration;
      if (typeof state.webcastBody === "string" && webcastBody) webcastBody.value = state.webcastBody;
      if (typeof state.webcastSponsorLogo === "string" && webcastSponsorLogo) webcastSponsorLogo.value = state.webcastSponsorLogo;
      if (typeof state.webcastSpeakerImage === "string" && webcastSpeakerImage) webcastSpeakerImage.value = state.webcastSpeakerImage;
      if (typeof state.webcastSpeakerName === "string" && webcastSpeakerName) webcastSpeakerName.value = state.webcastSpeakerName;
      if (typeof state.webcastSpeakerRole === "string" && webcastSpeakerRole) webcastSpeakerRole.value = state.webcastSpeakerRole;
      if (typeof state.webcastCtaUrl === "string" && webcastCtaUrl) webcastCtaUrl.value = state.webcastCtaUrl;
      if (typeof state.webcastCtaLabel === "string" && webcastCtaLabel) webcastCtaLabel.value = state.webcastCtaLabel;
      webcastSpeakers = Array.isArray(state.webcastSpeakers) ? state.webcastSpeakers : [];

      syncFooterColorState();
      updateColorLabels();
      setBuilderMode(state.builderMode === "webcast" ? "webcast" : "cleaner");
      setOutputMode(state.outputMode === "full" ? "full" : "fragment");
      setViewMode(["desktop", "mobile", "code", "dark"].includes(state.previewMode) ? state.previewMode : "desktop");
      isRestoringState = false;
      return true;
    } catch (err) {
      console.error(err);
      isRestoringState = false;
      return false;
    }
  }

  async function fetchWebcastData() {
    let payloadText = webcastJsonInput?.value.trim() || "";
    const url = webcastUrlInput?.value.trim() || "";

    if (!payloadText && url) {
      const identifiers = extractOn24Identifiers(url);
      if (!identifiers) {
        throw new Error("That ON24 URL format was not recognized.");
      }

      const endpoint = `https://event.on24.com/apic/eventRegistration/EventServlet?sessionid=1&key=${identifiers.key}&eventid=${identifiers.eventId}&cb=${Date.now()}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}.`);
      }
      payloadText = await response.text();
      if (webcastJsonInput) webcastJsonInput.value = payloadText;
    }

    if (!payloadText) {
      throw new Error("Paste an ON24 URL or EventServlet JSON first.");
    }

    let parsed;
    try {
      parsed = JSON.parse(payloadText);
    } catch (err) {
      throw new Error("The EventServlet payload is not valid JSON.");
    }

    const webcastData = parseOn24EventPayload(parsed);
    populateWebcastFields(webcastData);
    updatePreview();
  }

  function hasValidFullEmailSelection() {
    if (builderMode === "webcast") {
      return !!brandSelect.value;
    }
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
    const canEditTemplate = (builderMode === "webcast" || outputMode === "full") && !!brandSelect.value;

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
      brandHelperText.textContent = builderMode === "webcast"
        ? "Required for webcast builder. Pick the brand whose header and footer should wrap the invite."
        : outputMode === "full"
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

  function buildWebcastContentHtml() {
    const brandKey = brandSelect.value;
    const theme = getWebcastTheme(brandKey);
    const {
      eventType,
      headline,
      date,
      time,
      duration,
      bodyHtml,
      sponsorLogo,
      speakers,
      ctaUrl,
      ctaLabel
    } = getWebcastFields();
    const sections = extractTakeawaySection(bodyHtml);
    const mainBodyHtml = sections.bodyHtml || bodyHtml || "<p>Webcast description goes here.</p>";
    const takeawaysHtml = sections.takeawaysHtml;
    const fontStack = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
    const buttonColor = theme.buttonAccent || theme.accent;

    const normalizedTime = time
      ? time
          .replace(/\bEastern Daylight Time\b/i, "ET")
          .replace(/\bEastern Standard Time\b/i, "ET")
          .replace(/\bEastern Time\b/i, "ET")
      : "";
    const timeLine = [normalizedTime, duration].filter(Boolean).join(", ");
    const metaRows = [];
    if (date) metaRows.push({ icon: "&#128197;", text: date });
    if (timeLine) metaRows.push({ icon: "&#128340;", text: timeLine });

    const sponsorMarkup = sponsorLogo ? `
      <tr>
        <td data-webcast-sponsor="true" style="padding:28px 40px 28px 40px;text-align:center;font-family:${fontStack};font-size:14px;line-height:1.5;color:#4b5563;">
          <div style="margin:0 0 12px 0;font-size:12px;line-height:1.2;font-weight:700;color:#111827;">This event is sponsored by</div>
          <img src="${sponsorLogo.replace(/"/g, "&quot;")}" alt="Sponsor logo" style="display:block;max-width:220px;width:100%;height:auto;border:0;margin:0 auto;">
        </td>
      </tr>` : "";

    const topCtaMarkup = ctaUrl ? `
      <tr>
        <td style="padding:28px 40px 0;text-align:center;">
          <a href="${ctaUrl.replace(/"/g, "&quot;")}" target="_blank" style="display:inline-block;background:${buttonColor};color:#ffffff;font-family:${fontStack};font-size:15px;font-weight:700;padding:14px 48px;border-radius:10px;text-decoration:none;box-shadow:0 2px 8px rgba(17,24,39,0.12);">
            ${ctaLabel}
          </a>
        </td>
      </tr>` : "";

    const takeawaysMarkup = takeawaysHtml ? `
      <tr>
        <td style="padding:24px 40px 0 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${theme.takeawayBackground};border:1px solid ${theme.takeawayBorder};border-radius:12px;">
            <tr>
              <td style="padding:22px 24px;font-family:${fontStack};font-size:15px;line-height:1.65;color:${theme.takeawayText};">
                <div style="margin:0 0 12px 0;font-size:11px;line-height:1.2;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${theme.accent};">Key Takeaways</div>
                ${takeawaysHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>` : "";

    const speakerMarkup = speakers.length ? `
      <tr>
        <td style="padding:32px 40px 0 40px;">
          ${buildSpeakerCardsMarkup(speakers, fontStack)}
        </td>
      </tr>` : "";

    const bottomCtaMarkup = ctaUrl ? `
      <tr>
        <td style="padding:28px 40px 0;text-align:center;">
          <a href="${ctaUrl.replace(/"/g, "&quot;")}" target="_blank" style="display:inline-block;background:${buttonColor};color:#ffffff;font-family:${fontStack};font-size:15px;font-weight:700;padding:14px 48px;border-radius:10px;text-decoration:none;box-shadow:0 2px 8px rgba(17,24,39,0.12);">
            ${ctaLabel}
          </a>
        </td>
      </tr>` : "";

    const metaMarkup = metaRows.length ? `
      <tr>
        <td style="padding:20px 40px 0;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
            <tr>
              ${metaRows.map((row, index) => `
                <td class="webcast-meta-cell" style="padding:0 0 8px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="background:${theme.metaBackground};border-radius:8px;">
                    <tr>
                      <td style="padding:8px 14px;font-family:${fontStack};font-size:13px;color:${theme.metaText};font-weight:500;white-space:nowrap;">
                        ${row.icon} ${row.text}
                      </td>
                    </tr>
                  </table>
                </td>
                ${index < metaRows.length - 1 ? '<td style="width:8px;"></td>' : ""}`).join("")}
            </tr>
          </table>
        </td>
      </tr>` : "";

    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#eef1f4;">
  <tr>
    <td align="center" style="padding:32px 20px;">
      <table class="webcast-card" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:${theme.cardShadow};">
        <tr>
          <td style="padding:32px 40px 0;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
              <tr>
                <td style="background:${theme.labelBackground};color:${theme.labelText};font-family:${fontStack};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 16px;border-radius:100px;">
                  ${eventType || "Webinar"}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="webcast-headline" style="padding:20px 40px 0;text-align:center;font-family:${fontStack};font-size:28px;line-height:1.3;color:#111827;font-weight:800;letter-spacing:-0.3px;">
            ${headline || "Webcast title"}
          </td>
        </tr>
        ${metaMarkup}
        ${topCtaMarkup}
        <tr>
          <td class="webcast-copy" style="padding:24px 40px 0;font-family:${fontStack};font-size:15px;line-height:1.7;color:#444444;">
            ${mainBodyHtml}
          </td>
        </tr>
        ${bottomCtaMarkup}
        ${takeawaysMarkup}
        ${speakerMarkup}
        ${sponsorMarkup}
      </table>
    </td>
  </tr>
</table>`;
  }

  function buildWebcastEmailHtml() {
    const brandKey = brandSelect.value;
    const brand = brandPresets[brandKey];

    if (!brand) {
      return "";
    }

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
    const webcastMarkup = buildWebcastContentHtml();

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Webcast Invite</title>
<style>
  .webcast-speaker-card {
    width: 100% !important;
    table-layout: fixed !important;
  }
  .webcast-copy img {
    max-width: 100% !important;
    height: auto !important;
  }
  .webcast-copy table {
    max-width: 100% !important;
  }
  .webcast-copy td,
  .webcast-copy th {
    max-width: 100% !important;
  }
  .webcast-copy p,
  .webcast-copy ul,
  .webcast-copy ol,
  .webcast-speaker-copy,
  .webcast-speaker-copy p {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  @media only screen and (max-width:600px) {
    .webcast-headline {
      font-size: 24px !important;
      line-height: 1.25 !important;
    }
    .webcast-card {
      border-radius: 14px !important;
    }
    .webcast-meta-cell {
      display: block !important;
      width: 100% !important;
      padding-bottom: 8px !important;
    }
    .webcast-speaker-image-wrap {
      display: block !important;
      width: 100% !important;
      padding: 24px 24px 0 24px !important;
      text-align: center !important;
    }
    .webcast-speaker-image {
      width: 88px !important;
      max-width: 88px !important;
      height: 88px !important;
      margin: 0 auto !important;
    }
    .webcast-speaker-copy {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
      padding: 16px 20px 24px 20px !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      white-space: normal !important;
    }
    .webcast-copy,
    .webcast-meta-cell {
      width: 100% !important;
    }
  }
</style>
</head>
<body style="background:#eef1f4;margin:0;padding:0;">
<!-- COBRAND_HEADER_START -->
${brandHeader}
<!-- COBRAND_HEADER_END -->
${trackingMarkup ? `${trackingMarkup}\n` : ""}${webcastMarkup}
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
    if (builderMode === "webcast") {
      return buildWebcastEmailHtml();
    }
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
      ? "max-width:420px;margin:0 auto;"
      : "max-width:600px;width:100%;margin:0 auto;";

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
    padding:${isMobile ? "12px" : "20px"};
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

  function setBuilderMode(mode) {
    builderMode = mode;
    appEl.classList.toggle("is-webcast", mode === "webcast");
    appEl.classList.toggle("is-cleaner", mode === "cleaner");
    document.querySelectorAll(".webcast-only").forEach(section => {
      section.hidden = mode !== "webcast";
    });
    document.querySelectorAll(".cleaner-only").forEach(section => {
      section.hidden = mode !== "cleaner";
    });

    builderModeSwitch?.querySelectorAll(".switch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.builderMode === mode);
    });

    if (mode === "webcast") {
      if (toggleShowDividers) {
        lastCleanerShowDividers = toggleShowDividers.checked;
        toggleShowDividers.checked = false;
      }
      setOutputMode("full");
    } else {
      if (toggleShowDividers) {
        toggleShowDividers.checked = lastCleanerShowDividers;
      }
      setOutputMode(lastCleanerOutputMode || "fragment");
    }

    updateTemplateOptionsVisibility();
    updateActionButtons();
    updatePreview();
  }

  function setOutputMode(mode) {
    outputMode = mode;
    if (builderMode === "cleaner") {
      lastCleanerOutputMode = mode;
    }

    outputModeSwitch?.querySelectorAll(".switch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.outputMode === mode);
    });

    appEl.classList.toggle("is-fragment", mode === "fragment");
    updateActionButtons();
    updateTemplateOptionsVisibility();
    updatePreview();
  }

  function updatePreview() {
    try {
      if (builderMode === "webcast" && !brandSelect.value) {
        outputStore.html = "";
        updateActionButtons();
        renderStatus("warn", "Action needed", "Choose a brand to build a webcast invite.");

        if (previewMode === "code") {
          codeOutputInner.value = "Choose a brand to generate a webcast invite.";
        } else {
          previewFrame.srcdoc = `
            <html>
              <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
                <div style="height:100vh;display:flex;align-items:center;justify-content:center;color:#667085;padding:40px;text-align:center;">
                  Choose a brand to generate a webcast invite.
                </div>
              </body>
            </html>
          `;
        }

        renderQABaseline();
        return;
      }

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

      if (builderMode === "webcast") {
        const hasHeadline = !!webcastHeadline?.value.trim();
        renderStatus(hasHeadline ? "ok" : "info", hasHeadline ? "Invite ready" : "Waiting for content", hasHeadline
          ? "Webcast invite generated. Review the preview and QA checks, then copy or download."
          : "Paste an ON24 URL or EventServlet JSON, then fetch event details.");
      } else if (!inputHtml.value.trim()) {
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
    if (webcastUrlInput) webcastUrlInput.value = "";
    if (webcastJsonInput) webcastJsonInput.value = "";
    webcastSpeakers = [];
    populateWebcastFields({ eventType: "Webinar" });
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
  inputHtml.addEventListener("input", () => {
    updatePreview();
    saveState();
  });
  builderModeSwitch?.querySelectorAll(".switch-btn").forEach(btn => {
    btn.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setBuilderMode(btn.dataset.builderMode);
      saveState();
    });
  });
  brandSelect.addEventListener("change", () => {
    updateTemplateOptionsVisibility();
    updatePreview();
    saveState();
  });

  ["toggleKeepStyles", "toggleRemovePreview", "toggleRemoveTitle", "toggleRemoveScripts"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updatePreview);
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener("click", clearInputOnly);
  }

  if (fetchWebcastBtn) {
    fetchWebcastBtn.addEventListener("click", async () => {
      try {
        renderStatus("info", "Fetching", "Trying to fetch webcast data from ON24.");
        await fetchWebcastData();
        saveState();
      } catch (err) {
        console.error(err);
        renderStatus("warn", "Fetch failed", err.message);
      }
    });
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
        if (el === toggleShowDividers && builderMode === "cleaner") {
          lastCleanerShowDividers = toggleShowDividers.checked;
        }
        updateColorLabels();
        updatePreview();
        saveState();
      });
      el.addEventListener("change", () => {
        if (el === toggleShowDividers && builderMode === "cleaner") {
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

  if (headerBgColor) {
    headerBgColor.addEventListener("input", () => {
      syncFooterColorState();
    });
  }

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setViewMode(btn.dataset.previewMode);
      updatePreview();
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
        updatePreview();
      });
    }
  });

  [
    webcastUrlInput,
    webcastJsonInput,
    webcastEventType,
    webcastHeadline,
    webcastDate,
    webcastTime,
    webcastDuration,
    webcastBody,
    webcastSponsorLogo,
    webcastSpeakerImage,
    webcastSpeakerName,
    webcastSpeakerRole,
    webcastCtaUrl,
    webcastCtaLabel
  ].forEach(el => {
    if (el) {
      el.addEventListener("input", () => {
        updatePreview();
        saveState();
      });
    }
  });

  populateBrandOptions();
  const restoredState = restoreState();
  if (!restoredState) {
    clearAll();
    setBuilderMode("cleaner");
    setOutputMode("fragment");
    setViewMode("desktop");
    saveState();
  } else {
    updatePreview();
  }
  updateColorLabels();
  syncFooterColorState();
  updateStealthHelper();
});
