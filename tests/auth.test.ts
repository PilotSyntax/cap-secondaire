import assert from "node:assert/strict";
import test from "node:test";
import { validateGoogleClaims } from "../lib/google-auth";

const now = 1_800_000_000;

test("les déclarations Google valides produisent une identité normalisée", () => {
  const identity = validateGoogleClaims({ iss: "https://accounts.google.com", aud: "client-web", sub: "google-123", email: "Eleve@Example.com", email_verified: true, name: "Camille Élève", iat: now - 30, exp: now + 300 }, "client-web", now);
  assert.deepEqual(identity, { subject: "google-123", email: "eleve@example.com", displayName: "Camille Élève" });
});

test("les jetons expirés ou destinés à une autre application sont refusés", () => {
  assert.equal(validateGoogleClaims({ iss: "https://accounts.google.com", aud: "autre-client", sub: "1", email: "eleve@example.com", email_verified: true, exp: now + 300 }, "client-web", now), null);
  assert.equal(validateGoogleClaims({ iss: "https://accounts.google.com", aud: "client-web", sub: "1", email: "eleve@example.com", email_verified: true, exp: now - 1 }, "client-web", now), null);
});
