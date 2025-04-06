(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(t){if(t.ep)return;t.ep=!0;const n=a(t);fetch(t.href,n)}})();const f="http://localhost:8000/api";let u=localStorage.getItem("token");const x=e=>{u=e,localStorage.setItem("token",e)},b=()=>{u=null,localStorage.removeItem("token")},c=async(e,s,a)=>{const r={method:e,headers:{"Content-Type":"application/json",Accept:"application/json",...u&&{Authorization:`Bearer ${u}`}}};a&&(r.body=JSON.stringify(a));try{const t=await fetch(`${f}${s}`,r);return t.status===401?(b(),{error:"Unauthorized"}):await t.json()}catch(t){return console.error("API request failed:",t),{error:"Request failed"}}},l={login:(e,s)=>c("POST","/login",{email:e,password:s}),register:(e,s,a)=>c("POST","/register",{name:e,email:s,password:a}),me:()=>c("GET","/me"),getTasks:()=>c("GET","/tasks"),addTask:e=>c("POST","/tasks",e),deleteTask:e=>c("DELETE",`/tasks/${e}`),updateTask:(e,s)=>c("PUT",`/tasks/${e}`,s),setToken:x,removeToken:b},p=document.getElementById("app"),d=()=>{const e=document.getElementById("dashboard-content");e?e.innerHTML='<p class="text-center text-sm text-gray-500">Loading...</p>':p.innerHTML='<p class="text-center text-sm text-gray-500 mt-10">Loading...</p>'},g=()=>{p.innerHTML=`
    <div class="card max-w-md mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h1>
        <div id="loginError" class="text-red-500 text-sm text-center mb-2"></div>
        <form id="loginForm" class="space-y-4">
        <input type="email" placeholder="Email" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
        <input type="password" placeholder="Password" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
        <button type="submit" class="btn w-full">Login</button>
        </form>
        <p class="text-sm text-center mt-4">
        Don't have an account? <a href="#" id="toRegister" class="text-blue-500 hover:underline">Register</a>
        </p>
        <p class="text-sm text-center mt-2">
            View <a href="http://localhost:8000/api/documentation" target="_blank" class="text-blue-500 hover:underline">API Docs</a>
        </p>
    </div>
    `,document.getElementById("loginForm").onsubmit=async e=>{e.preventDefault(),d();const[s,a]=Array.from(e.target.elements).map(t=>t.value),r=await l.login(s,a);if(r.token)l.setToken(r.token),i("tasks");else{g();const t=document.getElementById("loginError");if(t.innerHTML="",r.message&&(t.innerHTML+=`<p>${r.message}</p>`),r.error&&(t.innerHTML+=`<p>${r.error}</p>`),r.errors)for(const n in r.errors)r.errors[n].forEach(o=>{t.innerHTML+=`<p>${o}</p>`})}},document.getElementById("toRegister").onclick=e=>{e.preventDefault(),y()}},y=()=>{p.innerHTML=`
      <div class="card max-w-md mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Register</h1>
        <div id="registerError" class="text-red-500 text-sm text-center mb-2"></div>
        <form id="registerForm" class="space-y-4">
          <input type="text" placeholder="Name" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <input type="email" placeholder="Email" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <input type="password" placeholder="Password" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <button type="submit" class="btn w-full">Register</button>
        </form>
        <p class="text-sm text-center mt-4">
          Already have an account? <a href="#" id="toLogin" class="text-blue-500 hover:underline">Login</a>
        </p>
        <p class="text-sm text-center mt-2">
            View <a href="http://localhost:8000/api/documentation" target="_blank" class="text-blue-500 hover:underline">API Docs</a>
        </p>
      </div>
    `,document.getElementById("registerForm").onsubmit=async e=>{e.preventDefault();const[s,a,r]=Array.from(e.target.elements).map(n=>n.value);d();const t=await l.register(s,a,r);if(t.token)l.setToken(t.token),i("tasks");else{y();const n=document.getElementById("registerError");if(n.innerHTML="",t.message&&(n.innerHTML+=`<p>${t.message}</p>`),t.errors)for(const o in t.errors)t.errors[o].forEach(k=>{n.innerHTML+=`<p>${k}</p>`})}},document.getElementById("toLogin").onclick=e=>{e.preventDefault(),g()}},i=async(e="tasks")=>{d();const s=await l.me();if(!s||s.error||!s.name){l.removeToken(),g();return}const a=await l.getTasks();p.innerHTML=`
        <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Task Dashboard — ${s.name}, ${s.email}</h1>
            <button id="logoutBtn" class="text-red-500 hover:text-red-700 text-sm">🚪 Logout</button>
        </header>

        <div class="flex flex-1">
            <aside class="w-64 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col justify-between">
            <nav class="space-y-2">
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-tasks">📋 All Tasks</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-create">➕ Add Task</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-edit">✏️ Edit Task</a>
            </nav>
            <div class="mt-6">
                <a href="http://localhost:8000/api/documentation" target="_blank" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700">
                📚 API Docs
                </a>
            </div>
            </aside>
            <main class="flex-1 p-6" id="dashboard-content"></main>
        </div>

        <footer class="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            © ${new Date().getFullYear()} Task Manager
        </footer>
        </div>
    `,document.getElementById("logoutBtn").onclick=()=>{l.removeToken(),location.reload()},document.getElementById("link-tasks").onclick=r=>{r.preventDefault(),i("tasks")},document.getElementById("link-create").onclick=r=>{r.preventDefault(),i("create")},document.getElementById("link-edit").onclick=r=>{r.preventDefault(),i("edit")},e==="create"?v():e==="edit"?w(a):h(a)},h=e=>{const s=document.getElementById("dashboard-content");if(!e.length){s.innerHTML=`
            <div class="text-center text-gray-500 text-sm">
            No tasks found.
            </div>
        `;return}s.innerHTML=`
        <ul class="space-y-2">
            ${e.map(a=>{var r;return`
            <li class="bg-white dark:bg-gray-800 p-3 shadow rounded cursor-pointer group task-item" data-id="${a.id}">
                <div class="flex justify-between items-center">
                <div>
                    <div class="font-semibold text-lg">${a.title}</div>
                    <div class="text-sm text-gray-500 mt-1">
                    Created by: ${((r=a.user)==null?void 0:r.name)||"Unknown"}<br/>
                    Created: ${m(a.created_at)}<br/>
                    Updated: ${m(a.updated_at)}
                    </div>
                </div>
                <button data-id="${a.id}" class="text-red-500 hover:text-red-700 deleteBtn">✕</button>
                </div>
            </li>
            `}).join("")}
        </ul>
        `,document.querySelectorAll(".task-item").forEach(a=>{a.onclick=r=>{if(r.target.classList.contains("deleteBtn"))return;const t=e.find(n=>n.id==a.dataset.id);T(t)}}),document.querySelectorAll(".deleteBtn").forEach(a=>{a.onclick=async r=>{r.stopPropagation(),confirm("Are you sure you want to delete this task?")&&(d(),await l.deleteTask(a.dataset.id),i("tasks"))}})},v=()=>{const e=document.getElementById("dashboard-content");e.innerHTML=`
        <form id="taskForm" class="space-y-4 max-w-xl">
        <input type="text" placeholder="Title" class="input w-full" id="taskTitle" required />
        <textarea placeholder="Description" class="input w-full resize-none" id="taskDesc" rows="4"></textarea>
        <button class="btn">Create Task</button>
        </form>
    `,document.getElementById("taskForm").onsubmit=async s=>{s.preventDefault();const a=document.getElementById("taskTitle").value,r=document.getElementById("taskDesc").value;d(),await l.addTask({title:a,description:r}),i("tasks")}},w=e=>{const s=document.getElementById("dashboard-content");s.innerHTML=`
        <form id="editTaskForm" class="space-y-4 max-w-xl">
        <label class="block">
            <span class="block mb-1">Select a Task:</span>
            <select id="taskSelect" class="input bg-white dark:bg-gray-800 dark:text-white w-full">
            ${e.map(o=>`<option value="${o.id}">${o.title}</option>`).join("")}
            </select>
        </label>
        <label class="block">
            <span class="block mb-1">New Title:</span>
            <input type="text" id="newTitle" class="input bg-white dark:bg-gray-800 dark:text-white w-full" required />
        </label>
        <label class="block">
            <span class="block mb-1">Description:</span>
            <textarea id="newDescription" rows="4" class="input bg-white dark:bg-gray-800 dark:text-white w-full resize-none"></textarea>
        </label>
        <button type="submit" class="btn">💾 Save</button>
        </form>
    `;const a=document.getElementById("taskSelect"),r=document.getElementById("newTitle"),t=document.getElementById("newDescription"),n=()=>{const o=e.find(k=>k.id==a.value);o&&(r.value=o.title,t.value=o.description||"")};a.addEventListener("change",n),n(),document.getElementById("editTaskForm").onsubmit=async o=>{o.preventDefault(),d(),await l.updateTask(a.value,{title:r.value,description:t.value}),alert("Task updated!"),i("tasks")}},T=e=>{var a;const s=document.getElementById("dashboard-content");s.innerHTML=`
            <div class="space-y-4 max-w-xl">
                <h2 class="text-2xl font-bold">${e.title}</h2>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    ${e.description||"<no description>"}
                </p>
                <p class="text-sm text-gray-500">Created by: ${((a=e.user)==null?void 0:a.name)||"Unknown"}</p>
                <p class="text-sm text-gray-500">Created at: ${m(e.created_at)}</p>
                <p class="text-sm text-gray-500">Updated at: ${m(e.updated_at)}</p>
                <button id="backBtn" class="btn">⬅ Back to all tasks</button>
            </div>
        `,document.getElementById("backBtn").onclick=()=>i("tasks")},m=e=>{const s=new Date(e),a=r=>r<10?"0"+r:r;return`${a(s.getDate())}.${a(s.getMonth()+1)}.${s.getFullYear()} ${a(s.getHours())}:${a(s.getMinutes())}`};localStorage.getItem("token")?i("tasks"):g();
