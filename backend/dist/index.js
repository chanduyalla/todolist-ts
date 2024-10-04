"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 80;
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield models_1.default.Todos.findAll({
            where: { deletedAt: null },
        });
        // if (todos.length === 0) {
        //   return res.status(200).json({ message: "No todos found." });
        // }
        res.status(200).json(todos);
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
app.post("/add-todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = req.body;
        const newTodo = yield models_1.default.Todos.create(todo);
        res.status(200).json({ message: "new todo added successfully." });
    }
    catch (error) {
        console.error("Error while adding todo:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
app.put("/edit-todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = req.body;
        const todoId = req.params.id;
        const updatedTodo = yield models_1.default.Todos.update(todo, {
            where: { id: todoId },
        });
        res.status(200).json({ message: "todo updated successfully" });
    }
    catch (error) {
        console.error("Error while adding todo:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
app.delete("/delete-todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.query.id;
        if (!todoId) {
            return res.status(400).json({ message: "Todo ID is required." });
        }
        const [deleted] = yield models_1.default.Todos.update({ deletedAt: new Date() }, { where: { id: todoId } });
        if (deleted) {
            res.status(200).json({ message: "Todo deleted successfully." });
        }
        else {
            res.status(404).json({ message: "Todo not found." });
        }
    }
    catch (error) {
        console.error("Error while deleting todo:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
