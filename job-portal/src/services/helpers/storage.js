// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// User data management
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

// Theme management
export const getTheme = () => localStorage.getItem('theme') || 'light';
export const setTheme = (theme) => localStorage.setItem('theme', theme);

// Search history management
export const getSearchHistory = () => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
};
export const addToSearchHistory = (search) => {
  const history = getSearchHistory();
  const newHistory = [search, ...history.filter(item => item !== search)].slice(0, 10);
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
};
export const clearSearchHistory = () => localStorage.removeItem('searchHistory');

// Recently viewed jobs
export const getRecentJobs = () => {
  const jobs = localStorage.getItem('recentJobs');
  return jobs ? JSON.parse(jobs) : [];
};
export const addToRecentJobs = (job) => {
  const jobs = getRecentJobs();
  const newJobs = [job, ...jobs.filter(item => item.id !== job.id)].slice(0, 10);
  localStorage.setItem('recentJobs', JSON.stringify(newJobs));
};
export const clearRecentJobs = () => localStorage.removeItem('recentJobs');

// Clear all storage
export const clearStorage = () => {
  removeToken();
  removeUser();
  clearSearchHistory();
  clearRecentJobs();
};
