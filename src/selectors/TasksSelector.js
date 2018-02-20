import { createSelector } from 'reselect'
import * as sortTypes from '../constants/SortTypes'

const getVisibilityFilter = (state) => state.settings.get('showingMarked');
const getOrderFilter = (state) => state.settings.get('sorting');
const getTasks = (state) => state.tasks;

export const getVisibleTasks = createSelector(
  [ getVisibilityFilter, getOrderFilter, getTasks ],
  (showingMarked, sorting, tasks) => {
    return tasks.filter((task) => showingMarked || !task.get('marked'))
     .sort((previous, next) => {
       if(sorting === sortTypes.NONE)
         return 0;
       const nameA = previous.get('text').toUpperCase();
       const nameB = next.get('text').toUpperCase();
       let value = nameA.localeCompare(nameB);
       value = sorting === sortTypes.DESCENDING ? value * -1 : value;
       return value;
     })
  }
);