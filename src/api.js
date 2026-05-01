export const BASE = import.meta.env.VITE_API || 'http://localhost:5000';
export async function getProducts(){
  const res = await fetch(BASE + '/api/products');
  return res.json();
}
export async function getProduct(id){ const r = await fetch(BASE + '/api/products/' + id); return r.json(); }
export async function createOrder(body){ const r = await fetch(BASE + '/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return r.json(); }
export async function createMessage(body){ const r = await fetch(BASE + '/api/messages',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return r.json(); }