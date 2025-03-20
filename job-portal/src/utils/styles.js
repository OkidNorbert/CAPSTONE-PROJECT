/**
 * Combines class names conditionally
 * @param {...(string|Object|Array)} args - Class names or conditional objects
 * @returns {string} Combined class names
 */
export const cn = (...args) => {
  const classes = [];

  args.forEach(arg => {
    if (!arg) return;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cn(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
};

/**
 * Generate gradient styles
 * @param {Object} options - Gradient options
 * @param {string} options.from - Start color
 * @param {string} options.to - End color
 * @param {string} options.direction - Gradient direction (default: 'to right')
 * @returns {Object} Style object with gradient
 */
export const gradient = ({ from, to, direction = 'to right' } = {}) => ({
  backgroundImage: `linear-gradient(${direction}, ${from}, ${to})`,
});

/**
 * Generate box shadow styles
 * @param {Object} options - Shadow options
 * @param {string} options.color - Shadow color
 * @param {string} options.intensity - Shadow intensity ('sm', 'md', 'lg', 'xl')
 * @returns {Object} Style object with box shadow
 */
export const shadow = ({ color = 'rgba(0, 0, 0, 0.1)', intensity = 'md' } = {}) => {
  const shadows = {
    sm: `0 1px 2px ${color}`,
    md: `0 4px 6px ${color}`,
    lg: `0 10px 15px ${color}`,
    xl: `0 20px 25px ${color}`,
  };

  return {
    boxShadow: shadows[intensity] || shadows.md,
  };
};

/**
 * Generate transition styles
 * @param {Object} options - Transition options
 * @param {string|string[]} options.properties - CSS properties to transition
 * @param {string} options.duration - Transition duration
 * @param {string} options.timing - Timing function
 * @returns {Object} Style object with transition
 */
export const transition = ({ 
  properties = ['all'],
  duration = '300ms',
  timing = 'ease-in-out',
} = {}) => ({
  transition: Array.isArray(properties)
    ? properties.map(prop => `${prop} ${duration} ${timing}`).join(', ')
    : `${properties} ${duration} ${timing}`,
});

/**
 * Generate truncate text styles
 * @param {Object} options - Truncate options
 * @param {number} options.lines - Number of lines before truncating
 * @returns {Object} Style object for text truncation
 */
export const truncate = ({ lines = 1 } = {}) => ({
  overflow: 'hidden',
  textOverflow: lines === 1 ? 'ellipsis' : undefined,
  display: lines === 1 ? undefined : '-webkit-box',
  WebkitLineClamp: lines === 1 ? undefined : lines,
  WebkitBoxOrient: lines === 1 ? undefined : 'vertical',
  whiteSpace: lines === 1 ? 'nowrap' : 'normal',
});

/**
 * Generate responsive styles
 * @param {Object} styles - Styles object with breakpoint keys
 * @returns {Object} Combined styles object
 */
export const responsive = (styles) => {
  const breakpoints = {
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
  };

  return Object.entries(styles).reduce((acc, [key, value]) => {
    if (breakpoints[key]) {
      acc[breakpoints[key]] = value;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Generate glass effect styles
 * @param {Object} options - Glass effect options
 * @param {number} options.opacity - Background opacity (0-1)
 * @param {number} options.blur - Blur amount in pixels
 * @returns {Object} Style object for glass effect
 */
export const glassEffect = ({ opacity = 0.7, blur = 8 } = {}) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
});

/**
 * Generate hover effect styles
 * @param {Object} options - Hover effect options
 * @param {string} options.scale - Scale amount on hover
 * @param {string} options.duration - Transition duration
 * @returns {Object} Style object for hover effect
 */
export const hoverEffect = ({ scale = '1.05', duration = '300ms' } = {}) => ({
  transform: 'scale(1)',
  transition: `transform ${duration} ease-in-out`,
  ':hover': {
    transform: `scale(${scale})`,
  },
});

/**
 * Generate focus ring styles
 * @param {Object} options - Focus ring options
 * @param {string} options.color - Ring color
 * @param {number} options.width - Ring width in pixels
 * @param {number} options.offset - Ring offset in pixels
 * @returns {Object} Style object for focus ring
 */
export const focusRing = ({ 
  color = 'rgb(59, 130, 246)',
  width = 2,
  offset = 2,
} = {}) => ({
  outline: 'none',
  ':focus-visible': {
    boxShadow: `0 0 0 ${width}px ${color}`,
    outline: 'none',
    outlineOffset: `${offset}px`,
  },
});

export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  }
}; 