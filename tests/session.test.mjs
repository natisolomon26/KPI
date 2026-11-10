import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Compile the actual store/service modules in isolation; no browser or database needed.
function loadTs(relativePath, mocks = {}) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const loaded = new Module(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/')) return loadTs(`${name.slice(2)}.ts`, mocks);
    return originalRequire(name);
  };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}
const user = { id: 'u1', email: 'member@example.com', firstName: 'Test', lastName: 'Member', role: 'user' };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function store(service) {
  return loadTs('store/auth.store.ts', { '@/services/auth.service': { authService: service } }).useAuthStore;
}

test('session starts uninitialized and concurrent checks share one request', async () => {
  const pending = deferred(); let calls = 0;
  const auth = store({ getCurrentUser: () => { calls++; return pending.promise; } });
  assert.equal(auth.getState().hasInitialized, false);
  assert.equal(auth.getState().isLoading, true);
  const first = auth.getState().checkAuth();
  const second = auth.getState().checkAuth();
  assert.equal(calls, 1);
  pending.resolve({ success: false });
  await Promise.all([first, second]);
  assert.equal(auth.getState().hasInitialized, true);
  assert.equal(auth.getState().isLoading, false);
  assert.equal(auth.getState().isAuthenticated, false);
});

test('an old unauthenticated session response cannot overwrite a successful login', async () => {
  const pending = deferred(); let credentials;
  const auth = store({ getCurrentUser: () => pending.promise, login: async value => {
    credentials = value; return { success: true, user };
  }});
  const checking = auth.getState().checkAuth();
  const result = await auth.getState().login(' MEMBER@Example.com ', 'password');
  pending.resolve({ success: false });
  await checking;
  assert.equal(result.success, true);
  assert.equal(credentials.email, 'member@example.com');
  assert.equal(auth.getState().isAuthenticated, true);
  assert.deepEqual(auth.getState().user, user);
});

test('invalid credentials clear auth and preserve the actionable error', async () => {
  const auth = store({ login: async () => ({ success: false, message: 'Invalid email or password' }) });
  const result = await auth.getState().login(user.email, 'wrong');
  assert.equal(result.success, false);
  assert.equal(auth.getState().isLoading, false);
  assert.equal(auth.getState().isAuthenticated, false);
  assert.equal(auth.getState().error, 'Invalid email or password');
});

test('reload restores the user from the cookie-backed session and forced check catches expiry', async () => {
  let valid = true;
  const auth = store({ getCurrentUser: async () => valid ? { success: true, user } : { success: false } });
  await auth.getState().checkAuth();
  assert.equal(auth.getState().isAuthenticated, true);
  valid = false;
  await auth.getState().checkAuth(true);
  assert.equal(auth.getState().isAuthenticated, false);
});

test('logout invalidates a pending successful session check', async () => {
  const pending = deferred();
  const auth = store({ getCurrentUser: () => pending.promise, logout: async () => ({ success: true }) });
  const checking = auth.getState().checkAuth();
  await auth.getState().logout();
  pending.resolve({ success: true, user });
  await checking;
  assert.equal(auth.getState().isAuthenticated, false);
  assert.equal(auth.getState().user, null);
});

test('failed logout retains the session so the UI does not falsely report success', async () => {
  const auth = store({ logout: async () => ({ success: false, message: 'Network unavailable' }) });
  auth.getState().setUser(user);
  await assert.rejects(auth.getState().logout(), /Network unavailable/);
  assert.equal(auth.getState().isAuthenticated, true);
  assert.equal(auth.getState().isLoading, false);
});

test('registration honors the session cookie created by the endpoint', async () => {
  const auth = store({ register: async () => ({ success: true, user }) });
  await auth.getState().register({ ...user, password: 'password' });
  assert.equal(auth.getState().isAuthenticated, true);
});

test('auth service accepts existing API response shape and sends credentials', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => { calls.push({ url, options }); return Response.json({ user, message: 'Login successful' }); };
  try {
    const { authService } = loadTs('services/auth.service.ts');
    const response = await authService.login({ email: user.email, password: 'password' });
    assert.equal(response.success, true);
    assert.deepEqual(response.user, user);
    assert.equal(calls[0].options.credentials, 'include');
    await authService.getCurrentUser();
    assert.equal(calls[1].options.cache, 'no-store');
  } finally { global.fetch = originalFetch; }
});

