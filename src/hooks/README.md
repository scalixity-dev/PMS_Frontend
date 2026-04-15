# Data Fetching — TanStack Query Pattern

All server data MUST be fetched via TanStack Query hooks. Direct `fetch()` inside
components is acceptable ONLY for:

- Auth pre-login flows (login, register, OTP) where session doesn't exist yet
- Streaming/chunked responses (AI chat SSE)
- One-off pre-form uploads (file upload to S3)

Everything else — lists, details, mutations — goes through a hook.

## Pattern

```ts
// 1. Service method (services/<feature>.service.ts)
async getAll(filters?) {
  const res = await fetch(API_ENDPOINTS.FEATURE.GET_ALL, { credentials: 'include' });
  const data = await res.json();
  // Unwrap pagination response if needed
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

// 2. Hook (hooks/use<Feature>Queries.ts)
export const useGetAllFeature = (filters?, enabled = true) =>
  useQuery({
    queryKey: ['feature', 'list', filters] as const,
    queryFn: () => featureService.getAll(filters),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => featureService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature', 'list'] });
    },
  });
};

// 3. Component
const { data = [], isLoading, error } = useGetAllFeature();
const createMutation = useCreateFeature();

// Map raw data via useMemo (never store in useState)
const mapped = useMemo(() => data.map(transform), [data]);
```

## Cache Invalidation

All mutations MUST invalidate related query keys on success. This keeps lists in
sync after create/update/delete without manual refetching.

```ts
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() });
  queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(variables.id) });
}
```

## Pagination Responses

Backend returns either:
- `[...]` — when no pagination params sent
- `{ data: [...], pagination: {...} }` — when `_page` / `_limit` present

Service layer MUST unwrap to array. Use the `unwrapArrayResponse` helper at
`services/utils/unwrapResponse.ts`.

## Toast Feedback

Mutations should show toast on success/error:
```ts
import { useToast } from 'components/common/Toast';

const toast = useToast();

try {
  await mutation.mutateAsync(data);
  toast.success('Saved!');
} catch (err) {
  toast.error(err.message || 'Save failed');
}
```

## Files Migrated to TanStack (consistent pattern)
- All services/*.service.ts — provide wrapper methods
- All hooks/use*Queries.ts — provide TanStack hooks
- UserApplications.tsx — useGetAllApplications + useMemo derivation

## Deferred Migrations (tracked)

These still use `useEffect + fetch` due to complex filter-derivation logic.
Hooks exist (`useGetPublicListings`, `useGetPublicPropertyDetail`); components
need a larger refactor to swap patterns without regressions:

- `userdashboard/features/Properties/UserProperties.tsx` — complex filter state
  built from URL params + user preferences + local filters
- `userdashboard/features/Properties/UserPropertyDetail.tsx` — heavy inline
  data mapping in useEffect

Convert in a dedicated task when refactoring those pages.
