import {config} from './config.js';
export class ApiError extends Error { constructor(message,status=0){super(message);this.status=status;} }
async function request(path,{method='GET',body}={}) {
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 try {const response=await fetch(`${config.apiBase}${path}`,{method,credentials:'same-origin',headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal});
 if(!response.ok){const error=await response.json().catch(()=>null);throw new ApiError(error?.error||'So‘rov bajarilmadi.',response.status);}
 if(response.status===204)return null;
 if(!response.headers.get('content-type')?.includes('application/json'))throw new ApiError('Server JSON ma’lumot qaytarmadi.');
 return await response.json();
 }catch(error){if(error instanceof ApiError)throw error;throw new ApiError(error.name==='AbortError'?'Server javobi kutilganidan uzoq davom etdi.':'Server bilan aloqa o‘rnatilmadi.');}finally{clearTimeout(timer);}
}
function array(data){if(!Array.isArray(data))throw new ApiError('Ma’lumot formati noto‘g‘ri.');return data;}
export const api={
 me:()=>request('/api/auth/me'),
 signup:data=>request('/api/auth/signup',{method:'POST',body:data}),
 login:data=>request('/api/auth/login',{method:'POST',body:data}),
 logout:()=>request('/api/auth/logout',{method:'POST',body:{}}),
 claimAdmin:code=>request('/api/auth/claim-admin',{method:'POST',body:{code}}),
 articles:async()=>array(await request('/api/articles')),
 article:id=>request(`/api/articles/${encodeURIComponent(id)}`),
 breaking:async()=>array(await request('/api/breaking-news')),
 poll:()=>request('/api/polls/active'),
 vote:(pollId,optionId)=>request('/api/polls/vote',{method:'POST',body:{pollId,optionId}}),
 archive:async()=>array(await request('/api/archive')),
 submit:data=>request('/api/submissions',{method:'POST',body:data}),
 like:id=>request(`/api/articles/${encodeURIComponent(id)}/like`,{method:'POST',body:{}})
};
