// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ['p-0','p-1','p-2','p-3','p-4','px-2','py-2','pt-4','pb-4'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
      },
    },
  },
};
