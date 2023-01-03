import * as logic from './modules/logicStuff';

const projectList = document.querySelector(".project-list");
const projectView = document.querySelector(".project-view");
const todoView = document.querySelector(".todo-view");

const listItemTeplate = document.querySelector('#list-item-template');
const projectViewTemplate = document.querySelector("#project-view-template");
const todoViewTemplate = document.querySelector("#todo-view-template");

const projectForm = document.importNode(projectViewTemplate, true);
const todoForm = document.importNode(todoViewTemplate, true);

const projectListElement = document.querySelector("#project-list");
const newProjectButton = document.querySelector('#new-project-button');

const projects = logic.loadStorage("todoProjects") || [];

let selectedProjectId = logic.loadStorage("todoSelectedProjectId") || null;
let selectedTodoId = logic.loadStorage("todoSelectedTodoId") || null;

let selectedProject;
let selectedTodo;

function renderList(arr, listElem) {
  clearElement(listElem);

  arr.forEach(object => {
    const listItem = document.importNode(listItemTeplate.content, true);
    listItem.querySelector('input').checked = object.completed;
    listItem.querySelector(".title").textContent = object.title;
    listItem.querySelector(".due-date").textContent += object.dueDate;
    listElem.appendChild(listItem);
    listElem.lastElementChild.dataset.id = object.id;
  });
}

function renderProjectView(projectId) {
  clearElement(projectView);
  selectedProject = projects[logic.findIndexById(projects, projectId)];

  const projectForm = document.importNode(projectViewTemplate.content, true);
  const todoList = projectForm.querySelector('#todo-list');

  projectForm.querySelector('#project-title').value = selectedProject.title;
  projectForm.querySelector('#project-due-date').value = selectedProject.dueDate;
  projectForm.querySelector('#project-priority').value = selectedProject.priority;
  projectForm.querySelector('#project-description').value = selectedProject.description;

  renderList(selectedProject.todos, todoList);

  projectView.appendChild(projectForm);

  const saveButton = document.querySelector('#project-save-button');
  const newTodoButton = document.querySelector('#new-todo-button');

  saveButton.addEventListener('click', saveProject);
  newTodoButton.addEventListener('click', () => {
    logic.createTodo(selectedProject, projects)
    renderPage();
  });

  todoList.addEventListener('click', e => {
    if (e.target.matches('.list-button, .list-button *')) {
      selectedTodoId = e.target.closest('li').dataset.id;
  
      renderTodoView(selectedTodoId);
      logic.updateStorage("todoSelectedTodo", selectedTodoId);
    }
  
    if (e.target.matches('.list-delete-button, .list-delete-button *')) {
      const toBeDeletedId = e.target.closest('li').dataset.id;
      if (toBeDeletedId === selectedTodoId) selectedTodoId = null;
      logic.deleteById(selectedProject.todos, toBeDeletedId);
  
      renderPage();
      logic.updateStorage("todoSelectedTodoId", selectedTodoId);
      logic.updateStorage("todoProjects", projects);
    }
  })
}

function saveProject() {
  const projectForm = document.querySelector('#project-form');

  selectedProject.title = projectForm.querySelector('#project-title').value;
  selectedProject.dueDate = projectForm.querySelector('#project-due-date').value;
  selectedProject.priority = projectForm.querySelector('#project-priority').value;
  selectedProject.description = projectForm.querySelector('#project-description').value;

  projects[logic.findIndexById(projects, selectedProjectId)] = selectedProject;
  logic.updateStorage("todoProjects", projects);
  renderPage();
}

// AAAAAAAAAAAAAAAAAAA
function renderTodoView(todoId) {
  clearElement(todoView);
  selectedTodo = selectedProject.todos[logic.findIndexById(selectedProject.todos, todoId)];

  const todoForm = document.importNode(todoViewTemplate.content, true);

  todoForm.querySelector('#todo-title').value = selectedTodo.title;
  todoForm.querySelector('#todo-due-date').value = selectedTodo.dueDate;
  todoForm.querySelector('#todo-priority').value = selectedTodo.priority;
  todoForm.querySelector('#todo-description').value = selectedTodo.description;

  todoView.appendChild(todoForm);

  const saveButton = document.querySelector('#todo-save-button');

  saveButton.addEventListener('click', saveTodo);
}

function saveTodo() {
  const todoForm = document.querySelector('#todo-form');

  selectedTodo.title = todoForm.querySelector('#todo-title').value;
  selectedTodo.dueDate = todoForm.querySelector('#todo-due-date').value;
  selectedTodo.priority = todoForm.querySelector('#todo-priority').value;
  selectedTodo.description = todoForm.querySelector('#todo-description').value;

  selectedProject[logic.findIndexById(selectedProject.todos, selectedTodoId)] = selectedTodo;
  logic.updateStorage("todoProjects", projects);
  renderPage();
}
// BBBBBBBBBBBBBBBBBBB

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

projectListElement.addEventListener('click', e => {
  if (e.target.matches('.list-button, .list-button *')) {
    selectedProjectId = e.target.closest('li').dataset.id;
    selectedTodoId = null;

    renderProjectView(selectedProjectId);
    logic.updateStorage("todoSelectedProjectId", selectedProjectId);
  }

  if (e.target.matches('.list-delete-button, .list-delete-button *')) {
    const toBeDeletedId = e.target.closest('li').dataset.id;
    if (toBeDeletedId === selectedProjectId) selectedProjectId = null;
    logic.deleteById(projects, toBeDeletedId);

    renderPage();
    logic.updateStorage("todoSelectedProjectId", selectedProjectId);
  }
})

newProjectButton.addEventListener('click', () => {
  logic.createProject(projects);
  renderProjectList();
})

function renderProjectList() {
  renderList(projects, projectListElement);
}


function renderPage() {
  renderProjectList();
  selectedProjectId !== null ? renderProjectView(selectedProjectId) : clearElement(projectView);
  selectedTodoId !== null ? renderTodoView(selectedTodoId) : clearElement(todoView);
};

renderPage();