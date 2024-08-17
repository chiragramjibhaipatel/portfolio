-- CreateEnum
CREATE TYPE "ShopifyPlan" AS ENUM ('Basic', 'Shopify', 'Advanced', 'Plus');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "shopifyPlan" "ShopifyPlan" NOT NULL DEFAULT 'Basic';
