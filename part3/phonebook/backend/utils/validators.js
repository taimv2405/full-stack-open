const validateAndTrim = (value) => {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed;
};

module.exports = { validateAndTrim };
