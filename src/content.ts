// Conteúdo da proposta 2 (Hype CX 2027, "Em Directo").
// Fonte: hypecx.targeting.ao (edição de 2026) e proposta 1.
// Data, local e preços de 2027 ainda não são públicos: nunca inventar.

export const event = {
  email: 'hypecx@targeting.ao',
  phone: '+244 943 229 113',
  phoneHref: 'tel:+244943229113',
  aftermovie: 'https://www.youtube.com/watch?v=6spHjoi4qKg',
  linkedin: 'https://www.linkedin.com/company/hypecx/',
  instagram: 'https://www.instagram.com/hypecx.ao/',
  youtube: 'https://www.youtube.com/watch?v=6spHjoi4qKg',
}

const mail = (subject: string, body = '') =>
  `mailto:${event.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`

export const links = {
  notify: (email: string, ticket = 'Hype CX 2027') =>
    mail(
      `Avisem-me: ${ticket}`,
      `Olá equipa Hype CX,\n\nQuero ser avisado(a) quando abrirem os ingressos para a 3ª edição.\n\nEmail: ${email}\n`,
    ),
  corporate: mail('Proposta Corporate: Hype CX 2027', 'Olá equipa Hype CX,\n\nGostaríamos de receber uma proposta para a nossa equipa.\n\nEmpresa:\nNúmero de pessoas:\n'),
  sponsor: mail('Patrocínio: Hype CX 2027', 'Olá equipa Hype CX,\n\nGostaríamos de saber mais sobre o patrocínio da 3ª edição.\n\nEmpresa:\n'),
}

export type Station = { id: string; label: string; freq: number }

// Cada secção é uma estação no dial (FM 87.5 a 108).
export const stations: Station[] = [
  { id: 'inicio', label: 'Início', freq: 88.1 },
  { id: 'porque', label: 'Porquê', freq: 91.3 },
  { id: 'vozes', label: 'Vozes', freq: 94.7 },
  { id: 'alinhamento', label: 'Alinhamento', freq: 98.4 },
  { id: 'arquivo', label: 'Arquivo', freq: 101.9 },
  { id: 'patrocinio', label: 'Patrocínio', freq: 104.6 },
  { id: 'ingressos', label: 'Ingressos', freq: 107.5 },
]

export const transcript = [
  'Hoje, o consumidor está mais informado, mais exigente e mais vocal.',
  'Mas ainda se sente pouco escutado.',
  'As empresas que entenderem isso primeiro vão liderar o mercado.',
]

export const reasons = [
  { word: 'Medir', text: 'A maioria das empresas em Angola ainda não mede a experiência do cliente de forma sistemática.' },
  { word: 'Escutar', text: 'O consumidor já tem canais de voz, mas sente que não é levado a sério.' },
  { word: 'Diferenciar', text: 'A diferença entre marcas acontece cada vez menos no produto e cada vez mais na jornada.' },
]

export type Speaker = { slug: string; name: string; role: string; company: string }

export const speakers: Speaker[] = [
  { slug: 'josemar-afonso', name: 'Josemar Afonso', role: 'Curador do Hype CX 2026', company: 'Hype CX' },
  { slug: 'eduardo-bettencourt', name: 'Eduardo Bettencourt', role: 'Administrador Executivo', company: 'EMIS' },
  { slug: 'marcus-valdez', name: 'Marcus Valdez', role: 'Director Geral', company: 'Multichoice Angola' },
  { slug: 'rossana-neves', name: 'Rossana Neves', role: 'Directora Comercial B2C', company: 'Sonangol D&C' },
  { slug: 'bazeka-kawenge', name: 'Bazeka Kawenge', role: 'Director de Marketing', company: 'Banco BAI' },
  { slug: 'fabio-santos', name: 'Fábio Santos', role: 'Head of TMO', company: 'TAAG' },
  { slug: 'miguel-pinheiro', name: 'Miguel Pinheiro', role: 'Distribution Manager', company: 'HP' },
  { slug: 'paulo-costa', name: 'Paulo Costa', role: 'Subdirector de CX', company: 'NOSSA Seguros' },
  { slug: 'antonio-rodrigues', name: 'António Rodrigues', role: 'CEO', company: 'MI6' },
  { slug: 'joao-matos', name: 'João Matos', role: 'Director Business Consulting', company: 'EY Portugal' },
]

export type Segment = { time: string; kind: string; title: string; text: string; voices?: string[] }

