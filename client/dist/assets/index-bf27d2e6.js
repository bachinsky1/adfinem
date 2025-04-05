(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const y="http://localhost:8000/api";let g=localStorage.getItem("token");function f(e){g=e,localStorage.setItem("token",e)}async function c(e,r,t){const a={method:e,headers:{"Content-Type":"application/json",Accept:"application/json",...g&&{Authorization:`Bearer ${g}`}}};return t&&(a.body=JSON.stringify(t)),(await fetch(`${y}${r}`,a)).json()}const i={login:(e,r)=>c("POST","/login",{email:e,password:r}),register:(e,r,t)=>c("POST","/register",{name:e,email:r,password:t}),me:()=>c("GET","/me"),getTasks:()=>c("GET","/tasks"),addTask:e=>c("POST","/tasks",e),deleteTask:e=>c("DELETE",`/tasks/${e}`),updateTask:(e,r)=>c("PUT",`/tasks/${e}`,r),setToken:f},m=document.getElementById("app"),d=()=>{const e=document.getElementById("dashboard-content");e?e.innerHTML='<p class="text-center text-sm text-gray-500">Loading...</p>':m.innerHTML='<p class="text-center text-sm text-gray-500 mt-10">Loading...</p>'},k=()=>{m.innerHTML=`
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
    `,document.getElementById("loginForm").onsubmit=async e=>{e.preventDefault(),d();const[r,t]=Array.from(e.target.elements).map(s=>s.value),a=await i.login(r,t);if(a.token)i.setToken(a.token),l("tasks");else{k();const s=document.getElementById("loginError");if(s.innerHTML="",a.message&&(s.innerHTML+=`<p>${a.message}</p>`),a.error&&(s.innerHTML+=`<p>${a.error}</p>`),a.errors)for(const n in a.errors)a.errors[n].forEach(o=>{s.innerHTML+=`<p>${o}</p>`})}},document.getElementById("toRegister").onclick=e=>{e.preventDefault(),b()}},b=()=>{m.innerHTML=`
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
    `,document.getElementById("registerForm").onsubmit=async e=>{e.preventDefault();const[r,t,a]=Array.from(e.target.elements).map(n=>n.value);d();const s=await i.register(r,t,a);if(s.token)i.setToken(s.token),l("tasks");else{b();const n=document.getElementById("registerError");if(n.innerHTML="",s.message&&(n.innerHTML+=`<p>${s.message}</p>`),s.errors)for(const o in s.errors)s.errors[o].forEach(p=>{n.innerHTML+=`<p>${p}</p>`})}},document.getElementById("toLogin").onclick=e=>{e.preventDefault(),k()}},l=async(e="tasks")=>{d();const r=await i.me(),t=await i.getTasks();m.innerHTML=`
      <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold">Task Dashboard — ${r.name}, ${r.email}</h1>
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
    `,document.getElementById("logoutBtn").onclick=()=>{localStorage.removeItem("token"),location.reload()},document.getElementById("link-tasks").onclick=a=>{a.preventDefault(),l("tasks")},document.getElementById("link-create").onclick=a=>{a.preventDefault(),l("create")},document.getElementById("link-edit").onclick=a=>{a.preventDefault(),l("edit")},e==="create"?h():e==="edit"?v(t):x(t)},x=e=>{const r=document.getElementById("dashboard-content");if(!e.length){r.innerHTML=`
        <div class="text-center text-gray-500 text-sm">
          No tasks found.
        </div>
      `;return}r.innerHTML=`
      <ul class="space-y-2">
        ${e.map(t=>{var a;return`
          <li class="bg-white dark:bg-gray-800 p-3 shadow rounded cursor-pointer group task-item" data-id="${t.id}">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-semibold text-lg">${t.title}</div>
                <div class="text-sm text-gray-500 mt-1">
                  Created by: ${((a=t.user)==null?void 0:a.name)||"Unknown"}<br/>
                  Created: ${u(t.created_at)}<br/>
                  Updated: ${u(t.updated_at)}
                </div>
              </div>
              <button data-id="${t.id}" class="text-red-500 hover:text-red-700 deleteBtn">✕</button>
            </div>
          </li>
        `}).join("")}
      </ul>
    `,document.querySelectorAll(".task-item").forEach(t=>{t.onclick=a=>{if(a.target.classList.contains("deleteBtn"))return;const s=e.find(n=>n.id==t.dataset.id);w(s)}}),document.querySelectorAll(".deleteBtn").forEach(t=>{t.onclick=async a=>{a.stopPropagation(),confirm("Are you sure you want to delete this task?")&&(d(),await i.deleteTask(t.dataset.id),l("tasks"))}})},h=()=>{const e=document.getElementById("dashboard-content");e.innerHTML=`
    <form id="taskForm" class="space-y-4 max-w-xl">
      <input type="text" placeholder="Title" class="input w-full" id="taskTitle" required />
      <textarea placeholder="Description" class="input w-full resize-none" id="taskDesc" rows="4"></textarea>
      <button class="btn">Create Task</button>
    </form>
  `,document.getElementById("taskForm").onsubmit=async r=>{r.preventDefault();const t=document.getElementById("taskTitle").value,a=document.getElementById("taskDesc").value;d(),await i.addTask({title:t,description:a}),l("tasks")}},v=e=>{const r=document.getElementById("dashboard-content");r.innerHTML=`
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
  `;const t=document.getElementById("taskSelect"),a=document.getElementById("newTitle"),s=document.getElementById("newDescription"),n=()=>{const o=e.find(p=>p.id==t.value);o&&(a.value=o.title,s.value=o.description||"")};t.addEventListener("change",n),n(),document.getElementById("editTaskForm").onsubmit=async o=>{o.preventDefault(),d(),await i.updateTask(t.value,{title:a.value,description:s.value}),alert("Task updated!"),l("tasks")}},w=e=>{var t;const r=document.getElementById("dashboard-content");r.innerHTML=`
        <div class="space-y-4 max-w-xl">
            <h2 class="text-2xl font-bold">${e.title}</h2>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                ${e.description||"<no description>"}
            </p>
            <p class="text-sm text-gray-500">Created by: ${((t=e.user)==null?void 0:t.name)||"Unknown"}</p>
            <p class="text-sm text-gray-500">Created at: ${u(e.created_at)}</p>
            <p class="text-sm text-gray-500">Updated at: ${u(e.updated_at)}</p>
            <button id="backBtn" class="btn">⬅ Back to all tasks</button>
        </div>
    `,document.getElementById("backBtn").onclick=()=>l("tasks")},u=e=>{const r=new Date(e),t=a=>a<10?"0"+a:a;return`${t(r.getDate())}.${t(r.getMonth()+1)}.${r.getFullYear()} ${t(r.getHours())}:${t(r.getMinutes())}`};localStorage.getItem("token")?l("tasks"):k();
