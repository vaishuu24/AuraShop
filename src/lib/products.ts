export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceRaw: number;
  category: string;
  categoryCode: string;
  description: string;
  details: string[];
  sizes: string[];
  images: string[]; // placeholder colors / gradient strings until real images arrive
  version: string;
  isNew?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '01',
    slug: 'core-shell',
    title: 'CORE_SHELL',
    subtitle: 'Neural Exoskeleton Jacket',
    price: '$840.00',
    priceRaw: 840,
    category: 'OUTERWEAR',
    categoryCode: 'N.01',
    description:
      'The CORE_SHELL is engineered for the interface between organic and digital. Eight adaptive pressure zones respond in real-time to biometric data, shifting structural tension to maximise range of motion.',
    details: [
      'Graphene-reinforced shell membrane',
      'Adaptive pressure zone matrix (8-point)',
      'Embedded NFC-ready data port',
      'Thermal regulation layer — range: −20°C to 45°C',
      'Machine washable at 30°C',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['#1a1a1a', '#2a2a2a', '#0f0f0f'],
    version: 'v.2.5',
    isNew: true,
  },
  {
    id: '02',
    slug: 'neural-unit',
    title: 'NEURAL_UNIT',
    subtitle: 'Cognitive Interface Headset',
    price: '$1,200.00',
    priceRaw: 1200,
    category: 'TECH',
    categoryCode: 'T.02',
    description:
      'The NEURAL_UNIT bridges the gap between thought and action. Ultra-thin electrode mesh reads surface EEG signals, translating intent into device commands with sub-50ms latency.',
    details: [
      '128-channel EEG electrode mesh',
      'Bluetooth 5.3 LE & USB-C connectivity',
      '12-hour continuous operational battery',
      'Open-source SDK for third-party integration',
      'Titanium-alloy frame, under 180g',
    ],
    sizes: ['ONE SIZE', 'COMPACT'],
    images: ['#EB3333', '#c42626', '#8a1a1a'],
    version: 'v.3.1',
    isNew: true,
  },
  {
    id: '03',
    slug: 'void-frame',
    title: 'VOID_FRAME',
    subtitle: 'Photonic Lens Accessory',
    price: '$560.00',
    priceRaw: 560,
    category: 'ACCESSORY',
    categoryCode: 'A.03',
    description:
      'VOID_FRAME lenses refract ambient photonic data into a heads-up overlay. The polarisation filter adapts dynamically to ambient light, maintaining perfect contrast from arctic noon to urban midnight.',
    details: [
      'Adaptive photonic polarisation',
      'AR-ready micro-display substrate',
      'Titanium beta wire frame',
      'UV400 + blue-light blocking coating',
      'Compatible with NEURAL_UNIT',
    ],
    sizes: ['ONE SIZE'],
    images: ['#D1D5D8', '#b0b5b8', '#8a8f92'],
    version: 'v.1.8',
  },
  {
    id: '04',
    slug: 'pulse-vest',
    title: 'PULSE_VEST',
    subtitle: 'Biometric Monitoring Vest',
    price: '$920.00',
    priceRaw: 920,
    category: 'GEAR',
    categoryCode: 'G.04',
    description:
      'The PULSE_VEST turns your torso into a biometric command centre. Embedded sensors provide continuous cardiac, respiratory, and galvanic skin response data streamed live to the VEXO neural network.',
    details: [
      'Continuous cardiac rhythm monitor',
      'Respiratory rate sensors (front + rear)',
      'Galvanic skin response mesh',
      'VEXO Neural Network cloud sync',
      'Water-resistant (IPX5)',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['#3a3a3a', '#2d2d2d', '#1a1a1a'],
    version: 'v.2.0',
  },
  {
    id: '05',
    slug: 'echo-frame',
    title: 'ECHO_FRAME',
    subtitle: 'Data Stream Exo-Pants',
    price: '$680.00',
    priceRaw: 680,
    category: 'OUTERWEAR',
    categoryCode: 'N.05',
    description:
      'Engineered for unrestricted movement, the ECHO_FRAME pants feature articulated knee panels and a 4D-stretch waistband with embedded motion sensors that feed data to your VEXO ecosystem.',
    details: [
      '4D-stretch carbon composite fabric',
      'Articulated knee panels for mobility',
      'Embedded inertial movement unit (IMU)',
      'Six reinforced weatherproof pockets',
      'Reflective VEXO logo detail at hem',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    images: ['#4a4a4a', '#383838', '#262626'],
    version: 'v.1.5',
  },
  {
    id: '06',
    slug: 'singularity-bag',
    title: 'SINGULARITY',
    subtitle: 'Smart Cargo Carrier',
    price: '$490.00',
    priceRaw: 490,
    category: 'ACCESSORY',
    categoryCode: 'A.06',
    description:
      'The SINGULARITY cargo carrier integrates a 15W wireless charging bay, RFID-blocking compartments, and a tamper-alert system that notifies you via the VEXO app.',
    details: [
      '15W Qi wireless charging bay',
      'RFID-blocking main compartment',
      'Tamper-alert haptic notification',
      '30L modular capacity',
      'Ballistic nylon outer shell',
    ],
    sizes: ['ONE SIZE'],
    images: ['#1E1E2E', '#16161F', '#0e0e14'],
    version: 'v.2.2',
  },
  {
    id: '07',
    slug: 'kinetic-vest',
    title: 'KINETIC_VEST',
    subtitle: 'Thermal Adaptive Vest',
    price: '$760.00',
    priceRaw: 760,
    category: 'GEAR',
    categoryCode: 'G.07',
    description:
      'The KINETIC_VEST adapts to your core temperature via micro-channel thermodynamic panels, keeping you in the optimal 36–38°C range regardless of external conditions.',
    details: [
      'Active thermodynamic micro-channel panels',
      'Core temperature target: 36–38°C',
      'Breathable aerogel insulation layer',
      'VEXO Core App integration',
      'Machine washable at 40°C',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['#EB3333', '#d42c2c', '#a01f1f'],
    version: 'v.3.0',
    isNew: true,
  },
  {
    id: '08',
    slug: 'legacy-core',
    title: 'LEGACY_CORE',
    subtitle: 'Generational Data Archive',
    price: '$1,800.00',
    priceRaw: 1800,
    category: 'ARTIFACT',
    categoryCode: 'A.08',
    description:
      'The LEGACY_CORE is a limited-edition data artifact. Encased in aerospace aluminium, it stores a cryptographic identity key, your biometric signature, and a 1TB personal archive — designed to last 100 years.',
    details: [
      'Aerospace 7075 aluminium housing',
      '1TB encrypted personal archive',
      'Cryptographic identity key (ECC-521)',
      '100-year data retention guarantee',
      'Edition of 500 — individually numbered',
    ],
    sizes: ['LIMITED ED.'],
    images: ['#C8A97E', '#a8895e', '#8a6b3a'],
    version: 'v.LEGACY',
    isNew: false,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}
