import { MetadataRoute } from 'next';

const BASE = 'https://icing.co.il';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/',               priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/immersion',      priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/booking',        priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/instructors',    priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact',        priority: 0.6, changeFrequency: 'monthly' },
    { path: '/science',        priority: 0.8, changeFrequency: 'monthly' },
    { path: '/noradrenaline',  priority: 0.8, changeFrequency: 'monthly' },
    { path: '/cortisol',       priority: 0.8, changeFrequency: 'monthly' },
    { path: '/dopamine',       priority: 0.8, changeFrequency: 'monthly' },
    { path: '/inflammation',   priority: 0.8, changeFrequency: 'monthly' },
    { path: '/icing-faq.html', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/reviews',        priority: 0.6, changeFrequency: 'weekly'  },
  ] as const;

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
