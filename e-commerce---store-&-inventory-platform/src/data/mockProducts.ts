import { Product } from '../types/ecommerce.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'AURA-NC700',
    name: 'Aura Studio ANC Headphones',
    tagline: 'Spatial audio with custom 45mm neodymium acoustic drivers',
    description: 'Immerse yourself in concert-grade high-fidelity sound. Designed with aircraft-grade aluminum, ultra-soft lambskin memory foam ear cushions, and dynamic active noise cancellation with transparency mode.',
    price: 349,
    originalPrice: 399,
    category: 'Audio',
    rating: 4.9,
    reviewCount: 328,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Hybrid active noise cancellation with 6-mic beamforming array',
      'Custom acoustic chamber tuned for deep sub-bass and crisp highs',
      'Up to 48 hours of playback with fast charge (10 mins = 5 hours)',
      'Multipoint Bluetooth 5.3 connection with low-latency gaming mode'
    ],
    specs: {
      'Battery Life': '48 hours (ANC off) / 36 hours (ANC on)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm lossless analog',
      'Weight': '255 grams',
      'Driver Size': '45mm Neodymium',
      'Warranty': '2 Years International'
    },
    isFeatured: true,
    isNewArrival: false,
    badge: 'Bestseller',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'prod-2',
    sku: 'AURA-WCH4X',
    name: 'Aura Chrono Smartwatch Ultra',
    tagline: 'Titanium chassis with dual-frequency GPS & AMOLED display',
    description: 'Precision engineered for extreme sports and everyday luxury. Features Sapphire crystal glass, continuous heart rate & ECG tracking, blood oxygen sensing, and 100m water resistance.',
    price: 499,
    originalPrice: 549,
    category: 'Wearables',
    rating: 4.8,
    reviewCount: 194,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Grade 5 Aerospace Titanium case with sapphire glass face',
      'Always-on 1.9-inch 120Hz Ultra Bright AMOLED (2000 nits)',
      'Comprehensive biometrics: ECG, HRV, sleep stage, VO2 max',
      '7-day typical battery life, wireless magnetic fast charger'
    ],
    specs: {
      'Water Resistance': '10 ATM / 100 meters',
      'Case Material': 'Grade 5 Aerospace Titanium',
      'Sensors': 'Optical HR, ECG, SpO2, Barometer, Compass',
      'Battery': '500mAh (Up to 7 days)',
      'Compatibility': 'iOS 15+ and Android 10+'
    },
    isFeatured: true,
    isNewArrival: true,
    badge: 'New Flagship',
    createdAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'prod-3',
    sku: 'AURA-KB900',
    name: 'Tactile Pro Wireless Mechanical Keyboard',
    tagline: 'Hot-swappable gasket-mounted aluminum mechanical workstation',
    description: 'Crafted for creators and developers who demand acoustic perfection and satisfying tactile feedback. CNC-machined solid anodized aluminum body with custom lubricated switches and PBT dye-sub keycaps.',
    price: 189,
    originalPrice: 219,
    category: 'Home & Workspace',
    rating: 4.9,
    reviewCount: 412,
    stock: 4, // low stock test
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Triple connection mode: 2.4GHz wireless, Bluetooth 5.1, USB-C wired',
      'Gasket mount architecture with Poron sound-dampening foam',
      'Hot-swappable PCB supporting 3-pin & 5-pin mechanical switches',
      'South-facing RGB per-key backlight with VIA/QMK programmable macros'
    ],
    specs: {
      'Layout': '75% Compact (82 keys)',
      'Switch Type': 'Pre-lubed Factory Tactile Aura Jade',
      'Plate Material': 'FR4 / Polycarbonate switch plate',
      'Weight': '1.38 kg solid CNC aluminum',
      'Battery': '4000mAh (Up to 200 hours backlight off)'
    },
    isFeatured: true,
    isNewArrival: false,
    badge: 'Low Stock',
    createdAt: '2026-08-20T08:15:00Z'
  },
  {
    id: 'prod-4',
    sku: 'AURA-DSK34',
    name: 'Aura Curved Studio Display 34"',
    tagline: 'UWQHD Nano IPS 165Hz color-calibrated panoramic monitor',
    description: 'Redefine productivity and entertainment. 3440x1440px wide aspect ratio with 99% DCI-P3 color gamut, integrated 90W USB-C Power Delivery, and built-in KVM switch for multi-device workflows.',
    price: 799,
    originalPrice: 899,
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 156,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '34-inch 1900R curvature panoramic Ultrawide QHD (3440 x 1440)',
      'Nano IPS panel with 1ms GtG response time and HDR600 certification',
      'USB-C single cable solution with 90W Power Delivery and Ethernet',
      'Integrated auto-dimming ambient light sensor and blue light shield'
    ],
    specs: {
      'Resolution': '3440 x 1440 pixels at 165Hz',
      'Color Gamut': '98% DCI-P3, 100% sRGB Delta E < 1.5',
      'Ports': '1x USB-C (90W PD), 2x HDMI 2.1, 1x DP 1.4, 4x USB-A Hub',
      'Brightness': '600 nits Peak HDR'
    },
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-12T16:00:00Z'
  },
  {
    id: 'prod-5',
    sku: 'AURA-EARS2',
    name: 'Aura Air Wireless Earbuds Pro',
    tagline: 'Ultra-compact earbuds with wireless charging case',
    description: 'Effortless all-day audio companion with crystal-clear phone calls, pressure-relieving silicone vents, IPX7 sweat & water resistance, and Qi-compatible charging.',
    price: 149,
    originalPrice: 179,
    category: 'Audio',
    rating: 4.6,
    reviewCount: 520,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '11mm graphene composite drivers for distortion-free audio',
      'Transparency mode and adaptive noise reduction for commutes',
      'IPX7 water & workout sweat proofing',
      'Total 32 hours battery with USB-C and wireless charging pad'
    ],
    specs: {
      'Weight': '4.2g per earbud',
      'Playtime': '8h single charge / 32h total with case',
      'Codecs': 'AAC, SBC, aptX Adaptive',
      'Microphones': '6 MEMS microphones with AI wind noise cancellation'
    },
    isFeatured: false,
    isNewArrival: true,
    badge: 'Popular',
    createdAt: '2026-09-10T11:00:00Z'
  },
  {
    id: 'prod-6',
    sku: 'AURA-MS700',
    name: 'Ergonomic Precision Wireless Mouse',
    tagline: 'Natural handshake angle with silent clicks & thumb wheel',
    description: 'Engineered by ergonomists to reduce muscle strain by 40%. Features high-accuracy Darkfield tracking on any surface including glass, horizontal scrolling thumb wheel, and rapid USB-C charging.',
    price: 99,
    originalPrice: 119,
    category: 'Accessories',
    rating: 4.8,
    reviewCount: 280,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '57-degree natural vertical handshake angle promotes healthy posture',
      '4000 DPI high-precision sensor tracks on glass & polished surfaces',
      'Quiet acoustic dampeners reduce click sound by 90%',
      'Connects up to 3 devices simultaneously with easy-switch toggle'
    ],
    specs: {
      'DPI': '400 to 4000 DPI (customizable in 50 DPI increments)',
      'Connectivity': 'Logi-Bolt Wireless + Bluetooth LE',
      'Battery': 'Rechargeable 500mAh Li-Po (up to 70 days per charge)',
      'Buttons': '6 programmable buttons'
    },
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-06-25T09:30:00Z'
  },
  {
    id: 'prod-7',
    sku: 'AURA-PWR100',
    name: 'GaN III 140W Quad Fast Charger',
    tagline: 'Next-gen Gallium Nitride pocket desktop charging station',
    description: 'Charges your MacBook Pro, iPad, iPhone, and Apple Watch all at full speed simultaneously. Advanced GaN III architecture delivers maximum energy efficiency while staying cool to the touch.',
    price: 89,
    originalPrice: 109,
    category: 'Accessories',
    rating: 4.9,
    reviewCount: 310,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      '140W PD 3.1 ultra-fast charging capability via USB-C1',
      '3x USB-C ports + 1x USB-A port with dynamic power distribution',
      'Intelligent temperature monitoring over 3 million times per day',
      'Compact foldable prongs with worldwide 100-240V compatibility'
    ],
    specs: {
      'Output': '140W Max total power output',
      'Port Layout': '3x USB-C (PD 3.1/3.0/PPS) + 1x USB-A (QC 3.0)',
      'Technology': 'Gallium Nitride (GaN III)',
      'Dimensions': '75 x 75 x 30 mm'
    },
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-29T13:45:00Z'
  },
  {
    id: 'prod-8',
    sku: 'AURA-LMP10',
    name: 'Architect Screenbar Halo Light',
    tagline: 'Zero screen glare monitor light bar with wireless remote puck',
    description: 'Saves desk space while illuminating your workspace with circadian rhythm matching light. Asymmetrical optical design illuminates your keyboard and documents without reflecting off the monitor.',
    price: 139,
    originalPrice: 169,
    category: 'Home & Workspace',
    rating: 4.9,
    reviewCount: 215,
    stock: 3, // low stock test
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'Patented asymmetrical optical design prevents screen reflection',
      'Precision wireless rotary puck controller for brightness & color temp',
      'Auto-dimming ambient light sensor for optimal eye comfort',
      'Ra95 ultra-high color rendering index shows true realistic colors'
    ],
    specs: {
      'Color Temperature': '2700K - 6500K stepless adjustment',
      'CRI (Ra)': '>95',
      'Power Input': '5V 2A USB-C port',
      'Compatibility': 'Flat and curved monitors 0.7cm to 6cm thick'
    },
    isFeatured: true,
    isNewArrival: true,
    badge: 'Staff Pick',
    createdAt: '2026-09-18T15:20:00Z'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-9481',
    userId: 'usr-customer-1',
    isGuest: false,
    items: [
      {
        productId: 'prod-1',
        productName: 'Aura Studio ANC Headphones',
        price: 349,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        sku: 'AURA-NC700'
      }
    ],
    subtotal: 349,
    discount: 34.9,
    discountCode: 'AURA10',
    shippingFee: 0,
    tax: 25.13,
    total: 339.23,
    paymentMethod: 'card' as const,
    paymentStatus: 'paid' as const,
    transactionId: 'TXN-83921820',
    shippingAddress: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 839-2041',
      addressLine1: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    status: 'shipped' as const,
    carrier: 'FedEx Express',
    trackingNumber: 'FDX-839104829US',
    estimatedDelivery: 'Tomorrow, Oct 6, 2026 by 7:00 PM',
    timeline: [
      {
        status: 'pending' as const,
        title: 'Order Confirmed',
        description: 'Payment authorized and receipt emailed to buyer',
        timestamp: '2026-10-04T08:14:00Z',
        completed: true
      },
      {
        status: 'processing' as const,
        title: 'Packaging & Quality Audit',
        description: 'Inventory picked and boxed with eco-friendly void fill',
        timestamp: '2026-10-04T11:30:00Z',
        completed: true
      },
      {
        status: 'shipped' as const,
        title: 'Dispatched with FedEx Express',
        description: 'Departed sorting facility in Oakland Logistics Hub',
        timestamp: '2026-10-04T18:45:00Z',
        completed: true
      },
      {
        status: 'out_for_delivery' as const,
        title: 'Out for Delivery',
        description: 'Courier en route to final destination address',
        timestamp: 'Estimated Oct 6',
        completed: false
      },
      {
        status: 'delivered' as const,
        title: 'Delivered',
        description: 'Package handed directly to resident or doorstep',
        timestamp: 'Estimated Oct 6',
        completed: false
      }
    ],
    createdAt: '2026-10-04T08:14:00Z',
    updatedAt: '2026-10-04T18:45:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-9482',
    isGuest: true,
    guestEmail: 'clara.design@guest.com',
    items: [
      {
        productId: 'prod-3',
        productName: 'Tactile Pro Wireless Mechanical Keyboard',
        price: 189,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        sku: 'AURA-KB900'
      },
      {
        productId: 'prod-6',
        productName: 'Ergonomic Precision Wireless Mouse',
        price: 99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        sku: 'AURA-MS700'
      }
    ],
    subtotal: 288,
    discount: 0,
    shippingFee: 0,
    tax: 23.04,
    total: 311.04,
    paymentMethod: 'apple_pay' as const,
    paymentStatus: 'paid' as const,
    transactionId: 'TXN-99120344',
    shippingAddress: {
      fullName: 'Clara Oswald',
      email: 'clara.design@guest.com',
      phone: '+1 (555) 234-5678',
      addressLine1: '1240 Broadway Ave, Apt 4B',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States'
    },
    status: 'processing' as const,
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'Wednesday, Oct 8, 2026',
    timeline: [
      {
        status: 'pending' as const,
        title: 'Order Confirmed',
        description: 'Apple Pay transaction validated',
        timestamp: '2026-10-05T01:10:00Z',
        completed: true
      },
      {
        status: 'processing' as const,
        title: 'Processing Order',
        description: 'Items allocated from Warehouse B',
        timestamp: '2026-10-05T01:30:00Z',
        completed: true
      },
      {
        status: 'shipped' as const,
        title: 'Awaiting Carrier Pickup',
        description: 'Label printed, ready for UPS dispatch',
        timestamp: 'Estimated Oct 5 afternoon',
        completed: false
      }
    ],
    createdAt: '2026-10-05T01:10:00Z',
    updatedAt: '2026-10-05T01:30:00Z'
  }
];

export const MOCK_USERS = [
  {
    id: 'usr-customer-1',
    email: 'alex.rivera@example.com',
    name: 'Alex Rivera',
    role: 'customer' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    addresses: [
      {
        fullName: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 839-2041',
        addressLine1: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States'
      }
    ],
    savedPaymentMethod: {
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2028
    }
  },
  {
    id: 'usr-admin-1',
    email: 'sarah.chen@auracommerce.com',
    name: 'Sarah Chen (Admin)',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    addresses: [
      {
        fullName: 'Sarah Chen',
        email: 'sarah.chen@auracommerce.com',
        phone: '+1 (555) 123-9900',
        addressLine1: '100 Innovation Way, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States'
      }
    ]
  }
];
