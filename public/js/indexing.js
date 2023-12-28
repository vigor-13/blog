document.addEventListener('DOMContentLoaded', function () {
  const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
  if (!headings.length) return;

  const sectionElement = document.querySelector('.post-left');

  const containerElement = document.createElement('div');
  containerElement.className = 'info-box content-index';

  const titleElement = document.createElement('div');
  titleElement.textContent = '목차';

  let indexUlElement = _createList(headings, 0);

  containerElement.appendChild(titleElement);
  containerElement.appendChild(indexUlElement);
  sectionElement.appendChild(containerElement);
});

const _tempList = [];
function _createList(headings, index, parent) {
  const head = headings[index];
  if (!head) return;

  let ulElement;
  if (parent && parent.tagName === 'UL') {
    ulElement = parent;
  } else {
    ulElement = document.createElement('ul');
    _tempList.push(ulElement);
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
    let parent;
    let currentDepth = Number(headings[index].tagName[1]);
    let nextDepth = Number(headings[index + 1].tagName[1]);

    if (nextDepth > currentDepth) {
      parent = liElement;
    } else if (currentDepth === nextDepth) {
      parent = ulElement;
    } else {
      const depth = currentDepth - nextDepth + 1;
      parent = _tempList[_tempList.length - depth];
    }

    _createList(headings, index + 1, parent);
  }

  return ulElement;
}
