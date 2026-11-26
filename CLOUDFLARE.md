# Cloudflare 部署

该版本包含完整的武汉联合新生赛个人报名页、明暗主题素材、报名接口和 D1 迁移。报名资源和应用代码分开：仓库不含真实报名记录、登录凭据或 API Token。

1. 使用 Node.js 22.13+，运行 `npm ci` 和 `npm run build`。
2. 在自己的 Cloudflare 账户创建 D1 数据库 `wuhan-freshman-registrations`。在已授权的 Wrangler 环境中运行：

   ```sh
   node scripts/configure-own-cloudflare.mjs "$CLOUDFLARE_ACCOUNT_ID" "$CONTEST_D1_DATABASE_ID"
   npx wrangler d1 migrations apply DB --remote --config dist/server/wrangler.own.json
   npx wrangler deploy --config dist/server/wrangler.own.json
   ```

Worker 名称为 `wuhan-freshman-contest`，D1 绑定为 `DB`。部署凭据使用 Wrangler 的现有登录或环境变量，勿写入仓库。
