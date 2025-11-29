console.log('Preenchendo campo de origem/destino...');

await page.waitForSelector('input.vs__search', { timeout: 30000 });
const inputs = await page.$$('input.vs__search');

if (inputs.length < 2) {
  throw new Error('Não encontrei os campos de origem/destino na tela.');
}

const originInput = inputs[0];
const destinationInput = inputs[1];

console.log('Preenchendo campo de origem...');
await originInput.click();
for (const char of origin) {
  await page.keyboard.type(char, { delay: 200 });
}
await delay(1500);
await page.keyboard.press('Enter');
await delay(2000);

console.log('Preenchendo campo de destino...');
await destinationInput.click();
for (const char of destination) {
  await page.keyboard.type(char, { delay: 200 });
}
await delay(1500);
await page.keyboard.press('Enter');
await delay(2000);
