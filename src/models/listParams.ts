import { z, type ZodObject, type ZodString, type ZodUnion, type ZodArray, type ZodEffects } from 'zod'
import { Matcher } from '@realtimeregister/api'

const matcherKeys: string[] = Object.keys(Matcher)

export const ListFilterSchema: ZodObject<{
  field: ZodString,
  matcher: ZodEffects<ZodString, string, string>,
  value: ZodUnion<[ZodString, ZodArray<ZodString>]>
}> = z.object({
  field: z.string().describe('Field to filter by'),
  matcher: z.string().refine(v => matcherKeys.includes(v), { message: 'Invalid matcher' }),
  value: z.union([ z.string(), z.array(z.string()) ]).describe('Value to match against')
})

export const ListParamsInputSchema = {
  limit: z.number().optional().describe('Limit for pagination, e.g. 10'),
  offset: z.number().optional().describe('Offset for pagination, e.g. 10'),
  order: z.array(z.string()).optional().describe('Order by fields, e.g. ["domainName", "-registrant"]'),
  total: z.boolean().optional().describe('Include total count in the response'),
  q: z.string().optional().describe('Search query'),
  fields: z.array(z.string()).optional().describe('Fields to include in the response'),
  filters: z.array(ListFilterSchema).optional().describe('Filters to apply to the list')
}