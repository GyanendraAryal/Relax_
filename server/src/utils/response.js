export function success(res, data, statusCode = 200, meta = null) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created(res, data) {
  return success(res, data, 201);
}

export function noContent(res) {
  return res.status(204).send();
}

export function paginated(res, data, { page, limit, total }) {
  return success(res, data, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  });
}
