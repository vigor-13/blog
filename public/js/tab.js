document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.tabs-tab-button');
  tabButtons.forEach((element) => {
    element.addEventListener('click', () => {
      const dataId = element.dataset.id;
      const tab = element.closest('.tabs-tabs-wrapper');
      const contents = tab.querySelectorAll('.tabs-tab-content');
      const activeContents = tab.querySelectorAll('.active');

      activeContents.forEach((element) => {
        element.classList.remove('active');
      });

      element.classList.add('active');
      contents.forEach((element) => {
        if (element.dataset.id === dataId) {
          element.classList.add('active');
        }
      });
    });
  });
});
