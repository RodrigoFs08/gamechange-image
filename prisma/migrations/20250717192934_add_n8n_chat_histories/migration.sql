-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "generatedUrl" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "n8n_chat_histories" (
    "id" BIGINT NOT NULL,
    "session_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "n8n_chat_histories_pkey" PRIMARY KEY ("id")
);
