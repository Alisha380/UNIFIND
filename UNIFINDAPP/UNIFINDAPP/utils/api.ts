
export const getItems = async (apiUrl: string) => {
  const response = await fetch(`${apiUrl}/items`);

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  const data = await response.json();

  return data;
};

export const createReport = async (
  apiUrl: string,
  report: object
) => {
  const response = await fetch(`${apiUrl}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });

  return response;
};

export const updateReport = async (
  apiUrl: string,
  id: number | string,
  report: object
) => {
  const response = await fetch(`${apiUrl}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });

  return response;
};

export const deleteReport = async (
  apiUrl: string,
  id: number | string
) => {
  const response = await fetch(`${apiUrl}/items/${id}`, {
    method: 'DELETE',
  });

  return response;
};
