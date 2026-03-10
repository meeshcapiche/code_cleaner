import { createBrand } from "./base.js";

export const universitybusiness = createBrand({
  id: "universitybusiness",
  name: "University Business",
  stealthLink: "https://universitybusiness.com/stealth-click?utm_source=bot-test&utm_medium=email&utm_campaign=stealth",
  divider: {
    shared: { color: "#d7d7d7", width: 1 }
  },
  matchers: [
    /<table[^>]*>\s*[\s\S]*?(UB_Header\.png|ub_white_stoke_for_email\.png)[\s\S]*?<\/table>\s*/gi,
    /<table[^>]*>\s*[\s\S]*?University Business[\s\S]*?confirmunsubscribelink[\s\S]*?<\/table>\s*/gi
  ],
  header: `
<table __HEADER_DARK_ATTR__ role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="__HEADER_BG__" style="background:__HEADER_BG__;">
  <tr>
    <td align="center" bgcolor="__HEADER_BG__" style="background:__HEADER_BG__;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
        <tr>
          <td style="padding:12px 16px 8px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#6f6f6f;text-align:center;">
            To view this email as a web page, click
            <a href="@{mv_online_version}@" target="_blank" style="color:#0068A5;text-decoration:underline;">here</a>.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 20px 14px 20px;">
            <a href="https://universitybusiness.com/" target="_blank" style="text-decoration:none;">
              <img
                src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/ub_white_stoke_for_email.png"
                alt="University Business"
                width="220"
                style="display:block;width:100%;max-width:220px;height:auto;border:0;margin:0 auto;"
              >
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 16px 24px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#7a7a7a;text-align:center;">
            You are receiving this email as part of a free information service from <i>University Business</i>.
          </td>
        </tr>
      </table>
    </td>
  </tr>

  __HEADER_DIVIDER__

</table>
  `,
  footer: `
<table __FOOTER_DARK_ATTR__ role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="__FOOTER_BG__" style="background:__FOOTER_BG__;">

  __FOOTER_DIVIDER__

  <tr>
    <td align="center" bgcolor="__FOOTER_BG__" style="background:__FOOTER_BG__;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
        <tr>
          <td style="padding:18px 24px 10px 24px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
              <tr>
                <td style="padding:0 5px;">
                  <a href="https://www.linkedin.com/company/university-business-magazine/" target="_blank" style="text-decoration:none;">
                    <img alt="LinkedIn" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/linkedin-circle-colored.png" width="32" height="32" style="display:block;width:32px;height:32px;border:0;">
                  </a>
                </td>
                <td style="padding:0 5px;">
                  <a href="https://twitter.com/universitybiz/" target="_blank" style="text-decoration:none;">
                    <img alt="Twitter" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/x-circle-colored.png" width="32" height="32" style="display:block;width:32px;height:32px;border:0;">
                  </a>
                </td>
                <td style="padding:0 5px;">
                  <a href="https://www.facebook.com/universitybusiness/" target="_blank" style="text-decoration:none;">
                    <img alt="Facebook" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/facebook-circle-colored.png" width="32" height="32" style="display:block;width:32px;height:32px;border:0;">
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 18px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td width="33.33%" style="padding:0;border-right:1px solid #d7d7d7;text-align:center;">
                  <a href="https://www.arc-network.com/policies/us-privacy-policy/" target="_blank" style="display:block;padding:12px 6px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:12px;line-height:1.2;font-weight:bold;color:#333333;text-decoration:none;">PRIVACY</a>
                </td>
                <td width="33.33%" style="padding:0;border-right:1px solid #d7d7d7;text-align:center;">
                  <a href="@{preferencepagelink}@" target="_self" style="display:block;padding:12px 6px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:12px;line-height:1.2;font-weight:bold;color:#333333;text-decoration:none;">PREFERENCES</a>
                </td>
                <td width="33.33%" style="padding:0;text-align:center;">
                  <a href="@{confirmunsubscribelink}@" target="_self" style="display:block;padding:12px 6px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:12px;line-height:1.2;font-weight:bold;color:#333333;text-decoration:none;">UNSUBSCRIBE</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 24px 24px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#777777;text-align:center;">
            <p style="margin:0 0 6px 0;">Entire contents copyright &copy; @{mv_date_yyyy}@ <i>University Business</i>. All rights reserved.</p>
            <p style="margin:0;">222 Lakeview Avenue, Suite 800, West Palm Beach, FL 33401</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
`
});
