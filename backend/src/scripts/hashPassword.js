const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Hashed password:', hash);
  console.log('Use this in seed.sql if you want password: admin123');
}

main();