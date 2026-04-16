import { createBrand } from "./base.js";

export const einfinder = createBrand({
  id: "einfinder",
  name: "EIN Finder",
  divider: {
    shared: { color: "#e2e2e2", width: 2 }
  },
  matchers: [
    /<table[^>]*>\s*[\s\S]*?jda_ein_finder_header\.jpg[\s\S]*?<\/table>\s*/gi,
    /<table[^>]*>\s*[\s\S]*?JDA-EINFinder-Arc-Logo-RGB-Color\.png[\s\S]*?confirmunsubscribelink[\s\S]*?<\/table>\s*/gi
  ],
  header: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="__HEADER_OUTER_BG__" style="background:__HEADER_OUTER_BG__;">
  <tr>
    <td align="center" bgcolor="__HEADER_OUTER_BG__" style="background:__HEADER_OUTER_BG__;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="__HEADER_BG__" style="width:100%;max-width:600px;margin:0 auto;background:__HEADER_BG__;">
        <tr>
          <td style="padding:5px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:14px;line-height:1.2;color:#6f6f6f;text-align:center;">
            To view this email as a web page, click
            <a href="@{mv_online_version}@" target="_blank" style="color:#0068A5;text-decoration:underline;">here</a>.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:5px 0;">
            <a href="https://www.consultingmag.com/" target="_blank" style="text-decoration:none;">
              <img
                src="https://d15k2d11r6t6rl.cloudfront.net/pub/40qd/hna4jlpf/vl8/paz/91n/jda_ein_finder_header.jpg"
                alt="EIN Finder Header"
                width="360"
                style="display:block;width:100%;max-width:360px;height:auto;border:0;margin:0 auto;"
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
          <td style="padding:10px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:14px;line-height:1.2;color:#6f6f6f;text-align:left;">
            This email was sent to: @{Email Name}@<br>
            This email was sent by: EIN Finder<br>
            222 Lakeview Avenue, West Palm Beach, FL, 33401<br>
            info@arc-network.com
          </td>
        </tr>
        <tr>
          <td style="padding:0 16px 10px 16px;text-align:left;">
            <img
              src="https://d15k2d11r6t6rl.cloudfront.net/pub/40qd/hna4jlpf/4vw/96t/mdx/JDA-EINFinder-Arc-Logo-RGB-Color.png"
              alt="EIN Finder part of Arc"
              width="240"
              style="display:block;width:100%;max-width:240px;height:auto;border:0;"
            >
          </td>
        </tr>
        <tr>
          <td style="padding:0 16px 24px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:11px;line-height:1.2;color:#6f6f6f;text-align:left;">
            <p style="margin:0 0 16px 0;">
              If you would like to opt-out from receiving marketing emails from EIN Finder, please
              <a href="@{confirmunsubscribelink}@" target="_self" style="color:#0068A5;text-decoration:underline;">click here</a>.<br><br>
              If you would like to manage your email preferences, visit your email preferences center
              <a href="@{preferencepagelink}@" target="_self" style="color:#0068A5;text-decoration:underline;">here</a>.
            </p>
            <p style="margin:0 0 16px 0;">
              <a href="https://www.arc-network.com/policies/us-privacy-policy/" target="_self" style="color:#0068A5;text-decoration:underline;">Privacy Policy</a>
              &nbsp; | &nbsp;
              <a href="https://www.arc-network.com/policies/us-terms-of-use/" target="_self" style="color:#0068A5;text-decoration:underline;">Terms &amp; Conditions</a>
            </p>
            <p style="margin:0;">&copy; @{mv_date_yyyy}@ Arc. All Rights Reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
`
});
