const urls = [
  'http://localhost:3000',
  'http://localhost:3000/api/stations?q=NDLS',
  'http://localhost:3000/api/search?from=NDLS&to=HWH',
  'http://localhost:3000/api/pnr/2458921473',
  'http://localhost:3000/api/schedule/12302',
  'http://localhost:3000/api/live-status/22436',
  'http://localhost:3000/search-results',
  'http://localhost:3000/booking',
  'http://localhost:3000/payment',
  'http://localhost:3000/booking/confirmation',
  'http://localhost:3000/pnr-status',
  'http://localhost:3000/live-status',
  'http://localhost:3000/train-schedule',
  'http://localhost:3000/account'
];

async function run() {
  console.log('Testing endpoints...');
  let failed = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`[PASS] 200 OK - ${url}`);
      } else {
        console.log(`[WARN] ${res.status} - ${url}`);
        failed++;
      }
    } catch (err) {
      console.log(`[FAIL] ${err.message} - ${url}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log('\nAll 14 endpoints and pages returned 200 OK successfully!');
  } else {
    console.log(`\n${failed} endpoints failed.`);
  }
}

run();
