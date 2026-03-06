export const thinkadvisor = {

  name: "ThinkAdvisor",

  header: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

  <tr>
    <td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">

        <tr>
          <td style="padding:10px 16px 12px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:13px;line-height:1.2;color:#6f6f6f;text-align:center;">
            To view this email as a web page, click
            <a href="@{mv_online_version}@" target="_blank" style="color:#0068A5;text-decoration:underline;">here</a>.
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:0 16px 14px 16px;">
            <a href="https://www.thinkadvisor.com/" target="_blank" style="text-decoration:none;">
              <img
                src="https://d15k2d11r6t6rl.cloudfront.net/pub/40qd/hna4jlpf/87q/w0s/vq4/ThinkAdvisor-Logo-RGB-Color.png"
                alt="ThinkAdvisor"
                width="390"
                style="display:block;width:100%;max-width:390px;height:auto;border:0;margin:0 auto;"
              >
            </a>
          </td>
        </tr>

      </table>

    </td>
  </tr>

  <!-- full width divider -->

  <tr>
    <td style="border-top:2px solid #e2e2e2;font-size:1px;line-height:1px;">&nbsp;</td>
  </tr>

</table>
  `,


  footer: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

  <!-- full width divider -->

  <tr>
    <td style="border-top:2px solid #e2e2e2;font-size:1px;line-height:1px;">&nbsp;</td>
  </tr>

  <tr>
    <td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">

        <tr>
          <td style="padding:16px 16px 8px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#6f6f6f;text-align:left;">
            This email was sent to: @{Email Name}@<br>
            This email was sent by: <strong>ThinkAdvisor</strong><br>
            222 Lakeview Avenue, West Palm Beach, FL, 33401<br>
            info@arc-network.com
          </td>
        </tr>

        <tr>
          <td style="padding:6px 16px 10px 16px;text-align:left;">
            <img
              src="https://d15k2d11r6t6rl.cloudfront.net/pub/40qd/hna4jlpf/tcn/fj1/he1/ThinkAdvisor-Arc-Logo-RGB-Color.png"
              alt="ThinkAdvisor part of Arc"
              width="240"
              style="display:block;width:100%;max-width:240px;height:auto;border:0;"
            >
          </td>
        </tr>

        <tr>
          <td style="padding:6px 16px 24px 16px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6f6f6f;text-align:left;">

            <p style="margin:0 0 14px 0;">
              If you would like to opt-out from receiving marketing emails from ThinkAdvisor Partner, please
              <a href="@{confirmunsubscribelink}@" target="_self" style="color:#0068A5;text-decoration:underline;">click here</a>.<br><br>

              If you would like to manage your email preferences, visit your email preferences center
              <a href="@{preferencepagelink}@" target="_self" style="color:#0068A5;text-decoration:underline;">here</a>.
            </p>

            <p style="margin:0 0 14px 0;">
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
};