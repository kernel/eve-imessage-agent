import kernel from "@onkernel/eve-extension"

// App-level Kernel credential: the "mcp.onkernel.com/eve-extension" Connect
// connector only supports per-user OAuth (no app subject type), which made
// krill's browser tool interactive and prone to silent failures on an SMS
// channel with no gate screen. A single shared KERNEL_API_KEY env var gives
// every texter the same cloud browser with no per-texter auth step.
export default kernel({ apiKey: process.env.KERNEL_API_KEY })
