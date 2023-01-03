import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  cleanUpMarkup(refs.list);
  cleanUpMarkup(refs.info);

  const input = e.target.value.trim();

  if(!input) {
    cleanUpMarkup(refs.list);
    return 
  }                
  
  fetchCountries(input).then(data => sendRequest(data)).catch(err => onFetchError(err));

}

function sendRequest(arr) {
  // if (arr.length > 10) {
  //   Notify.info('Too many matches found. Please enter a more specific name.');
  // } else if (arr.length > 2 && arr.length < 10) {
  //   createListMarkup(arr);
  // } else {
  //   createCardMarkup(arr);
  // }

  if (arr.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }  if (arr.length > 2 && arr.length < 10) {
    createListMarkup(arr);
  } if (arr.length === 1) {
    createCardMarkup(arr);
  }
}

function createListMarkup(arr) {
  let markup = "";
  
  markup = arr
  .map(
    ({ name, flags }) =>
      `<li><img class='img-list' src="${flags.svg}" alt="${name.official}"><h1>${name.official}</h1></li>`
  )
  .join('');
  
  refs.list.innerHTML = markup;
}

function createCardMarkup(arr) {
  let markupInfo = "";

  markupInfo  = arr
  .map(
    ({ name, flags,capital, population, languages}) =>
      `<img src="${flags.svg}" alt="${name.official}"><div class='wrap-info'><h1>${name.official}</h1><p><span>Capital:</span> ${capital}</p><p><span>Population:</span> ${population}</p><p><span>Languages:</span> ${Object.values(languages).join(', ')}</p></div>`
  )
  .join('');

  refs.info.innerHTML = markupInfo;
}


function onFetchError() {
  cleanUpMarkup(refs.list)
  Notify.failure('Oops, there is no country with that name');
}

function cleanUpMarkup(link) {
  link.innerHTML =''
}