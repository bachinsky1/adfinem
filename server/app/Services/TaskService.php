<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\Task;

class TaskService
{
    public function getAll()
    {
        $user = Auth::user();
        return $user->isAdmin()
            ? Task::with('user')->get()
            : Task::with('user')->where('user_id', $user->id)->get();
    }

    public function create(array $data)
    {
        return Auth::user()->tasks()->create($data);
    }

    public function getById($id)
    {
        $user = Auth::user();
        $query = Task::with('user')->where('id', $id);
    
        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }
    
        return $query->firstOrFail();
    }

    public function update($id, array $data)
    {
        $task = $this->getById($id);
        $task->update($data);
        return $task;
    }

    public function delete($id)
    {
        $task = $this->getById($id);
        return $task->delete();
    }
}
