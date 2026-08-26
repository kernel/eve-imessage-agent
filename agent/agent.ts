import { defineAgent } from "eve";

// App-level model: krill runs on the project's own AI Gateway credential
// (already provisioned for this v0 project -- no Connect, no per-texter
// setup, and no shared/OAuth token to manage). Every texter uses this same
// model, billed to this project.
export default defineAgent({
  model: "zai/glm-5.3-flash",
});
