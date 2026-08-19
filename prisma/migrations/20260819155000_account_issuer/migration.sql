-- Better Auth 1.7 keys OAuth accounts by (issuer, accountId).
ALTER TABLE "account" ADD COLUMN "issuer" TEXT NOT NULL DEFAULT '';

ALTER TABLE "account" ALTER COLUMN "issuer" DROP DEFAULT;

CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");
