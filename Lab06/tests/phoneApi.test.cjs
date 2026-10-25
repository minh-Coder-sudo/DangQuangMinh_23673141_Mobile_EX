const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const rows = require("../mockapi_phones_50.json");

// Execute the same TypeScript boundary code, without starting a native runtime.
function load(file, dependencies = {}, globals = {}) {
  const compiled = ts.transpileModule(
    fs.readFileSync(path.join(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const module = { exports: {} };
  vm.runInNewContext(
    compiled,
    {
      module,
      exports: module.exports,
      require: (name) => {
        if (!(name in dependencies))
          throw new Error(`Unexpected dependency ${name}`);
        return dependencies[name];
      },
      ...globals,
    },
    { filename: file },
  );
  return module.exports;
}
const validation = load("src/data/phoneValidation.ts");
function api(fetch, url = "https://example.test/") {
  return load(
    "src/api/phoneApi.ts",
    {
      "../data/phones": { PHONES: rows },
      "../data/phoneValidation": validation,
    },
    {
      fetch,
      process: { env: { EXPO_PUBLIC_API_URL: url } },
      setTimeout: (callback) => setTimeout(callback, 0),
    },
  );
}

test("50 records have unique IDs and match the required lab products", () => {
  assert.equal(rows.length, 50);
  assert.equal(new Set(rows.map((p) => p.id)).size, 50);
  for (const row of rows) {
    const phone = validation.parsePhone(row);
    assert.equal(phone.id, row.id);
    assert.equal(phone.colors.length, 4);
  }
  assert.equal(rows[0].defaultColor, "blue");
  assert.equal(rows[1].price, 3990000);
  assert.equal(
    rows.filter((p) => p.name.toLowerCase().includes("aris pro")).length,
    1,
  );
  assert.equal(
    rows.filter((p) => p.name.toLowerCase().includes("zzz")).length,
    0,
  );
});

test("malformed API data reports the incorrect field", () => {
  for (const [field, value] of [
    ["colors", []],
    ["colors", ["pink"]],
    ["colors", ["red", "red"]],
    ["defaultColor", "defaultColor 1"],
    ["rating", 96],
    ["rating", 4.5],
    ["price", "1790000"],
    ["oldPrice", 1],
    ["reviewCount", -1],
    ["name", ""],
  ]) {
    assert.throws(
      () => validation.parsePhone({ ...rows[0], [field]: value }),
      new RegExp(field),
    );
  }
  assert.throws(() => validation.parsePhone(null), /JSON/);
});

test("API reads the configured URL and forwards the abort signal", async () => {
  const controller = new AbortController();
  const client = api(async (url, options) => {
    assert.equal(url, "https://example.test/phones/1");
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => rows[0] };
  });
  const result = await client.fetchPhone("1", controller.signal);
  assert.equal(result.name, rows[0].name);
  assert.equal(client.USING_API, true);
});

test("HTTP errors and invalid JSON payloads reach the retry UI", async () => {
  await assert.rejects(
    api(async () => ({ ok: false, status: 404 })).fetchPhone("1"),
    /404/,
  );
  await assert.rejects(
    api(async () => ({
      ok: true,
      json: async () => ({ ...rows[0], colors: [] }),
    })).fetchPhone("1"),
    /colors/,
  );
});

test("offline mode finds products locally and reports missing IDs", async () => {
  const client = api(() => {
    throw new Error("Offline mode must not call fetch");
  }, "");
  assert.equal(client.USING_API, false);
  assert.equal((await client.fetchPhone("50")).id, "50");
  await assert.rejects(client.fetchPhone("missing"), /Không tìm thấy/);
});