test('registration service makes one request, forwards cancellation and exposes 401 status', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => { calls.push({ url, options }); return Response.json({ data: [] }); };
  try {
    const { registrationService, RegistrationRequestError } = loadTs('services/registration.service.ts');
    const controller = new AbortController();
    await registrationService.getAllRegistrations(2, 5, 'Test Person', controller.signal);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /page=2&limit=5&search=Test\+Person/);
    assert.equal(calls[0].options.signal, controller.signal);
    global.fetch = async () => Response.json({ error: 'Please login' }, { status: 401 });
    await assert.rejects(registrationService.getAllRegistrations(), error => error instanceof RegistrationRequestError && error.status === 401);
  } finally { global.fetch = originalFetch; }
});


test('an older logout cannot clear a newer login', async () => {
  const pending = deferred();
  const auth = store({ logout: () => pending.promise, login: async () => ({ success: true, user }) });
  auth.getState().setUser(user);
  const loggingOut = auth.getState().logout();
  await auth.getState().login(user.email, 'password');
  pending.resolve({ success: true });
  await loggingOut;
  assert.equal(auth.getState().isAuthenticated, true);
});

test('dashboard insights cover all records, fill missing months, and use Ethiopian month boundaries', async () => {
  let pipeline;
  const originalNow = Date.now;
  Date.now = () => Date.parse('2026-12-31T21:30:00Z'); // January 1 in Addis Ababa.
  const result = {
    topUniversities: [{ _id: 'Example University', count: 12 }],
    monthlyRegistrations: [{ _id: '2027-01', count: 3 }],
    totalCount: [{ count: 12 }], uniqueUniversities: [{ count: 1 }],
    thisMonth: [{ count: 3 }], uniqueLocations: [{ count: 2 }],
  };
  const model = {
    find: () => ({ sort: () => ({ skip: () => ({ limit: async () => [] }) }) }),
    countDocuments: async () => 12,
    aggregate: async value => { pipeline = value; return [result]; },
  };
  try {
    const { GET } = loadTs('app/api/registrations/route.ts', {
      '@/lib/mongodb': async () => {},
      '@/models/Registration': model,
      '@/lib/auth': { verifyAuth: async () => ({ isAuthenticated: true, user }) },
    });
    const response = await GET(new Request('http://localhost/api/registrations?page=2&limit=5'));
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.stats.total, 12);
    assert.equal(body.insights.topUniversities[0].count, 12);
    assert.deepEqual(body.insights.monthlyRegistrations.map(item => item.month), ['2026-08','2026-09','2026-10','2026-11','2026-12','2027-01']);
    assert.deepEqual(body.insights.monthlyRegistrations.map(item => item.count), [0,0,0,0,0,3]);
    assert.equal(pipeline[0].$facet.thisMonth[0].$match.registeredAt.$gte.toISOString(), '2026-12-31T21:00:00.000Z');
    assert.equal(pipeline[0].$facet.monthlyRegistrations[0].$match.registeredAt.$gte.toISOString(), '2026-07-31T21:00:00.000Z');
  } finally { Date.now = originalNow; }
});

test('registration listing rejects an anonymous request before querying the database', async () => {
  let connected = false;
  const { GET } = loadTs('app/api/registrations/route.ts', {
    '@/lib/mongodb': async () => { connected = true; },
    '@/models/Registration': {},
    '@/lib/auth': { verifyAuth: async () => ({ isAuthenticated: false }) },
  });
  const response = await GET(new Request('http://localhost/api/registrations'));
  assert.equal(response.status, 401);
  assert.equal(connected, false);
});


test('directory search matches partial full names and treats regex symbols literally', () => {
  const { buildRegistrationQuery } = loadTs('lib/registration-query.ts');
  const matches = (query, record) => query.$and.every(term => term.$or.some(condition => {
    const [field, expression] = Object.entries(condition)[0];
    return new RegExp(expression.$regex, expression.$options).test(record[field] || '');
  }));
  const { query } = buildRegistrationQuery(new URLSearchParams({ search: 'Hana Tes' }));
  assert.equal(matches(query, { firstName: 'Hana', lastName: 'Tesfaye' }), true);
  assert.equal(matches(query, { firstName: 'Hana', lastName: 'Abel' }), false);
  const literal = buildRegistrationQuery(new URLSearchParams({ search: 'C++' })).query;
  assert.equal(matches(literal, { department: 'C++ Programming' }), true);
  assert.equal(matches(literal, { department: 'Computer Science' }), false);
  const symbols = buildRegistrationQuery(new URLSearchParams({ search: '.*' })).query;
  assert.equal(matches(symbols, { firstName: 'Anything' }), false);
});

