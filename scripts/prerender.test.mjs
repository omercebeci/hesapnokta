import { describe, expect, it } from 'vitest';
import { resolveSuspenseReplay } from './prerender.mjs';

describe('resolveSuspenseReplay', () => {
  it('askıda kalan Suspense boundary yer tutucusunu gizli slot içeriğiyle statik olarak değiştirir', () => {
    const html =
      '<div id="root">' +
      '<main>' +
      '<!--$?--><template id="B:0"></template><!--/$-->' +
      '</main>' +
      '<footer>site altbilgisi</footer>' +
      '<script>requestAnimationFrame(function(){$RT=performance.now()});</script>' +
      '<div hidden id="S:0"><div class="calculator-page"><h1>Kredi Hesaplama</h1></div></div>' +
      '<script>$RB=[];$RV=function(a){};$RC=function(a,b){};$RC("B:0","S:0")</script>' +
      '</div>';

    const result = resolveSuspenseReplay(html);

    expect(result).toContain('<!--$--><div class="calculator-page"><h1>Kredi Hesaplama</h1></div><!--/$-->');
    expect(result).not.toContain('<template id="B:0">');
    expect(result).not.toContain('id="S:0"');
    expect(result).not.toContain('$RC(');
    expect(result).not.toContain('$RT=performance.now()');
    expect(result).toContain('<footer>site altbilgisi</footer>');
  });

  it('askıda boundary yoksa HTML\'i değiştirmeden bırakır', () => {
    const html = '<div id="root"><main><h1>Zaten çözülmüş içerik</h1></main></div>';
    expect(resolveSuspenseReplay(html)).toBe(html);
  });

  it('birden fazla boundary/slot çiftini bağımsız olarak çözer', () => {
    const html =
      '<!--$?--><template id="B:0"></template><!--/$-->' +
      '<!--$?--><template id="B:1"></template><!--/$-->' +
      '<div hidden id="S:0"><span>ilk</span></div>' +
      '<div hidden id="S:1"><span>ikinci</span></div>' +
      '<script>$RC("B:0","S:0");$RC("B:1","S:1")</script>';

    const result = resolveSuspenseReplay(html);

    expect(result).toContain('<!--$--><span>ilk</span><!--/$-->');
    expect(result).toContain('<!--$--><span>ikinci</span><!--/$-->');
    expect(result).not.toContain('hidden id=');
  });
});
