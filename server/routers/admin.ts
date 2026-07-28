import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
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
} from "../db";

// Middleware para verificar se é admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Acesso negado: apenas administradores podem acessar");
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Procedimentos
  procedures: router({
    list: adminProcedure.query(async () => {
      return getProcedures();
    }),

    create: adminProcedure.input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        duration: z.number(),
        category: z.string().optional(),
        image: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      await createProcedure({
        name: input.name,
        description: input.description,
        price: input.price as any,
        duration: input.duration,
        category: input.category,
        image: input.image,
        isActive: true,
      });
      return { success: true };
    }),

    update: adminProcedure.input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        duration: z.number().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateProcedure(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProcedure(input.id);
        return { success: true };
      }),
  }),

  // Cursos
  courses: router({
    list: adminProcedure.query(async () => {
      return getCourses();
    }),

    create: adminProcedure.input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        price: z.string(),
        instructor: z.string().optional(),
        duration: z.number(),
        image: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      await createCourse({
        title: input.title,
        description: input.description,
        price: input.price as any,
        instructor: input.instructor,
        duration: input.duration,
        image: input.image,
        isActive: true,
      });
      return { success: true };
    }),

    update: adminProcedure.input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        instructor: z.string().optional(),
        duration: z.number().optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCourse(id, data as any);
      return { success: true };
    }),
  }),

  // Promoções
  promotions: router({
    list: adminProcedure.query(async () => {
      return getPromotions();
    }),

    create: adminProcedure.input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.string(),
        applicableTo: z.enum(["all", "procedures", "courses"]),
        startDate: z.date(),
        endDate: z.date(),
      })
    ).mutation(async ({ input }) => {
      await createPromotion({
        title: input.title,
        description: input.description,
        discountType: input.discountType,
        discountValue: input.discountValue as any,
        applicableTo: input.applicableTo,
        startDate: input.startDate,
        endDate: input.endDate,
        isActive: true,
      });
      return { success: true };
    }),

    update: adminProcedure.input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        discountValue: z.string().optional(),
        applicableTo: z.enum(["all", "procedures", "courses"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updatePromotion(id, data as any);
      return { success: true };
    }),
  }),

  // Clientes
  clients: router({
    list: adminProcedure.query(async () => {
      return getClients();
    }),

    create: adminProcedure.input(
      z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string(),
        birthDate: z.date().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      await createClient(input);
      return { success: true };
    }),

    update: adminProcedure.input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        birthDate: z.date().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateClient(id, data);
      return { success: true };
    }),
  }),

  // Mensagens
  messages: router({
    list: adminProcedure.query(async () => {
      return getMessages();
    }),

    send: adminProcedure.input(
      z.object({
        recipientPhone: z.string(),
        message: z.string(),
        type: z.enum(["whatsapp", "sms", "email"]),
      })
    ).mutation(async ({ input }) => {
      await createMessage({
        recipientPhone: input.recipientPhone,
        message: input.message,
        type: input.type,
        status: "pending",
      });
      return { success: true };
    }),
  }),

  // Galeria Antes/Depois
  gallery: router({
    list: adminProcedure.query(async () => {
      return getBeforeAfterGallery();
    }),

    listByProcedure: adminProcedure.input(z.object({ procedureId: z.number() }))
      .query(async ({ input }) => {
        return getBeforeAfterGalleryByProcedure(input.procedureId);
      }),

    create: adminProcedure.input(
      z.object({
        procedureId: z.number(),
        beforeImage: z.string(),
        afterImage: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        clientName: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      await createBeforeAfterGallery({
        ...input,
        isPublished: true,
      });
      return { success: true };
    }),

    update: adminProcedure.input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        clientName: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateBeforeAfterGallery(id, data);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBeforeAfterGallery(input.id);
        return { success: true };
      }),
  }),
});
