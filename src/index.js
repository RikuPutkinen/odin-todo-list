import * as R from 'ramda';

const projects = [];

class TODO {
  constructor(title, dueDate, priority, description) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.completed = false;
    this.id = Date.now().toString();
  }
}

class PROJECT extends TODO {
  constructor(title, dueDate, priority, description) {
    super(title, dueDate, priority, description);
    this.todos = [];
  }
}

/*const find = R.curry((arr, id) => arr.find(elem => elem === id));
const findProject = find(projects);
*/
const add = R.curry((arr, item) => arr.push(item));
const addProject = add(projects);
/*
const newProject = R.compose(addProject, createProject);
*/

const createTodo = (title, dueDate, priority, description) => new TODO(title, dueDate, priority, description);
const createProject = (title, dueDate, priority, description) => new PROJECT(title, dueDate, priority, description);

const P = createProject("pppp", new Date(2022, 4, 1), 5, "AAAAA");
addProject(P);
console.log('It works');
console.log(P);