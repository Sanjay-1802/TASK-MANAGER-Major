import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://task-manager-major.onrender.com";

function App() {
const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [priority, setPriority] = useState("Medium");
const [dueDate, setDueDate] = useState("");
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const [editId, setEditId] = useState(null);
const [sortBy, setSortBy] = useState("newest");

const fetchTasks = async () => {
try {
const response = await fetch("/api/tasks");
const data = await response.json();


  if (Array.isArray(data)) {
    setTasks(data);
  } else {
    setTasks(data.data || []);
  }
} catch (error) {
  console.error(error);
}


};

useEffect(() => {
fetchTasks();
}, []);

const handleSubmit = async (e) => {
e.preventDefault();


try {
  if (editId) {
    await fetch(`/api/tasks/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,
      }),
    });
    toast.success("✏️ Task Updated Successfully");

    setEditId(null);
  } else {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,
      }),
    });
    toast.success("✏️ Task Updated Successfully");
  }

  setTitle("");
  setDescription("");
  setPriority("Medium");
  setDueDate("");

  fetchTasks();
} catch (error) {
  console.error(error);
}


};

const editTask = (task) => {
setTitle(task.title);
setDescription(task.description);
setPriority(task.priority || "Medium");
setDueDate(
task.dueDate
? task.dueDate.split("T")[0]
: ""
);
setEditId(task._id);
};

const deleteTask = async (id) => {
try {
await fetch(`/api/tasks/${id}`, {
method: "DELETE",
});

toast.success("✏️ Task Deleted Successfully");


  fetchTasks();
} catch (error) {
  console.error(error);
}


};

const completeTask = async (id) => {
try {
await fetch(`/api/tasks/${id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
status: "completed",
}),
});

toast.success("🎉 Task Completed");

  fetchTasks();
} catch (error) {
  console.error(error);
}


};

const filteredTasks = tasks
  .filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : task.status === filter;

    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    }

    if (sortBy === "high") {
      const order = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      return (
        order[b.priority] -
        order[a.priority]
      );
    }

    if (sortBy === "low") {
      const order = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      return (
        order[a.priority] -
        order[b.priority]
      );
    }

    return 0;
  });

return ( <div className="container"> <h1>🚀 Task Manager</h1>


  <div className="stats">
    <div className="stat-card">
      <h3>{tasks.length}</h3>
      <p>Total Tasks</p>
    </div>

    <div className="stat-card">
      <h3>
        {
          tasks.filter(
            (task) =>
              task.status === "completed"
          ).length
        }
      </h3>
      <p>Completed</p>
    </div>

    <div className="stat-card">
      <h3>
        {
          tasks.filter(
            (task) =>
              task.status === "pending"
          ).length
        }
      </h3>
      <p>Pending</p>
    </div>
  </div>

  <div className="form-container">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        required
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        required
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="Low">
          🟢 Low
        </option>
        <option value="Medium">
          🟡 Medium
        </option>
        <option value="High">
          🔴 High
        </option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <div className="form-buttons">
        <button
          className="add-btn"
          type="submit"
        >
          {editId
            ? "Update Task"
            : "Add Task"}
        </button>

        {editId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setDescription("");
              setPriority("Medium");
              setDueDate("");
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>

  <input
    className="search-bar"
    type="text"
    placeholder="🔍 Search Tasks..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

  <div className="filter-buttons">
    <button
      onClick={() => setFilter("all")}
    >
      All
    </button>

    <button
      onClick={() =>
        setFilter("pending")
      }
    >
      Pending
    </button>

    <button
      onClick={() =>
        setFilter("completed")
      }
    >
      Completed
    </button>
  </div>
  <select
  className="sort-select"
  value={sortBy}
  onChange={(e) =>
    setSortBy(e.target.value)
  }
>
  <option value="newest">
    Newest First
  </option>

  <option value="oldest">
    Oldest First
  </option>

  <option value="high">
    High Priority
  </option>

  <option value="low">
    Low Priority
  </option>
</select>

  <div className="task-list">
    <h2>All Tasks</h2>

    {filteredTasks.length === 0 ? (
      <p className="no-task">
        No Tasks Found
      </p>
    ) : (
      filteredTasks.map((task) => (
        <div
          key={task._id}
          className="task-card"
        >
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p
            className={`priority ${
              task.priority || "Medium"
            }`}
          >
            {task.priority ||
              "Medium"}
          </p>

          <p>
            📅 Due Date:{" "}
            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "Not Set"}
          </p>

          <p>
            🕒 Created:{" "}
            {task.createdAt
              ? new Date(
                  task.createdAt
                ).toLocaleDateString()
              : "N/A"}
          </p>

          <span
            className={
              task.status ===
              "completed"
                ? "completed"
                : "pending"
            }
          >
            {task.status}
          </span>

          <div className="action-buttons">
            <button
              className="edit-btn"
              onClick={() =>
                editTask(task)
              }
            >
              ✏️ Edit
            </button>

            {task.status !==
              "completed" && (
              <button
                className="complete-btn"
                onClick={() =>
                  completeTask(
                    task._id
                  )
                }
              >
                ✅ Complete
              </button>
            )}

            <button
              className="delete-btn"
              onClick={() =>
                deleteTask(task._id)
              }
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
  <ToastContainer
    position="top-right"
    autoClose={2000}
    theme="dark"
  />
</div>
);
}

export default App;
