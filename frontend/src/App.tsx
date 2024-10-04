import AllTasks from "./AllTasks";
import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

function App() {
  type Todo = {
    id?: number;
    title?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
  };

  const [editTaskId, setEeditTaskId] = useState<number | null>(null);
  const [allTasks, setAllTasks] = useState<Array<Todo>>([]);
  const [newTask, setNewTask] = useState<Todo>({
    title: "",
    priority: "low",
    completed: false,
  });
  const [taskUpdated, setTaskUpdated] = useState<boolean>(false);

  const fetchTodos = async () => {
    const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/todos`);
    setAllTasks(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, [taskUpdated]);

  const setTask = async (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    desc: string
  ) => {
    let value: string | boolean;

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === "checkbox") {
        value = e.target.checked;
      } else {
        value = e.target.value;
      }
    } else if (e.target instanceof HTMLSelectElement) {
      value = e.target.value;
    } else {
      return;
    }

    setNewTask({ ...newTask, [desc]: value });
  };

  const addTask = async () => {
    if (editTaskId !== null) {
      const [updatedTask] = allTasks.map((task, i) =>
        task.id === editTaskId ? newTask : task
      );
      // setAllTasks(updatedTasks);
      await axios.put(
        `${process.env.REACT_APP_HOST_URL}/edit-todo/${editTaskId}`,
        { ...updatedTask }
      );
      setEeditTaskId(null);
    } else {
      await axios.post(`${process.env.REACT_APP_HOST_URL}/add-todo`, {
        ...newTask,
      });
    }
    setTaskUpdated((prev) => !prev);
    setNewTask({
      title: "",
      priority: "low",
      completed: false,
    });
  };

  const editTask = (id: number) => {
    setEeditTaskId(id);
    const taskToEdit = allTasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit);
    }
  };

  const deleteTask = async (id: number) => {
    const deleteTask = allTasks.find((task, i) => task.id === id);
    if (deleteTask) {
      await axios.delete(`${process.env.REACT_APP_HOST_URL}/delete-todo`, {
        params: { id: deleteTask.id },
      });
    }
    setTaskUpdated((prev) => !prev);
  };

  return (
    <>
      <div>
        <h3>Welcome to Task Manager</h3>
        <h5>{editTaskId !== null ? "Edit Task" : "Add New Task"}</h5>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          onChange={(e) => setTask(e, "title")}
          value={newTask.title}
        />
        <label>Priority:</label>
        <select
          name="priority"
          onChange={(e) => setTask(e, "priority")}
          value={newTask.priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label>Completed:</label>
        <input
          type="checkbox"
          onChange={(e) => setTask(e, "completed")}
          name="completed"
          checked={newTask.completed}
        />
        <button onClick={addTask}>
          {editTaskId !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div>
        <h4>All Tasks</h4>
        <ul>
          {allTasks?.map((task, index: number) => (
            <li key={index}>
              <AllTasks
                index={index}
                task={task}
                editTask={editTask}
                deleteTask={deleteTask}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
