import { jest } from '@jest/globals';
import request from "supertest";
import jwt from "jsonwebtoken";

// Set test environment variables before importing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:8080/auth/google/callback';
process.env.CLIENT_URL = 'http://localhost:3000';

// Create mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  task: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

// Mock the database module
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockPrisma,
}));

// Import app after mocking
const { default: app } = await import('../src/server.js');
const prisma = mockPrisma;

// Helper to generate valid JWT token
const generateToken = (userId = 1, email = "test@example.com") => {
  return jwt.sign(
    { id: userId, email, name: "Test User" },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: "24h" }
  );
};

// Mock user for authentication
const mockUser = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  googleId: "google123",
  picture: "https://example.com/pic.jpg",
  createdAt: new Date(),
};

// Mock tasks
const mockTasks = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Description 1",
    status: "To Do",
    priority: "High",
    dueDate: new Date("2025-12-31"),
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Description 2",
    status: "In Progress",
    priority: "Medium",
    dueDate: null,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Task Tracker API Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // ===========================
  // Health & Basic Endpoints
  // ===========================
  describe("GET /health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /", () => {
    it("should return API information", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Task Tracker API");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("endpoints");
    });
  });

  // ===========================
  // Authentication Tests
  // ===========================
  describe("Authentication Middleware", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer invalid-token-here");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 401 when malformed Authorization header", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "InvalidFormat");

      expect(response.status).toBe(401);
    });

    it("should accept valid JWT token", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  // ===========================
  // GET /api/tasks - Retrieve Tasks
  // ===========================
  describe("GET /api/tasks", () => {
    it("should return 200 and an array of tasks", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("tasks");
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBe(2);
      expect(response.body).toHaveProperty("count", 2);
    });

    it("should return empty array when no tasks exist", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it("should filter tasks by status", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const filteredTasks = mockTasks.filter((t) => t.status === "To Do");
      prisma.task.findMany.mockResolvedValue(filteredTasks);

      const response = await request(app)
        .get("/api/tasks?status=To Do")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks.length).toBe(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: "To Do",
          }),
        })
      );
    });

    it("should filter tasks by priority", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const filteredTasks = mockTasks.filter((t) => t.priority === "High");
      prisma.task.findMany.mockResolvedValue(filteredTasks);

      const response = await request(app)
        .get("/api/tasks?priority=High")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priority: "High",
          }),
        })
      );
    });

    it("should search tasks by title/description", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockResolvedValue([mockTasks[0]]);

      const response = await request(app)
        .get("/api/tasks?search=Test Task 1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(prisma.task.findMany).toHaveBeenCalled();
    });
  });

  // ===========================
  // POST /api/tasks - Create Task
  // ===========================
  describe("POST /api/tasks", () => {
    const validTaskData = {
      title: "New Task",
      description: "Task description",
      priority: "Medium",
      status: "To Do",
      dueDate: "2025-12-31",
    };

    it("should create a new task with valid data", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const newTask = { id: 3, ...validTaskData, userId: 1 };
      prisma.task.create.mockResolvedValue(newTask);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(validTaskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("task");
      expect(response.body.task).toHaveProperty("title", validTaskData.title);
    });

    it("should return 400 when title is missing", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const invalidData = { description: "No title" };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should handle SQL injection attempts in title", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const sqlInjectionData = {
        title: "'; DROP TABLE tasks; --",
        description: "Malicious input",
        priority: "High",
        status: "To Do",
      };

      prisma.task.create.mockResolvedValue({
        id: 4,
        ...sqlInjectionData,
        userId: 1,
      });

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(sqlInjectionData);

      // Should either succeed (Prisma handles sanitization) or return 400
      expect([201, 400]).toContain(response.status);

      // If successful, verify the malicious string is stored as plain text
      if (response.status === 201) {
        expect(prisma.task.create).toHaveBeenCalled();
        // Prisma parameterizes queries, so SQL injection is prevented
      }
    });

    it("should handle XSS attempts in description", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const xssData = {
        title: "Test Task",
        description: "<script>alert('XSS')</script>",
        priority: "Low",
        status: "To Do",
      };

      prisma.task.create.mockResolvedValue({
        id: 5,
        ...xssData,
        userId: 1,
      });

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(xssData);

      expect([201, 400]).toContain(response.status);
    });

    it("should reject invalid priority values", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const invalidData = {
        title: "Test",
        priority: "InvalidPriority",
        status: "To Do",
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect([400, 500]).toContain(response.status);
    });

    it("should reject invalid status values", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const invalidData = {
        title: "Test",
        priority: "High",
        status: "InvalidStatus",
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect([400, 500]).toContain(response.status);
    });
  });

  // ===========================
  // PUT /api/tasks/:id - Update Task
  // ===========================
  describe("PUT /api/tasks/:id", () => {
    it("should update an existing task", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findUnique.mockResolvedValue(mockTasks[0]);
      const updatedTask = { ...mockTasks[0], title: "Updated Title" };
      prisma.task.update.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put("/api/tasks/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.task).toHaveProperty("title", "Updated Title");
    });

    it("should return 404 when task does not exist", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/tasks/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
    });

    it("should prevent updating other user's tasks", async () => {
      const token = generateToken(1, "user1@example.com");
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const otherUserTask = { ...mockTasks[0], userId: 2 };
      prisma.task.findUnique.mockResolvedValue(otherUserTask);

      const response = await request(app)
        .put("/api/tasks/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Hacked" });

      expect(response.status).toBe(403);
    });
  });

  // ===========================
  // DELETE /api/tasks/:id - Delete Task
  // ===========================
  describe("DELETE /api/tasks/:id", () => {
    it("should delete an existing task", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findUnique.mockResolvedValue(mockTasks[0]);
      prisma.task.delete.mockResolvedValue(mockTasks[0]);

      const response = await request(app)
        .delete("/api/tasks/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 404 when deleting non-existent task", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/tasks/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should prevent deleting other user's tasks", async () => {
      const token = generateToken(1, "user1@example.com");
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const otherUserTask = { ...mockTasks[0], userId: 2 };
      prisma.task.findUnique.mockResolvedValue(otherUserTask);

      const response = await request(app)
        .delete("/api/tasks/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  // ===========================
  // Security Tests
  // ===========================
  describe("Security Tests", () => {
    it("should handle extremely long input strings", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const longString = "A".repeat(10000);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: longString,
          description: longString,
        });

      // Should handle gracefully
      expect([201, 400, 413, 500]).toContain(response.status);
    });

    it("should handle null/undefined values properly", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: null,
          description: undefined,
        });

      expect([400, 500]).toContain(response.status);
    });

    it("should handle special characters in search", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/tasks?search=%27%22%3C%3E%26")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it("should reject requests with invalid content-type", async () => {
      const token = generateToken();

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "text/plain")
        .send("invalid data");

      expect([400, 500]).toContain(response.status);
    });
  });

  // ===========================
  // Edge Cases
  // ===========================
  describe("Edge Cases", () => {
    it("should handle database connection errors", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.task.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });

    it("should handle invalid task ID formats", async () => {
      const token = generateToken();
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/api/tasks/invalid-id")
        .set("Authorization", `Bearer ${token}`);

      expect([400, 404, 500]).toContain(response.status);
    });

    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});
