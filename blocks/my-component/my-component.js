export default function decorate(block) {
  const heading = block.querySelector('h2');
  const text = block.querySelector('p');

  block.innerHTML = `
      <div class="my-component-wrapper">
        <h2>${heading?.textContent}</h2>
        <p>${text?.textContent}</p>
      </div>
    `;
}
