window.Test = (container) => {
  const test = document.createElement('div');
  test.textContent = "Content loaded";
  container.append(test);
}