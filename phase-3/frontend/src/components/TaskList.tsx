/**
 * TaskList component.
 * Displays a list of tasks with filtering and task management capabilities.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskItem } from "@/components/TaskItem";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { tasksApi } from "@/lib/api";
import { Task, TaskFilter } from "@/types/task";
import { Plus, ListFilter, RotateCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setIsCreateOpen(false);
    toast.success("Task created successfully");
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success("Task updated");
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted");
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    const updatedTask = { ...task, is_completed: !task.is_completed };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );

    try {
      await tasksApi.update(taskId, { is_completed: !task.is_completed });
    } catch (error) {
      // Revert on error
      console.error("Error updating task:", error);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? task : t))
      );
      toast.error("Failed to update task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.is_completed;
    if (filter === "active") return !task.is_completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.is_completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Tasks</h2>
          <p className="text-muted-foreground mt-1">
            You have <span className="font-semibold text-primary">{activeCount}</span> filteredTasks remaining
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchTasks}
            title="Refresh tasks"
            className="hover:bg-primary/5 border-primary/20 text-primary"
          >
            <RotateCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                <ListFilter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as TaskFilter)}>
                <DropdownMenuRadioItem value="all">All Tasks</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm font-semibold">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {isCreateOpen && (
        <div className="mb-6 p-4 rounded-xl border bg-card/50 shadow-sm animate-in slide-in-from-top-4 border-primary/10">
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <TaskForm
            onSuccess={handleTaskCreated}
            onCancel={() => setIsCreateOpen(false)}
          />
        </div>
      )}

      {isLoading && tasks.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            // Skeleton loader
            <div key={i} className="h-32 rounded-xl border bg-muted/10 animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed bg-muted/5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
            {filter === "all"
              ? "You haven't created any tasks yet. Get started by adding your first task!"
              : `No ${filter} tasks found. Try changing the filter.`}
          </p>
          {filter === "all" && (
            <Button onClick={() => setIsCreateOpen(true)} variant="link" className="mt-2 text-primary">
              Create a task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
