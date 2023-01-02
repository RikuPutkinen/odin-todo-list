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

  projectForm.querySelector('#project-title').value = selectedProject.title;
  projectForm.querySelector('#project-due-date').value = selectedProject.dueDate;
  projectForm.querySelector('#project-priority').value = selectedProject.priority;
  projectForm.querySelector('#project-description').value = selectedProject.description;

  projectView.appendChild(projectForm);
  const saveButton = document.querySelector('#project-save-button');
  saveButton.addEventListener('click', saveProject);
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

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

projectListElement.addEventListener('click', e => {
  if (e.target.matches('.list-button *')) {
    selectedProjectId = e.target.closest('li').dataset.id;
    selectedTodoId = null;

    renderProjectView(selectedProjectId);
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
  if (selectedProjectId) renderProjectView(selectedProjectId);
  //if (selectedTodoId) DOMStuff.renderTodoView(selectedTodoId);
};

renderPage();