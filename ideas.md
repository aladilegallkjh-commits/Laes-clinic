# LAES Clinic - Design Brainstorming

## Design Reference (Ground Truth)
O usuário forneceu uma imagem de design que será a especificação final. Esta é a referência absoluta para o desenvolvimento.

**Características principais do design:**
- **Paleta de cores:** Verde escuro (#2D4F3F ou similar) como cor primária, dourado/bege (#C9A961 ou similar) como cor de destaque
- **Tipografia:** Serif elegante para títulos (tipo Playfair Display), sans-serif para corpo
- **Elementos visuais:** Folhas decorativas, ícones em linha, fotografias de alta qualidade com mulher em tratamento
- **Layout:** Assimétrico com imagem principal à direita, texto à esquerda no hero
- **Seções:** Header com navegação, Hero, Tratamentos (5 cards), Sobre a Clínica, CTA WhatsApp, Rodapé

## Design Philosophy Chosen: Wellness Elegance

**Design Movement:** Luxury Wellness & Botanical Minimalism

**Core Principles:**
1. **Natureza Integrada:** Elementos botânicos (folhas, linhas suaves) reforçam o conceito de "beleza natural"
2. **Confiança Profissional:** Tipografia serif + fotografia de qualidade transmitem expertise
3. **Espaço Respirável:** Muito whitespace, layouts assimétricos, sem poluição visual
4. **Harmonia Cromática:** Verde natural + dourado quente criam sofisticação sem frieza

**Color Philosophy:**
- **Verde Escuro (#2D4F3F):** Confiança, natureza, profissionalismo médico
- **Dourado (#C9A961):** Luxo, cuidado, destaque em CTAs
- **Bege/Off-white (#F5F1ED):** Fundo quente, acolhedor, premium
- **Preto/Charcoal (#1A1A1A):** Texto, contraste, elegância

**Layout Paradigm:**
- Hero assimétrico (texto esquerda, imagem direita com forma orgânica)
- Seções com alternância de alinhamento
- Cards de tratamentos em grid com ícones botânicos
- Rodapé com estrutura clara e links organizados

**Signature Elements:**
1. **Folhas decorativas:** Linhas delicadas de folhas em verde claro nos cantos/divisões
2. **Ícones botânicos:** Ícones em linha (não preenchidos) para cada tratamento
3. **Formas orgânicas:** Divisores com curvas suaves (wave dividers), bordas arredondadas

**Interaction Philosophy:**
- Hover effects suaves em botões (mudança de cor, leve elevação)
- Transições fluidas entre seções
- Ícones que ganham vida ao hover (mudança de cor para dourado)

**Animation:**
- Fade-in suave ao scroll (200-300ms)
- Hover em cards: elevação sutil (2-4px) + mudança de cor de ícone
- Botões: escala 0.98 ao clicar, transição 150ms
- Divisores: aparecem com fade-in suave

**Typography System:**
- **Display:** Playfair Display (serif) - títulos principais, h1, h2
- **Body:** Inter ou similar (sans-serif) - corpo de texto, descrições
- **Accent:** Playfair Display italic - citações, destaque
- Hierarquia: h1 (48px), h2 (32px), h3 (24px), body (16px)

**Brand Essence:**
- **Positioning:** Clínica de estética facial que une tecnologia avançada com cuidado integral, para mulheres que buscam sua melhor versão todos os dias.
- **Personality:** Confiante, acolhedora, sofisticada, inovadora

**Brand Voice:**
- Títulos: Elegantes, aspiracionais, poéticos ("Sua melhor versão, todos os dias")
- CTAs: Diretos, convidativos ("Agende sua consulta", "Conheça a Dra. Edilene Lopes")
- Microcopy: Profissional mas acessível, sem jargão excessivo

**Signature Brand Color:** Verde Escuro (#2D4F3F) - cor que aparece em header, botões primários e ícones

**Logo/Wordmark:** Já fornecido no design - símbolo circular com folha + texto "LAES Clinic"

---

## Implementation Notes
- Usar Google Fonts: Playfair Display (serif) + Inter (sans-serif)
- Cores em OKLCH para melhor contraste
- Gerar imagens de alta qualidade para hero e seções principais
- Manter fidelidade absoluta ao design fornecido
