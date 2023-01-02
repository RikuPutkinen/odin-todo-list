function* idGeneratorFunction(start = 0) {
  let id = start;
  while (true) {
    yield ++id;
  }
}

export { idGeneratorFunction };