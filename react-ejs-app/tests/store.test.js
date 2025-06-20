import { getAll, getById, create, updateById, deleteById } from "../store.js";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const dbPath = join(process.cwd(), "db.json");
const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]));
const populateDb = (data) => writeFileSync(dbPath, JSON.stringify(data));

const fixtures = [
  { id: 1, message: "test" },
  { id: 2, message: "hello world" },
];

const inventedId = 12345;
const existingId = fixtures[0].id;

describe("store", () => {
  beforeEach(() => populateDb(fixtures));
  afterAll(restoreDb);

  describe("getAll", () => {
    it("should return an empty array when there's no data", async () => {
      restoreDb();
      const data = await getAll();
      expect(data).toEqual([]);
    });

    it("should return an array with one item when there is one item", async () => {
      const data = await getAll();
      expect(data).toEqual(fixtures);
    });
  });

  describe("getById", () => {
    it("should return undefined when there is no item with the given id", async () => {
      const item = await getById(inventedId);
      expect(item).toBeUndefined();
    });

    it("should return the item with the given id", async () => {
      const item = await getById(fixtures[0].id);
      expect(item).toEqual(fixtures[0]);
    });
  });

  describe("create", () => {
    it("should return the created item", async () => {
      const newItem = { id: fixtures.length + 1, message: "test 3" };
      const item = await create(newItem.message);
      expect(item.message).toEqual(newItem.message);
    });

    it("should add the item to the db", async () => {
      const newItem = { id: fixtures.length + 1, message: "test 3" };
      await create(newItem.message);
      const item = await getById(newItem.id);
      expect(item).toEqual(newItem);
    });
  });

  describe("updateById", () => {
    it("should return undefined when there is no item with the given id", async () => {
      const updatedItem = await updateById(inventedId, "updated");
      expect(updatedItem).toBeUndefined();
    });

    it("should return the updated item", async () => {
      const updatedItem = { id: existingId, message: "updated" };
      await updateById(updatedItem.id, updatedItem.message);
      const item = await getById(existingId);
      expect(item).toEqual(updatedItem);
    });
  });

  describe("deleteById", () => {
    it("should return undefined when there is no item with the given id", async () => {
      const item = await deleteById(inventedId);
      expect(item).toBeUndefined();
    });

    it("should return the deleted item", async () => {
      const item = await deleteById(existingId);
      expect(item).toBeDefined();
    });

    it("should remove the item from the db", async () => {
      await deleteById(existingId);
      const items = await getAll();
      expect(items).toEqual(fixtures.filter((item) => item.id !== existingId));
    });
  });
});
