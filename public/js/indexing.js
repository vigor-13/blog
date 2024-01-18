document.addEventListener('DOMContentLoaded', function () {
  const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
  if (!headings.length) return;

  const indexContainer = document.querySelector('.info-box.content-index');
  let indexUlElement = _createList(headings);
  indexContainer.appendChild(indexUlElement);
});

function _createList(headings, index = 0, parent, parents = [], root) {
  const head = headings[index];
  if (!head) return;

  let ulElement;
  if (parent && parent.tagName === 'UL') {
    ulElement = parent;
  } else {
    ulElement = document.createElement('ul');
    parents.push(ulElement);
  }

  if (index !== 0 && headings[index].tagName === 'H2') {
    ulElement = root;
  }

  const liElement = document.createElement('li');
  const aElement = document.createElement('a');
  aElement.textContent = head.textContent;
  aElement.href = `#${head.id}`;
  liElement.appendChild(aElement);
  ulElement.appendChild(liElement);

  if (parent && parent.tagName === 'LI') {
    parent.appendChild(ulElement);
  }

  if (headings.length - 1 > index) {
    let _rootUl = index === 0 ? ulElement : root;
    let _parent;
    let _parents = parents;
    let currentDepth = Number(headings[index].tagName[1]);
    let nextDepth = Number(headings[index + 1].tagName[1]);

    if (nextDepth > currentDepth) {
      _parent = liElement;
    } else if (currentDepth === nextDepth) {
      _parent = ulElement;
    } else {
      const depth = currentDepth - nextDepth + 1;
      _parent = _parents[_parents.length - depth];
      _parents.pop();
    }

    _createList(headings, index + 1, _parent, _parents, _rootUl);
  }

  return ulElement;
}
