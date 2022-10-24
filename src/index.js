import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
    <li class="one__country">
      <img src='${country.flags.svg}' alt='flag of ${country.name.official}' width = '100px' height='60px'>
      <p><b>${country.name.official}</b></p>
    </li>`;
    })
    .join('');

  refs.countryListEl.innerHTML = markup;
}

function renderCountry(countries) {
  const markup = countries
    .map(country => {
      return `
    <li class="country__item">
      <img src='${country.flags.svg}' alt='flag of ${
        country.name.official
      }' width = '100px' height= '60px'>
      <p class="country__name"><b>${country.name.official}</b></p>
      <p><b>Capital:</b> ${country.capital}</p>
      <p><b>Population:</b> ${country.population}</p>
      <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>
    </li>`;
    })
    .join('');

  refs.countryListEl.innerHTML = markup;
}

refs.inputEl.addEventListener('input', debounce(someFunction, DEBOUNCE_DELAY));

function someFunction(event) {
  const userInputData = event.target.value.trim();
  if (userInputData === '') {
    return;
  }

  fetchCountries(userInputData).then(data => {
    console.log(data);
    if (data.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name'
      );
      refs.countryListEl.innerHTML = '';
    } else if (data.length === 1) {
      renderCountry(data);
    } else {
      renderCountryList(data);

      refs.countryListEl.addEventListener('click', chooseOneCountry);
    }
  });
}

function chooseOneCountry(event) {
  console.dir(event);
  const parentElem = event.target.parentNode;
  console.log(parentElem.childNodes);
  // console.log(typeof parentElem.childNodes[3]);
  const nodeItem = [...parentElem.childNodes]
    .find(node => {
      return node.tagName === 'P';
    })
    .textContent.replaceAll(' ', '%20');

  console.log(nodeItem);

  fetchCountries(nodeItem).then(renderCountry);
}
