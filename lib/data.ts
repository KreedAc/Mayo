import type { MenuSection, HoursEntry, SiteInfo } from './types'

const J = 'https://www.jmenu.it/media/cache/mayo/item-menu/800x600/menu-digitale-jmenu-'

export const MAYO_MENU: MenuSection[] = [
  {
    id: 'novita', label: 'Novità', emoji: '☀️',
    blurb: 'Le ultime aggiunte. Edizioni limitate.',
    items: [
      { id: 'ribs-bbq', name: 'RIBS IN SALSA BBQ', desc: 'Ribs di suino glassate in salsa BBQ, pezzi limitatissimi.', variants: [{ label: '3pz', price: 6.0 }], badges: ['LIMITED', 'NEW'], img: J+'photoroom-20260508-115444-31212.jpg' },
    ],
  },
  {
    id: 'sticks', label: 'Mayo Sticks', emoji: '🍟',
    blurb: 'La nostra selezione di patatine fritte.',
    items: [
      { id: 'classiche', name: 'CLASSICHE', desc: 'Patatine fritte classiche.', price: 3.0, img: J+'photoroom-20240808-174056-25152.jpg' },
      { id: 'truffle-fries', name: 'TRUFFLE FRIES 🧀', desc: 'Patatine fritte, maionese al tartufo, parmigiano reggiano 24 mesi.', price: 6.0, badges: ['LIMITED'], img: J+'photoroom-20260407-185523-30928.jpg' },
      { id: 'alabama', name: 'ALABAMA', desc: 'Patatine fritte, salsa ai pepi e cipolla croccante.', price: 5.0, img: J+'photoroom-20240809-215224-25150.jpg' },
      { id: 'wurstel-aff', name: 'CON WURSTEL AFFUMICATO', desc: 'Patatine fritte con wurstel di suino affumicato (bockwurst).', variants: [{ label: 'Solo wurstel', price: 5.0 }, { label: 'Wurstel e cheddar', price: 6.0 }], img: J+'photoroom-20240809-215551-25149.jpg' },
      { id: 'bacon-cheddar', name: 'BACON E CHEDDAR', desc: 'Patatine ricoperte da cheddar fuso e polvere di bacon croccante.', price: 6.0, img: J+'photoroom-20240809-215503-25148.jpg' },
      { id: 'pulled-pork', name: 'PULLED PORK E CHEDDAR', desc: 'Patatine con pulled pork e cheddar fuso.', price: 7.0, img: J+'photoroom-20240809-215735-25147.jpg' },
      { id: 'premium', name: 'PREMIUM 👑', desc: 'Patatine, cheddar fuso, petto di pollo croccante a tocchetti, salsa 1869.', price: 8.0, badges: ['CHEF'], featured: true, img: J+'photoroom-20240809-214718-25146.jpg' },
    ],
  },
  {
    id: 'friggitoria', label: 'Enjoy with Mayo', emoji: '🎨',
    blurb: 'Friggitoria. Da mangiare con le mani.',
    items: [
      { id: 'ribs-bbq-2', name: 'RIBS IN SALSA BBQ', desc: 'Ribs di suino glassate in salsa BBQ, pezzi limitatissimi.', variants: [{ label: '3pz', price: 6.0 }], badges: ['LIMITED'], img: J+'photoroom-20260508-115444-31211.jpg' },
      { id: 'cheddar-cup', name: 'COPPETTA DI CHEDDAR FUSO', desc: 'Puro godimento. 🧀', price: 3.0, img: J+'dcb40adb-6672-4037-a61e-bcefafa77d4c-29163.jpg' },
      { id: 'salse', name: 'SALSE EXTRA', desc: '1869 · New York · Western · Nduja · Pepi · BBQ · Ranch · Sriracha.', variants: [{ label: 'Cad.', price: 1.0 }], img: J+'photoroom-20250402-183349-27186.jpg' },
      { id: 'appetizer-mix', name: 'APPETIZER MIX', desc: 'Mayo flakes 4pz, chicken wings 2pz, onion rings 2pz, jalapeno bites 2pz, cheese bites 2pz. Due salse a scelta.', price: 10.0, featured: true, badges: ['CHEF'], img: J+'img-8336-25153.jpg' },
      { id: 'mayo-flakes', name: 'MAYO FLAKES', desc: 'Croccanti fiocchi di petto di pollo marinati, fatti in casa con speciale panatura.', variants: [{ label: '7pz', price: 5.0 }, { label: '10pz', price: 7.0 }], img: J+'photoroom-20240808-185502-25001.jpg' },
      { id: 'corn-dogs', name: 'CORN DOGS', desc: 'Wurstel di pollo fritti in speciale panatura, due salse a scelta.', variants: [{ label: '2pz', price: 5.0 }], img: J+'img-8331-25145.jpg' },
      { id: 'pull-cheese', name: 'MAYO PULL CHEESE', desc: 'Bomba di pulled pork di nostra produzione, panata, ripiena di cheddar.', price: 3.0, img: J+'img-8333-25141.jpg' },
      { id: 'wings', name: 'CHICKEN WINGS', desc: 'Alette e coscette di pollo speziate, accompagnate da salsa ranch.', variants: [{ label: '4pz', price: 5.0 }], img: J+'img-8335-25142.jpg' },
      { id: 'onion-rings', name: 'ONION RINGS', desc: 'Croccanti anelli di cipolla bianca, con pastella alla birra.', variants: [{ label: '5pz', price: 4.0 }, { label: '8pz', price: 6.0 }], img: J+'photoroom-20240808-175031-25007.jpg' },
      { id: 'jalapeno-bites', name: 'JALAPENO BITES', desc: 'Bites di cheddar e green jalapeno.', variants: [{ label: '5pz', price: 4.0 }, { label: '10pz', price: 7.0 }], badges: ['HOT'], img: J+'img-8329-25143.jpg' },
      { id: 'cheese-bites', name: 'CHEESE BITES', desc: 'Bocconcini di camembert fritti, avvolti da croccante panatura.', variants: [{ label: '5pz', price: 4.0 }, { label: '10pz', price: 7.0 }], img: J+'img-8334-25144.jpg' },
    ],
  },
  {
    id: 'burgers', label: 'Mayo Burgers', emoji: '🍔',
    blurb: 'Burger buns, macinato sempre fresco di bovino, pollo 100% italiano allevato a terra, salse ideate da noi. Riconoscerai MAYO al primo morso.',
    items: [
      { id: 'spicy-kiki', name: 'SPICY KIKI 🌶️', desc: 'Petto di pollo croccante, cetrioli Oi Muchim fatti in casa, salsa ranch, maionese piccante.', price: 9.0, badges: ['LIMITED', 'HOT'], img: J+'photoroom-20260407-185314-30929.jpg' },
      { id: 'mayo-icon', name: 'MAYO ICON 🥓', desc: 'Doppio smash burger di bovino fresco, cheddar, bacon, CRISPY sauce.', variants: [{ label: 'Doppio', price: 9.0 }, { label: 'Triplo', price: 11.0 }], featured: true, badges: ['CHEF'], img: J+'photoroom-20260422-214716-31032.jpg' },
      { id: 'oklahoma', name: 'OKLAHOMA 🇺🇸', desc: 'Gusto americano. Smash burger con cipolle piastrate, cheddar, cetriolini, senape e ketchup.', variants: [{ label: 'Singolo', price: 7.0 }, { label: 'Doppio', price: 9.0 }], img: J+'photoroom-20250520-032431-28167.jpg' },
      { id: 'glorious', name: 'GLORIOUS 🍔', desc: 'Smash burger di bovino fresco, scamorza affumicata, pomodoro, iceberg, MAYOnese.', variants: [{ label: 'Singolo', price: 7.0 }, { label: 'Doppio', price: 9.0 }, { label: 'Triplo', price: 11.0 }], img: J+'photoroom-20240808-165713-25009.jpg' },
      { id: 'yankee', name: 'YANKEE 🇺🇸', desc: 'Smash burger di bovino fresco, cheddar, bacon, cipolla rossa caramellata, cetriolini, NEW YORK sauce.', variants: [{ label: 'Singolo', price: 7.5 }, { label: 'Doppio', price: 9.5 }, { label: 'Triplo', price: 11.5 }], img: J+'photoroom-20250313-050533-26897.jpg' },
      { id: 'bacon-hd', name: 'BACON HD 🥓', desc: 'Doppio smash burger, doppio edamer, doppio bacon, bacon jam (marmellata di cipolle e bacon), BACON sauce.', variants: [{ label: 'Doppio', price: 9.5 }, { label: 'Triplo', price: 11.5 }, { label: 'Quadruplo', price: 13.5 }], img: J+'photoroom-20250313-050610-26898.jpg' },
      { id: 'crazy-beer', name: "CRAZY BEER 🥜", desc: "Doppio smash burger di bovino fresco, x2 bacon, x4 cheddar, burro d'arachidi, salsa alla BIRRA artigianale.", variants: [{ label: 'Doppio', price: 9.5 }, { label: 'Triplo', price: 11.5 }, { label: 'Quadruplo', price: 13.5 }], img: J+'photoroom-20240808-163605-25012.jpg' },
      { id: 'new-mexico', name: 'NEW MEXICO 🇲🇽', desc: 'Doppio smash burger, doppio cheddar, onion rings, bacon, jalapeno, salsa ai PEPI.', variants: [{ label: 'Doppio', price: 10.0 }], badges: ['HOT'], img: J+'photoroom-20250313-050734-26899.jpg' },
      { id: 'little-pork', name: 'LITTLE PORK 🐷', desc: 'Smash burger, scamorza affumicata, pulled pork artigianale, rosti di patate homemade, salsa CHEDDAR artigianale.', variants: [{ label: 'Singolo', price: 11.0 }, { label: 'Doppio', price: 13.0 }], img: J+'photoroom-20240808-165110-25014.jpg' },
      { id: 'crispy-boy', name: 'CRISPY BOY 🥇', desc: 'Petto di pollo croccante, scamorza affumicata, patate al forno, cipolla caramellata, iceberg, salsa WESTERN.', price: 9.0, img: J+'photoroom-20250313-050653-26896.jpg' },
      { id: 'big-g', name: 'BIG G 🍗', desc: 'Petto di pollo croccante, bacon, cheddar, patate al forno, iceberg, MAYOnese al rosmarino.', price: 9.0, img: J+'photoroom-20250313-050819-26900.jpg' },
      { id: 'memory', name: 'MEMORY 🍗', desc: 'Petto di pollo croccante, iceberg, pomodoro, salsa 1869.', variants: [{ label: 'Singolo', price: 7.0 }], img: J+'photoroom-20240808-175515-25017.jpg' },
      { id: 'bold', name: 'BOLD 🥬', desc: 'Burger di melanzane homemade, cipolla rossa caramellata, pomodoro, iceberg, MAYOnese.', variants: [{ label: 'Singolo', price: 7.0 }], badges: ['VEG'], img: J+'photoroom-20250520-034454-28168.jpg' },
    ],
  },
  {
    id: 'baby', label: 'Baby Menu', emoji: '👦🏻',
    blurb: 'Per i più piccoli.',
    items: [
      { id: 'baby-menu', name: "BABY MAYO MENU'", desc: 'Panino con hamburger di bovino e salsa a scelta, servito con patatine fritte.', variants: [{ label: 'Smash burger', price: 7.0 }, { label: 'Pollo fritto', price: 8.0 }], img: J+'img-8337-25154.jpg' },
    ],
  },
  {
    id: 'dolci', label: 'Dolci', emoji: '🍰',
    blurb: 'Chiusura dolce.',
    items: [
      { id: 'ice-cream', name: 'SOFT ICE CREAM 🍦', desc: 'Coppetta di gelato soffice. Gusti: Nutella, Lotus Biscoff, Caramello salato, Frutti di bosco.', price: 4.5, img: J+'photoroom-20250520-034533-28169.jpg' },
      { id: 'souffle', name: 'SOUFFLÈ', desc: 'Cuore caldo al cioccolato o caramello.', price: 5.0, img: J+'photoroom-20250220-160928-26765.jpg' },
    ],
  },
  {
    id: 'spina', label: 'Spina', emoji: '🔌',
    blurb: 'Alla spina, sempre fresca.',
    items: [
      { id: 'bud', name: 'BUD (5%)', desc: 'Lager americana, rinfrescante, pulita, dissetante. Oro paglierino.', variants: [{ label: 'Piccola 25cl', price: 3.0 }, { label: 'Media 50cl', price: 5.0 }], img: J+'img-6483-21386.jpg' },
      { id: 'goose-ipa', name: 'GOOSE ISLAND IPA (5.9%) 🇺🇸', desc: 'India Pale Ale made in Chicago. Ambrato ramato, premiata come miglior IPA al mondo.', variants: [{ label: 'Piccola 25cl', price: 4.0 }, { label: 'Media 50cl', price: 7.0 }], img: J+'img-6831-22282.jpg' },
      { id: 'coca-spina', name: 'COCA-COLA', desc: 'Original taste.', variants: [{ label: 'Piccola 30cl', price: 3.0 }, { label: 'Media 50cl', price: 4.0 }], img: J+'img-6486-21388.jpg' },
    ],
  },
  {
    id: 'artigianali', label: 'Artigianali', emoji: '🍺',
    blurb: '"The Wall" e "Ibeer, Spirito Agricolo".',
    items: [
      { id: 'nyx', name: 'NYX (7.2%)', desc: 'Scottish Export Ale di Brasseria degli Enotri. Ambrata, note maltate e caramellate.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20251016-184833-29449.jpg' },
      { id: 'ore', name: 'ORE (5%) APA', desc: 'American Pale Ale di Brasseria degli Enotri. Ambrato, note agrumate di mandarino e pompelmo.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20251106-102811-29581.jpg' },
      { id: 'estia', name: 'ESTIA (4.8%) HELLES', desc: 'Munich Helles. Giallo paglierino, bevuta semplice ma fragrante.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20251106-102749-29582.jpg' },
      { id: 'lametus-bock', name: 'LAMETUS BOCK (7.5%)', desc: 'Intenso gusto di malto, corpo strutturato, gradazione sostenuta.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20260324-135101-30797.jpg' },
      { id: 'lametus-porter', name: 'LAMETUS SMOKED PORTER (6%)', desc: 'Scura, note di affumicato, torrefatto, caffè e cioccolato.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20260324-134849-30796.jpg' },
      { id: 'lametus-rice', name: 'LAMETUS RICE LAGER (2.5%)', desc: 'Japanese Rice Lager prodotta a Lamezia con riso di Sibari. Fresca, leggera.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20260427-110212-31376.jpg' },
      { id: 'rea', name: 'REA (5%) IRISH RED ALE', desc: 'Anglosassone, complessa ma beverina, schiuma cremosa color nocciola.', variants: [{ label: '33cl', price: 6.0 }], img: J+'photoroom-20260508-184126-31377.jpg' },
    ],
  },
  {
    id: 'bottiglia', label: 'Bottiglia', emoji: '🍺',
    blurb: 'Birre in bottiglia da tutto il mondo.',
    items: [
      { id: 'tennents', name: "TENNENT'S SUPER (9%) 🏴", desc: 'Strong lager prodotta in Scozia.', variants: [{ label: '33cl', price: 4.0 }], img: J+'img-7037-22637.jpg' },
      { id: 'leffe-b', name: 'LEFFE BLONDE (6.6%) 🇧🇪', desc: "Autentica birra d'Abbazia, gusto dolce e leggermente amaro.", variants: [{ label: '33cl', price: 5.0 }], img: J+'img-6365-21294.jpg' },
      { id: 'leffe-r', name: 'LEFFE ROSSA (6.6%) 🇧🇪', desc: 'Corposa e morbida. Malto, tostato di caffè, fiori e frutta candita.', variants: [{ label: '33cl', price: 5.0 }], img: J+'img-6363-21293.jpg' },
      { id: 'franziskaner', name: 'FRANZISKANER WEISSBIER (5%)', desc: 'Icona dello stile Weiss. Frumento, biondo, ricca schiuma bianca.', variants: [{ label: '50cl', price: 5.0 }], img: J+'photoroom-20250828-195051-29081.jpg' },
      { id: 'hobgoblin', name: 'HOBGOBLIN IPA (5%)', desc: 'Ambrata. Luppoli inglesi e americani. Note tropicali, agrumate ed erbacee.', variants: [{ label: '50cl', price: 7.0 }], img: J+'photoroom-20250828-195117-29082.jpg' },
    ],
  },
  {
    id: 'vini', label: 'Vini Bio', emoji: '🌿',
    blurb: 'Cantine calabresi. 100% biologici.',
    items: [
      { id: 'annibale', name: 'ANNIBALE (13%)', desc: 'Cantina Le Moire. Greco Nero 100%. Fruttato fresco, frutti di bosco e more mature.', variants: [{ label: '75cl', price: 18.0 }], img: J+'img-0401-28996.jpg' },
      { id: 'shemale', name: 'SHEMALE (12.5%)', desc: 'Cantina Le Moire. Vino rosé, profumi di fragole e lamponi.', variants: [{ label: '75cl', price: 18.0 }], img: J+'img-0403-28998.jpg' },
      { id: 'madre-goccia', name: 'MADRE GOCCIA (12.5%)', desc: 'Giallo paglierino, riflessi verdognoli. Floreale, albicocca secca, frutta esotica.', variants: [{ label: '75cl', price: 18.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-madre-goccia-18010.jpg' },
    ],
  },
  {
    id: 'mondo', label: 'Bevande Mondo', emoji: '🌎',
    blurb: 'Soft drink da tutto il pianeta.',
    items: [
      { id: 'bubble-tea', name: 'BUBBLE TEA', desc: 'Gusti: Blue tropical, pesca, fragola, passion fruit.', variants: [{ label: '440ml', price: 5.0 }], img: J+'photoroom-20250518-162650-28260.jpg' },
      { id: 'coca-vanilla', name: 'COCA-COLA VANILLA', desc: 'Coca cola gusto vaniglia.', variants: [{ label: '33cl', price: 3.0 }], img: J+'img-6437-21327.jpg' },
      { id: 'mountain-dew', name: 'MOUNTAIN DEW', desc: 'Bevanda gassata al gusto di limone, USA 1940.', variants: [{ label: '33cl', price: 3.0 }], img: J+'img-8480-25604.jpg' },
      { id: 'fanta-blue', name: 'FANTA BLUE BERRY', desc: 'Fanta gusto frutti di bosco.', variants: [{ label: '35,5cl', price: 3.0 }], img: J+'img-6436-21324.jpg' },
      { id: 'fanta-straw', name: 'FANTA STRAWBERRY', desc: 'Fanta gusto fragola.', variants: [{ label: '35,5cl', price: 3.0 }], img: J+'img-6438-21328.jpg' },
      { id: 'fanta-grape', name: 'FANTA GRAPE', desc: 'Fanta gusto uva.', variants: [{ label: '35,5cl', price: 3.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-6443-21330.jpg' },
      { id: 'dr-pepper', name: 'DR PEPPER VANILLA', desc: '', variants: [{ label: '33cl', price: 3.0 }], img: J+'photoroom-20251202-174240-29690.jpg' },
    ],
  },
  {
    id: 'bevande', label: 'Bevande', emoji: '🥤',
    blurb: 'Soft drink classici.',
    items: [
      { id: 'acqua', name: 'ACQUA', desc: 'Naturale o frizzante.', variants: [{ label: '50cl', price: 1.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-7741-23980.jpg' },
      { id: 'coca-zero', name: 'COCA-COLA ZERO', desc: 'Lattina.', variants: [{ label: '33cl', price: 2.0 }], img: J+'img-6366-21300.jpg' },
      { id: 'fanta', name: 'FANTA', desc: 'Lattina.', variants: [{ label: '33cl', price: 2.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-6369-21297.jpg' },
      { id: 'sprite', name: 'SPRITE', desc: 'Lattina.', variants: [{ label: '33cl', price: 2.0 }], img: J+'img-8354-25274.jpg' },
      { id: 'spezi', name: 'SPEZI', desc: 'Effervescente: cola, aranciata, limonata.', variants: [{ label: '33cl', price: 3.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-8485-25605.jpg' },
      { id: 'brasilena', name: 'BRASILENA', desc: 'Vetro.', price: 2.0, img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-6375-21302.jpg' },
      { id: 'estathe', name: "ESTATHE' PESCA/LIMONE", desc: 'Lattina.', variants: [{ label: '33cl', price: 2.0 }], img: 'https://www.jmenu.it/media/upload/mayo/item-menu/menu-digitale-jmenu-img-6372-21301.jpg' },
    ],
  },
]

export const MAYO_HOURS: HoursEntry[] = [
  { day: 'Lunedì', time: 'Chiuso', closed: true },
  { day: 'Martedì', time: '18:30 — 23:30' },
  { day: 'Mercoledì', time: '18:30 — 23:30' },
  { day: 'Giovedì', time: '18:30 — 23:30' },
  { day: 'Venerdì', time: '18:30 — 00:30' },
  { day: 'Sabato', time: '18:30 — 00:30' },
  { day: 'Domenica', time: '18:30 — 23:30' },
]

export const MAYO_INFO: SiteInfo = {
  address: 'Via Gesualdo Scardamaglia, 20',
  city: 'Lamezia Terme (CZ)',
  phone: '+39 380 346 2352',
  phoneRaw: '3803462352',
  instagram: 'mayo_lameziaterme',
  igUrl: 'https://www.instagram.com/mayo_lameziaterme',
  cover: 1.0,
  minOrder: 8.0,
}
