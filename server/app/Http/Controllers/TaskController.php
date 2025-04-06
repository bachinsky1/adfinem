<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Tasks", description="Task operations")
 */
/**
 * @OA\Schema(
 *     schema="TaskStatus",
 *     type="string",
 *     enum={"pending", "in progress", "completed"},
 *     description="Status of the task: 
 *     - pending: waiting to be started
 *     - in progress: currently being worked on
 *     - completed: finished"
 * )
 */

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->middleware('auth:api');
        $this->taskService = $taskService;
    }

    /**
     * List all tasks.
     *
     * @OA\Get(
     *     path="/api/tasks",
     *     tags={"Tasks"},
     *     security={{"bearerAuth":{}}},
     *     summary="List all tasks",
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index()
    {
        return response()->json($this->taskService->getAll());
    }

    /**
     * Create new task.
     *
     * @OA\Post(
     *     path="/api/tasks",
     *     tags={"Tasks"},
     *     security={{"bearerAuth":{}}},
     *     summary="Create task",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="New task"),
     *             @OA\Property(property="description", type="string", example="Task description"),
     *             @OA\Property(property="status", type="string", example="pending")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Task created"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in progress,completed'
        ]);

        $task = $this->taskService->create($validated);
        return response()->json($task, 201);
    }

    /**
     * Get task by id.
     *
     * @OA\Get(
     *     path="/api/tasks/{id}",
     *     tags={"Tasks"},
     *     security={{"bearerAuth":{}}},
     *     summary="Get task by ID",
     *     @OA\Parameter(name="id", in="path", required=true, example=1),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function show(string $id)
    {
        return response()->json($this->taskService->getById($id));
    }

    /**
     * Update task.
     *
     * @OA\Put(
     *     path="/api/tasks/{id}",
     *     tags={"Tasks"},
     *     security={{"bearerAuth":{}}},
     *     summary="Update task",
     *     @OA\Parameter(name="id", in="path", required=true, example=1),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated task"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="status", type="string", example="pending")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Task updated"),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in progress,completed'
        ]);

        return response()->json($this->taskService->update($id, $validated));
    }


    /**
     * Delete task.
     *
     * @OA\Delete(
     *     path="/api/tasks/{id}",
     *     tags={"Tasks"},
     *     security={{"bearerAuth":{}}},
     *     summary="Delete task",
     *     @OA\Parameter(name="id", in="path", required=true, example=1),
     *     @OA\Response(response=200, description="Task deleted"),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function destroy(string $id)
    {
        $this->taskService->delete($id);
        return response()->json(['message' => 'Task deleted']);
    }
}
