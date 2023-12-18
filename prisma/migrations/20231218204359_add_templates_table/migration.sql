-- CreateTable
CREATE TABLE "email_tamplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template_name" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "footer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
