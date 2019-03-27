module.exports = {
  loginQuery: "SELECT email, password FROM users WHERE email=$1;",
  userExistsQuery: "SELECT 1 FROM users WHERE email=$1;", 
  signupInsert: "INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5);"
} 