// ─── Services & Categories endpoints ──────────────────────────────────────────
// Real HTTP calls to the backend consumer service/category APIs.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { SERVICES, SERVICE_CATEGORIES } from '@/src/services/mock';
import type { Service, ServiceCategory } from '@/src/types';

/** Backend service shape from the Service model. */
interface BackendService {
  _id: string;
  name: string;
  provider: string;
  providerInitials: string;
  categoryId: string;
  categoryLabel: string;
  mcIcon: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  tags: string[];
  eta: string;
  verified: boolean;
  accentColor: string;
  accentBg: string;
  jobCount: number;
  shortDesc: string;
}

/** Backend category shape from the ServiceCategory model. */
interface BackendCategory {
  _id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  proCount: number;
}

function mapService(s: BackendService): Service {
  return {
    id: s._id,
    name: s.name,
    provider: s.provider,
    providerInitials: s.providerInitials,
    categoryId: s.categoryId,
    categoryLabel: s.categoryLabel,
    mcIcon: s.mcIcon,
    rating: s.rating,
    reviews: s.reviews,
    price: s.price,
    originalPrice: s.originalPrice,
    badge: s.badge as Service['badge'],
    tags: s.tags,
    eta: s.eta,
    verified: s.verified,
    accentColor: s.accentColor,
    accentBg: s.accentBg,
    jobCount: s.jobCount,
    shortDesc: s.shortDesc,
    variations: [], // variations loaded separately if needed
  };
}

function mapCategory(c: BackendCategory): ServiceCategory {
  return {
    id: c._id,
    name: c.name,
    icon: c.icon,
    color: c.color,
    bg: c.bg,
    proCount: c.proCount,
  };
}

export const servicesApi = {
  async listCategories(): Promise<ServiceCategory[]> {
    if (config.useMock) return mockDelay(SERVICE_CATEGORIES);
    const data = await apiClient.get<BackendCategory[]>('/consumer/categories');
    return data.map(mapCategory);
  },

  async listServices(categoryId?: string): Promise<Service[]> {
    if (config.useMock) return mockDelay(SERVICES);
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const data = await apiClient.get<BackendService[]>(`/consumer/services${query}`);
    return data.map(mapService);
  },

  async getService(id: string): Promise<Service | undefined> {
    if (config.useMock) return mockDelay(SERVICES.find((s) => s.id === id));
    try {
      const data = await apiClient.get<BackendService>(`/consumer/services/${id}`);
      return mapService(data);
    } catch {
      return undefined;
    }
  },
};

export default servicesApi;
