import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, procedures, InsertProcedure, courses, InsertCourse, promotions, InsertPromotion, messages, InsertMessage, clients, InsertClient, beforeAfterGallery, InsertBeforeAfterGallery } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Procedimentos
export async function getProcedures() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(procedures).where(eq(procedures.isActive, true));
}

export async function getProcedureById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(procedures).where(eq(procedures.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProcedure(data: InsertProcedure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(procedures).values(data);
}

export async function updateProcedure(id: number, data: Partial<InsertProcedure>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(procedures).set(data).where(eq(procedures.id, id));
}

export async function deleteProcedure(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(procedures).where(eq(procedures.id, id));
}

// Cursos
export async function getCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.isActive, true));
}

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courses).values(data);
}

export async function updateCourse(id: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courses).set(data).where(eq(courses.id, id));
}

// Promoções
export async function getPromotions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promotions).where(eq(promotions.isActive, true));
}

export async function createPromotion(data: InsertPromotion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(promotions).values(data);
}

export async function updatePromotion(id: number, data: Partial<InsertPromotion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(promotions).set(data).where(eq(promotions.id, id));
}

// Mensagens
export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(messages).values(data);
}

export async function getMessages(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(messages).where(eq(messages.status, status as any));
  }
  return db.select().from(messages);
}

// Clientes
export async function getClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients);
}

export async function createClient(data: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clients).values(data);
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clients).set(data).where(eq(clients.id, id));
}

// Galeria Antes/Depois
export async function getBeforeAfterGallery() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(beforeAfterGallery).where(eq(beforeAfterGallery.isPublished, true));
}

export async function getBeforeAfterGalleryByProcedure(procedureId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(beforeAfterGallery)
    .where(eq(beforeAfterGallery.procedureId, procedureId));
}

export async function createBeforeAfterGallery(data: InsertBeforeAfterGallery) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(beforeAfterGallery).values(data);
}

export async function updateBeforeAfterGallery(id: number, data: Partial<InsertBeforeAfterGallery>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(beforeAfterGallery).set(data).where(eq(beforeAfterGallery.id, id));
}

export async function deleteBeforeAfterGallery(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(beforeAfterGallery).where(eq(beforeAfterGallery.id, id));
}
