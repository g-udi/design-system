// Client script from rehype-code-group 0.1.3 (https://github.com/ITZSHOAIB/rehype-code-group),
// MIT License, Copyright (c) 2024 Sohab Sk. The full notice is in ./LICENSE and THIRD_PARTY_LICENSES.
const codeGroups = document.querySelectorAll('.rehype-code-group');

codeGroups.forEach((group) => {
  const tabs = group.querySelectorAll('.rcg-tab');
  const blocks = group.querySelectorAll('.rcg-block');
  let activeTab = group.querySelector('.rcg-tab.active');
  let activeBlock = group.querySelector('.rcg-block.active');

  group.addEventListener('click', (event) => {
    const tab = event.target.closest('.rcg-tab');

    if (!tab) return;

    const index = Array.from(tabs).indexOf(tab);

    if (index === -1) return;

    if (activeTab) {
      activeTab.classList.remove('active');
      activeTab.setAttribute('aria-selected', 'false');
    }
    if (activeBlock) {
      activeBlock.classList.remove('active');
      activeBlock.setAttribute('hidden', 'true');
    }

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    blocks[index].classList.add('active');
    blocks[index].removeAttribute('hidden');

    activeTab = tab;
    activeBlock = blocks[index];
  });
});

