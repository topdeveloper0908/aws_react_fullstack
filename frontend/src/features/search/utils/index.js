export const paginate = (results) => {
  const arrayLength = results.length;
  const pages = [];

  for (let i = 0; i < arrayLength; i += 10) {
    const page = results.slice(i, i + 10);
    pages.push(page);
  }

  return pages;
};
