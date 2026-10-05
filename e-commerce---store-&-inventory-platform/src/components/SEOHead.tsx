import React, { useEffect } from 'react';
import { Product } from '../types/ecommerce.ts';

interface SEOHeadProps {
  title?: string;
  description?: string;
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'E-Commerce - Premium High-Fidelity Audio, Wearables & Workstation Gear',
  description = 'Shop concert-grade audio, precision smartwatches, mechanical keyboards and minimalist desk essentials with fast tracked delivery and guest checkout.',
  product
}) => {
  useEffect(() => {
    document.title = product ? `${product.name} | E-Commerce` : title;

    // Structured data injection
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';

    const schemaData = product ? {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: 'E-Commerce'
      },
      offers: {
        '@type': 'Offer',
        url: window.location.href,
        priceCurrency: 'USD',
        price: product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'E-Commerce',
      description: description,
      url: window.location.origin,
      currenciesAccepted: 'USD',
      paymentAccepted: 'Credit Card, Apple Pay, Google Pay',
      priceRange: '$$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        }
      ]
    };

    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('json-ld-schema');
      if (el) el.remove();
    };
  }, [title, description, product]);

  return null;
};
