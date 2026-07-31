import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  getProcedures,
  createProcedure,
  updateProcedure,
  deleteProcedure,
  getCourses,
  createCourse,
  updateCourse,
  getPromotions,
  createPromotion,
  updatePromotion,
  getClients,
  createClient,
  updateClient,
  createMessage,
  getMessages,
  getBeforeAfterGallery,
  getBeforeAfterGalleryByProcedure,
  createBeforeAfterGallery,
  updateBeforeAfterGallery,
  deleteBeforeAfterGallery,
  getDb,
} from "../db";
import {
  anamnesis,
  financialTransactions,
  inventory,
  clientPackages,
  appointments,
  clients,
  procedures,
} from "../../drizzle/schema";

// Middleware para verificar se é admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Acesso negado: apenas administradores podem acessar");
  }
  return next({ ctx });
});

export const adminRouter = router({
  // ── Dashboard / Métricas ──────────────────────────────────────────────────
  dashboard: router({
    metrics: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { todayRevenue: 0, monthRevenue: 0, todayAppointments: 0, pendingReturns: 0 };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [todayIncome] = await db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(financialTransactions)
        .where(and(eq(financialTransactions.type, "income"), gte(financialTransactions.transactionDate, today), lte(financialTransactions.transactionDate, tomorrow)));

      const [monthIncome] = await db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(financialTransactions)
        .where(and(eq(financialTransactions.type, "income"), gte(financialTransactions.transactionDate, monthStart)));

      const todayAppts = await db
        .select()
        .from(appointments)
        .where(and(gte(appointments.appointmentDate, today), lte(appointments.appointmentDate, tomorrow)));

      return {
        todayRevenue: Number(todayIncome?.total ?? 0),
        monthRevenue: Number(monthIncome?.total ?? 0),
        todayAppointments: todayAppts.length,
        pendingReturns: 0,
        todayAppointmentsList: todayAppts,
      };
    }),

    analytics: adminProcedure.query(async () => {
      // Dados mockados de analytics (integração futura com GA)
      return {
        todayVisits: 142,
        monthVisits: 3820,
        sources: [
          { name: "Instagram", value: 48 },
          { name: "Google", value: 35 },
          { name: "Direto", value: 17 },
        ],
        topProcedures: [
          { name: "Botox", visits: 210 },
          { name: "Preenchimento", visits: 178 },
          { name: "Bioestimulador", visits: 134 },
        ],
      };
    }),
  }),

  // ── Agendamentos ─────────────────────────────────────────────────────────
  appointments: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(appointments);
    }),

    listToday: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return db.select().from(appointments).where(and(gte(appointments.appointmentDate, today), lte(appointments.appointmentDate, tomorrow)));
    }),

    create: adminProcedure.input(z.object({
      clientId: z.number(),
      procedureId: z.number(),
      appointmentDate: z.date(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(appointments).values({ ...input, status: "pending" });
      return { success: true };
    }),

    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(appointments).set({ status: input.status }).where(eq(appointments.id, input.id));
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(appointments).where(eq(appointments.id, input.id));
      return { success: true };
    }),
  }),

  // ── Anamnese / Prontuário ─────────────────────────────────────────────────
  anamnesis: router({
    getByClient: adminProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(anamnesis).where(eq(anamnesis.clientId, input.clientId)).limit(1);
      return result[0] ?? null;
    }),

    save: adminProcedure.input(z.object({
      clientId: z.number(),
      allergies: z.boolean(),
      pregnancyLactation: z.boolean(),
      medications: z.string().optional(),
      previousProcedures: z.string().optional(),
      clinicalNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const existing = await db.select().from(anamnesis).where(eq(anamnesis.clientId, input.clientId)).limit(1);
      if (existing.length > 0) {
        await db.update(anamnesis).set(input).where(eq(anamnesis.clientId, input.clientId));
      } else {
        await db.insert(anamnesis).values(input);
      }
      return { success: true };
    }),
  }),

  // ── Financeiro ────────────────────────────────────────────────────────────
  finance: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(financialTransactions);
    }),

    create: adminProcedure.input(z.object({
      type: z.enum(["income", "expense"]),
      amount: z.string(),
      paymentMethod: z.enum(["pix", "credit_card", "debit_card", "cash", "other"]),
      category: z.string(),
      description: z.string().optional(),
      clientId: z.number().optional(),
      appointmentId: z.number().optional(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(financialTransactions).values({ ...input, amount: input.amount as any });
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(financialTransactions).where(eq(financialTransactions.id, input.id));
      return { success: true };
    }),
  }),

  // ── Estoque / Insumos ─────────────────────────────────────────────────────
  inventory: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(inventory);
    }),

    create: adminProcedure.input(z.object({
      name: z.string(),
      brand: z.string().optional(),
      lotNumber: z.string().optional(),
      expirationDate: z.date().optional(),
      quantity: z.number(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(inventory).values(input);
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      quantity: z.number().optional(),
      brand: z.string().optional(),
      lotNumber: z.string().optional(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(inventory).set(data).where(eq(inventory.id, id));
      return { success: true };
    }),
  }),

  // ── Pacotes de Clientes ───────────────────────────────────────────────────
  packages: router({
    listByClient: adminProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(clientPackages).where(eq(clientPackages.clientId, input.clientId));
    }),

    create: adminProcedure.input(z.object({
      clientId: z.number(),
      procedureId: z.number(),
      totalSessions: z.number(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(clientPackages).values({ ...input, completedSessions: 0 });
      return { success: true };
    }),

    incrementSession: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(clientPackages).set({ completedSessions: sql`completedSessions + 1` }).where(eq(clientPackages.id, input.id));
      return { success: true };
    }),
  }),

  // ── Procedimentos ─────────────────────────────────────────────────────────
  procedures: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(procedures);
    }),

    create: adminProcedure.input(z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.string(),
      duration: z.number(),
      category: z.string().optional(),
      image: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createProcedure({ ...input, price: input.price as any, isActive: true });
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      duration: z.number().optional(),
      category: z.string().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateProcedure(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteProcedure(input.id);
      return { success: true };
    }),
  }),

  // ── Cursos ────────────────────────────────────────────────────────────────
  courses: router({
    list: adminProcedure.query(async () => getCourses()),

    create: adminProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      price: z.string(),
      instructor: z.string().optional(),
      duration: z.number(),
      image: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createCourse({ ...input, price: input.price as any, isActive: true });
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      instructor: z.string().optional(),
      duration: z.number().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCourse(id, data as any);
      return { success: true };
    }),
  }),

  // ── Promoções ─────────────────────────────────────────────────────────────
  promotions: router({
    list: adminProcedure.query(async () => getPromotions()),

    create: adminProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      discountType: z.enum(["percentage", "fixed"]),
      discountValue: z.string(),
      applicableTo: z.enum(["all", "procedures", "courses"]),
      startDate: z.date(),
      endDate: z.date(),
    })).mutation(async ({ input }) => {
      await createPromotion({ ...input, discountValue: input.discountValue as any, isActive: true });
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      discountType: z.enum(["percentage", "fixed"]).optional(),
      discountValue: z.string().optional(),
      applicableTo: z.enum(["all", "procedures", "courses"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updatePromotion(id, data as any);
      return { success: true };
    }),
  }),

  // ── Clientes ──────────────────────────────────────────────────────────────
  clients: router({
    list: adminProcedure.query(async () => getClients()),

    create: adminProcedure.input(z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string(),
      birthDate: z.date().optional(),
      address: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createClient(input);
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      birthDate: z.date().optional(),
      address: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateClient(id, data);
      return { success: true };
    }),
  }),

  // ── Mensagens ─────────────────────────────────────────────────────────────
  messages: router({
    list: adminProcedure.query(async () => getMessages()),

    send: adminProcedure.input(z.object({
      recipientPhone: z.string(),
      message: z.string(),
      type: z.enum(["whatsapp", "sms", "email"]),
    })).mutation(async ({ input }) => {
      await createMessage({ ...input, status: "pending" });
      return { success: true };
    }),
  }),

  // ── Galeria Antes/Depois ──────────────────────────────────────────────────
  gallery: router({
    list: adminProcedure.query(async () => getBeforeAfterGallery()),

    listByProcedure: adminProcedure.input(z.object({ procedureId: z.number() })).query(async ({ input }) => {
      return getBeforeAfterGalleryByProcedure(input.procedureId);
    }),

    create: adminProcedure.input(z.object({
      procedureId: z.number(),
      beforeImage: z.string(),
      afterImage: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      clientName: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createBeforeAfterGallery({ ...input, isPublished: true });
      return { success: true };
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      clientName: z.string().optional(),
      isPublished: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateBeforeAfterGallery(id, data);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteBeforeAfterGallery(input.id);
      return { success: true };
    }),
  }),
});

