#!/usr/bin/env python3
"""Gera versões desktop e mobile da contracapa"""

import cairosvg

# Versão horizontal (desktop)
with open('data/livro/contracapa.svg.template', 'r') as f:
    svg_content = f.read()

cairosvg.svg2png(
    bytestring=svg_content.encode('utf-8'),
    write_to='assets/images/contracapa-desktop.png',
    output_width=1920,
    output_height=1080
)
print('✓ Contracapa desktop gerada')

# Versão vertical (mobile)
svg_vertical = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="400" height="800">
  <defs>
    <radialGradient id="luz_contra" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0d0d1a"/>
    </radialGradient>
    <linearGradient id="ouro_contra" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="50%" stop-color="#f4e4ba"/>
      <stop offset="100%" stop-color="#d4af37"/>
    </linearGradient>
  </defs>
  
  <rect width="400" height="800" fill="url(#luz_contra)"/>
  
  <!-- Sequência diagonal em estilo geométrico simples -->
  <g font-family="'Futura', 'Century Gothic', 'Avenir', 'Helvetica Neue', sans-serif" 
     font-size="28" 
     font-weight="300"
     fill="url(#ouro_contra)" 
     opacity="0.15"
     letter-spacing="3"
     transform="rotate(-15 200 400)">
    <text x="30" y="220" text-anchor="middle" font-style="italic">.</text>
    <text x="70" y="270" text-anchor="middle" font-style="italic">I</text>
    <text x="110" y="320" text-anchor="middle" font-style="italic">C</text>
    <text x="150" y="370" text-anchor="middle" font-style="italic">Ç</text>
    <text x="190" y="420" text-anchor="middle" font-style="italic">S</text>
    <text x="230" y="470" text-anchor="middle" font-style="italic">O</text>
    <text x="270" y="520" text-anchor="middle" font-style="italic">b</text>
    <text x="310" y="570" text-anchor="middle" font-style="italic">§</text>
    <text x="350" y="620" text-anchor="middle" font-style="italic">∞</text>
    <text x="390" y="670" text-anchor="middle" font-style="italic">ø</text>
  </g>
  
  <!-- Linha decorativa diagonal sutil -->
  <line x1="20" y1="200" x2="380" y2="680" stroke="#d4af37" stroke-width="0.3" opacity="0.08"/>
</svg>'''

cairosvg.svg2png(
    bytestring=svg_vertical.encode('utf-8'),
    write_to='assets/images/contracapa-mobile.png',
    output_width=800,
    output_height=1600
)
print('✓ Contracapa mobile gerada')
