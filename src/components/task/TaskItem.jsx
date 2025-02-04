"use client";

import { deleteTaskAction, updateTaskStatusAction, updateTaskTitleAction } from '@/app/actions';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Divider } from '@nextui-org/divider';
import React, { useState } from 'react';
import { CiTrash } from "react-icons/ci";
import { AiFillEdit } from "react-icons/ai";
import { Input } from '@nextui-org/input';

const TaskItem = ({ data, onTaskDeleted, onTaskEdited }) => {
  const [task, setTask] = useState(data);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const onDeleteTask = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await deleteTaskAction({ id: task._id });
      onTaskDeleted(task);
    } catch (err) {
      alert(err.message);
    }
  };

  const onUpdateStatus = async (newValue) => {
    setTask({ ...task, completed: newValue });

    try {
      await updateTaskStatusAction({
        id: task._id,
        newStatus: newValue
      });
    } catch (err) {
      alert(err.message);
      setTask({ ...task, completed: !newValue });
    }
  };

  const onEditTask = () => {
    setEditing(true);
  };

  const onSaveEdit = async () => {
    try {
      // Update the task title in the backend
      await updateTaskTitleAction({
        id: task._id,
        newTitle: editedTitle
      });

      // Update the local state with the new title
      const updatedTask = { ...task, title: editedTitle };
      setTask(updatedTask);

      // Notify the parent component of the change
      onTaskEdited(updatedTask);

      // Exit edit mode
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const onCancelEdit = () => {
    // Reset the edited title to the original title
    setEditedTitle(task.title);
    setEditing(false);
  };

  return (
    <>
      <div className='flex gap-1 items-center justify-between py-6'>
        <Checkbox
          isSelected={task.completed}
          isDisabled={isDeleting}
          onValueChange={onUpdateStatus}
        />
        <div className="flex items-center grow">
          {isEditing ? (
            <Input
              autoFocus
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSaveEdit();
                }
              }}
            />
          ) : (
            <h5 className={`${task.completed ? "line-through text-gray-300" : "text-gray-700"}`}>
              {task.title}
            </h5>
          )}
        </div>
        
        {isEditing ? (
          <>
            <Button
              isIconOnly
              color='success'
              size='sm'
              onClick={onSaveEdit}
            >
              Save
            </Button>
            <Button
              isIconOnly
              color='default'
              size='sm'
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              isIconOnly
              color='primary'
              size='sm'
              onClick={onEditTask}
            >
              <AiFillEdit size="1.5em" />
            </Button>
            <Button
              isIconOnly
              color='danger'
              size='sm'
              isLoading={isDeleting}
              onClick={onDeleteTask}
            >
              {!isDeleting && <CiTrash size="1.5em" />}
            </Button>
          </>
        )}
      </div>
      <Divider className='bg-gray-100' />
    </>
  );
};

export default TaskItem;