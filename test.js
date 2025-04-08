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

const user = { email: 'cbarto13@uncc.edu' };

runTest("Email visible for own profile", getEmailDisplay(true, { email: false }, user), "cbarto13@uncc.edu");
runTest("Email visible if user made it public", getEmailDisplay(false, { email: true }, user), "cbarto13@uncc.edu");
runTest("Email hidden for other users", getEmailDisplay(false, { email: false }, user), "[Hidden]");
  