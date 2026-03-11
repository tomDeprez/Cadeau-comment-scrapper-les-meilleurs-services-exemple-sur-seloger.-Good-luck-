const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// L'ajout du plugin Stealth est crucial pour ne pas être détecté comme un bot
puppeteer.use(StealthPlugin());

(async () => {
  console.log('Lancement du navigateur...');
  // headless: false permet de voir le navigateur s'ouvrir. Passe à true une fois que tout marche.
  const browser = await puppeteer.launch({ headless: true }); 
  const page = await browser.newPage();

  // On applique l'User-Agent de ton cURL
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36');

  // ÉTAPE 1 : Aller sur le site normalement pour générer le cookie _dd_s (résoudre le JS)
  console.log('Génération de la session (contournement DataDome)...');
  await page.goto('https://www.seloger.com/classified-search?distributionTypes=Buy&estateTypes=House,Apartment&locations=NBH2FR9342', {
    waitUntil: 'networkidle2' 
  });

  // ÉTAPE 2 : Exécuter la requête API dans le contexte du navigateur
  console.log('Récupération de la liste des annonces...');
  const targetUrl = 'https://www.seloger.com/classifiedList/2614W6QGYFR5,26VJPBKI36XN,265IKYDQGUFH,26DPFSQATZEQ,257SE93E22W7,267NHMKJ1VCX,253DCXXJ53HY,26SC7QHIMZVW,26R4QTH4JNGH,25N1W5LLX3LN,26J597SABTZN,26TXHDWRDSTY,26ZXMJ7T447V,26DVXMVZUAL1,25PJWDHJEGLR,26IVRQM6MYTU,26TZH55CPCHS,26M1JDLE6VGL,26XQR3QTGR1B,26U8SL442TX6,26GFDEJU7XTK,26A1VR8L7M9S,26PH3G6JH12S,26U2B2BLKTDT,26SFN3BDWJS2,261V16T5C441,268XL4XDDCCH,261WU12R5W1I,26X5SKEU5FUE,26MYRZWYSB7Y';

  const data = await page.evaluate(async (url) => {
    const response = await fetch(url, {
      headers: {
        'accept': '*/*',
        'x-language': 'fr'
      }
    });
    return response.json();
  }, targetUrl);

  console.log('Succès ! Voici un extrait des résultats :');
  console.log(data);

  await browser.close();
})();