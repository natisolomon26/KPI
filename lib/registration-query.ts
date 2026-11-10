const searchFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'university', 'campus', 'department', 'currentLocation'];
const sorts: Record<string, Record<string, 1 | -1>> = {
  newest: { registeredAt: -1, _id: -1 },
  oldest: { registeredAt: 1, _id: 1 },
  name: { firstName: 1, lastName: 1, _id: 1 },
};

export function buildRegistrationQuery(params: URLSearchParams) {
  const requestedPage = Number(params.get('page') || 1);
  const requestedLimit = Number(params.get('limit') || 10);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 10;
  const query: Record<string, unknown> = {};
  const search = params.get('search')?.trim().slice(0, 120);

  // Treat search as literal text and allow partial names, emails, and phone numbers.
  // Separate words can match different fields, so a full name works naturally.
  if (search) {
    query.$and = search.split(/\s+/).slice(0, 10).map(term => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return { $or: searchFields.map(field => ({ [field]: { $regex: escaped, $options: 'i' } })) };
    });
  }
  for (const field of ['university', 'department', 'graduationYear']) {
    const value = params.get(field)?.trim();
    if (value) query[field] = value;
  }
  const sortKey = params.get('sort') || 'newest';
  const sort = Object.hasOwn(sorts, sortKey) ? sorts[sortKey] : sorts.newest;
  return { query, sort, page, limit };
}
