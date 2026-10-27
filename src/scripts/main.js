"use strict";

import { generateTaskId } from "./utils/generate-task-id.js";

const tasksListEl = document.querySelector("#tasks-list");
const createdTasksQuantity = document.querySelector("#created-tasks-quantity");
const completedTasksQuantity = document.querySelector("#completed-tasks-quantity");

const createTaskFormEl = document.querySelector("#create-task-form")
const createTaskInputEl = document.querySelector("#create-task-input");

let tasks = [];
const TASKS_KEY = "tasks";

const noTasksWrapper = document.createElement("div");

noTasksWrapper.id = "no-tasks-wrapper";
noTasksWrapper.innerHTML = `
  <img src="./src/assets/clipboard.svg" alt="">
  <p class="no-tasks-message">
    <strong>Você ainda não tem tarefas cadastradas</strong>
    <br />
    Crie tarefas e organize seus itens a fazer
  </p>
`;

function showEmptyTaskList() {
  tasksListEl.appendChild(noTasksWrapper);
}

document.addEventListener("DOMContentLoaded", () => {
  const localStorageTasks = JSON.parse(localStorage.getItem(TASKS_KEY));

  if(localStorageTasks.length === 0) {
    showEmptyTaskList();

  } else {
    localStorageTasks.forEach(task => {
      addTask(task);
    });
  }
});

createTaskFormEl.onsubmit = (event) => {
  event.preventDefault();
  
  if(!createTaskInputEl.value) {
    return alert("Título inválido!");
  }

  const newTask = {
    id: generateTaskId(),
    title: createTaskInputEl.value,
    completed: false
  }

  addTask(newTask);

  if(tasksListEl.contains(noTasksWrapper)) {
    tasksListEl.removeChild(noTasksWrapper);
  }

  createTaskFormEl.reset();
  createTaskInputEl.focus();
}

function updateCreatedTasksQuantity() {
  createdTasksQuantity.textContent = tasks.length;
}

function addTask(newTask) {
  try {
    const taskItemLi = document.createElement("li");
    const taskItemCheckbox = document.createElement("input");
    const taskItemP = document.createElement("p");
    const taskItemButton = document.createElement("button");

    taskItemLi.id = newTask.id;
    taskItemLi.className = "task"

    taskItemCheckbox.type = "checkbox";

    taskItemP.textContent = newTask.title;

    taskItemButton.id = "delete-task-button";
    taskItemButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.2021 9.98547H12.8716V15.5073H14.2021V9.98547Z" fill="#808080"/>
        <path d="M11.4624 9.98547H10.1318V15.5073H11.4624V9.98547Z" fill="#808080"/>
        <path d="M18.478 7.16712C18.4754 7.03061 18.4295 6.89846 18.3469 6.78975C18.2642 6.68104 18.1492 6.6014 18.0184 6.56232V6.56232C17.9596 6.53782 17.8974 6.52252 17.8339 6.51696H14.2868C14.1525 6.07791 13.8808 5.69355 13.5117 5.42047C13.1426 5.14739 12.6956 5 12.2365 5C11.7774 5 11.3304 5.14739 10.9613 5.42047C10.5922 5.69355 10.3205 6.07791 10.1862 6.51696H6.63911C6.58068 6.51814 6.52269 6.52729 6.46674 6.54418H6.45162C6.31318 6.58701 6.19334 6.67547 6.11163 6.79515C6.02992 6.91483 5.99117 7.05866 6.00169 7.20319C6.01222 7.34771 6.0714 7.48441 6.16958 7.59099C6.26776 7.69757 6.39916 7.76774 6.54234 7.79006L7.25298 17.5334C7.26382 17.9127 7.41693 18.2741 7.68191 18.5458C7.94688 18.8175 8.30435 18.9797 8.68332 19H15.7867C16.1662 18.9804 16.5244 18.8186 16.79 18.5468C17.0556 18.2751 17.2092 17.9132 17.22 17.5334L17.9277 7.79914C18.0802 7.77797 18.22 7.70232 18.3212 7.58615C18.4223 7.46999 18.478 7.32116 18.478 7.16712V7.16712ZM12.2365 6.21456C12.3661 6.21458 12.4943 6.24146 12.6129 6.29351C12.7316 6.34556 12.8382 6.42164 12.926 6.51696H11.547C11.6346 6.42135 11.7411 6.34507 11.8599 6.29299C11.9786 6.24092 12.1069 6.21421 12.2365 6.21456V6.21456ZM15.7867 17.7904H8.68332C8.60168 17.7904 8.47467 17.6573 8.45955 17.4457L7.75798 7.81123H16.715L16.0135 17.4457C15.9984 17.6573 15.8714 17.7904 15.7867 17.7904Z" fill="#808080"/>
      </svg>
    `;
    taskItemButton.onclick = () => deleteTask(newTask.id);
    
    taskItemLi.append(taskItemCheckbox, taskItemP, taskItemButton);
    tasksListEl.appendChild(taskItemLi);

    tasks.push(newTask);

    updateCreatedTasksQuantity();
    updateCompletedTasksQuantity();

    taskItemCheckbox.oninput = () => updateTaskStatus(newTask.id);
    newTask.completed ? taskItemCheckbox.checked = true : taskItemCheckbox.checked = false;

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  } catch (error) {
    alert("Não foi possível adicionar a nova tarefa!");
    console.error(error);
  }
}

function deleteTask(taskId) {
  document.getElementById(taskId).remove();

  const newTasks = tasks.filter((task) => task.id !== taskId);
  tasks = newTasks;

  updateCreatedTasksQuantity();
  updateCompletedTasksQuantity();

  if(tasks.length === 0) {
    showEmptyTaskList();
  }

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function updateTaskStatus(taskId) {
  const taskItem = tasks.find((task) => task.id === taskId);

  taskItem.completed = !taskItem.completed

  updateCompletedTasksQuantity();

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function updateCompletedTasksQuantity() {
  const filteredTasksByStatusCompleted = tasks.filter((task) => task.completed === true);

  tasks.length > 0 ? 
  completedTasksQuantity.textContent = `${filteredTasksByStatusCompleted.length} de ${tasks.length}` :
  completedTasksQuantity.textContent = "0";
}