test('directory query combines exact filters, stable sorting and bounded pagination', () => {
  const { buildRegistrationQuery } = loadTs('lib/registration-query.ts');
  const result = buildRegistrationQuery(new URLSearchParams({ university: 'Example College', graduationYear: '2024', sort: 'name', page: '-3', limit: '1000' }));
  assert.equal(result.query.university, 'Example College');
  assert.equal(result.query.graduationYear, '2024');
  assert.equal(result.page, 1);
  assert.equal(result.limit, 100);
  assert.deepEqual(result.sort, { firstName: 1, lastName: 1, _id: 1 });
  const invalid = buildRegistrationQuery(new URLSearchParams({ sort: '__proto__', page: 'hello', limit: '0' }));
  assert.equal(invalid.page, 1);
  assert.equal(invalid.limit, 10);
  assert.deepEqual(invalid.sort, { registeredAt: -1, _id: -1 });
});

test('directory service forwards institution, year and sort filters to the API', async () => {
  const originalFetch = global.fetch;
  let requestedUrl;
  global.fetch = async url => { requestedUrl = new URL(url, 'http://localhost'); return Response.json({ data: [] }); };
  try {
    const { registrationService } = loadTs('services/registration.service.ts');
    await registrationService.getAllRegistrations(2, 25, 'Hana', undefined, { university: 'Example College', graduationYear: '2024', sort: 'oldest' });
    assert.equal(requestedUrl.searchParams.get('university'), 'Example College');
    assert.equal(requestedUrl.searchParams.get('graduationYear'), '2024');
    assert.equal(requestedUrl.searchParams.get('sort'), 'oldest');
    assert.equal(requestedUrl.searchParams.get('limit'), '25');
  } finally { global.fetch = originalFetch; }
});

test('analytics windows use Ethiopian month boundaries and equal-duration comparisons', () => {
  const { analyticsWindow, parseAnalyticsFilters } = loadTs('lib/analytics.ts');
  const now = new Date('2026-12-31T21:30:00Z');
  const window = analyticsWindow('3m', now);
  assert.equal(window.start.toISOString(), '2026-10-31T21:00:00.000Z');
  assert.deepEqual(window.months, ['2026-11', '2026-12', '2027-01']);
  assert.equal(window.start - window.previousStart, now - window.start);
  const all = analyticsWindow('all', now);
  assert.equal(all.start, null);
  assert.equal(all.previousStart, null);
  assert.equal(all.months.length, 12);
  assert.throws(() => parseAnalyticsFilters(new URLSearchParams('range=__proto__')), /valid registration period/);
  assert.throws(() => parseAnalyticsFilters(new URLSearchParams('graduationYear=bad')), /valid graduation year/);
});

async function analyticsFixture(range = '3m') {
  let pipeline;
  const facets = {
    total: [{ count: 20 }], previous: [{ count: 10 }],
    monthly: [{ _id: '2027-01', count: 5 }],
    institutions: [{ _id: 'Example University', count: 15 }, { _id: 'Not specified', count: 5 }],
    departments: [{ _id: 'Computer Science', count: 20 }],
    locations: [{ _id: 'Addis Ababa', count: 20 }],
    cohorts: [{ _id: '2024', count: 20 }],
    institutionOptions: [{ _id: 'Example University' }], yearOptions: [{ _id: '2024' }, { _id: null }],
  };
  const { getAnalyticsData } = loadTs('lib/analytics-data.ts', {
    '@/lib/mongodb': async () => {},
    '@/models/Registration': { aggregate: async value => { pipeline = value; return [facets]; } },
  });
  const data = await getAnalyticsData({ range, university: 'Example University', graduationYear: '2024' }, new Date('2026-12-31T21:30:00Z'));
  return { data, pipeline };
}

test('analytics aggregate across all matching records and zero-fill missing months', async () => {
  const { data, pipeline } = await analyticsFixture();
  assert.equal(data.summary.total, 20);
  assert.equal(data.summary.institutions, 1); // Missing values are not a represented institution.
  assert.equal(data.summary.growthPercent, 100);
  assert.deepEqual(data.monthly.map(item => item.count), [0, 0, 5]);
  assert.deepEqual(data.options.graduationYears, ['2024']);
  const facets = pipeline[0].$facet;
  for (const name of ['total', 'institutions', 'departments', 'locations', 'cohorts', 'monthly']) {
    assert.equal(facets[name][0].$match.university, 'Example University');
    assert.equal(facets[name][0].$match.graduationYear, '2024');
  }
  assert.equal(facets.total[0].$match.registeredAt.$gte.toISOString(), '2026-10-31T21:00:00.000Z');
  assert.equal(facets.institutionOptions[0].$group._id, '$university');
  const all = await analyticsFixture('all');
  assert.equal(all.data.summary.previousTotal, null);
  assert.equal(all.data.summary.growthPercent, null);
  assert.equal(all.data.monthly.length, 12);
});

