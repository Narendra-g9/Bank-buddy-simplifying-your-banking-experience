require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  DB_URL:
    process.env.DB_URL ||
    "mongodb://localhost:27017/Bank_Buddy?authSource=admin",
  ADMIN_ACCESS_TOKEN_SECRET:
    process.env.ADMIN_ACCESS_TOKEN_SECRET || "Admin@!^^&78TOK$%@!EN?:<>",
  USER_ACCESS_TOKEN_SECRET:
    process.env.USER_ACCESS_TOKEN_SECRET || "DOC$@!:-0><?:TORT67K@!E><N",
  SMTP_URL:
    process.env.SMTP_URL ||
    "smtps://yenumulasrirambrahmareddy@gmail.com:upjncsssckexvvjj@smtp.gmail.com/?pool=true",
  ACCESS_TOKEN_EXPIRY: "2d",
};
