function runTest(description, actual, expected) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    if (passed) {
      console.log(`✅ ${description}`);
    } else {
      console.error(`❌ ${description}`);
      console.error(`   Expected: ${JSON.stringify(expected)}`);
      console.error(`   Got:      ${JSON.stringify(actual)}`);
    }
  }

// email visibility test
function getEmailDisplay (isUser, visibility, user) {
    return isUser ? user.email : (visibility.email ? user.email : "[Hidden]");
}

const user = { email: 'test@uncc.edu' };

runTest("Email visible for own profile", getEmailDisplay(true, { email: false }, user), "test@uncc.edu");
runTest("Email visible if user made it public", getEmailDisplay(false, { email: true }, user), "test@uncc.edu");
runTest("Email hidden for other users", getEmailDisplay(false, { email: false }, user), "[Hidden]");
  
// testing if the edit button only appears on the logged in users page
function showEdit (isUser) {
    return isUser;
  }
  
  runTest("Edit button shown for own profile", showEdit (true), true);
  runTest("Edit button hidden for others", showEdit (false), false);
 
// testing the signup/login/logout features

const db = {};

function signup (user) {
    if (db[user.email]) return "User already exists";
    db[user.email] = user;
    return "Signup success";
}

function login (email, password) {
    const user = db[email];
    if (!user || user.password !== password) {
        return "Invalid credentials";
    }
        return "Login success";
}

function logout (session) {
    session.loggedIn = false;
    return "Logged out";
}

const exUser = { email: 'test@uncc.edu', password: '123456' };

runTest("Signup success", signup(exUser), "Signup success");
runTest("Signup duplicate", signup(exUser), "User already exists");
runTest("Login success", login("test@uncc.edu", "123456"), "Login success");
runTest("Login failure", login("test@uncc.edu", "654321"), "Invalid credentials");
runTest("Logout session", logout({ loggedIn: true }), "Logged out");
