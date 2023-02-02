// libraries import
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

// variables
const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

// function for rendering markup for one country
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

//// function for rendering markup for several countries
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

// add event listener to input element
refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

// handler for event listener for input element
function onInputChange(event) {
  const userInputData = event.target.value.trim();
  if (userInputData === '') {
    return;
  }

  // fetch data from public API Rest Countries and render data on the page
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

//handler for click event for choosing one country from the dropdown list
function chooseOneCountry(event) {
  const parentElem = event.target.parentNode;
  const nodeItem = [...parentElem.childNodes]
    .find(node => {
      return node.tagName === 'P';
    })
    .textContent.replaceAll(' ', '%20');

  fetchCountries(nodeItem).then(renderCountry);
}