// Alinhamento da edição de 2026 (referência do formato).
export const rundown: Segment[] = [
  { time: '08:30', kind: 'Abertura', title: 'Recepção e credenciamento', text: 'Boas-vindas aos participantes e entrada no espaço do evento.' },
  {
    time: '09:10',
    kind: 'Keynotes',
    title: 'A Experiência do Cliente como activo estratégico',
    text: 'Bloco 1: visão, liderança e escala.',
    voices: ['eduardo-bettencourt', 'marcus-valdez', 'rossana-neves', 'bazeka-kawenge'],
  },
  {
    time: '10:45',
    kind: 'Ferramentas úteis',
    title: 'CX Customer Feeling Report 2025',
    text: 'CX que se mede, gere e dá retorno.',
    voices: ['josemar-afonso'],
  },
  { time: '11:15', kind: 'Case study', title: 'Check-In', text: 'Apresentação de Mário Rafael, CEO da Check-In.' },
  {
    time: '13:10',
    kind: 'Mesa redonda',
    title: 'Da promessa à realidade',
    text: 'Quatro marcas, uma pergunta: o que muda quando se escuta o cliente?',
    voices: ['fabio-santos', 'miguel-pinheiro', 'paulo-costa', 'antonio-rodrigues'],
  },
  { time: '15:00', kind: 'Networking', title: 'Encerramento e networking', text: 'Networking final na zona das activações das marcas.' },
]

export type Frame =
  | { type: 'photo'; src: string; caption: string; w: number; h: number }
  | { type: 'quote'; quote: string; source: string }

export const archive: Frame[] = [
  { type: 'photo', src: '/media/event/oradores-grupo.webp', caption: 'Oradores e convidados da 2ª edição', w: 1278, h: 1600 },
  { type: 'quote', quote: 'Este não será um evento de “powerpoint e coffee break”.', source: 'Hype CX 2026' },
  { type: 'photo', src: '/media/event/oradora-palco.webp', caption: 'Keynote no palco principal', w: 1117, h: 1400 },
  { type: 'photo', src: '/media/event/palco-feedback.webp', caption: 'Ferramentas úteis: os tipos de feedback que importam', w: 1600, h: 1469 },
  { type: 'quote', quote: 'Quem não entende o seu cliente, está a liderar às cegas.', source: 'Tema da 2ª edição: “Quem entende, lidera.”' },
  { type: 'photo', src: '/media/event/painel.webp', caption: 'Mesa redonda: da promessa à realidade', w: 1118, h: 1400 },
  { type: 'photo', src: '/media/event/activacao.webp', caption: 'Activações das marcas parceiras', w: 1118, h: 1400 },
  {
    type: 'quote',
    quote: 'O lugar onde as vendas, a inovação e a reputação se alinham com o entendimento real do cliente.',
    source: 'Hype CX',
  },
]

export const partners = [
  { name: 'Banco BAI', file: 'logo-bai.png', ratio: 2.77 },
  { name: 'NOSSA Seguros', file: 'logo-nossa-seguros.png', ratio: 3.95 },
  { name: 'HP / Stylus', file: 'logo-hp-stylus.png', ratio: 4.57 },
  { name: 'Sonangol Distribuição e Comercialização', file: 'logo-sonangol-dc.png', ratio: 3.56, boost: 1.35 },
  { name: 'Paratus', file: 'logo-paratus.png', ratio: 2.6 },
  { name: 'Express', file: 'logo-express.png', ratio: 3.96 },
  { name: 'Check-In', file: 'logo-check-in.png', ratio: 3.66 },
  { name: 'Novagest', file: 'logo-novagest.png', ratio: 3.73 },
  { name: 'Superbrands Angola', file: 'logo-superbrands.png', ratio: 2.24 },
  { name: 'BeeExecutive', file: 'logo-beeexecutive.png', ratio: 5.12 },
  { name: 'Bisc8', file: 'logo-bisc8.png', ratio: 4.38 },
  { name: 'Duo Films', file: 'logo-duo-films.png', ratio: 0.71, boost: 1.35 },
]

export const tickets = [
  { name: 'Early Bird', note: 'Lugares limitados, para quem decide primeiro.', action: 'notify' as const },
  { name: 'Normal', note: 'Acesso a todo o programa da 3ª\u00a0edição.', action: 'notify' as const },
  { name: 'Corporate', note: 'Para equipas e empresas, com proposta à medida.', action: 'corporate' as const },
]
