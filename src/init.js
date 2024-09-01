const DomElements = {
  title: document.querySelector('.display-3'),
  lead: document.querySelector('.lead'),
  input: document.getElementById('url-input'),
  label: document.querySelector('label'),
  button: document.querySelector('form').querySelector('.btn'),
  example: document.querySelector('.example'),
  modal: {
    readButton: document.querySelector('.modal-footer').querySelector('a'),
    closeButton: document.querySelector('.modal-footer').querySelector('button'),
  },
};

export default function init(i18next) {
  DomElements.title.textContent = i18next('elements.title');
  DomElements.lead.textContent = i18next('elements.lead');
  DomElements.input.setAttribute('placeholder', i18next('elements.placeholder'));
  DomElements.label.textContent = i18next('elements.label');
  DomElements.button.textContent = i18next('elements.button');
  DomElements.example.textContent = i18next('elements.example');
  DomElements.modal.readButton.textContent = i18next('elements.modal.readButton');
  DomElements.modal.closeButton.textContent = i18next('elements.modal.closeButton');
}
