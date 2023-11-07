const test = "System"
console.log(`
System: ${test.includes("System")}
Alert or Kick: ${["Alert", "Kick"].some(word => test.includes(word))}
`)