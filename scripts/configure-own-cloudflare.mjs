import { readFileSync, writeFileSync } from 'node:fs';
const [accountId, databaseId] = process.argv.slice(2);
if (!/^[a-f\d]{32}$/i.test(accountId ?? '') || !/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(databaseId ?? '')) {
  throw new Error('Usage: node scripts/configure-own-cloudflare.mjs <account-id> <database-id>');
}
const p = 'dist/server/wrangler.json';
const config = JSON.parse(readFileSync(p, 'utf8'));
config.name = 'wuhan-freshman-contest';
config.account_id = accountId;
config.workers_dev = true;
config.preview_urls = false;
config.observability = {enabled: false};
config.d1_databases = [{binding:'DB', database_name:'wuhan-freshman-registrations', database_id:databaseId, migrations_dir:'../../drizzle'}];
writeFileSync('dist/server/wrangler.own.json', JSON.stringify(config, null, 2)+'\n');
