import bcrypt from "bcrypt";

const password = "DATA2026";
const hash = await bcrypt.hash(password, 10);
console.log(hash);
