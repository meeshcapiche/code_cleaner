import { thinkadvisor } from "./brands/thinkadvisor.js";

const brandPresets = {
  thinkadvisor
};

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

  const inputHtml = document.getElementById("inputHtml");
  const previewFrame = document.getElementById("previewFrame");
  const qaReport = document.getElementById("qaReport");
  const qaCount = document.getElementById("qaCount");
  const brandSelect = document.getElementById("brandSelect");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const outputStore = { html: "" };
  let previewMode = "desktop";

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

  function removeStyleBlocks(html) {
    return (html || "").replace(/<style\b[\s\S]*?<\/style>\s*/gi, "");
  }

  function removeClientPreheader(html) {
    let s = html || "";
    s = s.replace(/<span\b[^>]*style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "");
    s = s.replace(/<div\b[^>]*style=["'][^"']*(display\s*:\s*none|mso-hide\s*:\s*all|opacity\s*:\s*0)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
    return s.trim();
  }

  function removeUnsubscribeBlocks(html) {
    const chunks = (html || "").split(/(?=<p\b)|(?=<div\b)|(?=<table\b)|(?=<tr\b)|(?=<td\b)/i);
    const out = [];

    for (const chunk of chunks) {
      const lower = chunk.toLowerCase();
      const isUnsub =
        lower.includes("unsubscribe") ||
        lower.includes("opt-out") ||
        lower.includes("opt out") ||
        lower.includes("manage your email preferences") ||
        lower.includes("email preferences") ||
        lower.includes("preference center") ||
        lower.includes("preferences center") ||
        lower.includes("confirmunsubscribelink") ||
        lower.includes("preferencepagelink");

      if (!isUnsub) out.push(chunk);
    }

    return out.join("");
  }

  function getProcessedClientHtml() {
    let client = inputHtml.value.trim();

    if (!client) {
      return sampleClientHtml.trim();
    }

    client = stripOuterDocument(client);

    if (document.getElementById("toggleRemovePreview").checked) {
      client = removeClientPreheader(client);
    }

    if (document.getElementById("toggleRemoveTitle").checked) {
      client = removeTitleTag(client);
    }

    if (document.getElementById("toggleRemoveUnsubs").checked) {
      client = removeUnsubscribeBlocks(client);
    }

    if (document.getElementById("toggleRemoveStyles").checked) {
      client = removeStyleBlocks(client);
    }

    return client.trim();
  }

  function buildFinalEmailHtml() {
    const brandKey = brandSelect.value;
    const wrapBrand = document.getElementById("toggleWrapBrand").checked;
    const brand = brandPresets[brandKey];
    const client = getProcessedClientHtml();

    let finalInner = client;

    if (wrapBrand && brand) {
      finalInner = `${brand.header}${client}${brand.footer}`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cobrand Email</title>
</head>
<body style="background:#fff;margin:0;padding:0;">
${finalInner}
</body>
</html>`;
  }

  function buildPreviewDoc(finalHtml) {
    const shellStyle =
      previewMode === "mobile"
        ? "max-width:420px;margin:0 auto;"
        : "width:100%;margin:0 auto;";

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  html,body{
    margin:0;
    padding:0;
    background:#eef2f7;
  }
  body{
    font-family:Arial,Helvetica,sans-serif;
  }
  .stage{
    padding:20px;
  }
  .shell{
    ${shellStyle}
    border:1px solid #dfe5f0;
    border-radius:16px;
    overflow:auto;
    background:#fff;
    box-shadow:0 10px 24px rgba(15,23,40,.08);
  }
</style>
</head>
<body>
  <div class="stage">
    <div class="shell">
      ${finalHtml}
    </div>
  </div>
</body>
</html>`;
  }

  function runQA(finalHtml, rawClient) {
    const issues = [];

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
    qaCount.textContent = warnCount ? `${warnCount} high` : "0 issues";
    qaCount.className = `qa-pill ${warnCount ? "high" : "ok"}`;

    qaReport.innerHTML = issues
      .map(
        item => `
      <div class="qa-item ${item.level}">
        <div class="qa-title">${item.title}</div>
        <div class="qa-text">${item.text}</div>
      </div>
    `
      )
      .join("");
  }

  function updatePreview() {
    try {
      const finalHtml = buildFinalEmailHtml();
      outputStore.html = finalHtml;
      previewFrame.srcdoc = buildPreviewDoc(finalHtml);
      renderQA(runQA(finalHtml, inputHtml.value.trim()));
    } catch (err) {
      console.error(err);
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
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy HTML";
      }, 900);
    } catch (err) {
      console.error(err);
    }
  }

  function downloadOutput() {
    if (!outputStore.html) return;

    const blob = new Blob([outputStore.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cobrand-email.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    inputHtml.value = "";
    brandSelect.value = "";
    outputStore.html = "";
    previewFrame.srcdoc = `
      <html>
        <body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
          <div style="height:100vh;display:flex;align-items:center;justify-content:center;color:#667085;">
            Paste email HTML on the left to see a preview here.
          </div>
        </body>
      </html>
    `;
    renderQA([
      {
        level: "ok",
        title: "Ready",
        text: "Paste client HTML to begin."
      }
    ]);
  }

  copyBtn.addEventListener("click", copyOutput);
  downloadBtn.addEventListener("click", downloadOutput);

  inputHtml.addEventListener("input", updatePreview);
  brandSelect.addEventListener("change", updatePreview);

  ["toggleWrapBrand", "toggleRemovePreview", "toggleRemoveTitle", "toggleRemoveUnsubs", "toggleRemoveStyles"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updatePreview);
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      previewMode = btn.dataset.previewMode;
      updatePreview();
    });
  });

  clearAll();
});

document.addEventListener("drop", e => {

  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (!file) return;

  if (file.name.endsWith(".html")) {

    const reader = new FileReader();

    reader.onload = function(event) {

      inputHtml.value = event.target.result;
      updatePreview();

    };

    reader.readAsText(file);

  }

});

document.addEventListener("dragover", e => {
  e.preventDefault();
});