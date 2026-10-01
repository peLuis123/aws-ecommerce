import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CatalogPage } from '../src/pages/Catalog/CatalogPage';
import { productsApi } from '../src/api/products.api';
vi.mock('../src/api/products.api', () => ({ productsApi: { list: vi.fn() } }));
vi.mock('../src/api/categories.api', () => ({ categoriesApi: { list: async () => ({ data: [{ categoryId: 'c1', slug: 'ceramica', name: 'Cerámica' }] }) } }));
vi.mock('../src/components/product/ProductCard', () => ({ ProductCard: ({ product }) => <article>{product.name}</article> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it('requests pages from the API, preserves filters and resets page on search', async () => {
  productsApi.list.mockImplementation(async params => ({ data: {
    items: [{ productId: 'p', name: `Resultado página ${params.page}` }], page: params.page, total: 15, totalPages: 2, pageSize: 12,
  } }));
  render(<MemoryRouter initialEntries={['/tienda?categoria=ceramica&orden=low']}><CatalogPage /></MemoryRouter>);
  await screen.findByText('Resultado página 1');
  expect(screen.getByRole('button', { name: 'Anterior' }).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  await screen.findByText('Resultado página 2');
  expect(productsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, pageSize: 12, category: 'ceramica', sort: 'low' }));
  expect(screen.getByRole('button', { name: 'Siguiente' }).disabled).toBe(true);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'taza' } });
  await waitFor(() => expect(productsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, q: 'taza', category: 'ceramica' })));
  await screen.findByText('Resultado página 1');
});
it('supports retry after a failed page request', async () => {
  productsApi.list.mockRejectedValueOnce(new Error('network')).mockResolvedValue({ data: { items: [], page: 1, total: 0, totalPages: 1, pageSize: 12 } });
  render(<MemoryRouter><CatalogPage /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }));
  await screen.findByText('No encontramos esa pieza.');
  expect(screen.queryByRole('navigation', { name: 'Paginación de productos' })).toBeNull();
});
