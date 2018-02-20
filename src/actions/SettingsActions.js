import * as types from '../constants/SettingsActionTypes';

export const showSettings = () => ({ type: types.SHOW_SETTINGS });
export const hideSettings = () => ({ type: types.HIDE_SETTINGS });
export const showMarked = () => ({ type: types.SHOW_MARKED });
export const notShowMarked = () => ({ type: types.NOT_SHOW_MARKED });
export const sortAscending = () => ({ type: types.SORT_ASC });
export const sortDescending = () => ({ type: types.SORT_DESC });
