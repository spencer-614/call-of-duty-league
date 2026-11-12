export const db = window.supabaseClient || window.dbClient;
export async function rpc(name, args = {}) {
  if (!db) throw Error('The website connection is unavailable. Reload this page.');
  const {data,error} = await db.rpc(name,args);
  if (error) throw Error(error.message);
  return data;
}
export const el = (id) => document.getElementById(id);
export function node(tag,text,className) {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
export const date = value => new Date(value).toLocaleString();
export function notify(text) {el('message').textContent=text;}
export async function signedIn() {if(!db)throw Error('The website connection is unavailable. Reload this page.');const {data,error}=await db.auth.getUser();if(error||!data?.user)return null;return data.user;}
