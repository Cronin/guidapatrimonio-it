import Image from 'next/image';

type ImageName =
  | 'hero-milano-skyline'
  | 'milano-piazza-affari'
  | 'roma-palazzo-finanze'
  | 'svizzera-lugano'
  | 'como-villa-carlotta'
  | 'bce-francoforte';

interface FinanceImageProps {
  name: ImageName;
  alt?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

const IMAGE_METADATA: Record<ImageName, { description: string; width: number; height: number }> = {
  'hero-milano-skyline': {
    description: 'Skyline di Milano con Porta Nuova e grattacieli moderni',
    width: 2400,
    height: 1600
  },
  'milano-piazza-affari': {
    description: 'Centro finanziario di Milano',
    width: 2400,
    height: 1600
  },
  'roma-palazzo-finanze': {
    description: 'Architettura moderna a Roma',
    width: 2400,
    height: 1600
  },
  'svizzera-lugano': {
    description: 'Vista panoramica di Lugano e il suo lago',
    width: 2400,
    height: 1600
  },
  'como-villa-carlotta': {
    description: 'Villa storica sul Lago di Como',
    width: 2400,
    height: 1600
  },
  'bce-francoforte': {
    description: 'Skyline finanziario di Francoforte con grattacieli',
    width: 2400,
    height: 1600
  }
};

/**
 * Responsive finance image component with automatic WebP optimization
 *
 * @example
 * ```tsx
 * // Hero image with priority loading
 * <FinanceImage
 *   name="hero-milano-skyline"
 *   className="w-full h-[600px] object-cover"
 *   priority
 * />
 *
 * // Fill container
 * <div className="relative w-full h-96">
 *   <FinanceImage
 *     name="milano-piazza-affari"
 *     fill
 *     className="object-cover"
 *   />
 * </div>
 * ```
 */
export default function FinanceImage({
  name,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes = '100vw'
}: FinanceImageProps) {
  const metadata = IMAGE_METADATA[name];
  const altText = alt || metadata.description;

  // Generate srcSet for responsive images
  const srcSet = [
    `/images/finance/${name}-400w.webp 400w`,
    `/images/finance/${name}-640w.webp 640w`,
    `/images/finance/${name}-1280w.webp 1280w`,
    `/images/finance/${name}-1920w.webp 1920w`,
    `/images/finance/${name}.webp 2400w`
  ].join(', ');

  if (fill) {
    return (
      <Image
        src={`/images/finance/${name}.webp`}
        alt={altText}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        quality={90}
      />
    );
  }

  return (
    <Image
      src={`/images/finance/${name}.webp`}
      alt={altText}
      width={metadata.width}
      height={metadata.height}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={90}
    />
  );
}

/**
 * Image metadata for reference
 */
export const financeImages = {
  'hero-milano-skyline': {
    name: 'Milano Skyline',
    description: 'Skyline di Milano con Porta Nuova e grattacieli moderni',
    useFor: ['Homepage hero', 'Milano consulting page'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  },
  'milano-piazza-affari': {
    name: 'Piazza Affari Milano',
    description: 'Centro finanziario di Milano',
    useFor: ['Milano consulting page', 'Financial services section'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  },
  'roma-palazzo-finanze': {
    name: 'Roma EUR',
    description: 'Architettura moderna a Roma',
    useFor: ['Roma consulting page'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  },
  'svizzera-lugano': {
    name: 'Lugano Lago',
    description: 'Vista panoramica di Lugano e il suo lago',
    useFor: ['Switzerland consulting page'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  },
  'como-villa-carlotta': {
    name: 'Lago di Como Villa',
    description: 'Villa storica sul Lago di Como',
    useFor: ['Luxury real estate page', 'High net worth services'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  },
  'bce-francoforte': {
    name: 'BCE Francoforte',
    description: 'Skyline finanziario di Francoforte con grattacieli',
    useFor: ['Macroeconomic dashboard', 'European finance section'],
    sizes: ['400w', '640w', '1280w', '1920w', '2400w']
  }
} as const;
