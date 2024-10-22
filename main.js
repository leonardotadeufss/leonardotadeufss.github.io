const switchTheme = () => {
  const root = document.documentElement
  let theme = root.getAttribute('data-theme')
  let newTheme = theme == 'light' ? 'dark' : 'light'

  root.setAttribute('data-theme', newTheme)
}

const flipCard = () => {
  document.querySelector('#card').classList.toggle('back')
}


const handleCardHover = (event) => {
  if (event.target.closest('#card').classList.contains('back')) return
  const x = event.layerX
  const y = event.layerY
  const card = document.querySelector('#card')
  let angleX = 0
  let angleY = 0

  if (x > 300) {
    angleY = x / 500
  } else {
    angleY = x / (-50)
  }

  if (y < 320) {
    angleX = y / 320
  } else {
    angleX = y / (-320)
  }

  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(0)`;
}

const handleCardOut = (event) => {
  card.style.transform = "";
}

const changeLanguage = (event) => {

  const lang = event.target.dataset.value
  const root = document.documentElement

  root.setAttribute('data-language', lang)
}
const toggleAccordion = (event) => {

  const container = event.target.closest('.container')
  if (event.target.tagName !== "A") container.classList.toggle('open')
}


// event listeners
document.querySelector('#theme-switcher').addEventListener('click', switchTheme)

document.querySelector('#card').addEventListener('mousemove', handleCardHover)
document.querySelector('#card').addEventListener('mouseleave', handleCardOut)


document.querySelector('#works').addEventListener('click', flipCard)
document.querySelector('#works.back').addEventListener('click', flipCard)

document.querySelectorAll('#lang-switcher p').forEach(p => {
  p.addEventListener('click', changeLanguage)
})
document.querySelectorAll('#projects .container').forEach(h2 => {
  h2.addEventListener('click', toggleAccordion)
})

window.onload = () => {
  const langs = ['pt', 'en']
  const userLang = navigator.language || navigator.userLanguage;
  const root = document.documentElement
  const getPreferredScheme = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';
  let language = userLang.slice(0, 2)

  root.setAttribute('data-theme', getPreferredScheme())
  if (langs.includes(language)) {
    root.setAttribute('data-language', language)
  }
}