import { createBrand } from "./base.js";

export const hrexecutive = createBrand({
  id: "hrexecutive",
  name: "HR Executive",
  stealthLink: "https://hrexecutive.com/stealth-click?utm_source=bot-test&utm_medium=email&utm_campaign=stealth",
  divider: {
    shared: { color: "#d7d7d7", width: 1 }
  },
  matchers: [
    /<table[^>]*>\s*[\s\S]*?HR_Executive_RGB\.png[\s\S]*?<\/table>\s*/gi,
    /<table[^>]*>\s*[\s\S]*?HumanResourceExecutive[\s\S]*?confirmunsubscribelink[\s\S]*?<\/table>\s*/gi,
    /<table[^>]*>\s*[\s\S]*?HRExecMag[\s\S]*?confirmunsubscribelink[\s\S]*?<\/table>\s*/gi
  ],
  header: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="__HEADER_OUTER_BG__" style="background:__HEADER_OUTER_BG__;">
  <tr>
    <td align="center" bgcolor="__HEADER_OUTER_BG__" style="background:__HEADER_OUTER_BG__;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="__HEADER_BG__" style="width:100%;max-width:600px;margin:0 auto;background:__HEADER_BG__;">
        <tr>
          <td style="padding:12px 16px 8px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#6f6f6f;text-align:center;">
            To view this email as a web page, click
            <a href="@{mv_online_version}@" target="_blank" style="color:#0068A5;text-decoration:underline;">here</a>.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:8px 16px 18px 16px;">
            <a href="https://hrexecutive.com/" target="_blank" style="text-decoration:none;">
              <img
                src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/HR_Executive_RGB.png"
                alt="HR Executive"
                width="238"
                style="display:block;width:100%;max-width:238px;height:auto;border:0;margin:0 auto;"
              >
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  __HEADER_DIVIDER__

</table>
  `,
  footer: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="__FOOTER_OUTER_BG__" style="background:__FOOTER_OUTER_BG__;">

  __FOOTER_DIVIDER__

  <tr>
    <td align="center" bgcolor="__FOOTER_OUTER_BG__" style="background:__FOOTER_OUTER_BG__;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="__FOOTER_BG__" style="width:100%;max-width:600px;margin:0 auto;background:__FOOTER_BG__;">
        <tr>
          <td style="padding:24px 24px 12px 24px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
              <tr>
                <td style="text-align:center;padding:0 5px;">
                  <a href="https://www.linkedin.com/company/human-resource-executive-magazine/" target="_blank" style="text-decoration:none;">
                    <img alt="LinkedIn" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/linkedin-circle-colored.png" width="32" height="32" style="height:32px;width:32px;max-width:100%;display:block;border:0;">
                  </a>
                </td>
                <td style="text-align:center;padding:0 5px;">
                  <a href="https://x.com/HRExecMag" target="_blank" style="text-decoration:none;">
                    <img alt="Twitter" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/x-circle-colored.png" width="32" height="32" style="height:32px;width:32px;max-width:100%;display:block;border:0;">
                  </a>
                </td>
                <td style="text-align:center;padding:0 5px;">
                  <a href="https://www.facebook.com/HumanResourceExecutive/" target="_blank" style="text-decoration:none;">
                    <img alt="Facebook" src="https://cdn.omeda.com/hosted/images/CLIENT_LRP/LRPCD/facebook-circle-colored.png" width="32" height="32" style="height:32px;width:32px;max-width:100%;display:block;border:0;">
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
            <p style="margin:0 0 6px 0;">Entire contents copyright &copy; @{mv_date_yyyy}@ <i>HR Executive</i>. All rights reserved.</p>
            <p style="margin:0;">222 Lakeview Avenue, Suite 800, West Palm Beach, FL 33401</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
`
});