test('all six CSV reports use the same filtered totals as their previews', async () => {
  const { reportRows, reportDefinitions, analyticsReportCsv, csvCell } = loadTs('lib/analytics.ts');
  const { data } = await analyticsFixture('all');
  for (const type of Object.keys(reportDefinitions)) {
    const rows = reportRows(data, type);
    const csv = analyticsReportCsv(data, type);
    assert.equal(csv.split('\r\n').length, rows.length + 1);
    assert.ok(csv.includes('Example University'));
    assert.ok(csv.includes('2024'));
    assert.ok(csv.includes('Generated at (EAT)'));
  }
  assert.ok(analyticsReportCsv(data, 'monthly').includes('Latest 12 months'));
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvCell('A, B'), '"A, B"');
  assert.equal(csvCell('Line 1\nLine 2'), '"Line 1\nLine 2"');
});

test('analytics and report exports reject anonymous and non-admin requests before database access', async () => {
  for (const relativePath of ['app/api/analytics/route.ts', 'app/api/analytics/export/route.ts']) {
    for (const auth of [{ isAuthenticated: false }, { isAuthenticated: true, user: { role: 'user' } }]) {
      let called = false;
      const { GET } = loadTs(relativePath, {
        '@/lib/auth': { verifyAuth: async () => auth },
        '@/lib/analytics-data': { getAnalyticsData: async () => { called = true; } },
      });
      const response = await GET({ nextUrl: new URL('http://localhost/api/analytics') });
      assert.equal(response.status, auth.isAuthenticated ? 403 : 401);
      assert.equal(called, false);
    }
  }
});

test('report endpoint applies filters, validates types, and responds as a downloadable CSV', async () => {
  const { data } = await analyticsFixture();
  let receivedFilters;
  const { GET } = loadTs('app/api/analytics/export/route.ts', {
    '@/lib/auth': { verifyAuth: async () => ({ isAuthenticated: true, user: { role: 'admin' } }) },
    '@/lib/analytics-data': { getAnalyticsData: async filters => { receivedFilters = filters; return data; } },
  });
  const response = await GET({ nextUrl: new URL('http://localhost/api/analytics/export?report=institutions&range=3m&university=Example+University&graduationYear=2024') });
  assert.equal(response.status, 200);
  assert.equal(receivedFilters.university, 'Example University');
  assert.equal(receivedFilters.graduationYear, '2024');
  assert.match(response.headers.get('Content-Type'), /text\/csv/);
  assert.match(response.headers.get('Content-Disposition'), /evasue-institutions/);
  assert.ok((await response.text()).includes('"Example University","15","75"'));
  const invalid = await GET({ nextUrl: new URL('http://localhost/api/analytics/export?report=__proto__') });
  assert.equal(invalid.status, 400);
});

test('analytics service forwards filters and cancellation and preserves authorization failures', async () => {
  const originalFetch = global.fetch;
  const controller = new AbortController();
  let captured;
  global.fetch = async (url, options) => { captured = { url, options }; return Response.json({ data: { summary: { total: 2 } } }); };
  try {
    const { analyticsService, AnalyticsRequestError } = loadTs('services/analytics.service.ts');
    const data = await analyticsService.get({ range: '6m', university: 'Example University', graduationYear: '2024' }, controller.signal);
    assert.equal(data.summary.total, 2);
    assert.match(captured.url, /range=6m&university=Example\+University&graduationYear=2024/);
    assert.equal(captured.options.signal, controller.signal);
    assert.equal(captured.options.credentials, 'include');
    global.fetch = async () => Response.json({ error: 'Administrator access is required.' }, { status: 403 });
    await assert.rejects(analyticsService.get({ range: 'all' }), error => error instanceof AnalyticsRequestError && error.status === 403);
  } finally { global.fetch = originalFetch; }
});

test('account validation normalizes names/email, preserves passwords and drops privileged fields', () => {
  const { validateRegistration } = loadTs('lib/auth-validation.ts');
  const result = validateRegistration({ firstName: ' Hana ', lastName: ' Tesfaye ', email: ' HANA+alumni@Example.technology ', password: '  password  ', role: 'admin', university: 'Example University' });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, { firstName: 'Hana', lastName: 'Tesfaye', email: 'hana+alumni@example.technology', password: '  password  ' });
  assert.equal('role' in result.data, false);
  assert.equal('university' in result.data, false);
});

