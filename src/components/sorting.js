import { sortMap } from "../lib/utils.js";

export const initSorting = (columns) => {
  return (query, state, action) => {
    if (action?.dataset?.field) {
      action.dataset.value = sortMap[action.dataset.value];

      columns.forEach((col) => {
        if (col !== action) col.dataset.value = 'none';
      });

      if (action.dataset.value === 'none') {
        const { sort, ...restQuery } = query;
        return restQuery;
      }

      return {
        ...query,
        sort: `${action.dataset.field}:${action.dataset.value}`,
      };
    }
    return query;
  };
};