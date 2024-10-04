import express from "express";
import models from "./models";
import { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 80;

app.get("/todos", async (req: Request, res: any) => {
  try {
    const todos = await models.Todos.findAll({
      where: { deletedAt: null },
    });

    // if (todos.length === 0) {
    //   return res.status(200).json({ message: "No todos found." });
    // }

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
interface TodoInput {
  title: string;
  priority: string;
  completed: boolean;
}
app.post(
  "/add-todo",
  async (req: Request<{}, {}, TodoInput>, res: Response) => {
    try {
      const todo = req.body;
      const newTodo = await models.Todos.create(todo);
      res.status(200).json({ message: "new todo added successfully." });
    } catch (error) {
      console.error("Error while adding todo:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

interface TodoUpdateInput {
  title?: string;
  priority?: string;
  completed?: boolean;
}
app.put(
  "/edit-todo/:id",
  async (req: Request<{ id: string }, {}, TodoUpdateInput>, res: Response) => {
    try {
      const todo = req.body;
      const todoId = req.params.id;
      const updatedTodo = await models.Todos.update(todo, {
        where: { id: todoId },
      });
      res.status(200).json({ message: "todo updated successfully" });
    } catch (error) {
      console.error("Error while adding todo:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

app.delete("/delete-todo", async (req: Request, res: any) => {
  try {
    const todoId = req.query.id;

    if (!todoId) {
      return res.status(400).json({ message: "Todo ID is required." });
    }

    const [deleted] = await models.Todos.update(
      { deletedAt: new Date() },
      { where: { id: todoId } }
    );

    if (deleted) {
      res.status(200).json({ message: "Todo deleted successfully." });
    } else {
      res.status(404).json({ message: "Todo not found." });
    }
  } catch (error) {
    console.error("Error while deleting todo:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
