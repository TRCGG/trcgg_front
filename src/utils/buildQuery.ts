const buildQuery = (params: Record<string, string | number | undefined>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) searchParams.append(k, String(v));
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

export default buildQuery;
