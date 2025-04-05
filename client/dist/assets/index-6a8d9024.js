(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=a(t);fetch(t.href,r)}})();const b="http://localhost:8000/api";let p=localStorage.getItem("token");function f(e){p=e,localStorage.setItem("token",e)}async function c(e,n,a){const s={method:e,headers:{"Content-Type":"application/json",Accept:"application/json",...p&&{Authorization:`Bearer ${p}`}}};return a&&(s.body=JSON.stringify(a)),(await fetch(`${b}${n}`,s)).json()}const i={login:(e,n)=>c("POST","/login",{email:e,password:n}),register:(e,n,a)=>c("POST","/register",{name:e,email:n,password:a}),me:()=>c("GET","/me"),getTasks:()=>c("GET","/tasks"),addTask:e=>c("POST","/tasks",e),deleteTask:e=>c("DELETE",`/tasks/${e}`),updateTask:(e,n)=>c("PUT",`/tasks/${e}`,n),setToken:f},u=document.getElementById("app"),d=()=>{const e=document.getElementById("dashboard-content");e?e.innerHTML='<p class="text-center text-sm text-gray-500">Loading...</p>':u.innerHTML='<p class="text-center text-sm text-gray-500 mt-10">Loading...</p>'},g=()=>{u.innerHTML=`
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
    `,document.getElementById("loginForm").onsubmit=async e=>{e.preventDefault(),d();const[n,a]=Array.from(e.target.elements).map(t=>t.value),s=await i.login(n,a);if(s.token)i.setToken(s.token),l("tasks");else{g();const t=document.getElementById("loginError");if(t.innerHTML="",s.message&&(t.innerHTML+=`<p>${s.message}</p>`),s.error&&(t.innerHTML+=`<p>${s.error}</p>`),s.errors)for(const r in s.errors)s.errors[r].forEach(o=>{t.innerHTML+=`<p>${o}</p>`})}},document.getElementById("toRegister").onclick=e=>{e.preventDefault(),k()}},k=()=>{u.innerHTML=`
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
    `,document.getElementById("registerForm").onsubmit=async e=>{e.preventDefault();const[n,a,s]=Array.from(e.target.elements).map(r=>r.value);d();const t=await i.register(n,a,s);if(t.token)i.setToken(t.token),l("tasks");else{k();const r=document.getElementById("registerError");if(r.innerHTML="",t.message&&(r.innerHTML+=`<p>${t.message}</p>`),t.errors)for(const o in t.errors)t.errors[o].forEach(m=>{r.innerHTML+=`<p>${m}</p>`})}},document.getElementById("toLogin").onclick=e=>{e.preventDefault(),g()}},l=async(e="tasks")=>{d(),await i.me();const n=await i.getTasks();u.innerHTML=`
    <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Task Dashboard</h1>
        <a href="http://localhost:8000/api/documentation" target="_blank" class="text-sm text-blue-500 hover:underline">API Docs</a>
        </header>

        <div class="flex flex-1">
            <aside class="w-64 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col justify-between">
            <nav class="space-y-2">
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-tasks">📋 All Tasks</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-create">➕ Add Task</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-edit">✏️ Edit Task</a>
            </nav>
            <div>
                <button id="logoutBtn" class="text-red-500 hover:text-red-700 w-full text-left mt-10">🚪 Logout</button>
            </div>
            </aside>
            <main class="flex-1 p-6" id="dashboard-content"></main>
        </div>
        <footer class="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            © ${new Date().getFullYear()} Task Manager
        </footer>
        </div>
    `,document.getElementById("logoutBtn").onclick=()=>{localStorage.removeItem("token"),location.reload()},document.getElementById("link-tasks").onclick=a=>{a.preventDefault(),l("tasks")},document.getElementById("link-create").onclick=a=>{a.preventDefault(),l("create")},document.getElementById("link-edit").onclick=a=>{a.preventDefault(),l("edit")},e==="create"?h():e==="edit"?x(n):y(n)},y=e=>{const n=document.getElementById("dashboard-content");n.innerHTML=`
    <ul class="space-y-2">
      ${e.map(a=>`
        <li class="bg-white dark:bg-gray-800 p-3 shadow flex justify-between items-center rounded">
          <button class="text-left flex-1 viewTaskBtn" data-id="${a.id}">${a.title}</button>
          <button data-id="${a.id}" class="text-red-500 hover:text-red-700 deleteBtn">✕</button>
        </li>
      `).join("")}
    </ul>
  `,document.querySelectorAll(".deleteBtn").forEach(a=>{a.onclick=async()=>{confirm("Are you sure you want to delete this task?")&&(d(),await i.deleteTask(a.dataset.id),l("tasks"))}}),document.querySelectorAll(".viewTaskBtn").forEach(a=>{a.onclick=()=>{const s=e.find(t=>t.id==a.dataset.id);w(s)}})},h=()=>{const e=document.getElementById("dashboard-content");e.innerHTML=`
    <form id="taskForm" class="space-y-4 max-w-xl">
      <input type="text" placeholder="Title" class="input w-full" id="taskTitle" required />
      <textarea placeholder="Description" class="input w-full resize-none" id="taskDesc" rows="4"></textarea>
      <button class="btn">Create Task</button>
    </form>
  `,document.getElementById("taskForm").onsubmit=async n=>{n.preventDefault();const a=document.getElementById("taskTitle").value,s=document.getElementById("taskDesc").value;d(),await i.addTask({title:a,description:s}),l("tasks")}},x=e=>{const n=document.getElementById("dashboard-content");n.innerHTML=`
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
  `;const a=document.getElementById("taskSelect"),s=document.getElementById("newTitle"),t=document.getElementById("newDescription"),r=()=>{const o=e.find(m=>m.id==a.value);o&&(s.value=o.title,t.value=o.description||"")};a.addEventListener("change",r),r(),document.getElementById("editTaskForm").onsubmit=async o=>{o.preventDefault(),d(),await i.updateTask(a.value,{title:s.value,description:t.value}),alert("Task updated!"),l("tasks")}},w=e=>{const n=document.getElementById("dashboard-content");n.innerHTML=`
    <div class="space-y-4 max-w-xl">
      <h2 class="text-2xl font-bold">${e.title}</h2>
      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        ${e.description||"<no description>"}
      </p>
      <button id="backBtn" class="btn">⬅ Back to all tasks</button>
    </div>
  `,document.getElementById("backBtn").onclick=()=>l("tasks")};localStorage.getItem("token")?l("tasks"):g();
