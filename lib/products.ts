export const refreshProductsTable = () => {
  const event = new CustomEvent("refresh-table");

  window.dispatchEvent(event);
};
