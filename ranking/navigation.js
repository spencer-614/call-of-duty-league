(() => {
 const admin=location.pathname.startsWith('/admin/');
 const href=admin?'/admin/ranking/':'/ranking/';
 if(document.querySelector(`a[href="${href}"]`))return;
 const link=document.createElement('a');link.href=href;link.textContent=admin?'Ranking Reviews':'Request Placement / Re-rank';
 link.className=admin?'admin-nav-btn':'btn btn-outline';link.style.cssText='display:inline-flex;align-items:center;padding:10px 14px;color:#d5f45b;border:1px solid #647044;border-radius:6px;text-decoration:none;margin:6px;';
 const target=admin?document.querySelector('.admin-nav-btn')?.parentElement:document.querySelector('[onclick="openLeagueEditModal()"]')?.parentElement;
 (target||document.querySelector('main')||document.body).append(link);
})();
