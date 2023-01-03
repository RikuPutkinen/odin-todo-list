import { idGeneratorFunction } from './generators';
import { setDefaultOptions } from 'date-fns';

const updateStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item));
const loadStorage = (item) => JSON.parse(localStorage.getItem(item));
let latestId = loadStorage("todoLatestId") || 0;

const idGenerator = idGeneratorFunction(latestId);

const newId = () => {
  let latestId = idGenerator.next().value;
  updateStorage("todoLatestId", latestId);
  return latestId;
}

const todayISOStringShort = () => {
  return (new Date()).
  toISOString().
  split("T")[0]
}

class TODO {
  constructor() {
    this.title = "New todo";
    this.dueDate = todayISOStringShort();
    this.priority = 5;
    this.description = "";
    this.completed = false;
    this.id = newId().toString();
  }
}

class PROJECT extends TODO {
  constructor() {
    super();
    this.title = "New project";
    this.todos = [];
  }
}

const createProject = (projectArray) => {
  const project = new PROJECT();
  projectArray.push(project);
  updateStorage("todoProjects", projectArray);
};

const createTodo = (project, projectArray) => {
  const todo = new TODO();
  project.todos.push(todo);
  updateStorage("todoProjects", projectArray);
};

const findIndexById = (array, id) => {
  return array.findIndex(object => object.id === id);
}

const deleteById = (array, id) => {
  let index = findIndexById(array, id);
  array.splice(index, 1);
}

export {
        updateStorage,
        loadStorage,
        createProject,
        createTodo,
        findIndexById,
        deleteById,
}