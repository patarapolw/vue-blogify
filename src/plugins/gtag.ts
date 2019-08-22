import { g } from "@/shared";
import { dotGetter } from './search';

declare const dataLayer: any[];

async function gAnalytics(id: string) {
  var d = document, s = d.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  
  s.setAttribute('data-timestamp', new Date().toISOString());
  (d.head || d.body).appendChild(s);

  (window as any).dataLayer = dataLayer || [];
  function gtag(...x: any[]){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', id);
}

const id = dotGetter(g.config, "external.google.analytics");
if (id) {
  gAnalytics(id);
}
