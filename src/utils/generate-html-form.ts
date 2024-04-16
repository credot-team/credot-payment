import { OrderApplyResult } from '../payment';

export function generateHtmlForm(orderApplyResult: OrderApplyResult) {
  const formParams = orderApplyResult.payload;

  const fields = Object.entries(formParams.data)
    .map(([k, v]) => `${k} <input type="text" name="${k}" readonly value="${v}" /><br/>`)
    .join('\n');

  return `This form will POST to ${formParams.properties.url}
<br/><br/>
<form method=${formParams.properties.method} action=${formParams.properties.url}>
${fields}
<input type="submit" />
</form>`;
}