test('account validation rejects missing, invalid, short and overlong bcrypt passwords', () => {
  const { validateRegistration } = loadTs('lib/auth-validation.ts');
  const base = { firstName: 'Hana', lastName: 'Tesfaye', email: 'hana@example.com', password: 'password123' };
  assert.equal(validateRegistration(null).success, false);
  assert.equal(validateRegistration({ ...base, email: 'not-email' }).success, false);
  assert.equal(validateRegistration({ ...base, firstName: '   ' }).success, false);
  assert.equal(validateRegistration({ ...base, password: '1234567' }).success, false);
  assert.equal(validateRegistration({ ...base, password: '        ' }).success, false);
  assert.equal(validateRegistration({ ...base, password: 'a'.repeat(72) }).success, true);
  assert.equal(validateRegistration({ ...base, password: 'a'.repeat(73) }).success, false);
  assert.equal(validateRegistration({ ...base, password: '🔒'.repeat(19) }).success, false);
});

function accountEndpoint(model, connect = async () => {}) {
  const { createAuthResponse } = loadTs('lib/auth.ts');
  let claims;
  const { POST } = loadTs('app/api/auth/register/route.ts', {
    '@/lib/mongodb': connect,
    '@/models/User': model,
    '@/lib/auth': { createAuthResponse, generateToken: value => { claims = value; return 'signup-test-session'; } },
  });
  return { POST, claims: () => claims };
}
const signup = { firstName: 'Hana', lastName: 'Tesfaye', email: 'hana@example.com', password: 'password123' };

test('public signup creates a regular user and establishes a cookie-backed session', async () => {
  let saved;
  const endpoint = accountEndpoint({
    findOne: async () => null,
    create: async value => { saved = value; return { ...value, _id: 'created-user', password: 'hashed-secret' }; },
  });
  const response = await endpoint.POST({ json: async () => ({ ...signup, email: ' HANA@EXAMPLE.COM ', role: 'admin' }) });
  assert.equal(response.status, 201);
  assert.equal(saved.role, 'user');
  assert.equal(saved.email, 'hana@example.com');
  assert.equal(endpoint.claims().role, 'user');
  const body = await response.json();
  assert.equal(body.user.role, 'user');
  assert.equal(body.user.id, 'created-user');
  assert.equal('password' in body.user, false);
  assert.match(response.headers.get('set-cookie'), /token=signup-test-session/);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/);
});

test('invalid or malformed signup is rejected before connecting to the database', async () => {
  let connected = false;
  const endpoint = accountEndpoint({}, async () => { connected = true; });
  const invalid = await endpoint.POST({ json: async () => ({ ...signup, password: 'short' }) });
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).fieldErrors.password);
  const malformed = await endpoint.POST({ json: async () => { throw new SyntaxError('bad JSON'); } });
  assert.equal(malformed.status, 400);
  assert.equal(connected, false);
});

test('signup reports duplicate emails consistently, including a concurrent unique-index failure', async () => {
  const duplicate = accountEndpoint({ findOne: async () => ({ _id: 'existing' }) });
  const response = await duplicate.POST({ json: async () => signup });
  assert.equal(response.status, 409);
  assert.ok((await response.json()).fieldErrors.email);
  const raced = accountEndpoint({ findOne: async () => null, create: async () => { throw { code: 11000 }; } });
  const conflict = await raced.POST({ json: async () => signup });
  assert.equal(conflict.status, 409);
});

test('user schema accepts modern email addresses and existing short-password hashes still verify', async () => {
  const User = loadTs('models/User.ts').default;
  const bcrypt = await import('bcryptjs');
  const account = new User({ firstName: 'Hana', lastName: 'Tesfaye', email: 'hana+alumni@example.technology', password: bcrypt.hashSync('old123', 4) });
  await account.validate();
  assert.equal(await account.comparePassword('old123'), true);
  assert.equal(await account.comparePassword('wrong'), false);
});

test('signup service and store retain actionable field errors from the backend', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => Response.json({ message: 'Email already registered', fieldErrors: { email: 'Sign in instead.' } }, { status: 409 });
  try {
    const { authService } = loadTs('services/auth.service.ts');
    const response = await authService.register(signup);
    assert.equal(response.success, false);
    assert.equal(response.fieldErrors.email, 'Sign in instead.');
    const auth = store({ register: async () => response });
    const result = await auth.getState().register(signup);
    assert.equal(result.fieldErrors.email, 'Sign in instead.');
    assert.equal(auth.getState().isLoading, false);
    assert.equal(auth.getState().isAuthenticated, false);
  } finally { global.fetch = originalFetch; }
});
