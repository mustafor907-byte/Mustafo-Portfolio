/* ===================================================================
   PROJECTS — add your own projects here.

   Each project is one object. Copy a block, change the values.
   - title / description : text in 3 languages (uz, en, ru)
   - image : path to a screenshot (put files in the /images folder)
   - fit   : 'cover' (screenshot) or 'contain' (logo / transparent png)
   - tags  : technologies shown as small chips
   - live  : link to the live website  (leave '' to hide the button)
   - code  : link to the GitHub repo   (leave '' to hide the button)

   The two entries below are EXAMPLES — replace or delete them.
   =================================================================== */
window.PROJECTS = [
  {
    title: {
      uz: 'Restoran veb-sayti',
      en: 'Restaurant website',
      ru: 'Сайт ресторана',
    },
    description: {
      uz: 'Menyu, bron qilish va galereya bilan zamonaviy responsiv sayt.',
      en: 'A modern responsive website with a menu, booking and gallery.',
      ru: 'Современный адаптивный сайт с меню, бронированием и галереей.',
    },
    image: 'images/restaurant.jpg',
    fit: 'cover',
    tags: ['HTML', 'SCSS', 'JavaScript'],
    live: '',
    code: '',
  },
  {
    title: {
      uz: 'Starbucks (klon)',
      en: 'Starbucks (clone)',
      ru: 'Starbucks (клон)',
    },
    description: {
      uz: 'Mashhur kofe brendi sayti dizaynini takrorlash bo‘yicha mashq loyiha.',
      en: 'A practice project recreating the design of a popular coffee brand site.',
      ru: 'Учебный проект: повторение дизайна сайта известного кофейного бренда.',
    },
    image: 'images/starbucks.png',
    fit: 'contain',
    tags: ['HTML', 'CSS', 'Responsive'],
    live: '',
    code: '',
  },
];
